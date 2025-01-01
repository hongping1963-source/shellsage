export interface CommandHistory {
    original: string;
    corrected: string;
    timestamp: number;
    shell: string;
    exitCode?: number;
    output?: string;
}

export interface TerminalCommand {
    command: string;
    output: string;
    timestamp: number;
    shell: string;
}

export interface CorrectionResult {
    command: string;
    corrected: string;
    confidence: number;
    explanation: string;
}

export interface ExtensionConfig {
    pythonPath?: string;
    maxHistorySize: number;
    enableLogging: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    autoCorrect: boolean;
    retryAttempts: number;
    commandTimeout: number;
    deepseekApiKey: string;
}
