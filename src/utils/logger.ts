import * as vscode from 'vscode';

export class Logger {
    private static instance: Logger;
    private outputChannel: vscode.OutputChannel;

    private constructor() {
        this.outputChannel = vscode.window.createOutputChannel('ShellSage');
    }

    public static getInstance(): Logger {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    public debug(message: string, ...args: any[]): void {
        this.log('DEBUG', message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        this.log('INFO', message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        this.log('WARN', message, ...args);
    }

    public error(message: string, error?: any): void {
        this.log('ERROR', message, error);
        if (error) {
            console.error(error);
        }
    }

    private log(level: string, message: string, ...args: any[]): void {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level}] ${message}`;
        
        if (args.length > 0) {
            this.outputChannel.appendLine(`${formattedMessage} ${JSON.stringify(args)}`);
        } else {
            this.outputChannel.appendLine(formattedMessage);
        }
    }

    public dispose(): void {
        this.outputChannel.dispose();
    }
}
