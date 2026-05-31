import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { convertPowerPointToImages } from './converter';

export class PowerPointPreviewProvider implements vscode.CustomReadonlyEditorProvider {
    constructor(private readonly context: vscode.ExtensionContext) {}

    async openCustomDocument(
        uri: vscode.Uri,
        openContext: vscode.CustomDocumentOpenContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return {
            uri,
            dispose: () => {}
        };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.dirname(document.uri.fsPath)),
                vscode.Uri.file(require('os').tmpdir()),
                this.context.extensionUri
            ]
        };

        // ローディング画面をすぐに表示（ユーザーへのフィードバック）
        webviewPanel.webview.html = this.getLoadingHtml(path.basename(document.uri.fsPath));

        // PowerPointファイルを画像に変換
        try {
            const imagePaths = await convertPowerPointToImages(document.uri.fsPath);

            if (imagePaths.length === 0) {
                webviewPanel.webview.html = this.getErrorHtml('スライドの変換に失敗しました');
                return;
            }

            // ローカルファイルURIに変換（Base64エンコード不要でメモリ効率が大幅に向上）
            const webviewUris = imagePaths.map(imgPath =>
                webviewPanel.webview.asWebviewUri(vscode.Uri.file(imgPath)).toString()
            );

            webviewPanel.webview.html = this.getHtmlForWebview(
                webviewPanel.webview,
                webviewUris,
                path.basename(document.uri.fsPath)
            );

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '不明なエラー';
            vscode.window.showErrorMessage(`PowerPointの変換エラー: ${errorMessage}`);
            webviewPanel.webview.html = this.getErrorHtml(errorMessage);
        }
    }

    private getLoadingHtml(filename: string): string {
        return `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${filename} - 読み込み中</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: system-ui, -apple-system, sans-serif;
                        background-color: #2b2b2b;
                        color: #cccccc;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .spinner {
                        width: 48px;
                        height: 48px;
                        border: 4px solid rgba(255,255,255,0.1);
                        border-top-color: #007acc;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .loading-text {
                        font-size: 14px;
                        color: #aaaaaa;
                    }
                    .filename {
                        font-size: 12px;
                        color: #666;
                        max-width: 400px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                </style>
            </head>
            <body>
                <div class="spinner"></div>
                <div class="loading-text">スライドを変換中...</div>
                <div class="filename">${filename}</div>
            </body>
            </html>
        `;
    }

    private getErrorHtml(message: string): string {
        return `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>エラー</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: system-ui, -apple-system, sans-serif;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .error-container {
                        text-align: center;
                        padding: 2rem;
                        max-width: 600px;
                    }
                    .error-icon {
                        font-size: 3rem;
                        margin-bottom: 1rem;
                    }
                    .error-message {
                        color: var(--vscode-errorForeground);
                        margin: 1rem 0;
                        white-space: pre-line;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h2>エラーが発生しました</h2>
                    <p class="error-message">${message}</p>
                </div>
            </body>
            </html>
        `;
    }

    private getHtmlForWebview(
        webview: vscode.Webview,
        imageUris: string[],
        filename: string
    ): string {
        // JSONとしてURIリストを埋め込む（テンプレートリテラルのエスケープ問題を回避）
        const imageUrisJson = JSON.stringify(imageUris);
        const slideCount = imageUris.length;

        return `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${filename}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: system-ui, -apple-system, sans-serif;
                        background-color: #2b2b2b;
                        color: var(--vscode-editor-foreground);
                        overflow-y: auto;
                        height: 100vh;
                    }

                    .header {
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        background-color: var(--vscode-titleBar-activeBackground);
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding: 12px 24px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    }

                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }

                    .header-title {
                        font-weight: 600;
                        font-size: 14px;
                        color: var(--vscode-titleBar-activeForeground);
                    }

                    .zoom-controls {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .zoom-button {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 4px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        min-width: 32px;
                        transition: background-color 0.2s;
                    }

                    .zoom-button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }

                    .zoom-button:active {
                        transform: scale(0.95);
                    }

                    .zoom-level {
                        font-size: 13px;
                        color: var(--vscode-descriptionForeground);
                        min-width: 50px;
                        text-align: center;
                    }

                    .slide-count {
                        font-size: 13px;
                        color: var(--vscode-descriptionForeground);
                    }

                    .slides-container {
                        max-width: 1400px;
                        margin: 0 auto;
                        padding: 40px 20px;
                        transition: transform 0.3s ease;
                        transform-origin: top center;
                    }

                    .slide-wrapper {
                        margin-bottom: 40px;
                        position: relative;
                        scroll-margin-top: 80px;
                    }

                    .slide-number {
                        position: absolute;
                        top: -30px;
                        left: 0;
                        color: var(--vscode-descriptionForeground);
                        font-size: 13px;
                        font-weight: 600;
                    }

                    .slide {
                        width: 100%;
                        border-radius: 8px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                        display: block;
                        transition: box-shadow 0.3s ease;
                        /* 画像がロードされる前の高さを確保してレイアウトシフトを防ぐ */
                        min-height: 200px;
                        background-color: #1e1e1e;
                    }

                    .slide-wrapper.active .slide {
                        box-shadow: 0 4px 20px rgba(0, 122, 204, 0.5);
                    }

                    /* ステータスバー */
                    .status-bar {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: var(--vscode-statusBar-background);
                        color: var(--vscode-statusBar-foreground);
                        padding: 6px 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 12px;
                        border-top: 1px solid var(--vscode-panel-border);
                        z-index: 99;
                    }

                    .status-left {
                        display: flex;
                        gap: 16px;
                    }

                    .status-item {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }

                    .status-icon {
                        font-weight: 600;
                    }

                    /* スクロールバーのスタイリング */
                    ::-webkit-scrollbar {
                        width: 12px;
                    }

                    ::-webkit-scrollbar-track {
                        background: #1e1e1e;
                    }

                    ::-webkit-scrollbar-thumb {
                        background: #555;
                        border-radius: 6px;
                    }

                    ::-webkit-scrollbar-thumb:hover {
                        background: #666;
                    }

                    /* レスポンシブ対応 */
                    @media (max-width: 768px) {
                        .slides-container {
                            padding: 20px 10px 60px 10px;
                        }

                        .slide-wrapper {
                            margin-bottom: 30px;
                        }

                        .zoom-controls {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-left">
                        <div class="header-title">${filename}</div>
                        <div class="zoom-controls">
                            <button class="zoom-button" id="zoomOut" title="ズームアウト">−</button>
                            <span class="zoom-level" id="zoomLevel">100%</span>
                            <button class="zoom-button" id="zoomIn" title="ズームイン">＋</button>
                            <button class="zoom-button" id="zoomReset" title="リセット">⟲</button>
                        </div>
                    </div>
                    <div class="slide-count">${slideCount} スライド</div>
                </div>

                <div class="slides-container" id="slidesContainer">
                </div>

                <div class="status-bar">
                    <div class="status-left">
                        <div class="status-item">
                            <span class="status-icon">📄</span>
                            <span id="currentSlide">スライド 1</span>
                            <span>/</span>
                            <span>${slideCount}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-icon">🔍</span>
                            <span id="statusZoom">100%</span>
                        </div>
                    </div>
                    <div class="status-item">
                        <span>${filename}</span>
                    </div>
                </div>

                <script>
                    // 画像URIリスト（ローカルファイルURIを使用：Base64より高速）
                    const IMAGE_URIS = ${imageUrisJson};
                    const SLIDE_COUNT = ${slideCount};

                    let currentZoom = 100;
                    const minZoom = 50;
                    const maxZoom = 200;
                    const zoomStep = 10;

                    const slidesContainer = document.getElementById('slidesContainer');
                    const zoomLevelEl = document.getElementById('zoomLevel');
                    const statusZoomEl = document.getElementById('statusZoom');
                    const currentSlideStatus = document.getElementById('currentSlide');

                    // ========== スライドの動的生成 ==========
                    // DOM要素を直接生成することでHTMLパースのオーバーヘッドを削減
                    const fragment = document.createDocumentFragment();
                    IMAGE_URIS.forEach((uri, index) => {
                        const slideNum = index + 1;

                        const wrapper = document.createElement('div');
                        wrapper.className = 'slide-wrapper';
                        wrapper.dataset.slide = String(slideNum);
                        wrapper.id = 'slide-' + slideNum;

                        const label = document.createElement('div');
                        label.className = 'slide-number';
                        label.textContent = 'スライド ' + slideNum;

                        const img = document.createElement('img');
                        img.alt = 'Slide ' + slideNum;
                        img.className = 'slide';
                        // loading="lazy" でビューポート外の画像を遅延読み込み
                        img.loading = 'lazy';
                        // decoding="async" で画像デコードを非同期化（UIブロック防止）
                        img.decoding = 'async';
                        img.src = uri;

                        wrapper.appendChild(label);
                        wrapper.appendChild(img);
                        fragment.appendChild(wrapper);
                    });
                    slidesContainer.appendChild(fragment);

                    // ========== ズーム機能 ==========
                    function updateZoom(zoom) {
                        currentZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
                        slidesContainer.style.transform = \`scale(\${currentZoom / 100})\`;
                        zoomLevelEl.textContent = \`\${currentZoom}%\`;
                        statusZoomEl.textContent = \`\${currentZoom}%\`;
                    }

                    document.getElementById('zoomIn').addEventListener('click', () => {
                        updateZoom(currentZoom + zoomStep);
                    });

                    document.getElementById('zoomOut').addEventListener('click', () => {
                        updateZoom(currentZoom - zoomStep);
                    });

                    document.getElementById('zoomReset').addEventListener('click', () => {
                        updateZoom(100);
                    });

                    // キーボードショートカット
                    document.addEventListener('keydown', (e) => {
                        if (e.ctrlKey || e.metaKey) {
                            if (e.key === '=' || e.key === '+') {
                                e.preventDefault();
                                updateZoom(currentZoom + zoomStep);
                            } else if (e.key === '-') {
                                e.preventDefault();
                                updateZoom(currentZoom - zoomStep);
                            } else if (e.key === '0') {
                                e.preventDefault();
                                updateZoom(100);
                            }
                        }
                    });

                    // ========== スクロール位置に応じた現在のスライド検出 ==========
                    const observerOptions = {
                        root: null,
                        rootMargin: '-80px 0px -50% 0px',
                        threshold: 0
                    };

                    const slideWrappers = slidesContainer.querySelectorAll('.slide-wrapper');

                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const slideNumber = entry.target.getAttribute('data-slide');
                                currentSlideStatus.textContent = \`スライド \${slideNumber}\`;

                                // アクティブなスライドをハイライト
                                slideWrappers.forEach(wrapper => {
                                    wrapper.classList.remove('active');
                                });
                                entry.target.classList.add('active');
                            }
                        });
                    }, observerOptions);

                    // 全スライドを監視
                    slideWrappers.forEach(wrapper => {
                        observer.observe(wrapper);
                    });

                    // ========== マウスホイールでのズーム（Ctrl+ホイール）==========
                    document.addEventListener('wheel', (e) => {
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
                            updateZoom(currentZoom + delta);
                        }
                    }, { passive: false });

                    console.log('PowerPoint Viewer loaded with ' + SLIDE_COUNT + ' slides');
                </script>
            </body>
            </html>
        `;
    }
}
