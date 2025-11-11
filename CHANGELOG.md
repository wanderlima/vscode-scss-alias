# Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.1] – 2025-01-XX

### Changed

- Updated VS Code engine requirement compatibility

---

## [1.1.0] – 2025-01-XX

### Fixed

- **Cursor compatibility**: Fixed workspace folder resolution to be dynamic instead of captured at activation time, ensuring the extension works correctly in Cursor editor
- Fixed duplicate command subscription bug

### Added

- Vue file support for SCSS imports in `<style lang="scss">` blocks
- Debug logging configuration option (`vscodeScssAlias.debug`) for troubleshooting
- Open VSX publishing support for Cursor and other compatible editors
- Improved workspace folder detection using document URI for better multi-workspace support

### Changed

- Workspace folder is now resolved dynamically from document URI instead of at activation time
- Enhanced error handling and logging for better debugging experience
- Lowered minimum VS Code engine requirement from `^1.100.0` to `^1.70.0` for better compatibility with Cursor and older VS Code versions

---

## [1.0.0] – 2025-29-06

### Added

- Initial release of SCSS Alias Resolver
- Supports `@use`, `@forward`, and `@import`
- Alias configuration via `settings.json`
- Supports `.scss` and `.sass` files
- Resolves files like `_name.scss`, `_index.scss`
- Setup and Reload commands
