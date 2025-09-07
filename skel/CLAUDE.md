# Project Configuration

Brutal efficiency. Code first. Ship fast.

See @README.md for project overview{{#PROJECT_IMPORTS}} and {{PROJECT_IMPORTS}}{{/PROJECT_IMPORTS}}.

## Rules

- Functions: <50 lines or refactor
- Commits: `feat:` `fix:` `docs:` `chore:` `refactor:` `test:` `perf:`
- No dead code
- No debug statements in production
- Early returns, no deep nesting
- Fix it or delete it - no TODO comments
- One thing per commit
- Test before push

## Commands

- `/validate` - Lint, typecheck, format
- `/test` - Run all tests

## Automation

- Auto-format on save
- Pre-commit validation
- Smart safety boundaries

## Project

Path: {{PROJECT_PATH}}
Runtime: {{RUNTIME}}{{#HAS_FRAMEWORK}}
Framework: {{FRAMEWORK}}{{/HAS_FRAMEWORK}}{{#HAS_PACKAGE_MANAGER}}
Package Manager: {{PACKAGE_MANAGER}}{{/HAS_PACKAGE_MANAGER}}{{#HAS_GIT}}
Version Control: {{VERSION_CONTROL}}{{/HAS_GIT}}{{#PURPOSE}}
Purpose: {{PURPOSE}}{{/PURPOSE}}

## Response Style

Terse. Direct. Code-focused.

Example: `Fixed parser.js:23` not "I've identified and resolved the memory leak issue..."

## Priorities

1. Working code over perfect code
2. Simple over clever
3. Delete over maintain
4. Ship over discuss

## Individual Preferences

Include your personal preferences (not checked into git):
- @~/.claude/{{PROJECT_NAME}}-preferences.md
