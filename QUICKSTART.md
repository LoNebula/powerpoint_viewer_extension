# PowerPoint Viewer - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Required Software

#### For macOS

```bash
# Use Homebrew
brew install --cask libreoffice
brew install poppler

```

#### For Ubuntu

```bash
sudo apt-get update
sudo apt-get install libreoffice poppler-utils

```

#### For Windows

**📘 Detailed Guide:** Please refer to [WINDOWS-SETUP.md]().

**Simplified Steps:**

1. **LibreOffice**
* Download from the [LibreOffice Official Site]()
* Run the installer


2. **Poppler**
* Download [Poppler for Windows (Latest)]()
* Extract ZIP to `C:\poppler`


3. **Add to Environment Variable PATH**
Run in PowerShell (Administrator):
```powershell
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\Program Files\LibreOffice\program;C:\poppler\Library\bin", "Machine")

```


Or configure via GUI:
* Windows Key + R → `sysdm.cpl`
* Advanced tab → Environment Variables
* Add to Path:
* `C:\Program Files\LibreOffice\program`
* `C:\poppler\Library\bin`




4. **Verification**
In a new Command Prompt:
```cmd
soffice --version
pdftoppm -v

```



### 2. Install the Extension

```bash
# Clone the repository
git clone <repository-url>
cd vscode-powerpoint-viewer

# Install dependencies
npm install

# Compile
npm run compile

```

### 3. Run Development Version in VS Code

1. Open this folder in VS Code
2. Press F5
3. A new VS Code window (Extension Development Host) opens

### 4. Preview PowerPoint Files

In the Development Host:

1. Open a PowerPoint file (.pptx)
2. Right-click the file → "Open With..." → "PowerPoint Preview"

Or

1. Open a PowerPoint file
2. `Ctrl+Shift+P` to open Command Palette
3. Run "PowerPoint: Open Preview"

## 📝 Basic Usage

### Vertical Scroll View

* **Continuous display of all slides**: Scroll with mouse wheel or trackpad
* **High-quality images**: Display PowerPoint appearance exactly as images
* **Slide numbers**: Displayed above each slide
* **Current position**: Display current slide number in status bar

### Zoom Function

* **Zoom In**: "+" button in header or `Ctrl/Cmd + +`
* **Zoom Out**: "−" button in header or `Ctrl/Cmd + -`
* **Reset**: "⟲" button in header or `Ctrl/Cmd + 0`
* **Mouse Wheel**: `Ctrl/Cmd + Wheel` to zoom
* **Zoom Range**: 50% - 200%

### Status Bar

Information displayed at the bottom of the screen:

* 📄 Current Slide Number / Total Slides
* 🔍 Current Zoom Level
* File Name

### Display Information

* Total slide count (displayed in header)
* Number of each slide
* Complete rendering of PowerPoint (including fonts, colors, layouts, animation effects)

## 🔧 Troubleshooting

### Command Not Found

```bash
# Check if LibreOffice is installed correctly
soffice --version

# Check if Poppler is installed correctly
pdftoppm -v

```

If either is missing, please check the installation steps again.

### Preview Does Not Appear

1. Open VS Code Developer Tools (Help → Toggle Developer Tools)
2. Check error messages in the Console tab
3. Address based on the error message

Common errors:

* `ENOENT: soffice` → LibreOffice is not installed
* `ENOENT: pdftoppm` → Poppler is not installed
* `Timeout` → File is too large (conversion is taking time)

### Conversion is Slow

Presentations with large files or many slides may take time to convert initially. Since converted files are cached as temporary files, display will be faster from the second time onwards.

## 🎨 Customization

The preview UI automatically adapts to the VS Code theme:

* Dark Theme → Dark preview screen
* Light Theme → Light preview screen

## 📦 Packaging and Distribution

Create a VSIX file to share with other users:

```bash
# Install vsce
npm install -g @vscode/vsce

# Package
vsce package

# Install the generated .vsix file
# VS Code: Ctrl+Shift+P → "Extensions: Install from VSIX..."

```

## 💡 Tips

1. **Complete Rendering**: Faithfully reproduces PowerPoint appearance by using LibreOffice
2. **Scroll View**: Quickly review all slides with the mouse wheel
3. **Multiple Presentations**: Preview multiple PowerPoint files simultaneously
4. **High Quality**: Converted to images at 150 DPI high resolution
5. **Cache**: Once converted, files are cached in a temporary directory for fast display on subsequent views

## 📚 Next Steps

* [README.md]() - Detailed documentation
* [CHANGELOG.md]() - Change log
* Issue reports and feature proposals are welcome!