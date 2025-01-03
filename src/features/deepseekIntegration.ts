import * as vscode from 'vscode';
import axios from 'axios';
import { Logger } from '../utils/logger';
import { CorrectionResult } from '../types';

const logger = Logger.getInstance();

export class DeepSeekIntegration {
    private static readonly DEEPSEEK_API_URL = 'https://api.deepseek.ai/v1';
    private static instance: DeepSeekIntegration | undefined;
    private apiKey: string;

    private constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public static getInstance(context: vscode.ExtensionContext): DeepSeekIntegration {
        if (!this.instance) {
            const config = vscode.workspace.getConfiguration('shellsage');
            const apiKey = config.get<string>('deepseekApiKey');
            
            if (!apiKey) {
                throw new Error('DeepSeek API key not configured. Please set shellsage.deepseekApiKey in VS Code settings.');
            }

            this.instance = new DeepSeekIntegration(apiKey);
        }
        return this.instance;
    }

    public register(context: vscode.ExtensionContext): void {
        const analyzeCommand = vscode.commands.registerCommand('shellsage.analyzeCommand', () => {
            this.analyzeCurrentCommand();
        });

        context.subscriptions.push(analyzeCommand);
    }

    public async analyzeCurrentCommand(): Promise<void> {
        try {
            const command = await this.getLastCommand();
            if (!command) {
                return;
            }

            const analysis = await this.getCommandAnalysis(command);
            this.showAnalysisResults(analysis, command);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            logger.error('Failed to analyze command:', error);
            vscode.window.showErrorMessage(`Failed to analyze command: ${message}`);
        }
    }

    public async correctCommand(command: string): Promise<CorrectionResult> {
        try {
            logger.debug('Requesting command correction from DeepSeek API:', command);
            
            const response = await axios.post(
                `${DeepSeekIntegration.DEEPSEEK_API_URL}/chat/completions`,
                {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert in shell commands. Your task is to correct any errors in the provided command and explain the correction.'
                        },
                        {
                            role: 'user',
                            content: `Correct this command if needed: ${command}\n\nProvide the correction and explanation in this format:\nCommand: <corrected_command>\nConfidence: <0-1>\nExplanation: <why_corrected>`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No correction available from API');
            }

            // Parse the response
            const commandMatch = content.match(/Command: (.+)/);
            const confidenceMatch = content.match(/Confidence: (0\.\d+|1\.0|1)/);
            const explanationMatch = content.match(/Explanation: (.+)/);

            if (!commandMatch || !confidenceMatch || !explanationMatch) {
                throw new Error('Invalid response format from API');
            }

            return {
                command: command,
                corrected: commandMatch[1].trim(),
                confidence: parseFloat(confidenceMatch[1]),
                explanation: explanationMatch[1].trim()
            };
        } catch (err) {
            const error = err as Error;
            logger.error('Command correction failed:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid API key. Please check your DeepSeek API key configuration.');
                }
                throw new Error(`DeepSeek API error: ${error.response?.data?.error?.message || error.message}`);
            }
            throw error;
        }
    }

    private async getCommandAnalysis(command: string): Promise<any> {
        try {
            logger.debug('Requesting command analysis from DeepSeek API:', command);
            
            const response = await axios.post(
                `${DeepSeekIntegration.DEEPSEEK_API_URL}/chat/completions`,
                {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert in shell commands and terminal operations. Analyze the following command and provide detailed insights.'
                        },
                        {
                            role: 'user',
                            content: `Analyze this command: ${command}\n\nPlease provide:\n1. Command purpose\n2. Potential risks or side effects\n3. Common use cases\n4. Alternative approaches`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (err) {
            const error = err as Error;
            logger.error('Command analysis failed:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid API key. Please check your DeepSeek API key configuration.');
                }
                throw new Error(`DeepSeek API error: ${error.response?.data?.error?.message || error.message}`);
            }
            throw error;
        }
    }

    private async getLastCommand(): Promise<string | undefined> {
        return vscode.window.showInputBox({
            prompt: 'Enter the command to analyze',
            placeHolder: 'e.g., git push origin main'
        });
    }

    private showAnalysisResults(analysis: any, command: string): void {
        const panel = vscode.window.createWebviewPanel(
            'commandAnalysis',
            'Command Analysis',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

        panel.webview.html = this.getWebviewContent(analysis, command);
    }

    private getWebviewContent(analysis: any, command: string): string {
        const response = analysis.choices[0]?.message?.content || 'No analysis available';
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Command Analysis</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 20px;
                        line-height: 1.6;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-background);
                    }
                    .analysis-container {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .command-section {
                        margin-bottom: 20px;
                        padding: 15px;
                        background-color: var(--vscode-textBlockQuote-background);
                        border-left: 3px solid var(--vscode-textLink-activeForeground);
                        border-radius: 4px;
                    }
                    .analysis-section {
                        margin-bottom: 20px;
                        padding: 15px;
                        background-color: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 4px;
                    }
                    h2 {
                        color: var(--vscode-editor-foreground);
                        margin-top: 0;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 10px;
                    }
                    pre {
                        background-color: var(--vscode-textBlockQuote-background);
                        padding: 10px;
                        border-radius: 4px;
                        overflow-x: auto;
                    }
                </style>
            </head>
            <body>
                <div class="analysis-container">
                    <div class="command-section">
                        <h2>Analyzed Command</h2>
                        <pre>${command}</pre>
                    </div>
                    <div class="analysis-section">
                        <h2>Analysis</h2>
                        <div>${response.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}