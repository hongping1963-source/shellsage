import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';
import { diffChars, Change } from 'diff';
import { TaskIntegration, DebuggerIntegration, SCMIntegration } from './integrations';
import { EnhancedCorrection } from './features/enhancedCorrection';

async function execAsync(command: string, args: string[] = [], options: any = {}): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        const cmd = `${command} ${args.join(' ')}`;
        exec(cmd, options, (error: any, stdout: string, stderr: string) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

interface CommandHistory {
    original: string;
    corrected: string;
    timestamp: number;
}

interface TerminalCommand {
    command: string;
    output: string;
    timestamp: number;
    shell: string;
}

let lastCommand = '';
let lastExitCode = 0;
let terminalDataListener: vscode.Disposable | undefined;
const terminalCommands = new Map<string, TerminalCommand>();
let pythonPath: string;
let commandHistory: CommandHistory[] = [];
const MAX_HISTORY_SIZE = 50;

// 错误类型定义
enum ErrorType {
    noTerminal = 'noTerminal',
    executionError = 'executionError',
    noCorrection = 'noCorrection',
    invalidShell = 'invalidShell',
    unknown = 'unknown'
}

interface TheFuckError extends Error {
    type: ErrorType;
    stderr?: string;
}

function createError(message: string, type: ErrorType, stderr?: string): TheFuckError {
    const error = new Error(message) as TheFuckError;
    error.type = type;
    if (stderr) {
        error.stderr = stderr;
    }
    return error;
}

function handleError(error: unknown) {
    const theFuckError = error as TheFuckError;
    
    switch (theFuckError.type) {
        case ErrorType.noTerminal:
            vscode.window.showErrorMessage('No active terminal found. Please open a terminal first.');
            break;
        case ErrorType.executionError:
            const errorDetails = theFuckError.stderr ? `\nDetails: ${theFuckError.stderr}` : '';
            vscode.window.showErrorMessage(`Failed to execute command.${errorDetails}`);
            break;
        case ErrorType.noCorrection:
            vscode.window.showWarningMessage('No correction available for this command.');
            break;
        case ErrorType.invalidShell:
            vscode.window.showErrorMessage('Unsupported shell type. Please use PowerShell, CMD, Bash, or ZSH.');
            break;
        default:
            vscode.window.showErrorMessage(`An unexpected error occurred: ${theFuckError.message}`);
            console.error('Unexpected error:', theFuckError);
    }
}

export async function activate(context: vscode.ExtensionContext) {
    console.log('VS Code TheFuck extension is now active');

    // 初始化增强功能
    EnhancedCorrection.initialize(context);

    // 设置内置 Python 环境路径
    pythonPath = path.join(context.extensionPath, 'python_env', process.platform === 'win32' ? 'Scripts\\python.exe' : 'bin/python');

    // 确保 Python 可执行文件存在
    if (!fs.existsSync(pythonPath)) {
        vscode.window.showErrorMessage('内置 Python 环境未找到，扩展可能无法正常工作');
        return;
    }

    // 从存储中加载历史记录
    commandHistory = context.globalState.get<CommandHistory[]>('commandHistory', []);

    // 设置终端监听器
    await setupTerminalListener();

    // 注册命令
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-thefuck.correctCommand', () => runTheFuck(context)),
        vscode.commands.registerCommand('vscode-thefuck.showHistory', () => showHistory(context)),
        // 如果 terminalDataListener 存在，也将其添加到 subscriptions
        ...(terminalDataListener ? [terminalDataListener] : []),
        vscode.commands.registerCommand('vscode-thefuck.showDiff', () => showDiff(lastCommand, ''))
    );

    // 注册集成功能
    TaskIntegration.registerTaskProvider(context);
    DebuggerIntegration.registerDebuggerIntegration(context);
    SCMIntegration.registerSCMIntegration(context);
}

export function deactivate() {
    if (terminalDataListener) {
        terminalDataListener.dispose();
    }
}

async function setupTerminalListener() {
    // 清理旧的监听器
    if (terminalDataListener) {
        terminalDataListener.dispose();
    }
    
    // 监听通过 sendSequence 发送的命令
    terminalDataListener = vscode.commands.registerCommand('workbench.action.terminal.sendSequence', async (args: { text: string }) => {
        if (args && typeof args.text === 'string') {
            const cleanedCommand = args.text.trim().replace(/\n/g, ''); // 移除换行符
            if (cleanedCommand) {
                lastCommand = cleanedCommand;
                const terminal = vscode.window.activeTerminal;
                const terminalId = await terminal?.processId;
                if (terminalId) {
                    terminalCommands.set(terminalId.toString(), {
                        command: lastCommand,
                        output: '',
                        timestamp: Date.now(),
                        shell: await getShell()
                    });
                }
            }
        }
    });

    // 监听终端关闭事件，移除对应的命令记录
    vscode.window.onDidCloseTerminal(terminal => {
        terminal.processId.then(terminalId => {
            if (terminalId) {
                terminalCommands.delete(terminalId.toString());
            }
        });
    });

    // 定期清理过期的命令记录（超过30分钟的记录）
    setInterval(() => {
        const now = Date.now();
        const expirationTime = 30 * 60 * 1000; // 30分钟
        for (const [terminalId, command] of terminalCommands.entries()) {
            if (now - command.timestamp > expirationTime) {
                terminalCommands.delete(terminalId);
            }
        }
    }, 5 * 60 * 1000); // 每5分钟检查一次
}

async function showCommandHistory() {
    if (commandHistory.length === 0) {
        vscode.window.showInformationMessage('没有命令历史记录');
        return;
    }

    const items = commandHistory.map(hist => ({
        label: `${hist.original} → ${hist.corrected}`,
        description: new Date(hist.timestamp).toLocaleString(),
        original: hist.original,
        corrected: hist.corrected
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: '选择要重用的命令',
        matchOnDescription: true
    });

    if (selected) {
        const terminal = vscode.window.activeTerminal;
        if (terminal) {
            const action = await vscode.window.showQuickPick(
                ['使用原始命令', '使用修正后的命令'],
                { placeHolder: '选择要使用的命令版本' }
            );

            if (action === '使用原始命令') {
                terminal.sendText(selected.original);
            } else if (action === '使用修正后的命令') {
                terminal.sendText(selected.corrected);
            }
        }
    }
}

async function getShell(): Promise<string> {
    const terminal = vscode.window.activeTerminal;
    if (!terminal) {
        throw new Error('No active terminal found');
    }

    // 尝试从 terminal creation options 获取
    const creationOptions = terminal.creationOptions as { shellPath?: string };
    if (creationOptions && creationOptions.shellPath) {
        const shellPath = creationOptions.shellPath;
        const shellName = path.basename(shellPath).toLowerCase();
        if (shellName.includes('powershell') || shellName.includes('pwsh')) {
            return 'powershell';
        } else if (shellName.includes('cmd')) {
            return 'cmd';
        } else if (shellName.includes('bash')) {
            return 'bash';
        } else if (shellName.includes('zsh')) {
            return 'zsh';
        }
    }

    // 尝试从环境变量获取
    const shellEnv = process.env.SHELL || process.env.COMSPEC;
    if (shellEnv) {
        const shellName = path.basename(shellEnv).toLowerCase();
        if (shellName.includes('powershell') || shellName.includes('pwsh')) {
            return 'powershell';
        } else if (shellName.includes('cmd')) {
            return 'cmd';
        } else if (shellName.includes('bash')) {
            return 'bash';
        } else if (shellName.includes('zsh')) {
            return 'zsh';
        }
    }

    // 默认
    return process.platform === 'win32' ? 'powershell' : 'bash';
}

async function addToHistory(original: string, corrected: string, context: vscode.ExtensionContext) {
    const historyItem: CommandHistory = {
        original,
        corrected,
        timestamp: Date.now()
    };

    commandHistory.unshift(historyItem);
    if (commandHistory.length > MAX_HISTORY_SIZE) {
        commandHistory.pop();
    }

    await context.globalState.update('commandHistory', commandHistory);
}

async function runTheFuck(context: vscode.ExtensionContext) {
    try {
        if (!lastCommand) {
            throw createError('No previous command found to correct', ErrorType.noCorrection);
        }

        const terminal = vscode.window.activeTerminal;
        if (!terminal) {
            throw createError('No active terminal found', ErrorType.noTerminal);
        }

        const config = vscode.workspace.getConfiguration('vscode-thefuck');
        const customTheFuckPath = config.get<string>('thefuckPath');
        const shell = await getShell();

        // 使用用户配置的 thefuckPath 或默认的 thefuck
        const thefuckPath = customTheFuckPath || 'thefuck';

        // 安全地构造命令参数
        const args = ['--yeah'];
        if (lastCommand) {
            args.unshift(lastCommand);
        }

        let execOptions: any = {
            env: { ...process.env, pythonIoEncoding: 'utf-8' }
        };

        // 根据 shell 类型设置执行环境
        switch (shell) {
            case 'powershell':
                execOptions.shell = 'powershell.exe';
                break;
            case 'cmd':
                execOptions.shell = 'cmd.exe';
                break;
            case 'bash':
            case 'zsh':
                execOptions.shell = true;
                break;
            default:
                throw createError(`Unsupported shell type: ${shell}`, ErrorType.invalidShell);
        }

        try {
            const { stdout, stderr } = await execAsync(thefuckPath, args, execOptions);

            if (stderr) {
                throw createError('Command execution failed', ErrorType.executionError, stderr);
            }

            const correctedCommand = stdout.trim();
            if (!correctedCommand) {
                throw createError('No correction found', ErrorType.noCorrection);
            }

            // 添加到历史记录
            await addToHistory(lastCommand, correctedCommand, context);

            // 在终端中执行纠正后的命令
            terminal.sendText(correctedCommand);
            vscode.window.showInformationMessage(`Corrected: ${correctedCommand}`);
        } catch (execError) {
            throw createError(
                'Failed to execute thefuck',
                ErrorType.executionError,
                (execError as Error).message
            );
        }
    } catch (error) {
        handleError(error);
    }
}

async function showDiff(original: string, corrected: string) {
    const diff = diffChars(original, corrected);
    
    let markdownContent = '### Command Correction\n\n';
    markdownContent += 'Original command:\n```\n';
    markdownContent += original;
    markdownContent += '\n```\n\nCorrected command:\n```\n';
    markdownContent += corrected;
    markdownContent += '\n```\n\nDifferences:\n```diff\n';

    diff.forEach((part: Change) => {
        if (part.added) {
            markdownContent += `+${part.value}`;
        } else if (part.removed) {
            markdownContent += `-${part.value}`;
        } else {
            markdownContent += ` ${part.value}`;
        }
    });
    markdownContent += '\n```';

    const panel = vscode.window.createWebviewPanel(
        'commandDiff',
        'Command Correction',
        vscode.ViewColumn.Beside,
        { enableScripts: false }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { padding: 15px; }
                pre { background-color: #f5f5f5; padding: 10px; border-radius: 4px; }
                .diff-add { color: #22863a; background-color: #f0fff4; }
                .diff-remove { color: #cb2431; background-color: #ffeef0; }
            </style>
        </head>
        <body>
            ${markdownContent}
        </body>
        </html>
    `;
}

async function showHistory(context: vscode.ExtensionContext) {
    if (commandHistory.length === 0) {
        vscode.window.showInformationMessage('没有命令历史记录');
        return;
    }

    const items = commandHistory.map(hist => ({
        label: `${hist.original} → ${hist.corrected}`,
        description: new Date(hist.timestamp).toLocaleString(),
        original: hist.original,
        corrected: hist.corrected
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: '选择要重用的命令',
        matchOnDescription: true
    });

    if (selected) {
        const terminal = vscode.window.activeTerminal;
        if (terminal) {
            const action = await vscode.window.showQuickPick(
                ['使用原始命令', '使用修正后的命令'],
                { placeHolder: '选择要使用的命令版本' }
            );

            if (action === '使用原始命令') {
                terminal.sendText(selected.original);
            } else if (action === '使用修正后的命令') {
                terminal.sendText(selected.corrected);
            }
        }
    }
}
