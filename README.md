# Prompt Improver - Chrome Extension

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

AI-powered prompt improvement extension for LLM platforms. Get real-time suggestions to write better prompts for ChatGPT, Claude, Gemini, and more.

## ✨ Features

- 🎯 **Real-time Analysis** - Get instant feedback as you type
- 📊 **Quality Scoring** - See your prompt score (0-100)
- 💡 **Smart Suggestions** - 7 types of improvement checks
- 🚀 **Cross-Platform** - Works on ChatGPT, Claude, Gemini, Perplexity, Copilot
- ⚡ **Fast & Local** - No data sent to servers (free version)
- 🎨 **Non-Intrusive** - Auto-fade widget that stays out of your way
- ⌨️ **Keyboard Shortcut** - Press Ctrl+Shift+A to analyze
- 📋 **One-Click Actions** - Copy improved prompt or apply suggestions

## 🚀 Installation

### From Chrome Web Store
*(Coming Soon)*

### Manual Installation (Developer Mode)

1. Download or clone this repository
```bash
git clone https://github.com/YOUR_USERNAME/prompt-improver-extension.git
cd prompt-improver-extension
```

2. Install dependencies
```bash
pnpm install
```

3. Build the extension
```bash
pnpm build
```

4. Load in Chrome
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `dist` folder

## 🎯 Usage

1. Navigate to any supported LLM platform (ChatGPT, Claude, etc.)
2. Start typing your prompt
3. Widget appears automatically after 1 second
4. Review suggestions and quality score
5. Click "Copy Improved Prompt" or "Apply Suggestions"

**Keyboard Shortcut:** Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac) to analyze current prompt

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm

### Setup
```bash
# Install dependencies
pnpm install

# Run in development mode (with hot reload)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Clean build directory
pnpm clean
```

### Project Structure
```
prompt-improver-extension/
├── src/
│   ├── content/              # Content scripts
│   │   ├── index.ts         # Main entry point
│   │   ├── platform-detector.ts
│   │   ├── prompt-analyzer.ts
│   │   ├── suggestion-widget.ts
│   │   └── styles.css
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── tests/                   # Test files
├── build.js                 # Build script
├── manifest.json           # Extension manifest
└── package.json
```

## 📊 Analysis Checks

The extension performs 7 types of checks:

1. **Clarity** - Detects vague words and unclear instructions
2. **Specificity** - Identifies missing details and constraints
3. **Structure** - Checks for wall of text and organization
4. **Context** - Ensures sufficient background information
5. **Format** - Verifies output format specification
6. **Length** - Validates prompt length (not too short/long)
7. **Instructions** - Checks for clear questions or commands

## 🌐 Supported Platforms

- ✅ ChatGPT (chatgpt.com)
- ✅ Claude (claude.ai)
- ✅ Gemini (gemini.google.com)
- ✅ Perplexity (perplexity.ai)
- ✅ Copilot (copilot.microsoft.com)

## 🧪 Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

Test coverage: 71% lines, 68% branches, 85% functions

## 🗺️ Roadmap

### v0.2.0 (Planned)
- [ ] Premium AI-powered analysis (Claude API)
- [ ] 50+ prompt templates
- [ ] Prompt history (last 100)
- [ ] Cloud sync across devices
- [ ] Custom analysis rules

### v0.3.0 (Future)
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Export to Notion/Obsidian
- [ ] Browser sync (Firefox, Edge)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Akshen**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/YOUR_PROFILE)

## 🙏 Acknowledgments

- Built with TypeScript and esbuild
- Tested with Jest
- Icons created with [Tool Name]
- Inspired by prompt engineering best practices

## 📧 Support

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/prompt-improver-extension/issues)
- **Email:** your.email@example.com
- **Feedback:** Use the thumbs down button in Chrome Web Store

## 🔒 Privacy

This extension respects your privacy:
- ✅ All analysis runs locally in your browser
- ✅ No data sent to external servers (free version)
- ✅ No tracking or analytics
- ✅ Open source - verify yourself

## ⭐ Show Your Support

If you find this extension helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔀 Contributing code

---

Made with ❤️ for better AI interactions
```

---

## **Step 4: Create LICENSE**

Create `LICENSE` file:
```
MIT License

Copyright (c) 2025 Akshen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
