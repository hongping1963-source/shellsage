import * as vscode from 'vscode';
import { CommandHistory } from './commandHistory';
import { CommandPredictor } from './commandPredictor';
import { CommandRecommendation } from './commandRecommendation';
import { Configuration } from './configuration';

export function activate(context: vscode.ExtensionContext) {
    const history = CommandHistory.getInstance(context);
    const predictor = CommandPredictor.getInstance(context);
    const recommendation = CommandRecommendation.getInstance(context);
    const config = Configuration.getInstance();

    // 注册命令建议提供器
    const suggestionProvider = new CommandSuggestionProvider(context);
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: 'vscode-terminal' },
            suggestionProvider,
            ...config.getHistoryConfig().triggerCharacters
        )
    );

    // 注册显示推荐命令
    context.subscriptions.push(
        vscode.commands.registerCommand('shellsage.showRecommendations', async () => {
            const terminal = vscode.window.activeTerminal;
            if (terminal) {
                // 获取当前命令行内容（这需要终端API支持）
                const currentCommand = ''; // 需要实现获取当前命令的逻辑
                await recommendation.showRecommendations(currentCommand);
            }
        })
    );

    // 注册显示统计信息命令
    context.subscriptions.push(
        vscode.commands.registerCommand('shellsage.showStatistics', () => {
            const stats = history.getStatistics();
            const panel = vscode.window.createWebviewPanel(
                'shellsageStats',
                'ShellSage 统计信息',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getStatsWebviewContent(stats);
        })
    );

    // 监听终端命令执行
    vscode.window.onDidWriteTerminalData(e => {
        const command = e.data.trim();
        if (command) {
            predictor.addToContext(command);
        }
    });
}

function getStatsWebviewContent(stats: any): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ShellSage 统计信息</title>
        <style>
            body {
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            .stat-card {
                background: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 15px;
                margin-bottom: 15px;
            }
            .stat-title {
                font-size: 1.2em;
                margin-bottom: 10px;
                color: var(--vscode-editor-foreground);
            }
            .stat-content {
                color: var(--vscode-editor-foreground);
            }
            .chart {
                margin: 15px 0;
                height: 200px;
            }
        </style>
    </head>
    <body>
        <div class="stat-card">
            <div class="stat-title">基本统计</div>
            <div class="stat-content">
                <p>总命令数: ${stats.totalCommands}</p>
                <p>成功率: ${stats.successRate}</p>
                <p>平均每个命令使用次数: ${stats.averageUsesPerCommand}</p>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-title">使用时间分布</div>
            <div class="stat-content">
                <div id="hourlyChart" class="chart"></div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-title">命令类型分布</div>
            <div class="stat-content">
                <div id="typeChart" class="chart"></div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-title">错误模式分析</div>
            <div class="stat-content">
                ${stats.errorPatterns.map(pattern => `
                    <p>${pattern.pattern}: ${pattern.count} 次</p>
                    <ul>
                        ${pattern.examples.map(ex => `<li>${ex}</li>`).join('')}
                    </ul>
                `).join('')}
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-title">命令复杂度分析</div>
            <div class="stat-content">
                <p>平均长度: ${stats.complexity.averageLength.toFixed(2)}</p>
                <p>平均选项数: ${stats.complexity.averageOptions.toFixed(2)}</p>
                <p>平均参数数: ${stats.complexity.averageArguments.toFixed(2)}</p>
                <div id="complexityChart" class="chart"></div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-title">常见命令序列</div>
            <div class="stat-content">
                ${stats.sequences.commonPatterns.map(pattern => `
                    <p>${pattern.pattern.join(' -> ')}: ${pattern.frequency} 次</p>
                `).join('')}
            </div>
        </div>

        <script>
            // 这里可以添加图表渲染代码
        </script>
    </body>
    </html>`;
}

export function deactivate() {}
