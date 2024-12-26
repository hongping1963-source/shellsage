// ShellSage Core Functionality
class ShellSage {
    constructor() {
        this.commandHistory = [];
        this.aliases = new Map();
        this.contextualData = {
            currentDirectory: '',
            environment: {},
            recentCommands: [],
            commonPatterns: new Map()
        };
        
        // 初始化常见命令模式
        this.initializeCommonPatterns();
    }

    // 初始化常见命令模式
    initializeCommonPatterns() {
        this.contextualData.commonPatterns.set('git', {
            commands: ['status', 'add', 'commit', 'push', 'pull', 'checkout', 'branch'],
            patterns: {
                'stauts': 'status',
                'comit': 'commit',
                'checkout -b': 'switch -c',
                'add .': 'add --all'
            },
            suggestions: {
                'git add': ['git add .', 'git add --all', 'git add -u'],
                'git commit': ['git commit -m ""', 'git commit -am ""'],
                'git push': ['git push origin main', 'git push --set-upstream origin']
            }
        });

        this.contextualData.commonPatterns.set('npm', {
            commands: ['install', 'start', 'run', 'test', 'build'],
            patterns: {
                'instal': 'install',
                'istall': 'install',
                'run dev': 'run serve'
            },
            suggestions: {
                'npm install': ['npm install --save', 'npm install --save-dev'],
                'npm run': ['npm run dev', 'npm run build', 'npm run test']
            }
        });
    }

    // 上下文感知补全
    async getContextAwareCompletions(partialCommand) {
        const suggestions = [];
        const [mainCommand, ...args] = partialCommand.trim().split(' ');
        
        // 1. 基于历史命令的建议
        const historySuggestions = this.getHistoryBasedSuggestions(partialCommand);
        suggestions.push(...historySuggestions.map(cmd => ({
            type: 'history',
            command: cmd,
            description: '最近使用的命令'
        })));
        
        // 2. 基于常见模式的建议
        if (this.contextualData.commonPatterns.has(mainCommand)) {
            const patternData = this.contextualData.commonPatterns.get(mainCommand);
            
            // 子命令补全
            if (args.length === 0) {
                suggestions.push(...patternData.commands.map(cmd => ({
                    type: 'completion',
                    command: `${mainCommand} ${cmd}`,
                    description: `常用的 ${mainCommand} 命令`
                })));
            }
            
            // 特定命令的建议
            const cmdKey = `${mainCommand} ${args[0] || ''}`.trim();
            if (patternData.suggestions[cmdKey]) {
                suggestions.push(...patternData.suggestions[cmdKey].map(cmd => ({
                    type: 'suggestion',
                    command: cmd,
                    description: '推荐的命令格式'
                })));
            }
        }
        
        // 3. 基于别名的建议
        const aliasSuggestions = this.getAliasSuggestions(partialCommand);
        suggestions.push(...aliasSuggestions.map(({alias, command}) => ({
            type: 'alias',
            command: alias,
            description: `别名: ${command}`
        })));
        
        return suggestions;
    }

    // 命令错误诊断
    async diagnoseCommand(command) {
        const diagnosis = {
            isValid: true,
            errors: [],
            suggestions: []
        };

        const [mainCommand, ...args] = command.trim().split(' ');
        
        // 1. 检查命令是否存在
        if (!this.isValidCommand(mainCommand)) {
            diagnosis.isValid = false;
            diagnosis.errors.push({
                type: 'command_not_found',
                message: `命令 '${mainCommand}' 未找到`
            });
            
            // 查找相似命令
            const similarCommands = this.findSimilarCommands(mainCommand);
            if (similarCommands.length > 0) {
                diagnosis.suggestions.push({
                    type: 'similar_commands',
                    message: '您是否想要执行以下命令：',
                    commands: similarCommands
                });
            }
        }

        // 2. 检查常见错误模式
        if (this.contextualData.commonPatterns.has(mainCommand)) {
            const patternData = this.contextualData.commonPatterns.get(mainCommand);
            
            // 检查错误的子命令
            const subCommand = args[0];
            if (subCommand && patternData.patterns[subCommand]) {
                diagnosis.errors.push({
                    type: 'typo',
                    message: `您输入的是 '${subCommand}'，是否想要执行 '${patternData.patterns[subCommand]}'？`
                });
                diagnosis.suggestions.push({
                    type: 'correction',
                    command: `${mainCommand} ${patternData.patterns[subCommand]} ${args.slice(1).join(' ')}`.trim()
                });
            }
            
            // 提供更好的命令格式建议
            const cmdKey = `${mainCommand} ${subCommand || ''}`.trim();
            if (patternData.suggestions[cmdKey]) {
                diagnosis.suggestions.push({
                    type: 'better_format',
                    message: '推荐使用以下命令格式：',
                    commands: patternData.suggestions[cmdKey]
                });
            }
        }

        return diagnosis;
    }

    // 命令优化建议
    async getOptimizationSuggestions(command) {
        const suggestions = [];
        const [mainCommand, ...args] = command.trim().split(' ');

        // 1. 检查是否有更简洁的写法
        const conciseAlternatives = this.findConciseAlternatives(command);
        if (conciseAlternatives.length > 0) {
            suggestions.push({
                type: 'concise',
                message: '更简洁的写法：',
                commands: conciseAlternatives
            });
        }

        // 2. 检查是否有更高效的替代命令
        const efficientAlternatives = this.findEfficientAlternatives(command);
        if (efficientAlternatives.length > 0) {
            suggestions.push({
                type: 'efficient',
                message: '更高效的替代方案：',
                commands: efficientAlternatives
            });
        }

        // 3. 检查是否可以使用管道优化
        const pipelineSuggestions = this.suggestPipelines(command);
        if (pipelineSuggestions.length > 0) {
            suggestions.push({
                type: 'pipeline',
                message: '使用管道可以更高效：',
                commands: pipelineSuggestions
            });
        }

        // 4. 特定命令的优化建议
        switch (mainCommand) {
            case 'find':
                suggestions.push(...this.getOptimizedFindCommand(args));
                break;
            case 'grep':
                suggestions.push(...this.getOptimizedGrepCommand(args));
                break;
            case 'git':
                suggestions.push(...this.getOptimizedGitCommand(args));
                break;
        }

        return suggestions;
    }

    // 辅助方法
    isValidCommand(command) {
        // 这里应该实际检查命令是否存在
        const commonCommands = ['git', 'npm', 'node', 'python', 'pip'];
        return commonCommands.includes(command);
    }

    findSimilarCommands(command) {
        // 使用编辑距离算法查找相似命令
        const commonCommands = ['git', 'npm', 'node', 'python', 'pip'];
        return commonCommands.filter(cmd => 
            this.getLevenshteinDistance(command, cmd) <= 2
        );
    }

    getLevenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + 1,
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1
                    );
                }
            }
        }

        return dp[m][n];
    }

    getOptimizedFindCommand(args) {
        const suggestions = [];
        // 添加 find 命令的优化建议
        if (args.includes('-name')) {
            suggestions.push({
                type: 'performance',
                message: '使用 -type f 可以提高搜索效率：',
                command: `find ${args.join(' ')} -type f`
            });
        }
        return suggestions;
    }

    getOptimizedGrepCommand(args) {
        const suggestions = [];
        // 添加 grep 命令的优化建议
        if (!args.includes('-r') && !args.includes('-R')) {
            suggestions.push({
                type: 'feature',
                message: '使用 -r 可以递归搜索目录：',
                command: `grep -r ${args.join(' ')}`
            });
        }
        return suggestions;
    }

    getOptimizedGitCommand(args) {
        const suggestions = [];
        // 添加 git 命令的优化建议
        if (args[0] === 'add' && args[1] === '.') {
            suggestions.push({
                type: 'alternative',
                message: '使用 -A 标志可以包含所有更改：',
                command: 'git add -A'
            });
        }
        return suggestions;
    }

    getHistoryBasedSuggestions(partialCommand) {
        return this.commandHistory
            .filter(cmd => cmd.startsWith(partialCommand))
            .slice(0, 5);
    }

    getAliasSuggestions(partialCommand) {
        return Array.from(this.aliases.entries())
            .filter(([alias]) => alias.startsWith(partialCommand))
            .map(([alias, command]) => ({
                alias,
                command
            }));
    }
}

// 导出 ShellSage 类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShellSage;
} else {
    window.ShellSage = ShellSage;
}
