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

    private async callDeepSeekAPI(messages: any[], temperature: number = 0.3): Promise<any> {
        try {
            const response = await axios.post(
                `${DeepSeekIntegration.DEEPSEEK_API_URL}/chat/completions`,
                {
                    model: 'deepseek-chat',
                    messages: messages,
                    temperature: temperature,
                    max_tokens: 500
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0]?.message?.content;
        } catch (error) {
            logger.error('DeepSeek API call failed:', error);
            throw error;
        }
    }

    public async analyzeCommand(command: string): Promise<any> {
        const messages = [
            {
                role: 'system',
                content: `You are an expert in shell commands. Analyze the command and provide:
                1. Command purpose
                2. Potential risks or issues
                3. Parameter explanations
                4. Best practices
                5. Alternative approaches
                Format the response in JSON.`
            },
            {
                role: 'user',
                content: `Analyze this command: ${command}`
            }
        ];

        const response = await this.callDeepSeekAPI(messages);
        return JSON.parse(response);
    }

    public async correctCommand(command: string): Promise<CorrectionResult> {
        const messages = [
            {
                role: 'system',
                content: 'You are an expert in shell commands. Your task is to correct any errors in the provided command and explain the correction.'
            },
            {
                role: 'user',
                content: `Correct this command if needed: ${command}\n\nProvide the correction and explanation in this format:\nCommand: <corrected_command>\nConfidence: <0-1>\nExplanation: <why_corrected>`
            }
        ];

        const content = await this.callDeepSeekAPI(messages);
        
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
    }

    public async explainCommand(command: string): Promise<string> {
        const messages = [
            {
                role: 'system',
                content: 'You are an expert in shell commands. Provide a detailed but concise explanation of the command.'
            },
            {
                role: 'user',
                content: `Explain this command: ${command}`
            }
        ];

        return await this.callDeepSeekAPI(messages);
    }

    public async suggestImprovements(command: string): Promise<string[]> {
        const messages = [
            {
                role: 'system',
                content: 'You are an expert in shell commands. Suggest improvements for the command, focusing on efficiency, safety, and best practices.'
            },
            {
                role: 'user',
                content: `Suggest improvements for this command: ${command}\nProvide each suggestion on a new line.`
            }
        ];

        const response = await this.callDeepSeekAPI(messages);
        return response.split('\n').filter(Boolean);
    }

    public async getCommandCompletions(partialCommand: string): Promise<string[]> {
        const messages = [
            {
                role: 'system',
                content: 'You are an expert in shell commands. Provide relevant command completions.'
            },
            {
                role: 'user',
                content: `Suggest completions for this partial command: ${partialCommand}\nProvide only the completions, one per line.`
            }
        ];

        const response = await this.callDeepSeekAPI(messages, 0.2);
        return response.split('\n').filter(Boolean);
    }

    private async getLastCommand(): Promise<string | undefined> {
        const terminal = vscode.window.activeTerminal;
        if (!terminal) {
            vscode.window.showErrorMessage('No active terminal found.');
            return undefined;
        }

        // 获取最后一条命令的逻辑
        return 'last command'; // 需要实现实际的获取逻辑
    }

    private showAnalysisResults(analysis: any, command: string): void {
        const panel = vscode.window.createWebviewPanel(
            'shellsageAnalysis',
            'ShellSage Analysis',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

        panel.webview.html = this.getWebviewContent(analysis, command);
    }

    private getWebviewContent(analysis: any, command: string): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .command { background-color: #f0f0f0; padding: 10px; margin: 10px 0; }
                    .section { margin: 20px 0; }
                    .risk { color: #d73a49; }
                    .suggestion { color: #28a745; }
                </style>
            </head>
            <body>
                <h2>Command Analysis</h2>
                <div class="command">${command}</div>
                
                <div class="section">
                    <h3>Purpose</h3>
                    <p>${analysis.purpose}</p>
                </div>

                <div class="section">
                    <h3>Risks and Issues</h3>
                    ${analysis.risks.map((risk: string) => `<p class="risk">⚠️ ${risk}</p>`).join('')}
                </div>

                <div class="section">
                    <h3>Parameter Explanations</h3>
                    ${Object.entries(analysis.parameters).map(([param, desc]) => 
                        `<p><strong>${param}</strong>: ${desc}</p>`).join('')}
                </div>

                <div class="section">
                    <h3>Suggestions</h3>
                    ${analysis.suggestions.map((suggestion: string) => 
                        `<p class="suggestion">💡 ${suggestion}</p>`).join('')}
                </div>

                <div class="section">
                    <h3>Alternatives</h3>
                    ${analysis.alternatives.map((alt: string) => `<p>🔄 ${alt}</p>`).join('')}
                </div>
            </body>
            </html>
        `;
    }
}
