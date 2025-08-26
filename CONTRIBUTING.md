# Contributing

## Principles

- Zero dependencies (security first)
- Functions under 50 lines
- Early returns, no deep nesting
- Delete unused code immediately

## Quick Start

```bash
git clone https://github.com/RMNCLDYO/create-claude.git
cd create-claude
npm install
npm test
```

## Development

```bash
npm run dev     # Build and test locally
npm run test    # Run integration tests
npm run lint    # TypeScript strict mode
```

## Pull Request Process

1. Fork the repo
2. Create your feature branch (`git checkout -b fix-xyz`)
3. Run tests (`npm test`)
4. Commit: `fix: specific bug` or `feat: specific feature`
5. Push to your fork
6. Open PR with:
   - What broke and why
   - How you fixed it
   - Test results

## Code Standards

- TypeScript strict mode required
- All functions < 50 lines
- Integration tests for new features
- No external dependencies without discussion

## We Will Reject

- Dependencies without justification
- Untested code
- Functions > 50 lines
- Deeply nested code
- "Refactoring" that adds complexity
- Features nobody asked for

## Issues

Found a bug? [Open an issue](https://github.com/RMNCLDYO/create-claude/issues) with:
- Node version
- Operating system
- Error message
- Steps to reproduce
