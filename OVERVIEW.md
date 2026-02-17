# VS Code PowerPoint Viewer - 最終版

## 主な特徴 ✨

### 1. 高品質な表示 🎨
- ✅ **LibreOfficeによる完全レンダリング** - PowerPointの見た目を忠実に再現
- ✅ **150 DPI高解像度** - くっきりとした画像表示
- ✅ **すべての要素をサポート** - フォント、色、レイアウト、アニメーション効果を含む

### 2. 縦スクロール表示 📜
- ✅ **連続スクロール** - 全スライドを縦にスクロール表示
- ✅ **シンプルな操作** - マウスホイールで自然に閲覧
- ✅ **スライド番号** - 各スライドに番号を表示
- ✅ **現在位置表示** - ステータスバーに現在のスライド番号を表示

### 3. ズーム機能 🔍
- ✅ **50%〜200%のズーム** - ボタンまたはキーボードショートカット
- ✅ **マウスホイールズーム** - Ctrl/Cmd + ホイール
- ✅ **リアルタイム表示** - ズームレベルをステータスバーに表示

### 3. 技術スタック
- **LibreOffice** - PowerPointファイルをPDFに変換
- **Poppler (pdftoppm)** - PDFを高解像度JPEG画像に変換
- **Base64エンコード** - 画像を直接HTMLに埋め込み

## 必要なソフトウェア

### LibreOffice
PowerPointファイルをPDFに変換

- **Ubuntu/Debian:** `sudo apt-get install libreoffice`
- **macOS:** `brew install --cask libreoffice`
- **Windows:** [公式サイト](https://www.libreoffice.org/)からダウンロード

### Poppler
PDFを画像に変換

- **Ubuntu/Debian:** `sudo apt-get install poppler-utils`
- **macOS:** `brew install poppler`
- **Windows:** [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases/)

**📘 Windowsユーザーへ:** 詳細なセットアップ手順は [WINDOWS-SETUP.md](WINDOWS-SETUP.md) を参照してください。

## クイックスタート

```bash
# 1. インストール
npm install

# 2. コンパイル
npm run compile

# 3. VS Codeで開いてF5キーで実行
```

詳細は `QUICKSTART.md` を参照してください。

## 表示内容

### ✅ 完全サポート
- すべてのテキスト（フォント、サイズ、色）
- すべての画像
- すべての図形とSmartArt
- グラフ
- アニメーション効果（静止画として）
- トランジション効果（静止画として）
- レイアウトとデザイン

### 💡 表示の仕組み
LibreOfficeがPowerPointを完全にレンダリングするため、PowerPointで表示されるすべての要素が画像として忠実に再現されます。

## ドキュメント

- **README.md** - 完全なドキュメント
- **QUICKSTART.md** - 5分で始めるガイド
- **TESTING.md** - テスト手順と使用例
- **CHANGELOG.md** - 変更履歴

## ライセンス

MIT License - 詳細は `LICENSE` を参照
