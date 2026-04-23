# create-claude

[![npm](https://img.shields.io/npm/v/create-claude)](https://www.npmjs.com/package/create-claude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

I was manually copying the same Claude Code config into every new project: `.claude/settings.local.json`, a pile of hooks, a dozen slash commands, a few subagents, my terse output style, a `CLAUDE.md`. I wanted one command that dropped the whole thing in. So I built this.

Claude Code setup that just works. Bootstrap every project with agents, hooks, commands, and smart permissions. One command, zero dependencies, zero overhead.

## Quick start

```bash
npm create claude
```

## Install

```bash
npm create claude               # npm
pnpm create claude              # pnpm
bun create claude               # bun
yarn create claude              # yarn
```

Flags:

```bash
npm create claude --dry-run     # preview files
npm create claude --help        # all options
```

Shorter alias:

```bash
cld
npx cld
```

## Programmatic

```bash
npm i create-claude
```

```typescript
import { init } from 'create-claude';

await init('./my-project');
```

## What's in the box

### Safety

- `bypassPermissions` mode: Claude operates freely, but safety hooks block destructive commands (`rm -rf /`, `sudo rm`, disk formatting)
- All file/directory deletions require explicit user approval
- SHA256 checksums + timestamped backups on every file operation

### 8 slash commands

- `/commit`: git commits with Haiku (cost-efficient)
- `/explain`: concise code explanations
- `/fix`: structured bug fixes
- `/optimize`: performance improvements
- `/pr`: pull requests with git context
- `/review`: brutal code reviews
- `/test`: test runner with pattern support
- `/validate`: lint, typecheck, format

### 3 subagents

- `pre-commit`: ruthless validation before commits
- `refactor`: aggressive complexity reduction
- `debugger`: root cause analysis and fixes

### Config

- Session hooks (cleanup on exit)
- Advanced statusline: git status, framework detection, color-coded with modular helpers
- `CLAUDE.md` uses `@` imports for README and auto-pulls project configs (`package.json`, `Cargo.toml`, etc.)
- Terse output style

## Requirements

- Node.js 18+
- [Claude Code](https://claude.ai/code)

## What gets created

```
.claude/
├── settings.local.json
├── hooks/
│   ├── format.cjs
│   ├── safety.cjs
│   └── session-end.cjs
├── agents/
│   ├── pre-commit.md
│   ├── refactor.md
│   └── debugger.md
├── commands/
│   ├── commit.md, explain.md, fix.md, optimize.md
│   └── pr.md, review.md, test.md, validate.md
├── scripts/
│   ├── statusline.cjs
│   ├── statusline-git.cjs
│   └── statusline-detect.cjs
└── output-styles/
    └── terse.md

CLAUDE.md
```

## Remove it

```bash
rm -rf .claude CLAUDE.md
```

Your original code stays untouched.

## License

MIT
