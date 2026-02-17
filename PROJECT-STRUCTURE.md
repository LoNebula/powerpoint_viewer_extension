# 📁 Project Structure

```
vscode-powerpoint-viewer/
│
├── 📄 README.md                    # Main documentation
├── 📄 OVERVIEW.md                  # Project overview
├── 📄 CHANGELOG.md                 # Change log
├── 📄 LICENSE                      # MIT License
├── 📄 package.json                 # NPM package configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 🎨 icon.svg                     # Extension icon
│
├── 📚 セットアップガイド/          # Setup Guides/
│   ├── QUICKSTART.md               # 5-minute quick start guide
│   ├── WINDOWS-SETUP.md            # Detailed Windows setup
│   └── TESTING.md                  # Testing procedures
│
├── 🚀 公開関連/                    # Publishing Related/
│   ├── QUICK-PUBLISH.md            # Quick publishing guide
│   ├── PUBLISHING.md               # Detailed publishing procedures
│   └── PUBLISHING-CHECKLIST.md     # Pre-publish checklist
│
├── 📂 src/                         # Source code
│   ├── extension.ts                # Extension entry point
│   ├── converter.ts                # PPTX to JPEG conversion
│   └── previewProvider.ts          # Preview display logic
│
├── 📂 .vscode/                     # VS Code configuration
│   ├── extensions.json             # Recommended extensions
│   ├── launch.json                 # Debug configuration
│   ├── settings.json               # Editor settings
│   └── tasks.json                  # Task configuration
│
├── 📂 .github/                     # GitHub configuration
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md           # Bug report template
│       └── feature_request.md      # Feature request template
│
└── 📄 その他                       # Others
    ├── .gitignore                  # Git ignore settings
    ├── .vscodeignore               # VSIX ignore settings
    └── .eslintrc.js                # ESLint configuration

```

## 📖 Documentation List

### For Developers

1. **README.md** - Main documentation, feature description, installation instructions
2. **QUICKSTART.md** - Quick guide to get started in 5 minutes
3. **WINDOWS-SETUP.md** - Detailed setup instructions for Windows environment
4. **TESTING.md** - Testing procedures and support scope

### For Publishing

1. **QUICK-PUBLISH.md** ⭐ Shortest publishing procedure
2. **PUBLISHING.md** - Detailed publishing procedures
3. **PUBLISHING-CHECKLIST.md** - Pre-publish checklist

### Others

1. **OVERVIEW.md** - Project overview
2. **CHANGELOG.md** - Version history
3. **LICENSE** - MIT License

## 🚀 Quick Start

### Start Development

```bash
npm install
npm run compile
# Press F5 to launch the development host

```

### Create Test Package

```bash
npm run package
# → powerpoint-viewer-1.0.0.vsix

```

### Publish to Marketplace

```bash
npm run publish

```

Please refer to each document for details!

## 📝 Update Before Publishing

* [ ] `package.json` → `publisher`, `author`, `repository`
* [ ] `README.md` → Publisher name in badges
* [ ] Add actual screenshots

## 💡 Tips

* JSON debug warnings → Install recommended extensions
* Windows environment → See WINDOWS-SETUP.md
* First time publishing → Start with QUICK-PUBLISH.md