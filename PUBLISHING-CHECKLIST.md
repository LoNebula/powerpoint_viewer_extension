# Pre-Publish Checklist

Before publishing the extension to the VS Code Marketplace, please check the following items.

## Required Items

### package.json

* [ ] `name`: Appropriate package name (lowercase, hyphens allowed)
* [ ] `displayName`: Clear display name
* [ ] `description`: Concise description of functionality (max 512 characters)
* [ ] `version`: Appropriate version number (Semantic Versioning)
* [ ] `publisher`: Update to your publisher name
* [ ] `author`: Fill in author information
* [ ] `license`: Specify license (default: MIT)
* [ ] `icon`: Specify path to icon file
* [ ] `repository`: Fill in GitHub repository URL
* [ ] `bugs`: Fill in Issues page URL
* [ ] `homepage`: Fill in homepage URL
* [ ] `keywords`: Add search keywords (5-10 recommended)
* [ ] `categories`: Select appropriate categories
* [ ] `engines.vscode`: Specify minimum supported version

### Files

* [ ] `README.md`: Detailed description and screenshots
* [ ] `CHANGELOG.md`: Record version history
* [ ] `LICENSE`: Include license file
* [ ] `icon.svg` or `icon.png`: 128x128 icon
* [ ] `.vscodeignore`: Exclude unnecessary files

### README.md Content

* [ ] Clear feature description
* [ ] Screenshots or GIF (at least one)
* [ ] Installation instructions
* [ ] Usage
* [ ] System requirements (LibreOffice, Poppler)
* [ ] Troubleshooting
* [ ] License information

### Code Quality

* [ ] No TypeScript compile errors: `npm run compile`
* [ ] No Lint errors: `npm run lint`
* [ ] Verify all features work
* [ ] Test on Windows, macOS, Linux (if possible)

### Security

* [ ] Check for vulnerable packages: `npm audit`
* [ ] Remove unnecessary dependencies
* [ ] Check that no sensitive information (API keys, passwords) is included

## Recommended Items

### Marketplace Display Optimization

* [ ] `galleryBanner`: Set gallery banner color and theme
* [ ] Add multiple screenshots (per feature)
* [ ] Demo usage with GIF animation
* [ ] Add badges to README (version, download count, etc.)

### Documentation

* [ ] Add FAQ section
* [ ] Document known issues
* [ ] Add contribution guidelines (CONTRIBUTING.md)
* [ ] Add code of conduct (CODE_OF_CONDUCT.md)

### Testing

* [ ] Test with PowerPoint files of various sizes
* [ ] Test with slides having complex layouts
* [ ] Test with large number of slides (100+)
* [ ] Check error handling for corrupted files

### GitHub Repository

* [ ] Make repository public
* [ ] Appropriate README
* [ ] Create Issue templates
* [ ] Create Pull Request templates
* [ ] Automate build with GitHub Actions (Optional)

## Publishing Steps

### 1. Final Verification

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Compile
npm run compile

# Lint
npm run lint

# Create package
npm run package

```

### 2. Local Testing

```bash
# Install VSIX
code --install-extension powerpoint-viewer-1.0.0.vsix

# Restart VS Code and test

```

### 3. Azure DevOps Setup

* [ ] Create Personal Access Token (PAT)
* [ ] Create publisher
* [ ] Login with vsce: `vsce login your-publisher-name`

### 4. Publish

```bash
# Publish
npm run publish

# Or
vsce publish

```

### 5. Post-Publish Verification

* [ ] Check if visible in Marketplace search
* [ ] Check if visible in VS Code search
* [ ] Install and verify operation
* [ ] Check if description and screenshots are displayed correctly

## Troubleshooting

### Common Errors

**"Missing publisher name"**
→ Add `publisher` field to package.json

**"Failed to get publisher"**
→ Use correct publisher name and PAT with `vsce login`

**"Icon not found"**
→ Check if icon file exists in project root

**"README.md not found"**
→ Check if README.md exists in project root

**"Failed to compile"**
→ Run `npm run compile` and fix errors

## References

* [VS Code Publishing Extensions]()
* [Extension Manifest Reference]()
* [Marketplace Presentation Tips]()

## After Checklist Completion

Once all checklist items are completed, please follow the steps in [PUBLISHING.md]() to publish.