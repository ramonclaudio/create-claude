# create-claude

> Installs production-ready Claude Code agents, hooks, commands, and smart permissions that eliminate interruptions, enforce code quality, and maintain safety through intelligent boundaries, allowing you to iterate fast and ship faster.

[![npm version](https://img.shields.io/npm/v/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![node-current](https://img.shields.io/node/v/create-claude)](https://www.npmjs.com/package/create-claude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What it is

An enhanced alternative to Claude Code's `/init` command that adds production-ready agents, hooks, commands, and automation tools to help developers work more efficiently.

## Quick Start

```bash
npm create claude@latest
```

30 seconds. Zero config. Immediate productivity boost.

## Installation

```bash
# Recommended
npm create claude@latest

# Alternative methods
npx create-claude@latest
npm init claude

# Global install (not recommended)
npm install -g create-claude
```

## Why use this

Claude Code's built-in `/init` provides basic configuration. This package extends that foundation with:

- **Pre-configured agents** for automated refactoring and pre-commit validation
- **Smart hooks** that auto-detect and run your existing formatters and linters
- **Custom commands** for common workflows like `/validate` and `/test`
- **Enhanced statusline** with Git and runtime information
- **Permission presets** that reduce interruptions while maintaining safety

The goal: help developers maintain flow state by automating repetitive tasks and reducing context switches.

## What you get

```
CLAUDE.md                    # Project context and coding standards
.claude/
├── settings.local.json      # Permission configuration with smart defaults
├── agents/                  
│   ├── pre-commit.md        # Enforces quality before commits
│   └── refactor.md          # Auto-simplifies complex code
├── hooks/                   
│   ├── format.cjs           # Auto-detects prettier/biome/ruff/black
│   └── safety.cjs           # Pattern-based command validation
├── commands/                
│   ├── validate.md          # Run all quality checks
│   └── test.md              # Discover and run test suites
├── scripts/                 
│   ├── statusline.sh        # Project-aware status display
│   ├── statusline-detect.sh # Framework/runtime detection
│   └── statusline-git.sh    # Enhanced Git information
└── output-styles/           
    └── terse.md             # Concise response format

```

## Key features

### Intelligent permissions

Reduces interruptions by pre-configuring common patterns:

```json
{
  "permissions": {
    "bypassPermissions": true,                               // Work uninterrupted
    "allowed": ["Read", "Write", "Edit", "..."],             // Allow all safe operations
    "blocked": ["Bash(*sudo*)", "Bash(*rm -rf /*)", "..."], // Block dangerous patterns
    "ask": ["Bash(*rm*)", "..."]                            // Prompt for destructive ops
  }
}
```

### Auto-detection

Automatically discovers and uses your existing tools:
- Formatters: Prettier, Biome, Ruff, Black
- Package managers: npm, yarn, pnpm, bun
- Test runners: Jest, Vitest, Pytest, Go test
- Runtime: Node.js, Python, Go, Rust

and more...

### Atomic operations

All file operations include automatic backup to `.create-claude-backup-*` with timestamp-based versioning.

### Custom statusline

Displays relevant project information in Claude Code:
- Project Name (non-git, git, or github)
- Current Git branch and status
- Active runtime and framework
- Package manager in use

## How it works

1. **Extends Claude Code's native configuration** - Builds on the [official memory hierarchy](https://docs.anthropic.com/en/docs/claude-code/manage-memory)
2. **Project-first approach** - Local settings override global, each project stays unique
3. **Pattern matching** - Uses Claude's pattern system for intelligent permission handling
4. **Zero dependencies** - Pure configuration files, no npm packages installed

## Configuration

All aspects are customizable through standard Claude Code configuration files:

### Adjust permissions
Edit `.claude/settings.local.json` to modify permission rules

### Customize agents
Modify markdown files in `.claude/agents/` to change agent behavior

### Add commands
Create new markdown files in `.claude/commands/` for custom workflows

### Modify hooks
Update JavaScript files in `.claude/hooks/` to change automation behavior

## Requirements

- Node.js 18+
- [Claude Code](https://claude.ai/code)

## CLI Options

```bash
npm create claude@latest --dry-run  # Preview changes without applying
npm create claude@latest --help      # Display available options
```

## Uninstall

```bash
rm -rf .claude CLAUDE.md
```

No dependencies or build artifacts to clean up.

## Contributing

This is open source software. Contributions are welcome:

- Report issues or request features via [GitHub Issues](https://github.com/RMNCLDYO/create-claude/issues)
- Submit improvements via pull requests
- Share your custom agents and commands with the community

## Support

- [Report bugs](https://github.com/RMNCLDYO/create-claude/issues)
- [Request features](https://github.com/RMNCLDYO/create-claude/issues)
- [Ask questions](https://github.com/RMNCLDYO/create-claude/discussions)

## Links

- [NPM Package](https://www.npmjs.com/package/create-claude)
- [GitHub Repository](https://github.com/RMNCLDYO/create-claude)
- [Changelog](https://github.com/RMNCLDYO/create-claude/blob/main/CHANGELOG.md)

## Related

- [Claude Code](https://claude.ai/code)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)

## License

MIT © [RMNCLDYO](https://github.com/RMNCLDYO)
