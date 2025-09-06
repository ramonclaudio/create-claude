# create-claude

Claude Code setup that just works. Bootstrap every project with agents, hooks, commands, and smart permissions. One command, zero headaches.

[![version](https://img.shields.io/npm/v/create-claude.svg?label=version&color=brightgreen)](https://www.npmjs.com/package/create-claude)
[![downloads](https://img.shields.io/npm/dm/create-claude.svg?label=downloads&color=blue)](https://www.npmjs.com/package/create-claude)
[![package size](https://img.shields.io/npm/unpacked-size/create-claude?label=package%20size&color=orange)](https://www.npmjs.com/package/create-claude)
[![node version](https://img.shields.io/node/v/create-claude?label=node%20version&color=forestgreen)](https://www.npmjs.com/package/create-claude)
[![build](https://github.com/RMNCLDYO/create-claude/workflows/CI/badge.svg?label=build&color=navy)](https://github.com/RMNCLDYO/create-claude/actions/workflows/ci.yml)
[![security](https://github.com/RMNCLDYO/create-claude/workflows/Security%20Scan/badge.svg?label=security&color=purple)](https://github.com/RMNCLDYO/create-claude/actions/workflows/security.yml)
[![openssf](https://www.bestpractices.dev/projects/11141/badge?label=openssf&color=gold)](https://www.bestpractices.dev/projects/11141)
[![license](https://img.shields.io/badge/license-MIT-red.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
npm create claude
```

*Adds the **local** config files to your project. ZERO dependencies, ZERO  overhead.*

## Installation Options

### Package Managers
```bash
npm create claude               # npm
pnpm create claude              # pnpm  
bun create claude               # bun
yarn create claude              # yarn
```

### Flags
```bash
npm create claude --dry-run     # Preview files
npm create claude --help        # All options
```

### Shortcuts
```bash
cld                             # Short alias
npx cld                         # Via npx
```

## Programmatic Usage

### Installation
```bash
npm i create-claude
```

### Usage
```typescript
import { init } from 'create-claude';

await init('./my-project');
```

## Features

### Smart Configuration
- **Auto-detection**: Finds your package.json scripts, formatters, linters
- **Smart permissions**: Pre-approves safe operations, blocks dangerous ones

### Enhanced Workflow  
- **Custom agents**: `/refactor` and `/validate` commands
- **Better statusline**: Shows Git branch, uncommitted changes
- **Format hooks**: Runs Prettier/ESLint/etc automatically

## FAQ

<details>
<summary><strong>Is it safe to run?</strong></summary>

Yes. It only creates config files, never modifies your code. Each file operation uses SHA256 checksums and creates timestamped backups.

```bash
# If something goes wrong, backups are here:
ls .create-claude-backup-*
```
</details>

<details>
<summary><strong>How do I remove it?</strong></summary>

Delete the config files:

```bash
rm -rf .claude CLAUDE.md
```

Your original code stays untouched.
</details>

<details>
<summary><strong>What are the requirements?</strong></summary>

- Node.js 18+
- [Claude Code](https://claude.ai/code) (the CLI tool)

That's it. No global installs, no dependencies.
</details>

<details>
<summary><strong>Does it work with my tools?</strong></summary>

It auto-detects:
- **Formatters**: Prettier, ESLint, Biome, dprint
- **Package managers**: npm, yarn, pnpm, bun  
- **Languages**: JavaScript, TypeScript, Python, Go, Rust
- **Frameworks**: React, Vue, Next.js, etc.

Can't find your tool? It falls back to sensible defaults.
</details>

<details>
<summary><strong>What files does it create?</strong></summary>

```
.claude/
├── settings.local.json     # Permissions, tool detection
├── hooks/
│   ├── format.cjs         # Auto-format on save
│   └── safety.cjs         # Block dangerous operations
├── agents/
│   ├── refactor.md        # /refactor command
│   └── pre-commit.md      # Git hook integration
├── commands/
│   ├── validate.md        # /validate command
│   └── test.md            # /test command
└── scripts/
    └── statusline.cjs     # Git status in prompt

CLAUDE.md                   # Project-specific instructions
```
</details>

## Security

This project follows security best practices:
- All dependencies are audited and kept up-to-date
- Code is scanned with CodeQL and other security tools
- OpenSSF Scorecard certified
- Signed releases with build provenance

Report security issues: [SECURITY.md](SECURITY.md)

## Contributing

Contributions welcome! Please read [SECURITY.md](SECURITY.md) first, then:

1. Fork the repo
2. Create a feature branch
3. Run `npm run validate` before committing
4. Submit a pull request

## Links

[**Issues**](https://github.com/RMNCLDYO/create-claude/issues) • [**Changelog**](https://github.com/RMNCLDYO/create-claude/blob/main/CHANGELOG.md) • [**Claude Code Docs**](https://docs.anthropic.com/en/docs/claude-code) • [**Security**](SECURITY.md)

## License

MIT © [RMNCLDYO](https://github.com/RMNCLDYO)
