# Publishing to VS Code Marketplace

This guide explains how to publish the PowerPoint Viewer extension to the VS Code Marketplace.

## Prerequisites

1. **Microsoft Account**: Required to access Azure DevOps
2. **Node.js**: Installed
3. **vsce**: VS Code extension packaging and publishing tool

## Procedures

### 1. Create a Publisher in Azure DevOps

1. Access [Azure DevOps]()
2. Sign in with your Microsoft account
3. Create a [Personal Access Token (PAT)]():
* User icon in top right → Security → Personal access tokens
* Click "+ New Token"
* **Name**: VS Code Publisher (Any name)
* **Organization**: All accessible organizations
* **Expiration**: Any duration (e.g., 1 year)
* **Scopes**: Custom defined → Show all scopes → Check **Marketplace** → **Manage**
* Click "Create"
* **Important**: Copy the displayed token and save it in a safe place (it will not be shown again)


4. Access [Visual Studio Marketplace Publisher Management]()
5. Click "Create publisher"
6. Enter required information:
* **Publisher Name**: Unique identifier (e.g., `your-name`) lowercase, numbers, hyphens allowed
* **Display Name**: Display name (e.g., `Your Name`)
* **Email**: Contact email



### 2. Update package.json

Update the `publisher` field in `package.json` to the publisher name you created:

```json
{
  "publisher": "your-actual-publisher-name"
}

```

Update other information as needed:

* `author`: Your name
* `repository`: GitHub repository URL
* `bugs`: Issues page URL
* `homepage`: Project homepage URL

### 3. Install vsce and Authenticate

```bash
# Install vsce globally
npm install -g @vscode/vsce

# Login as publisher
vsce login your-publisher-name

```

When prompted, enter the PAT created in Step 1.

### 4. Packaging the Extension

Create a package locally first to test before publishing:

```bash
# Run in project directory
cd vscode-powerpoint-viewer

# Install dependencies
npm install

# Compile
npm run compile

# Create package
vsce package

```

This will generate a `.vsix` file.

### 5. Local Testing

Install and test the generated `.vsix` file:

```bash
code --install-extension powerpoint-viewer-1.0.0.vsix

```

Or in VS Code:

1. `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
2. Select "Extensions: Install from VSIX..."
3. Select the `.vsix` file

### 6. Publish to Marketplace

Publish once testing is complete:

```bash
vsce publish

```

Or bump the version and publish:

```bash
# Bump patch version (1.0.0 → 1.0.1)
vsce publish patch

# Bump minor version (1.0.0 → 1.1.0)
vsce publish minor

# Bump major version (1.0.0 → 2.0.0)
vsce publish major

```

### 7. Verify Publication

Wait a few minutes after publishing, then:

1. Search for the extension in the [VS Code Marketplace]()
2. Search in VS Code: `Ctrl+Shift+X` → Search for "PowerPoint Viewer"

## Troubleshooting

### Error: "Missing publisher name"

Please add the `publisher` field to `package.json`.

### Error: "Failed to get publisher"

Check if you entered the publisher name correctly in `vsce login` and are using a valid PAT.

### Error: "Icon not found"

Ensure `icon.svg` or `icon.png` exists in the project root.

### Error: "README.md not found"

Ensure the `README.md` file exists in the project root.

## Publishing Updates

When updating the extension:

1. Modify the code
2. Record changes in `CHANGELOG.md`
3. Bump the version number and publish:
```bash
vsce publish patch  # or minor, major

```



## Unpublishing

To remove the extension from the Marketplace:

1. Access [Publisher Management Page]()
2. Select the extension
3. "..." menu → "Unpublish"

**Note**: Unpublishing will make it inaccessible to all users.

## Best Practices

### Enrich README.md

* Add screenshots or GIFs
* Clear installation instructions
* Usage examples
* Troubleshooting

### Optimize Icon

* 128x128 pixel PNG or SVG
* Simple and recognizable design
* Visible in both VS Code dark and light themes

### Manage CHANGELOG.md

Record changes for every version:

```markdown
## [1.0.1] - 2024-02-18
### Fixed
- Bug fixes

## [1.0.0] - 2024-02-17
### Added
- Initial release

```

### Versioning

Follow [Semantic Versioning]():

* **Major (x.0.0)**: Breaking changes
* **Minor (0.x.0)**: New features (backwards compatible)
* **Patch (0.0.x)**: Bug fixes

## Reference Links

* [VS Code Extension Publishing]()
* [Extension Manifest]()
* [Azure DevOps]()
* [Visual Studio Marketplace]()

## Add npm scripts

Useful scripts added to `package.json`:

```json
{
  "scripts": {
    "package": "vsce package",
    "publish": "vsce publish"
  }
}

```

Usage:

```bash
npm run package  # Create package
npm run publish  # Publish

```