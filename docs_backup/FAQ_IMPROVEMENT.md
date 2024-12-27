# ShellSage FAQ (Frequently Asked Questions)

## 基本信息

### 什么是ShellSage？
ShellSage是一个VS Code扩展，它能自动检测并纠正终端中的命令行错误。它的灵感来自流行的TheFuck命令行工具，但直接集成在VS Code中，提供更流畅的用户体验。

### ShellSage如何工作？
当您输入导致错误的命令时，ShellSage会：
1. 分析错误信息和命令历史
2. 使用模式匹配和机器学习技术提供准确的纠正建议
3. 显示可能的修正选项
4. 允许您一键应用修正

## 安装与设置

### 系统要求
- VS Code 1.60.0 或更高版本
- Node.js 16.x 或更高版本
- 支持的操作系统：Windows、macOS、Linux

### 安装步骤
1. 打开VS Code
2. 转到扩展市场（Ctrl+Shift+X）
3. 搜索"ShellSage"
4. 点击"安装"
5. 重启VS Code以激活扩展

### 配置选项
在VS Code设置中，您可以自定义以下选项：
- `shellsage.enableAutoCorrect`: 启用/禁用自动纠正建议
- `shellsage.showInlineCorrections`: 在终端中显示内联纠正
- `shellsage.maxSuggestions`: 最大显示建议数量
- `shellsage.excludedCommands`: 排除特定命令的纠正

## 功能支持

### 支持的Shell
- PowerShell
- Command Prompt (CMD)
- Bash
- Git Bash
- WSL (Windows Subsystem for Linux)

### 当前支持的功能
- [x] 命令错误检测
- [x] 自动纠正建议
- [x] 多Shell支持
- [x] 自定义配置
- [x] 历史命令分析

### 计划中的功能
- [ ] 更多Shell支持
- [ ] 高级模式匹配
- [ ] 用户自定义规则
- [ ] AI驱动的建议改进
- [ ] 多语言支持

## 常见问题解答

### Q: ShellSage和TheFuck的区别是什么？
A: ShellSage是专门为VS Code设计的扩展，提供了更好的IDE集成体验，包括内联建议、图形界面等特性。而TheFuck是一个独立的命令行工具。

### Q: 如何禁用特定命令的纠正？
A: 在VS Code设置中，将命令添加到`shellsage.excludedCommands`数组中即可。

### Q: ShellSage是否支持自定义纠正规则？
A: 目前正在开发中。您可以关注我们的GitHub仓库了解最新进展。

### Q: 遇到问题如何获取帮助？
A: 您可以：
1. 查看本FAQ文档
2. 在GitHub上提交Issue
3. 参与Discussions讨论
4. 查看开发文档

## 反馈与贡献

### 如何报告问题？
1. 访问我们的[GitHub Issues](https://github.com/hongping1963-source/shellsage/issues)
2. 点击"New Issue"
3. 选择适当的问题模板
4. 填写必要信息并提交

### 如何贡献代码？
1. Fork仓库
2. 创建功能分支
3. 提交更改
4. 发起Pull Request
详细步骤请参考[贡献指南](CONTRIBUTING_GUIDE.md)

### 获取更新
- Star和Watch我们的GitHub仓库
- 定期检查VS Code扩展更新
- 关注我们的发布说明

## 性能与安全

### ShellSage会影响终端性能吗？
A: ShellSage采用轻量级设计，对终端性能的影响微乎其微。

### 命令历史是否安全？
A: 所有命令分析都在本地进行，不会上传到任何服务器。
