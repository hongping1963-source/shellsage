import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { diffChars, Change } from 'diff';
import { TaskIntegration, DebuggerIntegration, SCMIntegration } from './integrations';
import { DeepSeekIntegration } from './features/deepseekIntegration';
import { Logger } from './utils/logger';
import { CommandHistory, TerminalCommand } from './types';

const logger = Logger.getInstance();
const execAsync = promisify(exec);

// 增加日志记录工具
interface ExtensionConfig {
    pythonPath?: string;
    maxHistorySize: number;
    enableLogging: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    autoCorrect: boolean;
    retryAttempts: number;
    commandTimeout: number;
}

class ConfigManager {
    private static instance: ConfigManager;
    private config: ExtensionConfig;
    private readonly DEFAULT_CONFIG: ExtensionConfig = {
        maxHistorySize: 50,
        enableLogging: true,
        logLevel: 'info',
        autoCorrect: false,
        retryAttempts: 3,
        commandTimeout: 10000
    };

    private constructor() {
        this.config = this.loadConfig();
    }

    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private loadConfig(): ExtensionConfig {
        try {
            const config = vscode.workspace.getConfiguration('vscode-thefuck');
            return {
                pythonPath: config.get<string>('pythonPath'),
                maxHistorySize: config.get<number>('maxHistorySize', this.DEFAULT_CONFIG.maxHistorySize),
                enableLogging: config.get<boolean>('enableLogging', this.DEFAULT_CONFIG.enableLogging),
                logLevel: config.get<'debug' | 'info' | 'warn' | 'error'>('logLevel', this.DEFAULT_CONFIG.logLevel),
                autoCorrect: config.get<boolean>('autoCorrect', this.DEFAULT_CONFIG.autoCorrect),
                retryAttempts: config.get<number>('retryAttempts', this.DEFAULT_CONFIG.retryAttempts),
                commandTimeout: config.get<number>('commandTimeout', this.DEFAULT_CONFIG.commandTimeout)
            };
        } catch (error) {
            console.error('Failed to load configuration:', error);
            return this.DEFAULT_CONFIG;
        }
    }

    getConfig(): ExtensionConfig {
        return { ...this.config };
    }

    async updateConfig(newConfig: Partial<ExtensionConfig>): Promise<void> {
        try {
            const config = vscode.workspace.getConfiguration('vscode-thefuck');
            for (const [key, value] of Object.entries(newConfig)) {
                await config.update(key, value, vscode.ConfigurationTarget.Global);
            }
            this.config = { ...this.config, ...newConfig };
            console.info('Configuration updated:', newConfig);
        } catch (error) {
            console.error('Failed to update configuration:', error);
            throw error;
        }
    }

    getPythonPath(): string | undefined {
        return this.config.pythonPath;
    }

    getMaxHistorySize(): number {
        return this.config.maxHistorySize;
    }

    isLoggingEnabled(): boolean {
        return this.config.enableLogging;
    }

    getLogLevel(): string {
        return this.config.logLevel;
    }

    isAutoCorrectEnabled(): boolean {
        return this.config.autoCorrect;
    }

    getRetryAttempts(): number {
        return this.config.retryAttempts;
    }

    getCommandTimeout(): number {
        return this.config.commandTimeout;
    }
}

class CommandHistoryManager {
    private static readonly MAX_HISTORY_SIZE = ConfigManager.getInstance().getMaxHistorySize();
    private history: CommandHistory[] = [];

    constructor(private context: vscode.ExtensionContext) {
        this.loadHistory();
    }

    private loadHistory() {
        try {
            const savedHistory = this.context.globalState.get<CommandHistory[]>('commandHistory', []);
            this.history = savedHistory;
            logger.debug(`Loaded ${this.history.length} command history items`);
        } catch (error) {
            logger.error('Failed to load command history:', error);
            this.history = [];
        }
    }

    async addToHistory(original: string, corrected: string, shell: string, exitCode?: number, output?: string) {
        try {
            const entry: CommandHistory = {
                original,
                corrected,
                timestamp: Date.now(),
                shell,
                exitCode,
                output
            };

            this.history.unshift(entry);

            // 保持历史记录在限制大小内
            if (this.history.length > CommandHistoryManager.MAX_HISTORY_SIZE) {
                this.history = this.history.slice(0, CommandHistoryManager.MAX_HISTORY_SIZE);
            }

            await this.saveHistory();
            logger.debug('Added new command to history:', entry);
        } catch (error) {
            logger.error('Failed to add command to history:', error);
        }
    }

    private async saveHistory() {
        try {
            await this.context.globalState.update('commandHistory', this.history);
            logger.debug(`Saved ${this.history.length} command history items`);
        } catch (error) {
            logger.error('Failed to save command history:', error);
        }
    }

    getHistory(): CommandHistory[] {
        return [...this.history];
    }

    async clearHistory() {
        this.history = [];
        await this.saveHistory();
        logger.info('Command history cleared');
    }
}

class TerminalManager {
    private static instance: TerminalManager;
    private terminalDataListener: vscode.Disposable | undefined;
    private terminals: Map<string, TerminalCommand> = new Map();
    private commandHistoryManager: CommandHistoryManager;

    private constructor(context: vscode.ExtensionContext) {
        this.commandHistoryManager = new CommandHistoryManager(context);
        this.setupTerminalListener();
        this.registerTerminalCloseListener();
    }

    static getInstance(context: vscode.ExtensionContext): TerminalManager {
        if (!TerminalManager.instance) {
            TerminalManager.instance = new TerminalManager(context);
        }
        return TerminalManager.instance;
    }

    private setupTerminalListener() {
        try {
            if (this.terminalDataListener) {
                this.terminalDataListener.dispose();
            }

            this.terminalDataListener = vscode.window.onDidWriteTerminalData(async e => {
                try {
                    const terminalId = await e.terminal.processId;
                    if (!terminalId) {
                        logger.warn('Unable to get terminal process ID');
                        return;
                    }

                    const terminalKey = terminalId.toString();
                    const currentCommand = this.terminals.get(terminalKey);

                    if (currentCommand) {
                        // 追加输出数据
                        currentCommand.output += e.data;
                        this.terminals.set(terminalKey, currentCommand);
                        logger.debug(`Updated terminal output for ${terminalKey}`);
                    }
                } catch (error) {
                    logger.error('Error in terminal data listener:', error);
                }
            });

            logger.info('Terminal listener setup completed');
        } catch (error) {
            logger.error('Failed to setup terminal listener:', error);
            throw createError('Failed to setup terminal listener', ErrorType.unknown);
        }
    }

    private registerTerminalCloseListener() {
        vscode.window.onDidCloseTerminal(terminal => {
            terminal.processId.then(id => {
                if (id) {
                    this.terminals.delete(id.toString());
                    logger.debug(`Terminal ${id} closed and removed from tracking`);
                }
            });
        });
    }

    async addCommand(terminal: vscode.Terminal, command: string) {
        try {
            const terminalId = await terminal.processId;
            if (!terminalId) {
                throw createError('Unable to get terminal process ID', ErrorType.noTerminal);
            }

            const shell = await getShell();
            this.terminals.set(terminalId.toString(), {
                command,
                output: '',
                timestamp: Date.now(),
                shell
            });

            logger.debug(`Added new command for terminal ${terminalId}:`, command);
        } catch (error) {
            logger.error('Failed to add command:', error);
            handleError(error);
        }
    }

    getCommand(terminalId: string): TerminalCommand | undefined {
        return this.terminals.get(terminalId);
    }

    getCommandHistoryManager(): CommandHistoryManager {
        return this.commandHistoryManager;
    }
}

enum ErrorType {
    noTerminal = 'noTerminal',
    executionError = 'executionError',
    noCorrection = 'noCorrection',
    invalidShell = 'invalidShell',
    pythonError = 'pythonError',
    environmentError = 'environmentError',
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
    logger.error('Error occurred:', error);

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
        case ErrorType.pythonError:
            vscode.window.showErrorMessage('Python execution error. Please check your Python installation.');
            break;
        case ErrorType.environmentError:
            vscode.window.showErrorMessage('Environment configuration error. Please check your setup.');
            break;
        default:
            vscode.window.showErrorMessage(`An unexpected error occurred: ${theFuckError.message}`);
            logger.error('Unexpected error:', theFuckError);
    }
}

export async function activate(context: vscode.ExtensionContext) {
    try {
        logger.debug('Starting ShellSage extension...');

        // Initialize DeepSeek integration
        const deepseekIntegration = DeepSeekIntegration.getInstance(context);
        deepseekIntegration.register(context);

        // Register terminal data listener
        const terminalDataListener = vscode.window.onDidWriteTerminalData((e: vscode.TerminalDataWriteEvent) => {
            const terminalId = e.terminal.processId?.toString() || '';
            if (terminalId) {
                const terminalManager = TerminalManager.getInstance(context);
                terminalManager.addCommand(e.terminal, e.data);
            }
        });

        context.subscriptions.push(terminalDataListener);

        // Register other commands
        const correctCommand = vscode.commands.registerCommand('shellsage.correctCommand', async () => {
            try {
                const correctedCommand = await runTheFuck(context);
                if (correctedCommand) {
                    const terminal = vscode.window.activeTerminal;
                    if (terminal) {
                        terminal.sendText(correctedCommand);
                    }
                }
            } catch (error) {
                handleError(error);
            }
        });

        const historyCommand = vscode.commands.registerCommand('shellsage.showHistory', () => {
            showHistory(context);
        });

        // Register command disposables
        context.subscriptions.push(correctCommand, historyCommand);

        // Initialize terminal manager
        TerminalManager.getInstance(context);

        // Initialize integrations
        const taskIntegration = new TaskIntegration();
        const debuggerIntegration = new DebuggerIntegration();
        const scmIntegration = new SCMIntegration();

        context.subscriptions.push(
            taskIntegration,
            debuggerIntegration,
            scmIntegration
        );

        logger.info('ShellSage extension activated successfully');
    } catch (error) {
        handleError(error);
    }
}

export function deactivate() {
    // Nothing to do here
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

async function runTheFuck(context: vscode.ExtensionContext): Promise<string> {
    try {
        logger.debug('Starting command correction...');
        const terminal = vscode.window.activeTerminal;
        if (!terminal) {
            throw createError('No active terminal found', ErrorType.noTerminal);
        }

        const terminalId = await terminal.processId;
        if (!terminalId) {
            throw createError('Unable to get terminal process ID', ErrorType.noTerminal);
        }

        const terminalCommand = TerminalManager.getInstance(context).getCommand(terminalId.toString());
        if (!terminalCommand) {
            throw createError('No command history found', ErrorType.noCorrection);
        }

        // 检查命令是否为空或只包含空白字符
        if (!terminalCommand.command.trim()) {
            throw createError('Empty command', ErrorType.noCorrection);
        }

        logger.debug('Original command:', terminalCommand.command);

        // 使用重试机制执行命令
        const maxRetries = ConfigManager.getInstance().getRetryAttempts();
        let lastError: Error | null = null;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const correctedCommand = await executePythonCorrection(terminalCommand.command, terminalCommand.output);
                if (correctedCommand && correctedCommand !== terminalCommand.command) {
                    logger.info('Command corrected:', { original: terminalCommand.command, corrected: correctedCommand });
                    TerminalManager.getInstance(context).getCommandHistoryManager().addToHistory(terminalCommand.command, correctedCommand, terminalCommand.shell);
                    return correctedCommand;
                }
            } catch (error) {
                lastError = error as Error;
                logger.warn(`Retry ${i + 1}/${maxRetries} failed:`, error);
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // 指数退避
                continue;
            }
        }

        if (lastError) {
            throw lastError;
        }

        throw createError('No correction available', ErrorType.noCorrection);
    } catch (error) {
        handleError(error);
        return '';
    }
}

async function executePythonCorrection(command: string, output: string): Promise<string> {
    try {
        logger.debug('Executing Python correction...');
        const pythonScript = `
from thefuck.main import Command, run_alias
from thefuck.specific.windows import Powershell

command = Command('${command.replace(/'/g, "\\'")}', '${output.replace(/'/g, "\\'")}')
corrected = run_alias(command, Powershell)
print(corrected)
`.trim();

        const tempFile = path.join(os.tmpdir(), `thefuck_${Date.now()}.py`);

        try {
            // 写入临时文件
            await fs.promises.writeFile(tempFile, pythonScript, 'utf8');
            logger.debug('Created temporary Python script:', tempFile);

            // 执行 Python 脚本
            const { stdout, stderr } = await execAsync(pythonPath, [tempFile], {
                env: {
                    ...process.env,
                    LANG: 'en_US.UTF-8',
                    PYTHONIOENCODING: 'utf-8'
                }
            });

            if (stderr) {
                logger.warn('Python script stderr:', stderr);
            }

            return stdout.trim();
        } finally {
            // 清理临时文件
            try {
                await fs.promises.unlink(tempFile);
                logger.debug('Cleaned up temporary Python script');
            } catch (error) {
                logger.warn('Failed to clean up temporary file:', error);
            }
        }
    } catch (error) {
        logger.error('Python correction failed:', error);
        throw createError('Failed to execute Python correction', ErrorType.pythonError, (error as Error).message);
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
    const commandHistoryManager = TerminalManager.getInstance(context).getCommandHistoryManager();
    const history = commandHistoryManager.getHistory();

    if (history.length === 0) {
        vscode.window.showInformationMessage('没有命令历史记录');
        return;
    }

    const items = history.map(hist => ({
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
