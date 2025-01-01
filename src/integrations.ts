import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Tasks integration
export class TaskIntegration implements vscode.Disposable {
    private disposables: vscode.Disposable[] = [];

    constructor() {
        // Register task provider
        const taskProvider = vscode.tasks.registerTaskProvider('thefuck', {
            provideTasks: () => {
                // 创建多个任务选项
                const tasks = [
                    new vscode.Task(
                        { type: 'thefuck', task: 'correct' },
                        vscode.TaskScope.Workspace,
                        'Correct Last Command',
                        'thefuck',
                        new vscode.ShellExecution('${command:vscode-thefuck.correctCommand}')
                    ),
                    new vscode.Task(
                        { type: 'thefuck', task: 'history' },
                        vscode.TaskScope.Workspace,
                        'Show Command History',
                        'thefuck',
                        new vscode.ShellExecution('${command:vscode-thefuck.showHistory}')
                    )
                ];
                return tasks;
            },
            resolveTask: (_task: vscode.Task) => {
                return undefined;
            }
        });
        this.disposables.push(taskProvider);
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }

    public static register(context: vscode.ExtensionContext): void {
        if (!context) {
            throw new Error('Context is required');
        }
        const taskIntegration = new TaskIntegration();
        context.subscriptions.push(taskIntegration);
    }
}

// Debugger integration
export class DebuggerIntegration implements vscode.Disposable {
    private disposables: vscode.Disposable[] = [];

    constructor() {
        // 监听调试会话事件
        const debugListener = vscode.debug.onDidTerminateDebugSession(async (session) => {
            if (session.configuration.type === 'shell' && session.configuration.exitCode !== 0) {
                const correction = await vscode.commands.executeCommand('vscode-thefuck.correctCommand');
                if (correction) {
                    const action = await vscode.window.showInformationMessage(
                        `调试命令失败。是否尝试使用纠正后的命令？\n${correction}`,
                        '是', '否', '添加到调试配置'
                    );
                    if (action === '是') {
                        const terminal = vscode.window.activeTerminal;
                        if (terminal) {
                            terminal.sendText(correction as string);
                        }
                    } else if (action === '添加到调试配置') {
                        // 将纠正后的命令添加到调试配置
                        await this.addToDebugConfig(correction as string);
                    }
                }
            }
        });

        // 监听调试开始事件
        const debugStartListener = vscode.debug.onDidStartDebugSession(session => {
            console.log('Debug session started:', session.type);
        });

        this.disposables.push(debugListener, debugStartListener);
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }

    private static async addToDebugConfig(command: string) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {return;}

        const launchPath = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode', 'launch.json');
        try {
            const document = await vscode.workspace.openTextDocument(launchPath);
            const config = JSON.parse(document.getText());
            
            // 添加或更新配置
            if (!config.configurations) {
                config.configurations = [];
            }
            
            config.configurations.push({
                type: "shell",
                request: "launch",
                name: "Corrected Command",
                command: command
            });

            // 写入文件
            const edit = new vscode.WorkspaceEdit();
            edit.replace(
                launchPath,
                new vscode.Range(0, 0, document.lineCount, 0),
                JSON.stringify(config, null, 4)
            );
            await vscode.workspace.applyEdit(edit);
        } catch (error) {
            console.error('Error updating launch.json:', error);
            vscode.window.showErrorMessage('无法更新调试配置文件');
        }
    }

    public static register(context: vscode.ExtensionContext): void {
        if (!context) {
            throw new Error('Context is required');
        }
        const debuggerIntegration = new DebuggerIntegration();
        context.subscriptions.push(debuggerIntegration);
    }
}

// SCM integration
export class SCMIntegration implements vscode.Disposable {
    private disposables: vscode.Disposable[] = [];

    constructor() {
        // 监听 Git 命令执行
        const gitCommandHandler = vscode.commands.registerCommand('git.command', async (args) => {
            try {
                await execAsync(args.command);
            } catch (error) {
                // 如果 Git 命令失败，使用 TheFuck 尝试纠正
                const correction = await vscode.commands.executeCommand('vscode-thefuck.correctCommand');
                if (correction) {
                    const action = await vscode.window.showInformationMessage(
                        `Git 命令失败。是否尝试使用纠正后的命令？\n${correction}`,
                        '是', '否', '添加到 Git 别名'
                    );
                    if (action === '是') {
                        const terminal = vscode.window.activeTerminal;
                        if (terminal) {
                            terminal.sendText(correction as string);
                        }
                    } else if (action === '添加到 Git 别名') {
                        await this.addGitAlias(args.command, correction as string);
                    }
                }
            }
        });

        // 添加 Git 状态栏集成
        const statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );
        statusBarItem.text = "$(tools) TheFuck";
        statusBarItem.tooltip = "纠正最后的 Git 命令";
        statusBarItem.command = 'vscode-thefuck.correctCommand';
        statusBarItem.show();

        this.disposables.push(gitCommandHandler, statusBarItem);
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }

    private static async addGitAlias(originalCommand: string, correctedCommand: string) {
        try {
            const aliasName = `fix-${Date.now()}`;
            await execAsync(`git config --global alias.${aliasName} "${correctedCommand}"`);
            vscode.window.showInformationMessage(
                `已添加 Git 别名: git ${aliasName}`
            );
        } catch (error) {
            console.error('Error adding git alias:', error);
            vscode.window.showErrorMessage('无法添加 Git 别名');
        }
    }

    public static register(context: vscode.ExtensionContext): void {
        if (!context) {
            throw new Error('Context is required');
        }
        const scmIntegration = new SCMIntegration();
        context.subscriptions.push(scmIntegration);
    }
}
