import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const SUPPORTED_LANGUAGES = ['scss', 'sass', 'vue'];

  function getAliasConfig(): Record<string, string> {
    return (
      vscode.workspace
        .getConfiguration('vscodeScssAlias')
        .get<Record<string, string>>('aliases') || {}
    );
  }

  const workspaceFolder =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';

  function resolveImportTarget(importPath: string): string | undefined {
    const aliasConfig = getAliasConfig();

    const aliasEntry = Object.entries(aliasConfig).find(([alias]) =>
      importPath.startsWith(alias),
    );

    if (!aliasEntry) {
      return undefined;
    }

    const [alias, targetPath] = aliasEntry;
    const relativePath = importPath.replace(alias, '').replace(/^\/+/, '');

    const candidates = [
      path.join(workspaceFolder, targetPath, relativePath + '.scss'),
      path.join(workspaceFolder, targetPath, relativePath + '.sass'),
      path.join(workspaceFolder, targetPath, relativePath, '_index.scss'),
      path.join(workspaceFolder, targetPath, relativePath, '_index.sass'),
      path.join(
        workspaceFolder,
        targetPath,
        relativePath.replace(/\/(\w+)$/, '/_$1.scss'),
      ),
      path.join(workspaceFolder, targetPath, '_' + relativePath + '.scss'),
    ];

    return candidates.find(file => fs.existsSync(file));
  }

  function logDebug(message: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[scss-alias] ${message}`);
    }
  }

  SUPPORTED_LANGUAGES.forEach(language => {
    const provider = vscode.languages.registerDefinitionProvider(language, {
      provideDefinition(document, position) {
        const line = document.lineAt(position);
        const regex = /@(?:use|forward|import)\s+['"]([^'"]+)['"]/;
        const match = line.text.match(regex);

        if (!match) {
          return;
        }

        const targetFile = resolveImportTarget(match[1]);

        if (!targetFile) {
          logDebug(`No match found for import: ${match[1]}`);
          return;
        }

        return new vscode.Location(
          vscode.Uri.file(targetFile),
          new vscode.Position(0, 0),
        );
      },
    });

    const linkProvider = vscode.languages.registerDocumentLinkProvider(
      { language },
      {
        provideDocumentLinks(document) {
          const links: vscode.DocumentLink[] = [];
          const regex = /@(?:use|forward|import)\s+['"]([^'"]+)['"]/g;

          for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match: RegExpExecArray | null;

            while ((match = regex.exec(line.text)) !== null) {
              const targetFile = resolveImportTarget(match[1]);
              if (!targetFile) continue;

              const start = line.text.indexOf(match[1]);
              const range = new vscode.Range(
                i,
                start,
                i,
                start + match[1].length,
              );
              links.push(
                new vscode.DocumentLink(range, vscode.Uri.file(targetFile)),
              );
            }
          }

          return links.length ? links : undefined;
        },
      },
    );

    context.subscriptions.push(provider, linkProvider);
  });

  // NOTE: Comands
  // ---

  const setupCommand = vscode.commands.registerCommand(
    'vscodeScssAlias.setupAliases',
    async () => {
      const workspaceFolder =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
      }

      const settingsPath = path.join(
        workspaceFolder,
        '.vscode',
        'settings.json',
      );
      const vscodeDir = path.dirname(settingsPath);

      if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir, { recursive: true });
      }

      let settings: any = {};
      if (fs.existsSync(settingsPath)) {
        try {
          const raw = fs.readFileSync(settingsPath, 'utf8');
          settings = JSON.parse(raw);
        } catch (err) {
          vscode.window.showErrorMessage(
            `Failed to read settings.json: ${err}`,
          );
          return;
        }
      }

      settings['vscodeScssAlias'] = settings['vscodeScssAlias'] || {};
      const aliases = settings['vscodeScssAlias'].aliases || {};

      while (true) {
        const alias = await vscode.window.showInputBox({
          prompt: 'Enter an alias (e.g., @core). Leave empty to finish.',
          validateInput: value =>
            value && !value.startsWith('@')
              ? 'Alias should start with @'
              : null,
        });

        if (!alias) break;

        const pathInput = await vscode.window.showInputBox({
          prompt: `Enter the relative path for ${alias} (e.g., src/styles/core)`,
          value: '',
        });

        if (!pathInput) {
          vscode.window.showWarningMessage(
            `Alias ${alias} skipped (no path provided).`,
          );
          continue;
        }

        aliases[alias] = pathInput;
      }

      settings['vscodeScssAlias'].aliases = aliases;

      try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        vscode.window.showInformationMessage(
          `Saved ${Object.keys(aliases).length} alias(es) to .vscode/settings.json.`,
        );

        // Reload after writing
        await vscode.commands.executeCommand('vscodeScssAlias.reloadAliases');
      } catch (err) {
        vscode.window.showErrorMessage(`Failed to write settings.json: ${err}`);
      }
    },
  );

  context.subscriptions.push(setupCommand);

  const reloadAliasesCommand = vscode.commands.registerCommand(
    'vscodeScssAlias.reloadAliases',
    () => {
      const aliasConfig = getAliasConfig();
      const aliases = Object.keys(aliasConfig);

      vscode.window.showInformationMessage(
        `SCSS aliases reloaded: ${aliases.length ? aliases.join(', ') : 'None'}`,
      );
    },
  );

  context.subscriptions.push(setupCommand);
  context.subscriptions.push(reloadAliasesCommand);
}

export function deactivate() {}
