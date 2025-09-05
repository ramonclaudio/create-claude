# create-claude

> Better Claude Code setup. Agents, hooks, commands, smart permissions. Zero config.

[![npm version](https://img.shields.io/npm/v/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![npm downloads](https://img.shields.io/npm/dm/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![node-current](https://img.shields.io/node/v/create-claude)](https://www.npmjs.com/package/create-claude)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/RMNCLDYO/create-claude/badge)](https://scorecard.dev/viewer/?uri=github.com/RMNCLDYO/create-claude)
[![Security Audit](https://github.com/RMNCLDYO/create-claude/workflows/Security%20Scan/badge.svg)](https://github.com/RMNCLDYO/create-claude/actions/workflows/security.yml)
[![NPM Audit](https://github.com/RMNCLDYO/create-claude/workflows/NPM%20Audit%20Signatures/badge.svg)](https://github.com/RMNCLDYO/create-claude/actions/workflows/audit-signatures.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Funding](https://img.shields.io/github/sponsors/RMNCLDYO)](https://github.com/sponsors/RMNCLDYO)

## Quick Setup

**One command. Zero config. Better Claude Code.**

```bash
npm create claude        # or bun/pnpm/yarn
```

*No downloads, no dependencies, no permanent install - just copies config files to your project.*

```bash
$ npm create claude
create-claude helps you set up Claude Code with production-ready 
configuration. Press ^C anytime to quit.

Done! Claude Code configuration saved in current directory.
 + .claude/settings.local.json
 + .claude/agents/pre-commit.md
 + .claude/agents/refactor.md
 + .claude/hooks/format.cjs
 + .claude/hooks/safety.cjs
 + .claude/commands/validate.md
 + .claude/commands/test.md
 + .claude/scripts/statusline.cjs
 + .claude/output-styles/terse.md
 + CLAUDE.md

To get started:
  Open Claude Code and enjoy the enhanced experience!
```

---

## More Options

**Works with any package manager:**

```bash
# npm
npm create claude my-project
npx create-claude my-project

# pnpm
pnpm create claude my-project
pnpm dlx create-claude my-project

# bun
bun create claude my-project
bunx create-claude my-project

# yarn
yarn create claude my-project
yarn dlx create-claude my-project
```

```bash
npm create claude --dry-run     # Preview without installing
npm create claude --help        # Show all options
```

## Use as Library

```bash
npm i create-claude
```

```typescript
import { init } from 'create-claude';

await init('./my-project');
```

## Features

- Agents for refactoring and pre-commit validation
- Hooks that find your formatters/linters
- Commands like `/validate` and `/test`
- Better statusline with Git info
- Permissions that don't bug you

## That's it

Run the command. Get back to work.

---

## FAQ

**What does this do?** Adds config files to make Claude Code work better. No code changes.

**Is it safe?** Handles file operations carefully with SHA256 checksums and timestamped backups.

**How do I undo it?** `rm -rf .claude CLAUDE.md`

**Do I need to install anything?** Just Node.js 18+ and [Claude Code](https://claude.ai/code)

## Issues

[GitHub Issues](https://github.com/RMNCLDYO/create-claude/issues)

## Links

- [NPM Package](https://www.npmjs.com/package/create-claude)
- [GitHub Repository](https://github.com/RMNCLDYO/create-claude)
- [Changelog](https://github.com/RMNCLDYO/create-claude/blob/main/CHANGELOG.md)

## Related

- [Claude Code](https://claude.ai/code)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)

## License

MIT © [RMNCLDYO](https://github.com/RMNCLDYO)
