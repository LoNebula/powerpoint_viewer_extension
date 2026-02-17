import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function convertPowerPointToImages(pptxPath: string): Promise<string[]> {
    // 一時ディレクトリを作成
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'pptx-preview-'));
    const pdfPath = path.join(tempDir, 'output.pdf');
    const imagePrefix = path.join(tempDir, 'slide');

    try {
        // ステップ1: PowerPointをPDFに変換（LibreOfficeを使用）
        console.log('PowerPointをPDFに変換中...');
        await convertToPDF(pptxPath, pdfPath);

        // ステップ2: PDFを画像に変換（Popplerのpdftoppmを使用）
        console.log('PDFを画像に変換中...');
        await convertPDFToImages(pdfPath, imagePrefix);

        // 生成された画像ファイルを取得
        const files = await fs.promises.readdir(tempDir);
        const imageFiles = files
            .filter(file => file.startsWith('slide-') && file.endsWith('.jpg'))
            .map(file => path.join(tempDir, file))
            .sort((a, b) => {
                const aNum = parseInt(path.basename(a).match(/\d+/)?.[0] || '0');
                const bNum = parseInt(path.basename(b).match(/\d+/)?.[0] || '0');
                return aNum - bNum;
            });

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
        const { stdout, stderr } = await execPromise(command, {
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
    // -r 150: 解像度150 DPI
    const command = `pdftoppm -jpeg -r 150 "${pdfPath}" "${imagePrefix}"`;

    try {
        const { stdout, stderr } = await execPromise(command, {
            timeout: 60000 // 60秒のタイムアウト
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('ENOENT')) {
            throw new Error(
                'Popplerがインストールされていません。Popplerをインストールしてください。\n' +
                'Ubuntu/Debian: sudo apt-get install poppler-utils\n' +
                'macOS: brew install poppler\n' +
                'Windows: http://blog.alivate.com.au/poppler-windows/ からダウンロード'
            );
        }
        throw error;
    }
}

async function cleanupTempDir(tempDir: string): Promise<void> {
    try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
        console.error('一時ディレクトリのクリーンアップに失敗:', error);
    }
}

// 拡張機能が無効化されたときに一時ファイルをクリーンアップ
export async function cleanupAllTempFiles(): Promise<void> {
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
