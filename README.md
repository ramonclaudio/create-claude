# create-claude

Claude Code configuration in one command.

[![npm version](https://img.shields.io/npm/v/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![npm downloads](https://img.shields.io/npm/dm/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Requirements

- **Node.js** ≥ 20.0.0
- **Claude Code** (Anthropic's official CLI)
- **Operating Systems**: macOS, Linux, Windows
- **Architectures**: x64, ARM64

## Usage

```bash
npx create-claude
```

## Installation

```bash
npx create-claude      # Recommended
npm init claude        # Alternative
cld                    # After global install
```

## Options

```bash
--help       # Show help
--version    # Show version
--dry-run    # Preview changes
```

## What You Get

```
.claude/
├── agents/          # AI-powered code assistants
├── hooks/           # Auto-formatting & safety checks  
├── commands/        # Custom slash commands
├── scripts/         # Dynamic statusline
└── settings.json    # Full permissions config
```

- **Agents**: pre-commit validation, refactoring
- **Hooks**: format on save, command safety
- **Commands**: /validate, /test
- **Templates**: Stack detection, Git integration

## Supported Stacks

**Languages:** Rust, Go, Python, Java, C/C++, Node.js, Bun, TypeScript  
**Frameworks:** Next.js, Nuxt.js, NestJS, React, Vue, Angular, Svelte, Vite, Astro, Express, Fastify + more  
**Package Managers:** npm, yarn, pnpm, bun, pip, poetry, uv  
**Features:** Auto-formatting, pre-commit hooks, safety guards, progress indicators, smart backups

## API

```typescript
import { init, ErrorCode } from 'create-claude';

// Basic usage
const result = await init('/path/to/project');
console.log(result.message);

// With options
const dryRunResult = await init('/path/to/project', { dryRun: true });
if (dryRunResult.success) {
  console.log(`Would create ${dryRunResult.filesCreated} files`);
}

// Error handling
if (!result.success) {
  switch (result.errorCode) {
    case ErrorCode.NO_WRITE_PERMISSION:
      console.error('Permission denied');
      break;
    case ErrorCode.SKELETON_FILES_MISSING:
      console.error('Package corrupted, reinstall');
      break;
  }
}
```

## Safety

- Atomic file operations with locks
- SHA256 backup verification
- Automatic rollback on failure
- Timestamped backups in `.create-claude-backup-[timestamp]/`

## Features

- Zero dependencies
- < 2 seconds setup
- Atomic operations
- Automatic backups
- Framework detection

## Testing

- Core operations and error handling
- Concurrent safety and rollback
- 15+ frameworks supported
- Multiple runtimes and package managers
- Git integration
- Full integration test suite

## Troubleshooting

**Permission Errors**:
```bash
# Fix: Ensure write permissions in target directory
chmod 755 /path/to/project && create-claude
```

**Node Version Issues**:
```bash
# Fix: Upgrade to Node.js ≥ 20
nvm install 20 && nvm use 20
```

**Existing Config Conflicts**:
```bash
# Your original files are safely backed up in:
# .create-claude-backup-[timestamp]/
# You can restore them manually if needed
```

**Module Import Errors**:
```bash
# Fix: Ensure you have latest Claude Code installed
# The hooks require Node.js CommonJS compatibility
```

## Restore Backup

```bash
cp -r .create-claude-backup-*/* .
```

## Disclaimer

Backup your project first. Commit to git before running.

NO WARRANTY. USE AT YOUR OWN RISK.

## Contributing

PRs welcome! Please read our [contributing guidelines](https://github.com/RMNCLDYO/create-claude/blob/main/CONTRIBUTING.md) first.

## Support

[Issues](https://github.com/RMNCLDYO/create-claude/issues)

## License

MIT
