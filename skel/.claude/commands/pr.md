---
description: Create pull request with changes summary
argument-hint: [branch-name]
allowed-tools: Bash(git:*), Read(*), Write(*)
---

## Context
- Current branch: !`git branch --show-current`
- Git status: !`git status --short`
- Recent commits: !`git log --oneline -5`
- Files changed: !`git diff --stat HEAD~1`

## Task
Create a pull request for current changes. Summarize what changed and why. Include test plan.