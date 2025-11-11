# Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.0] – 2025-01-XX

### Fixed

- **Cursor compatibility**: Fixed workspace folder resolution to be dynamic instead of captured at activation time, ensuring the extension works correctly in Cursor editor
- Fixed duplicate command subscription bug

### Added

- Debug logging configuration option (`vscodeScssAlias.debug`) for troubleshooting
- Open VSX publishing support for Cursor and other compatible editors
- Improved workspace folder detection using document URI for better multi-workspace support

### Changed

- Workspace folder is now resolved dynamically from document URI instead of at activation time
- Enhanced error handling and logging for better debugging experience

---

## [1.0.0] – 2025-29-06

### Added

- Initial release of SCSS Alias Resolver
- Supports `@use`, `@forward`, and `@import`
- Alias configuration via `settings.json`
- Supports `.scss` and `.sass` files
- Resolves files like `_name.scss`, `_index.scss`
- Setup and Reload commands
