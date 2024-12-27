import * as vscode from 'vscode';
import { logger } from './logger';
import { ConfigManager } from './config';
import { ErrorType } from './error';

export class ErrorRecovery {
    private static instance: ErrorRecovery;
    private errorCounts: Map<string, number> = new Map();
    private recoveryStrategies: Map<ErrorType, (() => Promise<void>)[]> = new Map();
    private readonly MAX_ERRORS = 3;
    private readonly ERROR_RESET_INTERVAL = 60 * 60 * 1000; // 1 hour

    private constructor() {
        this.initializeRecoveryStrategies();
        this.startErrorResetTimer();
    }

    static getInstance(): ErrorRecovery {
        if (!ErrorRecovery.instance) {
            ErrorRecovery.instance = new ErrorRecovery();
        }
        return ErrorRecovery.instance;
    }

    private initializeRecoveryStrategies() {
        // 终端错误恢复策略
        this.recoveryStrategies.set(ErrorType.noTerminal, [
            async () => {
                const terminal = vscode.window.createTerminal('TheFuck Recovery');
                terminal.show();
                logger.info('Created new terminal for recovery');
            }
        ]);

        // Python 环境错误恢复策略
        this.recoveryStrategies.set(ErrorType.pythonError, [
            async () => {
                const configManager = ConfigManager.getInstance();
                const pythonPath = configManager.getPythonPath();
                if (pythonPath) {
                    try {
                        await this.checkPythonInstallation(pythonPath);
                    } catch (error) {
                        logger.error('Failed to verify Python installation:', error);
                        throw error;
                    }
                }
            },
            async () => {
                const action = await vscode.window.showErrorMessage(
                    'Python environment issues detected. Would you like to repair it?',
                    'Yes', 'No'
                );
                if (action === 'Yes') {
                    await this.repairPythonEnvironment();
                }
            }
        ]);

        // 执行错误恢复策略
        this.recoveryStrategies.set(ErrorType.executionError, [
            async () => {
                logger.info('Attempting to clear terminal state');
                const terminal = vscode.window.activeTerminal;
                if (terminal) {
                    terminal.sendText('\x0c'); // Clear terminal
                }
            }
        ]);

        // 环境错误恢复策略
        this.recoveryStrategies.set(ErrorType.environmentError, [
            async () => {
                await this.verifyEnvironment();
            },
            async () => {
                await this.repairEnvironment();
            }
        ]);
    }

    private startErrorResetTimer() {
        setInterval(() => {
            this.errorCounts.clear();
            logger.debug('Error counts reset');
        }, this.ERROR_RESET_INTERVAL);
    }

    async handleError(error: Error, errorType: ErrorType): Promise<boolean> {
        const errorKey = `${errorType}_${Date.now()}`;
        const currentCount = this.errorCounts.get(errorType) || 0;
        this.errorCounts.set(errorType, currentCount + 1);

        logger.warn(`Error occurred (${currentCount + 1}/${this.MAX_ERRORS}):`, error);

        if (currentCount >= this.MAX_ERRORS) {
            logger.error(`Max errors (${this.MAX_ERRORS}) reached for type: ${errorType}`);
            return false;
        }

        const strategies = this.recoveryStrategies.get(errorType);
        if (!strategies || strategies.length === 0) {
            logger.warn(`No recovery strategy found for error type: ${errorType}`);
            return false;
        }

        try {
            const strategyIndex = Math.min(currentCount, strategies.length - 1);
            await strategies[strategyIndex]();
            logger.info(`Successfully executed recovery strategy for: ${errorType}`);
            return true;
        } catch (recoveryError) {
            logger.error('Recovery strategy failed:', recoveryError);
            return false;
        }
    }

    private async checkPythonInstallation(pythonPath: string): Promise<void> {
        // 实现 Python 安装检查逻辑
    }

    private async repairPythonEnvironment(): Promise<void> {
        // 实现 Python 环境修复逻辑
    }

    private async verifyEnvironment(): Promise<void> {
        // 实现环境验证逻辑
    }

    private async repairEnvironment(): Promise<void> {
        // 实现环境修复逻辑
    }

    resetErrorCount(errorType: ErrorType): void {
        this.errorCounts.delete(errorType);
        logger.debug(`Reset error count for: ${errorType}`);
    }

    getErrorCount(errorType: ErrorType): number {
        return this.errorCounts.get(errorType) || 0;
    }
}
