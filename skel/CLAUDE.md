# Create Claude

Brutal efficiency. Zero tolerance for bloat. Direct communication.

**Response format**:
```
PROBLEM: [One sentence]
FIX: [Minimal working solution]  
NOT DOING: [Complexity you avoided]
```

# RULES

**Code**:
- Functions >50 lines = design failure
- No unused code. Delete it.
- Early returns, no nesting

**Version Control**:
- Follow Semantic Versioning (MAJOR.MINOR.PATCH)
- Use Conventional Commits for all commits
- Branch naming: `feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`
- PR titles must follow conventional commit format

**Commit Format**:
- `feat:` New features (MINOR version bump)
- `fix:` Bug fixes (PATCH version bump)  
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code restructuring
- `test:` Test additions/changes
- `perf:` Performance improvements
- `BREAKING CHANGE:` Major version bump

**Workflow**:
- Use `/validate` for lint/typecheck/format
- Use `/test` for testing
- Use `pre-commit` agent before commits
- Use `refactor` agent for code cleanup
- `format` hook runs on file save (with 10MB safety limit)
- `safety` hook blocks destructive commands and sensitive file access
- Delete unused code immediately
- Create todo lists for complex tasks
- Signal handlers provide clean shutdown (SIGINT/SIGTERM)

**Safety**:
- All file operations use atomic copying with SHA256 verification
- Existing configs backed up to timestamped directories
- Zero data loss guarantee with 5-step integrity validation
- Auto-recovery on any operation failure

**Never**:
- Functions over 50 lines
- Wrong package manager commands
- Unsafe file operations (blocked by safety hooks)
- Committing without pre-commit validation

# TOOLCHAIN

**Installed by create-claude v0.1.0**:
- Production agents: `pre-commit`, `refactor`
- Safety hooks: `format.cjs`, `safety.cjs` 
- Commands: `/validate`, `/test`
- Statusline: Dynamic project context with Git integration
- Output style: `terse` (minimal, efficient responses)
- Backup system: Atomic operations with SHA256 verification

# PROJECT CONTEXT

**Project Path**: {{PROJECT_PATH}}
**Runtime**: {{RUNTIME}}{{#HAS_FRAMEWORK}}
**Framework**: {{FRAMEWORK}}{{/HAS_FRAMEWORK}}{{#HAS_PACKAGE_MANAGER}}
**Package Manager**: {{PACKAGE_MANAGER}}{{/HAS_PACKAGE_MANAGER}}{{#HAS_GIT}}
**Version Control**: {{VERSION_CONTROL}}{{/HAS_GIT}}{{#PURPOSE}}
**Purpose**: {{PURPOSE}}{{/PURPOSE}}

# OUTPUT STYLE

Terse mode active. Code first, explanations only if asked.

Good: `Fixed memory leak in parser.js:23`
Bad: Long explanations
