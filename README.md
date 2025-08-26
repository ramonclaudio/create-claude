# `create-claude`

> Turn Claude Code into an autonomous coding partner. Zero interruptions. Pure productivity.

[![npm version](https://img.shields.io/npm/v/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![npm downloads](https://img.shields.io/npm/dm/create-claude.svg)](https://www.npmjs.com/package/create-claude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm create claude@latest

# Alternative methods
npx create-claude@latest
npm init claude
```

30 seconds. Zero config. Immediate results.

## The Problem You're Having

Claude Code is incredibly powerful, but it interrupts you constantly:

- "May I read this file?" → Accept
- "Can I run this command?" → Accept  
- "Should I edit this?" → Accept

**200+ interruptions per day.** Your flow is broken. Your focus is shot.

## The Solution We Built

Give Claude full autonomy where it's safe. Keep smart guardrails where it matters. 

Work uninterrupted for hours.

### Before
```
Claude: "May I read package.json?"
You: Accept
Claude: "May I run npm install?" 
You: Accept
Claude: "May I edit src/index.js?"
You: Accept
[... 197 more prompts today ...]
```

### After
```
You: "Build a REST API"
Claude: Done. Routes created, tests pass, code formatted.
```

## Real Results

After installing create-claude:

- **Write code uninterrupted** - Zero prompts for normal development
- **Ship faster** - 30+ minutes saved daily from eliminated clicks
- **Better code quality** - Enforced standards, automatic formatting
- **Never lose work** - Smart safety prevents accidental deletions
- **Team consistency** - Everyone ships production-ready code

## What You Get

Standard Claude Code configuration files. Nothing foreign. Follows [official memory hierarchy](https://docs.anthropic.com/en/docs/claude-code/manage-memory).

```
CLAUDE.md                    # Project rules and context
.claude/
├── settings.local.json      # Full autonomy + smart safety
├── agents/                  # pre-commit, refactor
├── hooks/                   # format.cjs, safety.cjs
├── commands/                # /validate, /test
├── scripts/                 # statusline (git/runtime aware)
└── output-styles/           # terse mode
```

### Permission System
- **Allow**: All safe operations (read, write, edit, test)
- **Block**: Dangerous patterns (sudo, /etc, ~/.ssh, .env)
- **Ask**: Destructive operations (rm, delete)
- **Default**: `bypassPermissions` - full autonomy

### Agents
- **pre-commit**: Tests, types, lint, security. Binary pass/fail.
- **refactor**: Auto-triggered for complex code. No mercy for bloat.

### Hooks
- **format**: Auto-detects your formatter (prettier/biome/ruff/black)
- **safety**: Pattern-based pre-execution validation

### Commands
- `/validate`: Format + lint + typecheck
- `/test`: Find and run ALL tests

## How It Works

We use Claude Code's native configuration system with battle-tested defaults:

1. **Smart Patterns**: `Bash(*rm*)` catches all deletions, not just exact matches
2. **Tool Detection**: Automatically finds and uses YOUR formatter (prettier, biome, ruff, black)
3. **Project-First**: Your local settings override global - each project stays unique
4. **Zero Setup**: Works with your existing tools, no new dependencies

## Safety That Makes Sense

We don't block all `rm` commands (that would make development impossible).

Instead, we're smart about it:
- `rm temp.txt` → Goes through instantly
- `rm -rf /` → Blocked immediately
- `rm important.db` → Asks once for confirmation

Plus, everything gets backed up to `.create-claude-backup-*` automatically. 

**Your code is safe. Your workflow isn't broken.**

## Perfect for Teams

Get your entire team shipping consistent, high-quality code:

- **Same standards** - Formatting and linting rules applied automatically
- **Clean git history** - Enforced semantic commits across the team
- **No setup debates** - One config that just works
- **Instant onboarding** - New devs are productive in 30 seconds

## No Lock-in

This isn't a framework or dependency. It's just configuration files.

- **Modify anything** - Every setting is customizable
- **Easy removal** - Delete `.claude/` and `CLAUDE.md` to uninstall
- **Mix and match** - Keep what works, change what doesn't

Your code stays yours. Your choices stay yours.

## Requirements

- Node.js 18+
- [Claude Code](https://claude.ai/code)

## Options

```bash
npm create claude@latest --dry-run  # Preview changes
npm create claude@latest --help      # Show options
```

## Why Developers Love This

**We enforce the good habits you already want:**
- Functions under 50 lines (you know they should be)
- Semantic commits (your future self will thank you)
- No TODOs in production (ship it or delete it)

**We're smart about safety:**
- Patterns not blanket rules
- Context-aware decisions
- Your workflow stays intact

**We work with what you have:**
- Uses YOUR existing tools
- Respects YOUR project setup
- Zero new dependencies

## Links

- [NPM](https://www.npmjs.com/package/create-claude)
- [GitHub](https://github.com/RMNCLDYO/create-claude)
- [Issues](https://github.com/RMNCLDYO/create-claude/issues)
- [Changelog](https://github.com/RMNCLDYO/create-claude/blob/main/CHANGELOG.md)

## License

MIT © [RMNCLDYO](https://github.com/RMNCLDYO)