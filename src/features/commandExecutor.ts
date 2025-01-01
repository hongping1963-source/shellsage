import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../utils/config';
import { ErrorType, createError } from '../utils/error';

const execAsync = promisify(exec);
const logger = Logger.getInstance();
const config = ConfigManager.getInstance();

export interface ExecutionResult {
    stdout: string;
    stderr: string;
    code: number;
}

export class CommandExecutor {
    private static instance: CommandExecutor;

    private constructor() {}

    public static getInstance(): CommandExecutor {
        if (!this.instance) {
            this.instance = new CommandExecutor();
        }
        return this.instance;
    }

    public async execute(command: string, shell?: string): Promise<ExecutionResult> {
        try {
            logger.debug(`Executing command: ${command}`);

            const options = {
                shell: shell || await this.getDefaultShell(),
                timeout: 10000, // Default timeout of 10 seconds
                maxBuffer: 1024 * 1024 // 1MB buffer
            };

            const { stdout, stderr } = await execAsync(command, options);
            
            return {
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                code: 0
            };
        } catch (error: any) {
            logger.error('Command execution failed:', error);

            if (error.code === 'ENOENT') {
                throw createError(
                    'Shell executable not found',
                    ErrorType.CONFIGURATION,
                    error
                );
            }

            if (error.code === 'ETIMEDOUT') {
                throw createError(
                    'Command execution timed out',
                    ErrorType.COMMAND_EXECUTION,
                    error
                );
            }

            return {
                stdout: '',
                stderr: error.message,
                code: error.code || 1
            };
        }
    }

    private async getDefaultShell(): Promise<string> {
        const terminal = vscode.window.activeTerminal;
        if (terminal) {
            return terminal.name;
        }

        // Default shells based on platform
        switch (process.platform) {
            case 'win32':
                return 'powershell.exe';
            case 'darwin':
                return '/bin/zsh';
            default:
                return '/bin/bash';
        }
    }
}
