# Windows Setup Guide

This guide explains the steps to set up the PowerPoint Viewer extension in a Windows environment.

## Installing Required Software

### 1. Install LibreOffice

#### Download

1. Visit the [LibreOffice Official Website]()
2. Click "Download Version X.X.X"
3. Download the Windows installer (.msi)

#### Install

1. Double-click the downloaded `.msi` file
2. Follow the installation wizard to install
3. Default settings are fine

#### Verification

Run the following in Command Prompt or PowerShell:

```cmd
"C:\Program Files\LibreOffice\program\soffice.exe" --version

```

If version information is displayed, it is OK.

**Important**: You must add the LibreOffice path to your environment variables (described later).

### 2. Install Poppler

#### Download

1. Visit [Poppler for Windows]()
2. Download `Release-XX.XX.X-0.zip` from the latest Release
3. Or direct link: [Latest Version]()

#### Install

1. Extract the downloaded ZIP file
2. Move the extracted folder to `C:\poppler` (or any location you prefer)
3. Confirm that `pdftoppm.exe` exists inside the `C:\poppler\Library\bin` folder

### 3. Setting Environment Variable PATH

#### Set via PowerShell (Recommended)

Open PowerShell with Administrator privileges and run the following:

```powershell
# Add LibreOffice path
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\Program Files\LibreOffice\program",
    "Machine"
)

# Add Poppler path
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\poppler\Library\bin",
    "Machine"
)

```

#### Set via GUI

1. Press Windows Key + R to open "Run"
2. Type `sysdm.cpl` and press Enter
3. Click the "Advanced" tab
4. Click the "Environment Variables" button
5. In the "System variables" section, select "Path" and click "Edit"
6. Click "New" and add the following:
* `C:\Program Files\LibreOffice\program`
* `C:\poppler\Library\bin`


7. Click "OK" on all dialogs

#### Verification

**Open a new Command Prompt** and run the following:

```cmd
soffice --version
pdftoppm -v

```

If version information is displayed for both commands, it is OK.

**Note**: After changing environment variables, you need to close existing Command Prompts or PowerShell windows and open new ones.

## VS Code Extension Setup

### 1. Install Node.js (If not installed)

1. Visit the [Node.js Official Website]()
2. Download and install the LTS version

### 2. Setup Extension

```cmd
# Move to the location where the ZIP file was extracted
cd path\to\vscode-powerpoint-viewer

# Install dependencies
npm install

# Compile TypeScript
npm run compile

```

### 3. Run Development Version in VS Code

1. Open the `vscode-powerpoint-viewer` folder in VS Code
2. Press F5
3. A new VS Code window (Extension Development Host) opens

### 4. Preview PowerPoint Files

In the Development Host:

1. Open a PowerPoint file (.pptx)
2. Right-click the file → "Open With..." → "PowerPoint Preview"

## Troubleshooting

### "LibreOffice is not installed" Error

**Cause**: LibreOffice path is not set in environment variables.

**Solution**:

1. Check if `C:\Program Files\LibreOffice\program` is included in the Path environment variable.
2. Run `soffice --version` in a new Command Prompt.
3. Restart VS Code.

### "Poppler is not installed" Error

**Cause**: Poppler path is not set in environment variables, or pdftoppm.exe cannot be found.

**Solution**:

1. Check if `C:\poppler\Library\bin\pdftoppm.exe` exists.
2. Check if `C:\poppler\Library\bin` is included in the Path environment variable.
3. Run `pdftoppm -v` in a new Command Prompt.
4. Restart VS Code.

### How to Check if Path is Set

Open a new Command Prompt:

```cmd
echo %PATH%

```

Check if the output includes:

* `C:\Program Files\LibreOffice\program`
* `C:\poppler\Library\bin`

### Conversion Does Not Work

1. Check if Windows Defender or antivirus software is blocking it.
2. Check if the PowerPoint file is corrupted (verify if it opens in PowerPoint).
3. Check error logs in VS Code Developer Tools (Help → Toggle Developer Tools).

### When Administrator Privileges are Required

In some environments, you may need to run VS Code as an administrator:

1. Right-click VS Code
2. Select "Run as administrator"

## FAQ

### Q: LibreOffice is already installed but it doesn't work

A: Please check if the LibreOffice path is set in the Path environment variable. Also, please restart VS Code.

### Q: Can I change the installation location of Poppler?

A: Yes. Extract it to any location and add the `Library\bin` folder in that location to the Path environment variable.

### Q: Can I use the Portable version of LibreOffice?

A: Yes. If using the Portable version, please add the `program` directory within that folder to the Path environment variable.

### Q: Does it work on Windows 11?

A: Yes. It works on both Windows 10 and Windows 11.

## Recommended Environment

* **OS**: Windows 10 (64-bit) / Windows 11
* **RAM**: 4GB or more
* **Storage**: 2GB or more free space (LibreOffice + Poppler)
* **VS Code**: Latest version recommended

## After Setup Completion

Once everything is installed correctly:

1. Launch Extension Development Host in VS Code (Press F5)
2. Open a PowerPoint file
3. Right-click → "Open With..." → "PowerPoint Preview"
4. Browse all slides by scrolling

Good job! 🎉