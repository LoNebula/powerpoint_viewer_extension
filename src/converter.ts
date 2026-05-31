import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as crypto from 'crypto';

const execPromise = promisify(exec);

// ディスクキャッシュ: ファイルパス+更新時刻のハッシュ → 変換済み画像ディレクトリ
const conversionCache = new Map<string, { tempDir: string; images: string[] }>();

/**
 * ファイルのキャッシュキーを生成する（パス + 最終更新時刻のハッシュ）
 */
async function getCacheKey(pptxPath: string): Promise<string> {
    const stat = await fs.promises.stat(pptxPath);
    const raw = `${pptxPath}:${stat.mtimeMs}`;
    return crypto.createHash('md5').update(raw).digest('hex');
}

/**
 * PowerPointを画像に変換し、画像ファイルパスの配列を返す。
 * 同一ファイル・同一更新時刻の場合はキャッシュを返す。
 */
export async function convertPowerPointToImages(pptxPath: string): Promise<string[]> {
    const cacheKey = await getCacheKey(pptxPath);

    // キャッシュヒット確認
    const cached = conversionCache.get(cacheKey);
    if (cached) {
        // キャッシュのファイルがまだ存在するか確認
        const allExist = cached.images.every(p => fs.existsSync(p));
        if (allExist && cached.images.length > 0) {
            console.log(`[Cache HIT] ${path.basename(pptxPath)}`);
            return cached.images;
        }
        // キャッシュが壊れていれば削除
        conversionCache.delete(cacheKey);
    }

    console.log(`[Cache MISS] Converting: ${path.basename(pptxPath)}`);

    // 一時ディレクトリを作成
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'pptx-preview-'));
    const pdfPath = path.join(tempDir, 'output.pdf');
    const imagePrefix = path.join(tempDir, 'slide');

    try {
        // ステップ1: PowerPointをPDFに変換（LibreOfficeを使用）
        await convertToPDF(pptxPath, pdfPath);

        // ステップ2: PDFを画像に変換（Popplerのpdftoppmを使用）
        await convertPDFToImages(pdfPath, imagePrefix);

        // 生成された画像ファイルを取得してソート
        const files = await fs.promises.readdir(tempDir);
        const imageFiles = files
            .filter(file => file.startsWith('slide-') && file.endsWith('.jpg'))
            .map(file => path.join(tempDir, file))
            .sort((a, b) => {
                const aNum = parseInt(path.basename(a).match(/\d+/)?.[0] || '0');
                const bNum = parseInt(path.basename(b).match(/\d+/)?.[0] || '0');
                return aNum - bNum;
            });

        // キャッシュに保存
        conversionCache.set(cacheKey, { tempDir, images: imageFiles });

        return imageFiles;
    } catch (error) {
        // エラーが発生した場合は一時ディレクトリをクリーンアップ
        await cleanupTempDir(tempDir);
        throw error;
    }
}

async function convertToPDF(pptxPath: string, pdfPath: string): Promise<void> {
    const outDir = path.dirname(pdfPath);

    // LibreOfficeを使用してPDFに変換
    // --headless: GUIなしで実行
    // --convert-to pdf: PDF形式に変換
    // --outdir: 出力ディレクトリ
    const command = `soffice --headless --convert-to pdf --outdir "${outDir}" "${pptxPath}"`;

    try {
        await execPromise(command, {
            timeout: 60000 // 60秒のタイムアウト
        });

        // 出力ファイルが正しい名前にリネームされているか確認
        const generatedPdf = path.join(outDir, path.basename(pptxPath, '.pptx') + '.pdf');
        if (fs.existsSync(generatedPdf) && generatedPdf !== pdfPath) {
            await fs.promises.rename(generatedPdf, pdfPath);
        }

        if (!fs.existsSync(pdfPath)) {
            throw new Error('PDFファイルの生成に失敗しました');
        }
    } catch (error) {
        if (error instanceof Error && error.message.includes('ENOENT')) {
            throw new Error(
                'LibreOfficeがインストールされていません。LibreOfficeをインストールしてください。\n' +
                'Ubuntu/Debian: sudo apt-get install libreoffice\n' +
                'macOS: brew install --cask libreoffice\n' +
                'Windows: https://www.libreoffice.org/download/download/'
            );
        }
        throw error;
    }
}

async function convertPDFToImages(pdfPath: string, imagePrefix: string): Promise<void> {
    // pdftoppmを使用してPDFを画像に変換
    // -jpeg: JPEG形式で出力
    // -r 150: 解像度150 DPI（表示品質と速度のバランス）
    // -jpegopt quality=85: JPEG品質を85に設定してファイルサイズを削減
    const command = `pdftoppm -jpeg -r 150 -jpegopt quality=85 "${pdfPath}" "${imagePrefix}"`;

    try {
        await execPromise(command, {
            timeout: 60000 // 60秒のタイムアウト
        });
    } catch (error) {
        // -jpegopt がサポートされていない古いバージョンのpopplerにフォールバック
        if (error instanceof Error && error.message.includes('ENOENT')) {
            throw new Error(
                'Popplerがインストールされていません。Popplerをインストールしてください。\n' +
                'Ubuntu/Debian: sudo apt-get install poppler-utils\n' +
                'macOS: brew install poppler\n' +
                'Windows: http://blog.alivate.com.au/poppler-windows/ からダウンロード'
            );
        }

        // -jpegopt 非対応の場合はオプションなしで再試行
        try {
            const fallbackCommand = `pdftoppm -jpeg -r 150 "${pdfPath}" "${imagePrefix}"`;
            await execPromise(fallbackCommand, { timeout: 60000 });
        } catch (fallbackError) {
            throw error; // 元のエラーを再スロー
        }
    }
}

async function cleanupTempDir(tempDir: string): Promise<void> {
    try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
        console.error('一時ディレクトリのクリーンアップに失敗:', error);
    }
}

// 拡張機能が無効化されたときに一時ファイルとキャッシュをクリーンアップ
export async function cleanupAllTempFiles(): Promise<void> {
    // メモリキャッシュをクリア
    const dirs = Array.from(conversionCache.values()).map(v => v.tempDir);
    conversionCache.clear();

    // キャッシュしていたディレクトリを削除
    await Promise.all(dirs.map(dir => cleanupTempDir(dir)));

    // tmpdir内の残留ファイルも削除
    const tempDir = os.tmpdir();
    try {
        const files = await fs.promises.readdir(tempDir);
        const pptxTempDirs = files.filter(file => file.startsWith('pptx-preview-'));

        await Promise.all(
            pptxTempDirs.map(dir =>
                cleanupTempDir(path.join(tempDir, dir))
            )
        );
    } catch (error) {
        console.error('一時ファイルのクリーンアップに失敗:', error);
    }
}
