import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';
import { logger } from '../utils/logger';
import { ConfigManager } from '../utils/config';
import { createError, ErrorType } from '../utils/error';

const execAsync = promisify(exec);

export class CommandExecutor {
    private static instance: CommandExecutor;
    private commandQueue: Array<{
        command: string;
        resolve: (value: string) => void;
        reject: (error: Error) => void;
    }> = [];
    private isProcessing = false;

    private constructor() {
        this.processQueue();
    }

    static getInstance(): CommandExecutor {
        if (!CommandExecutor.instance) {
            CommandExecutor.instance = new CommandExecutor();
        }
        return CommandExecutor.instance;
    }

    async executeCommand(command: string, output: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.commandQueue.push({ command, resolve, reject });
            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    private async processQueue() {
        if (this.isProcessing || this.commandQueue.length === 0) {
            return;
        }

        this.isProcessing = true;
        const configManager = ConfigManager.getInstance();
        const commandTimeout = configManager.getCommandTimeout();

        while (this.commandQueue.length > 0) {
            const current = this.commandQueue.shift()!;
            try {
                const result = await Promise.race([
                    this.executePythonCorrection(current.command, ''),
                    new Promise<string>((_, reject) => 
                        setTimeout(() => reject(new Error('Command execution timeout')), commandTimeout)
                    )
                ]);
                current.resolve(result);
            } catch (error) {
                current.reject(error as Error);
            }
        }

        this.isProcessing = false;
    }

    private async executePythonCorrection(command: string, output: string): Promise<string> {
        const tempFile = path.join(os.tmpdir(), `thefuck_${Date.now()}.py`);
        const configManager = ConfigManager.getInstance();
        const pythonPath = configManager.getPythonPath();

        try {
            // 优化 Python 脚本
            const pythonScript = `
import sys
from thefuck.main import Command, run_alias
from thefuck.specific.windows import Powershell

def main():
    try:
        command = Command('${command.replace(/'/g, "\\'")}', '${output.replace(/'/g, "\\'")}')
        corrected = run_alias(command, Powershell)
        print(corrected)
        sys.exit(0)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
`.trim();

            // 使用 Promise.all 并行处理文件操作
            await Promise.all([
                fs.promises.writeFile(tempFile, pythonScript, 'utf8'),
                this.checkPythonEnvironment(pythonPath)
            ]);

            logger.debug('Created temporary Python script:', tempFile);

            // 执行 Python 脚本
            const { stdout, stderr } = await execAsync(`"${pythonPath}" "${tempFile}"`, {
                env: {
                    ...process.env,
                    LANG: 'en_US.UTF-8',
                    PYTHONIOENCODING: 'utf-8',
                    PYTHONOPTIMIZE: '1'  // 启用 Python 优化
                },
                timeout: configManager.getCommandTimeout()
            });

            if (stderr) {
                logger.warn('Python script stderr:', stderr);
            }

            return stdout.trim();
        } catch (error) {
            logger.error('Python correction failed:', error);
            throw createError('Failed to execute Python correction', ErrorType.pythonError, (error as Error).message);
        } finally {
            // 异步清理临时文件
            fs.promises.unlink(tempFile).catch(error => {
                logger.warn('Failed to clean up temporary file:', error);
            });
        }
    }

    private async checkPythonEnvironment(pythonPath: string | undefined): Promise<void> {
        if (!pythonPath) {
            throw createError('Python path not configured', ErrorType.environmentError);
        }

        try {
            await execAsync(`"${pythonPath}" -c "import thefuck"`, {
                timeout: 5000
            });
        } catch (error) {
            throw createError('Python environment check failed', ErrorType.environmentError, (error as Error).message);
        }
    }
}
