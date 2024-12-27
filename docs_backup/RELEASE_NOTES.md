# VS Code TheFuck Extension

## Version: 0.0.1
## Release Date: 2024-12-23

### New Features
1. **内置 Python 环境**
   - 集成了 Python 运行时环境
   - 无需额外安装 Python 或 TheFuck
   - 开箱即用的体验

2. **智能命令纠正**
   - 自动检测命令错误
   - 提供多个纠正选项
   - 支持命令历史记录

3. **多 Shell 支持**
   - PowerShell 支持
   - CMD 支持
   - WSL (如果可用)
   - Bash/ZSH 支持

4. **Web 版本支持**
   - 支持在 vscode.dev 中运行
   - 优化的 Web 性能
   - 轻量级部署

### 改进
1. **性能优化**
   - 异步命令执行
   - 智能缓存机制
   - 定期清理过期数据
   - 优化内存使用

2. **用户体验**
   - 简化的配置选项
   - 直观的错误提示
   - 状态栏集成
   - 命令面板支持

3. **代码质量**
   - ESLint 规范遵循
   - TypeScript 严格模式
   - 完整的错误处理
   - 代码注释完善

### Bug 修复
1. **命令执行**
   - 修复了命令执行超时问题
   - 改进了错误命令的处理
   - 优化了命令历史记录管理

2. **Shell 集成**
   - 修复了 Shell 类型检测问题
   - 改进了环境变量处理
   - 优化了命令输出编码

3. **配置处理**
   - 修复了配置更新不生效的问题
   - 改进了路径配置验证
   - 优化了默认配置处理

### 安装步骤
1. 打开 Visual Studio Code
2. 转到扩展视图（点击活动栏中的扩展图标）
3. 搜索 "VS Code TheFuck"
4. 点击 "安装" 按钮
5. 安装完成后重启 VS Code

### 更新说明
1. 打开 Visual Studio Code
2. 转到扩展视图
3. 找到 VS Code TheFuck 扩展
4. 点击 "更新" 按钮
5. 更新完成后重新加载 VS Code

### 已知问题
1. Windows 测试框架限制
   - 自动化测试在 Windows 环境下可能不完整
   - 建议进行手动功能验证

2. Web 版本限制
   - 部分 Shell 功能在 Web 版本中可能受限
   - 建议在桌面版本中使用完整功能

### 联系与反馈
- **GitHub Issues**: [项目仓库](https://github.com/your-username/vscode-thefuck)
- **功能建议**: 欢迎通过 GitHub Issues 提供建议
- **Bug 报告**: 请提供详细的复现步骤和环境信息

### 贡献指南
- 欢迎提交 Pull Request
- 请确保遵循代码规范
- 添加适当的测试用例
- 更新相关文档

### 许可证
MIT License

### 致谢
- TheFuck 项目团队
- VS Code 扩展社区
- 所有贡献者和测试者
