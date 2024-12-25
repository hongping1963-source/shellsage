---
layout: post
title: "VS Code Extension Development Guide"
date: 2024-12-25
categories: [tutorials, vscode]
tags: [vscode, extension-development, typescript, api]
author: Zhang Hongping
author_email: zhanghongping1982@gmail.com
---

# VS Code Extension Development Guide

Visual Studio Code's extensibility model allows developers to enhance the editor's functionality. This guide will walk you through the process of developing VS Code extensions, using ShellSage as a real-world example.

## Getting Started

### 1. Extension Development Environment
First, set up your development environment:

```bash
# Create extension project
$ yo code
> ? What type of extension? New Extension (TypeScript)
> ? Extension name? my-extension
> ? Description? My VS Code Extension
> ? Initialize git repository? Yes

# Install dependencies
$ npm install
```

### 2. Extension Structure
```typescript
// Extension entry point (src/extension.ts)
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension activated');
    
    // Register commands
    let disposable = vscode.commands.registerCommand(
        'extension.command',
        () => {
            vscode.window.showInformationMessage('Hello World!');
        }
    );
    
    context.subscriptions.push(disposable);
}

export function deactivate() {}
```

## Command Registration

### 1. Basic Commands
```typescript
// Register simple command
const command = vscode.commands.registerCommand(
    'extension.command',
    async () => {
        // Command implementation
        const result = await vscode.window.showInputBox({
            prompt: 'Enter something'
        });
        
        if (result) {
            vscode.window.showInformationMessage(
                `You entered: ${result}`
            );
        }
    }
);
```

### 2. Context Menu Commands
```typescript
// package.json
{
    "contributes": {
        "menus": {
            "editor/context": [{
                "command": "extension.command",
                "when": "editorTextFocus"
            }]
        }
    }
}
```

## UI Integration

### 1. Status Bar Items
```typescript
// Create status bar item
const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
);

statusBarItem.text = "$(sync) Working...";
statusBarItem.tooltip = "Click for more info";
statusBarItem.command = 'extension.command';
statusBarItem.show();
```

### 2. Quick Picks
```typescript
// Show quick pick menu
const items = ['Option 1', 'Option 2', 'Option 3'];
const result = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select an option'
});

if (result) {
    vscode.window.showInformationMessage(
        `Selected: ${result}`
    );
}
```

## Editor Integration

### 1. Text Document Changes
```typescript
// Listen for document changes
vscode.workspace.onDidChangeTextDocument(event => {
    const document = event.document;
    const changes = event.contentChanges;
    
    for (const change of changes) {
        console.log(
            `Changed text: ${change.text}`
        );
    }
});
```

### 2. Text Decorations
```typescript
// Add text decorations
const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255,0,0,0.3)',
    border: '1px solid red'
});

const editor = vscode.window.activeTextEditor;
if (editor) {
    const range = new vscode.Range(0, 0, 0, 10);
    editor.setDecorations(decorationType, [range]);
}
```

## Language Features

### 1. Diagnostics
```typescript
// Report problems
const diagnosticCollection = vscode.languages.createDiagnosticCollection('example');

const diagnostic = new vscode.Diagnostic(
    new vscode.Range(0, 0, 0, 10),
    'This is a problem',
    vscode.DiagnosticSeverity.Error
);

diagnosticCollection.set(document.uri, [diagnostic]);
```

### 2. Code Actions
```typescript
// Provide code actions
vscode.languages.registerCodeActionsProvider(
    'typescript',
    {
        provideCodeActions(document, range, context) {
            const fix = new vscode.CodeAction(
                'Fix this',
                vscode.CodeActionKind.QuickFix
            );
            
            fix.edit = new vscode.WorkspaceEdit();
            fix.edit.replace(
                document.uri,
                range,
                'fixed code'
            );
            
            return [fix];
        }
    }
);
```

## Configuration Management

### 1. Extension Settings
```json
// package.json
{
    "contributes": {
        "configuration": {
            "title": "My Extension",
            "properties": {
                "myExtension.enabled": {
                    "type": "boolean",
                    "default": true,
                    "description": "Enable/disable extension"
                }
            }
        }
    }
}
```

### 2. Reading Settings
```typescript
// Get configuration
const config = vscode.workspace.getConfiguration('myExtension');
const isEnabled = config.get('enabled', true);

// Update configuration
await config.update('enabled', false, true);
```

## Extension Testing

### 1. Unit Tests
```typescript
// src/test/suite/extension.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    });
    
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('publisher.extension'));
    });
});
```

### 2. Integration Tests
```typescript
// Run command and verify result
test('Command execution', async () => {
    await vscode.commands.executeCommand('extension.command');
    
    // Verify result
    const editor = vscode.window.activeTextEditor;
    assert.ok(editor);
    assert.strictEqual(editor.document.getText(), 'expected text');
});
```

## Publishing Extensions

### 1. Package Extension
```bash
# Create VSIX package
$ vsce package
> Created: my-extension-0.0.1.vsix

# Publish to marketplace
$ vsce publish
> Published publisher.extension@0.0.1
```

### 2. Marketplace Manifest
```json
// package.json
{
    "name": "my-extension",
    "displayName": "My Extension",
    "version": "0.0.1",
    "publisher": "publisher",
    "engines": {
        "vscode": "^1.60.0"
    },
    "categories": [
        "Other"
    ],
    "activationEvents": [
        "onCommand:extension.command"
    ],
    "repository": {
        "type": "git",
        "url": "https://github.com/user/repo"
    }
}
```

## Best Practices

### 1. Performance Optimization
```typescript
// Use debouncing for frequent operations
import { debounce } from 'lodash';

const debouncedUpdate = debounce(() => {
    // Update logic here
}, 250);

vscode.workspace.onDidChangeTextDocument(() => {
    debouncedUpdate();
});
```

### 2. Error Handling
```typescript
// Proper error handling
try {
    await vscode.commands.executeCommand('command');
} catch (error) {
    vscode.window.showErrorMessage(
        `Error: ${error.message}`
    );
    console.error(error);
}
```

## Conclusion

Building VS Code extensions requires understanding of:
- Extension activation and lifecycle
- Command registration and handling
- UI integration and editor manipulation
- Language features and diagnostics
- Configuration and settings management
- Testing and publishing

Stay tuned for more VS Code extension development tips and advanced features!
