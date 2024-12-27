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
        
        // 错误处理配置
        this.errorConfig = {
            maxRetries: 3,
            retryDelay: 1000,
            timeout: 5000
        };
        
        // 初始化常见命令模式
        this.initializeCommonPatterns();
        
        // 初始化输入验证规则
        this.initializeValidationRules();
    }

    // 初始化输入验证规则
    initializeValidationRules() {
        this.validationRules = {
            command: {
                maxLength: 1000,
                pattern: /^[a-zA-Z0-9\s\-_./\\'"]+$/,
                blockedPatterns: [
                    /rm\s+-rf\s+\//, // 危险的删除命令
                    />[>]?\s*\/dev\//, // 危险的重定向
                    /\|\s*rm/, // 管道到rm命令
                    /eval\s*\(/ // eval命令
                ]
            },
            path: {
                maxLength: 260,
                pattern: /^[a-zA-Z0-9\s\-_./\\]+$/
            }
        };
    }

    // 输入校验
    validateInput(input, type = 'command') {
        try {
            if (!input) {
                throw new Error('输入不能为空');
            }

            const rules = this.validationRules[type];
            if (!rules) {
                throw new Error('未知的验证类型');
            }

            // 检查长度
            if (input.length > rules.maxLength) {
                throw new Error(`输入长度不能超过 ${rules.maxLength} 个字符`);
            }

            // 检查字符模式
            if (!rules.pattern.test(input)) {
                throw new Error('输入包含无效字符');
            }

            // 检查危险模式
            if (type === 'command') {
                for (const pattern of rules.blockedPatterns) {
                    if (pattern.test(input)) {
                        throw new Error('检测到潜在的危险命令');
                    }
                }
            }

            return { isValid: true };
        } catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    }

    // 带重试的异步操作包装器
    async withRetry(operation, options = {}) {
        const retries = options.retries || this.errorConfig.maxRetries;
        const delay = options.delay || this.errorConfig.retryDelay;
        const timeout = options.timeout || this.errorConfig.timeout;

        let lastError;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // 创建超时Promise
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('操作超时')), timeout);
                });

                // 执行操作并竞争超时
                const result = await Promise.race([
                    operation(),
                    timeoutPromise
                ]);

                return result;
            } catch (error) {
                lastError = error;
                console.warn(`操作失败 (尝试 ${attempt}/${retries}):`, error.message);
                
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`操作失败，已重试 ${retries} 次: ${lastError.message}`);
    }

    // 上下文感知补全
    async getContextAwareCompletions(partialCommand) {
        try {
            // 输入校验
            const validation = this.validateInput(partialCommand);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            return await this.withRetry(async () => {
                const suggestions = [];
                const [mainCommand, ...args] = partialCommand.trim().split(' ');
                
                // 基于历史命令的建议
                const historySuggestions = this.getHistoryBasedSuggestions(partialCommand);
                suggestions.push(...historySuggestions.map(cmd => ({
                    type: 'history',
                    command: cmd,
                    description: '最近使用的命令'
                })));
                
                // 基于常见模式的建议
                if (this.contextualData.commonPatterns.has(mainCommand)) {
                    const patternData = this.contextualData.commonPatterns.get(mainCommand);
                    
                    if (args.length === 0) {
                        suggestions.push(...patternData.commands.map(cmd => ({
                            type: 'completion',
                            command: `${mainCommand} ${cmd}`,
                            description: `常用的 ${mainCommand} 命令`
                        })));
                    }
                    
                    const cmdKey = `${mainCommand} ${args[0] || ''}`.trim();
                    if (patternData.suggestions[cmdKey]) {
                        suggestions.push(...patternData.suggestions[cmdKey].map(cmd => ({
                            type: 'suggestion',
                            command: cmd,
                            description: '推荐的命令格式'
                        })));
                    }
                }
                
                return suggestions;
            });
        } catch (error) {
            console.error('获取补全建议时出错:', error);
            return [{
                type: 'error',
                message: '无法获取补全建议: ' + error.message
            }];
        }
    }

    // 命令错误诊断
    async diagnoseCommand(command) {
        try {
            // 输入校验
            const validation = this.validateInput(command);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            return await this.withRetry(async () => {
                const diagnosis = {
                    isValid: true,
                    errors: [],
                    suggestions: []
                };

                const [mainCommand, ...args] = command.trim().split(' ');
                
                // 检查命令是否存在
                if (!this.isValidCommand(mainCommand)) {
                    diagnosis.isValid = false;
                    diagnosis.errors.push({
                        type: 'command_not_found',
                        message: `命令 '${mainCommand}' 未找到`
                    });
                    
                    const similarCommands = this.findSimilarCommands(mainCommand);
                    if (similarCommands.length > 0) {
                        diagnosis.suggestions.push({
                            type: 'similar_commands',
                            message: '您是否想要执行以下命令：',
                            commands: similarCommands
                        });
                    }
                }

                // 检查常见错误模式
                if (this.contextualData.commonPatterns.has(mainCommand)) {
                    const patternData = this.contextualData.commonPatterns.get(mainCommand);
                    
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
                }

                return diagnosis;
            });
        } catch (error) {
            console.error('诊断命令时出错:', error);
            return {
                isValid: false,
                errors: [{
                    type: 'system_error',
                    message: '命令诊断失败: ' + error.message
                }],
                suggestions: []
            };
        }
    }

    // 命令优化建议
    async getOptimizationSuggestions(command) {
        try {
            // 输入校验
            const validation = this.validateInput(command);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            return await this.withRetry(async () => {
                const suggestions = [];
                const [mainCommand, ...args] = command.trim().split(' ');

                // 检查是否有更简洁的写法
                const conciseAlternatives = await this.findConciseAlternatives(command);
                if (conciseAlternatives.length > 0) {
                    suggestions.push({
                        type: 'concise',
                        message: '更简洁的写法：',
                        commands: conciseAlternatives
                    });
                }

                // 检查是否有更高效的替代命令
                const efficientAlternatives = await this.findEfficientAlternatives(command);
                if (efficientAlternatives.length > 0) {
                    suggestions.push({
                        type: 'efficient',
                        message: '更高效的替代方案：',
                        commands: efficientAlternatives
                    });
                }

                // 特定命令的优化建议
                switch (mainCommand) {
                    case 'find':
                        suggestions.push(...await this.getOptimizedFindCommand(args));
                        break;
                    case 'grep':
                        suggestions.push(...await this.getOptimizedGrepCommand(args));
                        break;
                    case 'git':
                        suggestions.push(...await this.getOptimizedGitCommand(args));
                        break;
                }

                return suggestions;
            });
        } catch (error) {
            console.error('获取优化建议时出错:', error);
            return [{
                type: 'error',
                message: '无法获取优化建议: ' + error.message
            }];
        }
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

    // 错误处理工具方法
    handleError(error, context = '') {
        console.error(`${context}错误:`, error);
        
        // 根据错误类型返回用户友好的错误消息
        if (error instanceof TypeError) {
            return '输入格式不正确';
        } else if (error instanceof RangeError) {
            return '输入值超出有效范围';
        } else if (error instanceof Error) {
            return error.message;
        } else {
            return '发生未知错误';
        }
    }
}

// 导出 ShellSage 类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShellSage;
} else {
    window.ShellSage = ShellSage;
}
