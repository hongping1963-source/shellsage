import * as vscode from 'vscode';
import { Configuration } from './configuration';

interface CommandHistoryItem {
    command: string;
    correctedCommand: string;
    useCount: number;
    lastUsed: number;
    success: boolean;
}

export class CommandHistory {
    private static instance: CommandHistory;
    private history: Map<string, CommandHistoryItem>;
    private config: Configuration;

    private constructor(context: vscode.ExtensionContext) {
        this.history = new Map<string, CommandHistoryItem>();
        this.config = Configuration.getInstance();
        this.loadHistory(context);
    }

    public static getInstance(context: vscode.ExtensionContext): CommandHistory {
        if (!CommandHistory.instance) {
            CommandHistory.instance = new CommandHistory(context);
        }
        return CommandHistory.instance;
    }

    private loadHistory(context: vscode.ExtensionContext) {
        const historyData = context.globalState.get<{ [key: string]: CommandHistoryItem }>('commandHistory');
        if (historyData) {
            this.history = new Map(Object.entries(historyData));
        }
    }

    private saveHistory(context: vscode.ExtensionContext) {
        const historyData = Object.fromEntries(this.history.entries());
        context.globalState.update('commandHistory', historyData);
    }

    public addCommand(command: string, correctedCommand: string, success: boolean) {
        const item = this.history.get(command) || {
            command,
            correctedCommand,
            useCount: 0,
            lastUsed: 0,
            success
        };

        item.useCount++;
        item.lastUsed = Date.now();
        item.success = success;

        this.history.set(command, item);
    }

    public getHistory(): Map<string, CommandHistoryItem> {
        return this.history;
    }

    public clearHistory() {
        this.history.clear();
    }

    public searchHistory(query: string): CommandHistoryItem[] {
        const results: CommandHistoryItem[] = [];
        for (const item of this.history.values()) {
            if (item.command.includes(query) || item.correctedCommand.includes(query)) {
                results.push(item);
            }
        }
        return results.sort((a, b) => b.useCount - a.useCount);
    }

    public getRecentCommands(limit: number): CommandHistoryItem[] {
        return Array.from(this.history.values())
            .sort((a, b) => b.lastUsed - a.lastUsed)
            .slice(0, limit);
    }

    public getFrequentCommands(limit: number): CommandHistoryItem[] {
        return Array.from(this.history.values())
            .sort((a, b) => b.useCount - a.useCount)
            .slice(0, limit);
    }

    public getSuccessfulCorrections(limit: number): CommandHistoryItem[] {
        return Array.from(this.history.values())
            .filter(item => item.success)
            .sort((a, b) => b.lastUsed - a.lastUsed)
            .slice(0, limit);
    }

    public getStatistics(): any {
        const historyArray = Array.from(this.history.values());
        const total = historyArray.length;
        const successful = historyArray.filter(item => item.success).length;
        const mostUsed = this.getFrequentCommands(1)[0];

        // 按小时统计使用情况
        const hourlyStats = this.getHourlyStats();
        
        // 按命令类型统计
        const commandTypeStats = this.getCommandTypeStats();
        
        // 错误模式分析
        const errorPatterns = this.analyzeErrorPatterns();
        
        // 命令复杂度分析
        const complexityStats = this.analyzeCommandComplexity();
        
        // 命令序列分析
        const sequenceStats = this.analyzeCommandSequences();

        return {
            totalCommands: total,
            successfulCorrections: successful,
            successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
            mostUsedCommand: mostUsed ? {
                command: mostUsed.command,
                useCount: mostUsed.useCount
            } : null,
            averageUsesPerCommand: (historyArray.reduce((sum, item) => sum + item.useCount, 0) / total).toFixed(2),
            hourlyUsage: hourlyStats,
            commandTypes: commandTypeStats,
            errorPatterns: errorPatterns,
            complexity: complexityStats,
            sequences: sequenceStats
        };
    }

    private getHourlyStats(): { [hour: string]: number } {
        const hourlyStats: { [hour: string]: number } = {};
        
        // 初始化24小时的统计
        for (let i = 0; i < 24; i++) {
            hourlyStats[i] = 0;
        }

        Array.from(this.history.values()).forEach(item => {
            const hour = new Date(item.lastUsed).getHours();
            hourlyStats[hour]++;
        });

        return hourlyStats;
    }

    private getCommandTypeStats(): { [type: string]: number } {
        const typeStats: { [type: string]: number } = {};
        const commandPatterns = [
            { type: 'git', pattern: /^git\s/ },
            { type: 'npm', pattern: /^npm\s/ },
            { type: 'docker', pattern: /^docker\s/ },
            { type: 'file', pattern: /^(ls|cd|cp|mv|rm|mkdir|touch|cat|less|more|tail|head)\s/ },
            { type: 'network', pattern: /^(curl|wget|ping|ssh|telnet|netstat)\s/ },
            { type: 'process', pattern: /^(ps|top|kill|pkill)\s/ },
            { type: 'package', pattern: /^(apt|yum|brew|pip|npm|yarn)\s/ }
        ];

        Array.from(this.history.values()).forEach(item => {
            const type = commandPatterns.find(p => p.pattern.test(item.command))?.type || 'other';
            typeStats[type] = (typeStats[type] || 0) + 1;
        });

        return typeStats;
    }

    private analyzeErrorPatterns(): Array<{pattern: string, count: number, examples: string[]}> {
        const errorPatterns = [
            { pattern: 'typo', regex: /[a-z]+/, distance: 1 },
            { pattern: 'missing_option', regex: /^[^-]+(--?[a-z]+)*$/ },
            { pattern: 'wrong_order', regex: /^(\w+\s+){2,}/ },
            { pattern: 'missing_quotes', regex: /\s+[\w\s]+\s+/ }
        ];

        const results = [];
        const failedCommands = Array.from(this.history.values()).filter(item => !item.success);

        for (const pattern of errorPatterns) {
            const matches = failedCommands.filter(item => 
                this.matchesErrorPattern(item.command, pattern.regex, pattern.distance)
            );

            if (matches.length > 0) {
                results.push({
                    pattern: pattern.pattern,
                    count: matches.length,
                    examples: matches.slice(0, 3).map(m => m.command)
                });
            }
        }

        return results;
    }

    private matchesErrorPattern(command: string, regex: RegExp, distance?: number): boolean {
        if (distance) {
            // 使用Levenshtein距离进行模糊匹配
            return this.getLevenshteinDistance(command, regex.source) <= distance;
        }
        return regex.test(command);
    }

    private getLevenshteinDistance(a: string, b: string): number {
        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + substitutionCost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    private analyzeCommandComplexity(): any {
        const commands = Array.from(this.history.values());
        
        const complexityStats = {
            averageLength: 0,
            averageOptions: 0,
            averageArguments: 0,
            complexityDistribution: {
                simple: 0,    // 1-2 components
                medium: 0,    // 3-5 components
                complex: 0    // 6+ components
            }
        };

        commands.forEach(item => {
            const components = item.command.split(/\s+/);
            const options = components.filter(c => c.startsWith('-')).length;
            const args = components.length - options - 1; // 减去命令本身

            complexityStats.averageLength += item.command.length;
            complexityStats.averageOptions += options;
            complexityStats.averageArguments += args;

            const totalComponents = options + args;
            if (totalComponents <= 2) complexityStats.complexityDistribution.simple++;
            else if (totalComponents <= 5) complexityStats.complexityDistribution.medium++;
            else complexityStats.complexityDistribution.complex++;
        });

        const total = commands.length;
        if (total > 0) {
            complexityStats.averageLength /= total;
            complexityStats.averageOptions /= total;
            complexityStats.averageArguments /= total;
        }

        return complexityStats;
    }

    private analyzeCommandSequences(): any {
        const commands = Array.from(this.history.values());
        const sequences: { [key: string]: { next: { [key: string]: number }, count: number } } = {};
        
        // 分析命令序列
        for (let i = 0; i < commands.length - 1; i++) {
            const currentCmd = this.getBaseCommand(commands[i].command);
            const nextCmd = this.getBaseCommand(commands[i + 1].command);
            
            if (!sequences[currentCmd]) {
                sequences[currentCmd] = { next: {}, count: 0 };
            }
            
            sequences[currentCmd].count++;
            sequences[currentCmd].next[nextCmd] = (sequences[currentCmd].next[nextCmd] || 0) + 1;
        }

        // 计算转换概率
        const transitionProbabilities: { [key: string]: { [key: string]: number } } = {};
        Object.entries(sequences).forEach(([cmd, data]) => {
            transitionProbabilities[cmd] = {};
            Object.entries(data.next).forEach(([nextCmd, count]) => {
                transitionProbabilities[cmd][nextCmd] = count / data.count;
            });
        });

        return {
            sequences,
            transitionProbabilities,
            commonPatterns: this.findCommonCommandPatterns(sequences)
        };
    }

    private getBaseCommand(command: string): string {
        return command.split(/\s+/)[0];
    }

    private findCommonCommandPatterns(sequences: any): Array<{pattern: string[], frequency: number}> {
        const patterns: { [key: string]: number } = {};
        
        // 查找长度为2-3的常见命令序列
        Object.entries(sequences).forEach(([cmd, data]: [string, any]) => {
            Object.entries(data.next).forEach(([nextCmd, count]: [string, number]) => {
                const pattern = `${cmd} -> ${nextCmd}`;
                patterns[pattern] = (patterns[pattern] || 0) + count;
                
                // 查找长度为3的序列
                if (sequences[nextCmd]) {
                    Object.entries(sequences[nextCmd].next).forEach(([thirdCmd, thirdCount]: [string, number]) => {
                        const longPattern = `${cmd} -> ${nextCmd} -> ${thirdCmd}`;
                        patterns[longPattern] = (patterns[longPattern] || 0) + Math.min(count, thirdCount);
                    });
                }
            });
        });

        return Object.entries(patterns)
            .map(([pattern, frequency]) => ({
                pattern: pattern.split(' -> '),
                frequency
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5);
    }
}
