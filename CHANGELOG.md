# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.13] - 2025-09-07

### Fixed

- **NPM Warnings**: Normalized bin paths to resolve npm publish warnings about cleaned script names
- **Package Configuration**: Applied `npm pkg fix` to resolve bin path formatting issues

### Security

- **Code Ownership**: Added CODEOWNERS file for better code review practices and accountability
- **Branch Protection**: Enhanced OpenSSF Scorecard rating with code owner requirements
- **Review Process**: Established clear ownership structure for all repository files

### Technical

- Removed leading `./` from bin paths in package.json per npm best practices
- CODEOWNERS file covers all critical paths including source, docs, CI/CD, and security files
- Improved repository governance for future contributions

## [0.1.12] - 2025-09-07

### Security

- **OpenSSF Scorecard**: Added PAT support for branch protection verification
- **Workflow Enhancement**: Scorecard workflow now uses dedicated token for full security analysis

### Technical

- Added `repo_token` parameter to Scorecard action for admin-level checks
- Enables complete branch protection scoring in OpenSSF Scorecard

## [0.1.11] - 2025-09-07

### Added

- **Dual Registry Publishing**: Package now publishes to both npm and GitHub Packages registries
- **GitHub Packages Support**: Added `@rmncldyo/create-claude` scoped package for GitHub Packages users
- **Registry Flexibility**: Users can now install from either npm or GitHub Packages based on their needs

### Enhanced

- **Publish Workflow**: Extended to support dual publishing with proper scoping and permissions
- **Security Maintained**: Both registries receive full security artifacts including provenance, SBOMs, and signatures
- **Installation Docs**: Release notes now include installation instructions for both registries

### Technical

- Added `npm.pkg.github.com:443` to allowed endpoints in workflow security hardening
- Added `packages: write` permission for GitHub Packages publishing
- Dynamic package name switching for scoped GitHub Packages publish
- Maintained all existing security features for both registry publishes

## [0.1.10] - 2025-09-07

### Fixed

- **Publish Workflow**: Fixed minisign checksum verification format issue preventing security artifact generation
- **Workflow Security**: Improved token permissions following OpenSSF best practices with read-only defaults
- **Workflow Ordering**: Reorganized publish workflow to ensure all security artifacts are generated before NPM publish
- **Template Formatting**: Fixed missing newlines in command and agent template files

### Security

- **Token Permissions**: Set top-level permissions to read-only with job-level write permissions only where required
- **OpenSSF Compliance**: Aligned publish workflow with OpenSSF Scorecard requirements for signed releases and SBOMs

## [0.1.9] - 2025-09-07

### Added

- **Enhanced Permission System**: Implemented `bypassPermissions` mode for maximum autonomy with safety guardrails
- **8 Custom Slash Commands**: Added `/commit`, `/explain`, `/fix`, `/optimize`, `/pr`, `/review`, `/test`, `/validate` with proper frontmatter and argument support
- **3 Specialized Subagents**: Pre-commit validator, code refactorer, and debugger with focused tool access
- **Session Lifecycle Hooks**: SessionEnd hooks for project context and cleanup
- **Bash Command Execution**: Added `!` prefix support in slash commands for dynamic git context
- **Import-based Memory**: CLAUDE.md now uses `@` imports for README and package.json references via `PROJECT_IMPORTS` template variable
- **Environment Variables**: Configured bash timeouts and working directory maintenance
- **Statusline Helper Scripts**: Added statusline-git.cjs and statusline-detect.cjs for modular statusline functionality
- **Template Variable**: Added `PROJECT_IMPORTS` to dynamically include project configuration files in CLAUDE.md

### Changed

- **Simplified Permissions**: Switched from explicit tool lists to `allow: ["*"]` with targeted deny/ask lists
- **Safety Hook Rewrite**: Enhanced with permissive mode detection and refined dangerous pattern matching
- **Terse Output Style**: Configured for minimal, efficient responses without bloat
- **Status Line**: Advanced implementation with git integration, framework detection, and color coding
- **Gitignore**: Fixed to properly track skel/.claude template files while ignoring local instances

### Improved

- **Subagent Formatting**: Added proper markdown headers and structure to pre-commit and refactor agents
- **Command Arguments**: Added `argument-hint` and `$ARGUMENTS` placeholders to relevant commands
- **Security Patterns**: Refined dangerous command detection to only block truly destructive operations
- **Delete Confirmations**: All delete operations now require explicit user confirmation
- **File Validation**: Updated init.ts to validate all 20 template files including new scripts and hooks
- **CLI Output**: Updated to display all 20 created files instead of subset

### Fixed

- **Hook Timeout**: Reduced safety hook timeout from 5 to 2 seconds for better responsiveness
- **Path Patterns**: Corrected permission patterns to use `//` for absolute paths and `~` for home directory
- **Template System**: Added PROJECT_IMPORTS to types.ts and template.ts for proper variable handling
- **Required Files**: Added statusline-git.cjs and statusline-detect.cjs to init.ts validation list

## [0.1.8] - 2025-09-06

### Enhanced

- Updated all GitHub Actions workflows to latest versions for improved security and performance
- step-security/harden-runner upgraded to v2.12.0 with critical CVE-2025-32955 security fix
- actions/checkout upgraded to v5.0.0 with Node.js 24 runtime support
- actions/setup-node upgraded to v5.0.0 with enhanced caching and package manager detection
- github/codeql-action upgraded to v2.23.0 with latest CodeQL CLI and improved analysis
- actions/attest-build-provenance upgraded to v3.0.0 with node24 runtime and improved checksum parsing
- anchore/sbom-action upgraded to v0.20.0 with latest Syft features
- actions/upload-artifact upgraded to v4.6.2 with critical security updates
- ossf/scorecard-action upgraded to v2.4.2 with Scorecard v5.2.1 and enhanced security checks
- crazy-max/ghaction-import-gpg upgraded to v6 with latest GPG handling
- softprops/action-gh-release upgraded to v2.3.2 with improved release management

### Updated

- Node.js runtime updated to v22 LTS across all workflows for active maintenance support
- npm updated to v11.6.0 for latest features and security patches
- Microsoft SBOM tool updated to v4.1.2 with SPDX 3.0 support
- fast-check updated to v4.3.0 for latest property-based testing capabilities
- Minisign implementation enhanced with proper trusted comments and latest best practices
- All workflow commit hashes verified and updated to valid, latest versions

### Fixed

- Corrected invalid commit hashes in publish workflow that would cause deployment failures
- Fixed minisign command syntax from incorrect -S flag to proper -Sm format
- Added missing trusted comments to minisign signatures as required by official specification
- Updated verification instructions to use accessible public keys instead of GitHub secrets
- Resolved async issues in robustness tests that were causing CI failures
- Fixed CodeQL workflow permissions by moving security-events permission to job level
- Removed redundant package attestation from publish workflow to prevent duplicate provenance
- Replaced fast-check fuzz testing with native Node.js robustness tests for better reliability
- Enhanced error handling in detectPackageManager for edge cases and malicious inputs

### Documentation

- Updated project tagline to "Claude Code setup that just works. Bootstrap every project with agents, hooks, commands, and smart permissions. One command, zero headaches."
- Enhanced README.md with new tagline, shortcuts section for `cld` alias, Security section highlighting OpenSSF certification, and Contributing guidelines
- Expanded CITATION.cff keywords to include "setup", "template", "ai", "agents", "hooks", and "config" for better academic discoverability
- Added package.json files array to include CITATION.cff in published packages
- Improved project messaging to better communicate value proposition and pain points solved

### Security

- All GitHub Actions now use Node.js 24 runtime for latest security features
- Enhanced supply chain security with verified commit hashes across all workflows
- Improved cryptographic signing with proper minisign implementation following official best practices
- Latest security patches applied across all tools and dependencies
- Improved permission isolation in CI workflows with job-level security permissions
- Enhanced robustness testing against malicious template injection attempts
- Strengthened input validation in core utility functions

## [0.1.7] - 2025-09-06

### Added

- SECURITY.md for vulnerability reporting with safe harbor policy
- CITATION.cff for academic citation support and Zenodo integration with ORCID
- SUPPORT.md for community support guidelines and response times
- GitHub Sponsors funding configuration
- Comprehensive GitHub issue templates (bug reports, feature requests)
- Modern pull request template following 2025 standards
- Dependabot configuration for automated dependency updates
- Security scanning workflow with CodeQL analysis
- OpenSSF Scorecard integration for security health metrics
- NPM audit signatures verification workflow
- Provenance attestation in publish workflow with OIDC trusted publishing
- Comprehensive README badges for security, quality, and funding
- Fuzz testing workflow with fast-check integration using native Node.js test runner
- SSH commit signing for cryptographic verification
- OpenSSF Best Practices Badge with passing level certification
- Comprehensive CI workflow with test suite, CodeQL analysis, and fuzz testing

### Enhanced

- Package.json with funding field and provenance configuration
- Publish workflow with npm provenance and package attestation
- Repository discoverability with comprehensive topic coverage
- Branch protection rules for main branch with enhanced security
- Enhanced token permissions in security workflow following least privilege principle
- Updated README badges with distinct colors for better visibility
- Removed sponsors badge to maintain professional appearance
- Improved npm downloads badge styling with purple color
- Pinned npm version in all workflows for supply chain security
- Updated integration tests to support ES module imports with dynamic import()

### Fixed

- ES module compatibility issues in integration tests
- NPM audit workflow false positive failures with corrected vulnerability check logic
- CI fuzz testing by replacing Jest with native Node.js test runner
- Updated attest-build-provenance action to correct SHA hash for v3.0.0
- Resolved "Cannot use import statement outside a module" errors in test files
- Fixed pinned dependencies warnings in GitHub workflows

### Security

- All commits now cryptographically signed with SSH keys
- Branch protection enabled with required reviews and status checks
- Dependency scanning and vulnerability monitoring
- Supply chain security with pinned action hashes and npm versions
- Automated fuzz testing for robustness validation with property-based testing
- Achieved OpenSSF Best Practices Badge demonstrating commitment to security standards
- Fixed vulnerability check logic in audit workflow to prevent false positives
- Comprehensive CI/CD pipeline with security scanning on every commit and PR
- CodeQL static analysis running on all JavaScript/TypeScript code

## [0.1.6] - 2025-09-05

### Enhanced

- Modernized Claude Code configuration with security updates
- Updated permission patterns to use correct `:*` syntax for Claude Code compatibility
- Enhanced security patterns in skeleton settings with improved .env coverage
- Added comprehensive MCP tool patterns (`mcp__*__write*`, `mcp__*__delete*`) to ask list
- Modernized safety hook with JSON permissionDecision output format
- Added defense-in-depth security checks for dangerous commands
- Improved sensitive file pattern detection beyond permissions

### Fixed

- Resolved "Found invalid settings files" error when using @skel/ template
- Fixed wildcard patterns from `*` to `:*` format for Claude Code compatibility

### Technical

- Added comprehensive integration tests with 95% coverage
- Removed all comments from codebase following minimal design philosophy
- Updated safety hook to use structured JSON output instead of deprecated stderr pattern
- Enhanced atomic operations testing and utility function validation
- Complete API coverage testing across 14 comprehensive scenarios

## [0.1.5] - 2025-08-27

### Changed

- **BREAKING**: Removed interactive prompts for ultra-fast setup
- **BREAKING**: Removed verbose and silent flags - simplified CLI interface  
- **BREAKING**: Removed legacy `--yes` flag - no longer needed
- Achieved zero-config setup experience
- Simplified CLI to only essential flags: `--help`, `--version`, `--dry-run`
- Updated package description from verbose technical to "One command. Zero config. Better Claude Code setup..."
- Enhanced README with clear package manager support (npm/pnpm/bun/yarn)
- Added 9 strategic keywords for better NPM discoverability: scaffolding, ai, productivity, automation, agents, hooks, config, zero-config, developer-tools
- Improved help text to reflect streamlined functionality

### Technical

- Cleaned progress indicators for silent work phase
- Removed all legacy code and unused functionality
- Streamlined argument validation and processing
- Always-silent logging for clean output
- Simplified TypeScript interfaces and removed unused options

## [0.1.4] - 2025-08-27

### Added

- GitHub Actions workflow for automated package publishing
- `build:watch` script for TypeScript watch mode development
- `start` script for direct execution without rebuild
- `clean:dist` script for lightweight dist directory cleaning
- `releaseCheck` script for complete release validation pipeline

### Changed

- Updated changelog with complete version history from v0.1.0 to v0.1.3
- Updated package.json version to 0.1.4
- Updated package.json description to better reflect the tool's purpose
- Refreshed package-lock.json with clean install
- Modernized npm scripts following 2025 best practices
- Enhanced `clean` script to remove dist, node_modules, and package-lock.json using cross-platform Node.js commands
- Updated `build` script to use `clean:dist` for better efficiency
- Enhanced `version` script with comprehensive validation, changelog reminder, and automated staging
- Improved `releaseCheck` as dry-run validation without file staging
- Rewrote README.md with technical focus, removing sales language
- Updated README.md tagline to clearly describe features and benefits
- Removed pause from `version` script for smoother workflow

### Fixed

- Ensured all validation (typecheck and lint) passes before release
- Verified all integration tests pass with updated version
- Cross-platform compatibility for all npm scripts using Node.js fs.rmSync()

## [0.1.3] - 2025-08-26

### Changed

- Updated CLAUDE.md header and streamlined template
- Updated package dependencies
- Improved test expectations for smaller template size

### Fixed

- CLAUDE.md header alignment with streamlined template

## [0.1.2] - 2025-08-26

### Changed

- Rewritten README to emphasize autonomy and productivity benefits
- Streamlined CLAUDE.md for maximum efficiency
- Updated package configuration

## [0.1.1] - 2025-08-26

### Changed

- Simplified README documentation

## [0.1.0] - 2025-08-26

### Added

- Initial release with complete project setup
- CLI tool for initializing Claude Code projects
- Atomic file operations with backup and rollback
- Template system with variable substitution
- Safety hooks for input validation
- Format hooks for code formatting and linting
- Statusline scripts for project and Git status
- Comprehensive test suite
- TypeScript support with strict configuration

[0.1.9]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/RMNCLDYO/create-claude/releases/tag/v0.1.0
