import * as vscode from 'vscode';
import { ErrorType, ShellSageError } from './error';

export interface ShellSageConfig {
    deepseekApiKey: string;
    pythonPath: string;
    maxHistorySize: number;
    logging: {
        enabled: boolean;
        level: 'debug' | 'info' | 'warn' | 'error';
    };
}

export class ConfigManager {
    private static instance: ConfigManager;
    private config: ShellSageConfig;

    private constructor() {
        this.config = this.loadConfig();
    }

    public static getInstance(): ConfigManager {
        if (!this.instance) {
            this.instance = new ConfigManager();
        }
        return this.instance;
    }

    private loadConfig(): ShellSageConfig {
        const config = vscode.workspace.getConfiguration('shellsage');
        return {
            deepseekApiKey: config.get<string>('deepseekApiKey', ''),
            pythonPath: config.get<string>('pythonPath', ''),
            maxHistorySize: config.get<number>('maxHistorySize', 100),
            logging: {
                enabled: config.get<boolean>('logging.enabled', true),
                level: config.get<'debug' | 'info' | 'warn' | 'error'>('logging.level', 'info')
            }
        };
    }

    public getConfig(): ShellSageConfig {
        return this.config;
    }

    public getDeepSeekApiKey(): string {
        const apiKey = this.config.deepseekApiKey;
        if (!apiKey) {
            throw new ShellSageError(
                'DeepSeek API key not configured. Please set shellsage.deepseekApiKey in VS Code settings.',
                ErrorType.CONFIGURATION
            );
        }
        return apiKey;
    }

    public getPythonPath(): string {
        return this.config.pythonPath;
    }

    public getMaxHistorySize(): number {
        return this.config.maxHistorySize;
    }

    public isLoggingEnabled(): boolean {
        return this.config.logging.enabled;
    }

    public getLogLevel(): 'debug' | 'info' | 'warn' | 'error' {
        return this.config.logging.level;
    }

    public reload(): void {
        this.config = this.loadConfig();
    }
}
