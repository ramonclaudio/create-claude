---
description: Create git commit with message
argument-hint: [commit-message]
allowed-tools: Bash(git:*)
model: claude-3-5-haiku-20241022
---

## Context
- Status: !`git status --short`
- Staged changes: !`git diff --cached --stat`

## Task
Stage and commit changes with message: $ARGUMENTS

Use conventional commit format. Be concise.