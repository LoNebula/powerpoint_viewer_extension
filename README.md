# PowerPoint Viewer for VS Code

An extension that allows you to directly preview PowerPoint files (.pptx) within VS Code.

*Continuous display of all slides with vertical scrolling*

## Features

* 📊 Display PowerPoint files as high-quality images
* 📜 Continuous display of all slides with vertical scrolling
* 🎯 Complete rendering by LibreOffice (faithfully reproduces fonts, colors, and layouts)
* 🔍 Zoom function (50% - 200%)
* 📍 Display current slide position in the status bar
* ⚡ Complete within VS Code, no PowerPoint app required
* 🎨 Accurately display animations and complex shapes as images

## Screenshots

The following features are available in the preview screen:

* Continuous display of all slides by scrolling
* Display number on each slide
* Display PowerPoint appearance exactly as images
* UI compatible with VS Code themes

## Prerequisites

To use this extension, the following software must be installed on your system:

### 1. LibreOffice

Used to convert PowerPoint files to PDF.

**Ubuntu/Debian:**

```bash
sudo apt-get update
sudo apt-get install libreoffice

```

**macOS:**

```bash
brew install --cask libreoffice

```

**Windows:**
Download and install from the [LibreOffice Official Website]()

### 2. Poppler

Used to convert PDF to images.

**Ubuntu/Debian:**

```bash
sudo apt-get update
sudo apt-get install poppler-utils

```

**macOS:**

```bash
brew install poppler

```

**Windows:**
Download and configure [Poppler for Windows]()

### 📘 Detailed Guide for Windows

Windows users should check [WINDOWS-SETUP.md]() for detailed setup instructions (with screenshots).

**Simplified Windows Steps:**

1. Install LibreOffice
2. Download Poppler and extract to `C:\poppler`
3. Add the following to the PATH environment variable:
* `C:\Program Files\LibreOffice\program`
* `C:\poppler\Library\bin`


4. Restart Command Prompt and verify: `soffice --version` and `pdftoppm -v`

## Installation

### Installing Development Version

1. Clone this repository:

```bash
git clone <repository-url>
cd vscode-powerpoint-viewer

```

2. Install dependencies:

```bash
npm install

```

3. Compile TypeScript:

```bash
npm run compile

```

4. Run for development in VS Code:
* Press F5 to launch the Extension Development Host



### Installing from VSIX File

1. Package the extension:

```bash
npm install -g @vscode/vsce
vsce package

```

2. Install the generated `.vsix` file into VS Code:
* `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) in VS Code
* Select "Extensions: Install from VSIX..."
* Select the generated `.vsix` file



## Usage

### Method 1: Right-click the file

1. Right-click the `.pptx` file in Explorer
2. Select "Open With..."
3. Select "PowerPoint Preview"

### Method 2: From Command Palette

1. Open a `.pptx` file
2. Open Command Palette with `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
3. Run "PowerPoint: Open Preview"

### Method 3: Set as Default Editor

1. Right-click the `.pptx` file
2. "Open With..." → "Configure Default Editor for '*.pptx'..."
3. Select "PowerPoint Preview"

## Examples

### Review Presentation

1. Right-click a .pptx file in the project
2. Select "Open With..." → "PowerPoint Preview"
3. Check all slides by scrolling

### Compare Multiple Presentations

1. Open multiple .pptx files
2. Display each with "PowerPoint Preview"
3. Switch tabs to compare contents

## Navigation

The following operations are possible in the preview screen:

### Scroll

* **Mouse Wheel/Trackpad**: Continuous display of all slides
* **Current Slide**: Displayed in status bar

### Zoom Function

* **Zoom In**: "+" button in header or `Ctrl/Cmd + +`
* **Zoom Out**: "−" button in header or `Ctrl/Cmd + -`
* **Reset**: "⟲" button in header or `Ctrl/Cmd + 0`
* **Mouse Wheel**: `Ctrl/Cmd + Wheel` to zoom
* **Zoom Range**: 50% - 200%

### Status Bar

Displays the following information at the bottom of the screen:

* 📄 Current Slide Number / Total Slides
* 🔍 Current Zoom Level
* File Name

## Troubleshooting

### Error "LibreOffice is not installed"

Check if LibreOffice is installed on your system. You can verify by running the following in the command line:

```bash
soffice --version

```

### Error "Poppler is not installed"

Check if Poppler is installed on your system. You can verify by running the following in the command line:

```bash
pdftoppm -v

```

### Preview does not appear

1. Check if LibreOffice and Poppler are installed correctly
2. Check if the file is not corrupted (verify if it opens in PowerPoint)
3. Check for errors in the VS Code Developer Console (Help → Toggle Developer Tools)

### Slow Performance

Presentations with large files or many slides may take time to convert. After the initial conversion, results are cached as temporary files.

## Development

### Build

```bash
npm run compile

```

### Watch Mode

```bash
npm run watch

```

### Debug

1. Open this project in VS Code
2. Press F5 to launch the Extension Development Host
3. Open a `.pptx` file in the Development Host to test

## License

MIT License

## Contribution

Pull requests are welcome! Please report bugs and feature requests in Issues.

## Future Plans

* [ ] Slide zoom function
* [ ] Jump to specific slide function
* [ ] Presentation mode
* [ ] Slide search function
* [ ] Comparison view of multiple presentations
* [ ] Improve cache management

## Technical Details

This extension uses the following tools:

* [LibreOffice]() - Conversion from PowerPoint to PDF
* [Poppler]() - Conversion from PDF to images

**Process Flow:**

1. Convert PowerPoint file (.pptx) to PDF with LibreOffice
2. Convert PDF to high-resolution JPEG images with Poppler
3. Base64 encode images and embed in WebView
4. Display as vertically scrollable HTML