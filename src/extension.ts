import * as vscode from 'vscode';
import { PowerPointPreviewProvider } from './previewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('PowerPoint Viewer拡張機能がアクティブ化されました');

    // カスタムエディタープロバイダーを登録
    const provider = new PowerPointPreviewProvider(context);
    const registration = vscode.window.registerCustomEditorProvider(
        'powerpoint-viewer.preview',
        provider,
        {
            webviewOptions: {
                retainContextWhenHidden: true,
            },
            supportsMultipleEditorsPerDocument: false,
        }
    );

    context.subscriptions.push(registration);

    // コマンドを登録
    const openPreviewCommand = vscode.commands.registerCommand(
        'powerpoint-viewer.openPreview',
        async () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showErrorMessage('アクティブなエディタがありません');
                return;
            }

            const document = activeEditor.document;
            if (!document.fileName.endsWith('.pptx')) {
                vscode.window.showErrorMessage('このファイルはPowerPointファイルではありません');
                return;
            }

            await vscode.commands.executeCommand(
                'vscode.openWith',
                document.uri,
                'powerpoint-viewer.preview'
            );
        }
    );

    context.subscriptions.push(openPreviewCommand);
}

export function deactivate() {}
