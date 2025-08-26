# create-claude

> Initialize Claude Code configurations for your project.

[![npm version](https://img.shields.io/npm/v/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![npm downloads](https://img.shields.io/npm/dm/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

```bash
npm create claude@latest
```

That's it! Interactive prompts will guide you through the setup.

## 📋 Prerequisites

- **Node.js** 18 or higher
- **Claude Code** (Install from [claude.ai/code](https://claude.ai/code))

## 💻 Installation Methods

```bash
# Recommended - always uses latest version
npm create claude@latest

# Alternative methods
npx create-claude@latest      # Using npx directly
npm init claude               # Using npm init
npm install -g create-claude  # Global install (then use 'create-claude' or 'cld')
```

## 🎯 What Gets Installed

### Agents
- **pre-commit**: Validates your code before every commit
- **refactor**: Helps identify and improve code quality issues

### Hooks  
- **format**: Auto-formats your code on save (respects .gitignore, 10MB file limit)
- **safety**: Prevents destructive commands like `rm -rf` and blocks access to sensitive files

### Commands
- **/validate**: Runs your project's linting and type checking
- **/test**: Executes your test suite with proper error handling

### Scripts
- **statusline**: Shows project context, git status, and current runtime in Claude Code

### Configuration
- **settings.local.json**: Full permissions and hook configuration
- **CLAUDE.md**: Project-specific instructions tailored to your stack

## 🛡️ Safety

- Creates timestamped backups before making changes
- Atomic file operations - either all succeed or none do
- SHA256 verification of file integrity
- Automatic rollback if operations fail
- Non-destructive - existing files are preserved

## 🔧 Options

- `--dry-run` - Preview what will be installed without making changes
- `--help` - Show available options
- `--version` - Display package version

## ❓ Troubleshooting

If something goes wrong, your original files are preserved in `.create-claude-backup-*` directories. You can restore them by copying the backup files back to their original locations.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.


## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/create-claude)
- [GitHub Repository](https://github.com/RMNCLDYO/create-claude)
- [Report Issues](https://github.com/RMNCLDYO/create-claude/issues)
- [Changelog](https://github.com/RMNCLDYO/create-claude/blob/main/CHANGELOG.md)
- [Claude Code Documentation](https://claude.ai/code)

## 📄 License

MIT © [RMNCLDYO](https://github.com/RMNCLDYO)