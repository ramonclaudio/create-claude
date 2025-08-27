# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.4]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/RMNCLDYO/create-claude/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/RMNCLDYO/create-claude/releases/tag/v0.1.0
