import * as vscode from 'vscode';
import * as path from 'path';
import { execAsync } from '../utils';

interface CorrectionCache {
    command: string;
    correction: string;
    timestamp: number;
    context: string;
}

interface CorrectionResult {
    command: string;
    correction: string;
    timestamp: number;
    context: string;
}

export class EnhancedCorrection {
    private static readonly cacheTimeout = 1800000; // 30 minutes in milliseconds
    private static cache: Map<string, CorrectionCache> = new Map();
    private static statusBarItem: vscode.StatusBarItem;
    private static context: vscode.ExtensionContext;

    static initialize(context: vscode.ExtensionContext) {
        this.context = context;
        this.setupStatusBarItem();
        this.setupContextMenus();
        this.setupAutomaticTrigger();
        this.setupQuickPick();
    }

    private static setupStatusBarItem() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            100
        );
        this.statusBarItem.text = "$(tools) TheFuck";
        this.statusBarItem.tooltip = "纠正最后的命令 (点击查看选项)";
        this.statusBarItem.command = 'vscode-thefuck.showCorrectionOptions';
        this.context.subscriptions.push(this.statusBarItem);
        this.statusBarItem.show();
    }

    private static setupContextMenus() {
        const commandHandler = vscode.commands.registerCommand(
            'vscode-thefuck.showCorrectionOptions',
            async () => {
                const options = ['纠正最后的命令', '显示命令历史', '配置自动触发', '查看文档'];
                const choice = await vscode.window.showQuickPick(options, {
                    placeHolder: '选择操作'
                });

                switch (choice) {
                    case '纠正最后的命令':
                        await vscode.commands.executeCommand('vscode-thefuck.correctCommand');
                        break;
                    case '显示命令历史':
                        await vscode.commands.executeCommand('vscode-thefuck.showHistory');
                        break;
                    case '配置自动触发':
                        await vscode.commands.executeCommand('workbench.action.openSettings', 'vscode-thefuck.autoTrigger');
                        break;
                    case '查看文档':
                        // 打开文档
                        const docUri = vscode.Uri.file(this.context.extensionPath + '/docs/integrations.md');
                        await vscode.commands.executeCommand('markdown.showPreview', docUri);
                        break;
                }
            }
        );
        this.context.subscriptions.push(commandHandler);
    }

    private static setupAutomaticTrigger() {
        // 监听终端输出
        const terminalDataListener = vscode.window.onDidOpenTerminal(async terminal => {
            const config = vscode.workspace.getConfiguration('vscode-thefuck');
            if (!config.get<boolean>('autoTrigger')) {
                return;
            }

            // 监听终端退出代码
            terminal.processId.then(async pid => {
                if (!pid) {return;}

                // 使用 exit code 来判断命令是否失败
                const exitCodeWatcher = setInterval(async () => {
                    try {
                        const { stdout } = await execAsync(`ps -p ${pid} -o exitcode=`);
                        const exitCode = parseInt(stdout.trim());
                        if (exitCode && exitCode !== 0) {
                            clearInterval(exitCodeWatcher);
                            const correction = await this.getCorrection(terminal.name);
                            if (correction) {
                                this.showCorrectionSuggestion(correction, terminal);
                            }
                        }
                    } catch (error) {
                        clearInterval(exitCodeWatcher);
                    }
                }, 1000);

                // 5分钟后清除监听器
                setTimeout(() => {
                    clearInterval(exitCodeWatcher);
                }, 5 * 60 * 1000);
            });
        });

        this.context.subscriptions.push(terminalDataListener);
    }

    private static async getCorrection(context: string): Promise<string | null> {
        const lastCommand = await this.getLastCommand();
        if (!lastCommand) {
            return null;
        }

        // 检查缓存
        const cacheKey = `${context}:${lastCommand}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.correction;
        }

        try {
            // 使用内置的 Python 环境
            const pythonPath = path.join(this.context.extensionPath, 'python_env',
                process.platform === 'win32' ? 'Scripts\\python.exe' : 'bin/python');
            const thefuckScript = path.join(this.context.extensionPath, 'python_env',
                process.platform === 'win32' ? 'Scripts\\thefuck.exe' : 'bin/thefuck');

            // 构建命令
            const command = `"${pythonPath}" "${thefuckScript}" "${lastCommand}" --enable-experimental-instant-mode`;

            const { stdout, stderr } = await execAsync(command, {
                env: {
                    ...process.env,
                    pythonIoEncoding: 'utf-8',
                    pythonPath: path.join(this.context.extensionPath, 'python_env', 'Lib', 'site-packages')
                }
            });

            if (stderr) {
                console.error('TheFuck error:', stderr);
                return null;
            }

            const correction = stdout.trim();
            if (correction && correction !== lastCommand) {
                // 更新缓存
                this.cache.set(cacheKey, {
                    command: lastCommand,
                    correction,
                    timestamp: Date.now(),
                    context
                });

                return correction;
            }
        } catch (error) {
            console.error('Error getting correction:', error);
        }

        return null;
    }

    private static async showCorrectionSuggestion(correction: string, terminal: vscode.Terminal) {
        const config = vscode.workspace.getConfiguration('vscode-thefuck');
        const showExplanation = config.get<boolean>('showExplanation');

        let message = `是否要执行: ${correction}`;
        if (showExplanation) {
            const explanation = await this.getCommandExplanation(correction);
            message += `\n\n${explanation}`;
        }

        const action = await vscode.window.showInformationMessage(
            message,
            '执行',
            '查看文档',
            '不再显示'
        );

        switch (action) {
            case '执行':
                terminal.sendText(correction);
                break;
            case '查看文档':
                await this.openCommandDocumentation(correction);
                break;
            case '不再显示':
                await config.update('autoTrigger', false, true);
                break;
        }
    }

    private static async getCommandExplanation(command: string): Promise<string> {
        // 这里可以调用 man 或其他文档工具获取命令解释
        try {
            const { stdout } = await execAsync(`man -f ${command.split(' ')[0]}`);
            return stdout.trim();
        } catch {
            return '没有找到相关文档';
        }
    }

    private static async openCommandDocumentation(command: string) {
        const baseCommand = command.split(' ')[0];
        const url = `https://man.archlinux.org/man/${baseCommand}.1`;
        await vscode.env.openExternal(vscode.Uri.parse(url));
    }

    private static async getLastCommand(): Promise<string | null> {
        try {
            // 在 Windows 上使用 doskey /history 获取命令历史
            const command = process.platform === 'win32'
                ? 'doskey /history'
                : 'history 1';

            const { stdout } = await execAsync(command);
            const lines = stdout.trim().split('\n');
            if (lines.length > 0) {
                // 获取最后一行命令
                const lastLine = lines[lines.length - 1].trim();
                // 移除命令编号（如果有）
                return lastLine.replace(/^\d+\s*/, '');
            }
        } catch (error) {
            console.error('Error getting last command:', error);
        }
        return null;
    }

    private static setupQuickPick() {
        const quickPickHandler = vscode.commands.registerCommand(
            'vscode-thefuck.quickCorrect',
            async () => {
                const correction = await this.getCorrection('quickpick');
                if (!correction) {
                    return;
                }

                const quickPick = vscode.window.createQuickPick();
                quickPick.items = [
                    { label: '$(check) 执行', description: correction },
                    { label: '$(book) 查看文档', description: '打开命令文档' },
                    { label: '$(history) 添加到历史', description: '保存这个纠正' }
                ];

                quickPick.onDidChangeSelection(async ([item]) => {
                    if (!item) {return;}

                    switch (item.label) {
                        case '$(check) 执行':
                            const terminal = vscode.window.activeTerminal;
                            if (terminal) {
                                terminal.sendText(correction);
                            }
                            break;
                        case '$(book) 查看文档':
                            await this.openCommandDocumentation(correction);
                            break;
                        case '$(history) 添加到历史':
                            // 添加到历史记录的逻辑
                            break;
                    }
                    quickPick.hide();
                });

                quickPick.show();
            }
        );
        this.context.subscriptions.push(quickPickHandler);
    }

    private static cleanupCache(): void {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > EnhancedCorrection.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }
}
