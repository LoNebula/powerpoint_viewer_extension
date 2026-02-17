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
                this.context.extensionUri
            ]
        };

        // PowerPointファイルを画像に変換
        try {
            const images = await convertPowerPointToImages(document.uri.fsPath);
            
            if (images.length === 0) {
                webviewPanel.webview.html = this.getErrorHtml('スライドの変換に失敗しました');
                return;
            }

            // 画像をBase64に変換
            const imageData = await Promise.all(
                images.map(async (imgPath) => {
                    const buffer = await fs.promises.readFile(imgPath);
                    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
                })
            );

            webviewPanel.webview.html = this.getHtmlForWebview(
                webviewPanel.webview,
                imageData,
                path.basename(document.uri.fsPath)
            );

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '不明なエラー';
            vscode.window.showErrorMessage(`PowerPointの変換エラー: ${errorMessage}`);
            webviewPanel.webview.html = this.getErrorHtml(errorMessage);
        }
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
        images: string[],
        filename: string
    ): string {
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
                    <div class="slide-count">${images.length} スライド</div>
                </div>

                <div class="slides-container" id="slidesContainer">
                    ${images.map((img, index) => `
                        <div class="slide-wrapper" data-slide="${index + 1}" id="slide-${index + 1}">
                            <div class="slide-number">スライド ${index + 1}</div>
                            <img src="${img}" alt="Slide ${index + 1}" class="slide" loading="lazy">
                        </div>
                    `).join('')}
                </div>

                <div class="status-bar">
                    <div class="status-left">
                        <div class="status-item">
                            <span class="status-icon">📄</span>
                            <span id="currentSlide">スライド 1</span>
                            <span>/</span>
                            <span>${images.length}</span>
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
                    let currentZoom = 100;
                    const minZoom = 50;
                    const maxZoom = 200;
                    const zoomStep = 10;

                    const slidesContainer = document.getElementById('slidesContainer');
                    const zoomLevel = document.getElementById('zoomLevel');
                    const statusZoom = document.getElementById('statusZoom');
                    const currentSlideStatus = document.getElementById('currentSlide');
                    const slideWrappers = document.querySelectorAll('.slide-wrapper');

                    // ズーム機能
                    function updateZoom(zoom) {
                        currentZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
                        slidesContainer.style.transform = \`scale(\${currentZoom / 100})\`;
                        zoomLevel.textContent = \`\${currentZoom}%\`;
                        statusZoom.textContent = \`\${currentZoom}%\`;
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

                    // スクロール位置に応じた現在のスライド検出
                    const observerOptions = {
                        root: null,
                        rootMargin: '-80px 0px -50% 0px',
                        threshold: 0
                    };

                    let currentVisibleSlide = 1;

                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const slideNumber = entry.target.getAttribute('data-slide');
                                currentVisibleSlide = parseInt(slideNumber);
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

                    // マウスホイールでのズーム（Ctrl+ホイール）
                    document.addEventListener('wheel', (e) => {
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
                            updateZoom(currentZoom + delta);
                        }
                    }, { passive: false });

                    console.log('PowerPoint Viewer loaded with ${images.length} slides');
                    
                    // 画像の読み込み完了を監視
                    const images = document.querySelectorAll('.slide');
                    let loadedCount = 0;
                    
                    images.forEach((img) => {
                        if (img.complete) {
                            loadedCount++;
                        } else {
                            img.addEventListener('load', () => {
                                loadedCount++;
                                if (loadedCount === images.length) {
                                    console.log('All slides loaded');
                                }
                            });
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}
