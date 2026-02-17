# 🚀 Quick Publish Guide

This is the shortest procedure to publish to the VS Code Marketplace.

## Step 1: Create a Publisher in Azure DevOps (First Time Only)

1. Sign in to [Azure DevOps]()
2. Create a Personal Access Token (PAT):
* User Icon → Security → Personal access tokens
* **New Token** → Marketplace: Check **Manage**
* Copy and save the token


3. **Create publisher** in [VS Marketplace Publisher Management]()
* Publisher Name: `your-name` (lowercase, hyphens allowed)
* Display Name: `Your Name`
* Email: Your email



## Step 2: Update package.json

```json
{
  "publisher": "your-actual-publisher-name",
  "author": {
    "name": "Your Name"
  },
  "repository": {
    "url": "https://github.com/yourusername/vscode-powerpoint-viewer"
  }
}

```

## Step 3: Build and Publish

```bash
# 1. Install vsce (First time only)
npm install -g @vscode/vsce

# 2. Login (First time only)
vsce login your-publisher-name
# → Enter PAT

# 3. Install dependencies
npm install

# 4. Compile
npm run compile

# 5. Create package (For testing)
npm run package
# → powerpoint-viewer-1.0.0.vsix is generated

# 6. Test locally
code --install-extension powerpoint-viewer-1.0.0.vsix

# 7. Publish!
npm run publish

```

## Step 4: Verification

Check the following after a few minutes:

* Search in [VS Code Marketplace]()
* Search inside VS Code (Ctrl+Shift+X)

## Subsequent Updates

```bash
# After modifying code
npm run compile

# Bump version and publish
vsce publish patch  # 1.0.0 → 1.0.1
vsce publish minor  # 1.0.0 → 1.1.0
vsce publish major  # 1.0.0 → 2.0.0

```

## Troubleshooting

### Error: Missing publisher name

→ Check the `publisher` field in package.json

### Error: Failed to get publisher

→ Use correct publisher name and PAT with `vsce login`

### Error: Icon not found

→ Check if `icon.svg` exists in the project root

---

📖 Refer to [PUBLISHING.md]() and [PUBLISHING-CHECKLIST.md]() for details.