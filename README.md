# SCSS Alias

**SCSS Alias** is a lightweight Visual Studio Code extension that allows you to use `Cmd+Click` (Mac) or `Ctrl+Click` (Windows/Linux) to jump to SCSS files that use custom import aliases in `@use`, `@forward`, or `@import` statements.

> ⚠️ This extension does **not** configure aliases for your SCSS compiler — it only helps **resolve aliases inside VS Code** for easier navigation.

## ✨ Features

- Supports SCSS and Sass syntax
- Resolves imports using aliases like `@scss/` or `@mixins/`
- Works with `@use`, `@forward`, and `@import`
- Handles multiple SCSS resolution patterns including:
  - `_filename.scss`
  - `_index.scss`
  - Direct `.scss` or `.sass` file references

## 💡 Example Usage

Given this import:

```scss
@use '@mixins/spacing';
@use '@scss/components/button';
```

You can then `Cmd+Click` or `Ctrl+Click` to go directly to that file. The `right click` and `Go to definition` works too.

Resolves to `src/scss/mixins/_spacing.scss`, `src/scss/components/button.scss` or similar.

## ⚙️ Configuration

```json
"vscodeScssAlias.aliases": {
  "@scss": "src/scss",
  "@mixins": "src/scss/mixins",
}
```

## ⚡ Commands

To run a command, open Command Palette `Ctrl + Shift + p` or `Cmd + Shift + p` on MacOS. Type SCSS Alias: and then select the command: Setup or Reload.

### Setup

Open the Command Palette and type `Rin SCSS Alias`, then click to add the settings into your `.vscode/settings.json` file.
Run `SCSS Alias: Setup Project Configuration`

### Reload

You can reload your settings using the command: **Reload SCSS Aliases**
Open the Command Palette and type `Reload SCSS Aliases`, then click to reload the settings.

## 🚧 Note

This extension only affects your editor experience — you still need to configure these same aliases in your SCSS build system (e.g., webpack, Vite, Dart Sass CLI) for your project to compile correctly.

## 🧩 Contribution

Feel free to open issues or submit pull requests to improve functionality or add support for other use cases.

## 📜 License

MIT
