# ShellSage 

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=shellsage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/hongping1963-source/shellsage/graphs/commit-activity)
[![GitHub issues](https://img.shields.io/github/issues/hongping1963-source/shellsage)](https://github.com/hongping1963-source/shellsage/issues)

> 您的VS Code智能终端助手！基于 DeepSeek AI 的智能命令分析与纠正，提升您的终端使用效率。

<p align="center">
  <img src="images/demo.gif" alt="ShellSage Demo" width="600">
</p>

## 📌 项目状态

当前版本：v0.2.0-alpha（早期开发阶段）

[查看完整项目状态和路线图](./docs/PROJECT_STATUS.md)

### 已实现功能
- ✅ 基础Shell集成
- ✅ DeepSeek AI 驱动的命令分析
- ✅ 智能命令纠正与建议
- ✅ VS Code扩展框架
- ✅ 命令历史管理
- ✅ 配置选项

### 开发中功能
- 🚧 更多 AI 模型支持
- 🚧 命令执行风险评估
- 🚧 更多Shell支持
- 🚧 性能优化

## 🌟 主要特性

- **AI 驱动的命令分析**
  - 基于 DeepSeek AI 的实时命令分析
  - 智能错误检测与纠正
  - 命令用途和风险说明
  - 替代命令建议

- **智能命令纠正**
  - 实时检测并建议修正错误命令
  - 置信度评分系统
  - 详细的纠正解释
  - 支持多种Shell环境

- **VS Code深度集成**
  - 无缝融入VS Code终端
  - 快捷键支持
  - 自定义配置选项
  - 美观的分析结果展示

- **命令历史管理**
  - 智能命令历史记录
  - 使用频率分析
  - 错误模式识别
  - 命令序列分析

## 📥 安装

### 系统要求
- VS Code 1.60.0 或更高版本
- Node.js 16.x 或更高版本
- 支持的操作系统：Windows、macOS、Linux
- DeepSeek API 密钥（可在设置中配置）

### 安装步骤
1. 打开VS Code
2. 按下 `Ctrl+P` / `Cmd+P`
3. 输入 `ext install shellsage`
4. 按下回车键
5. 在设置中配置 DeepSeek API 密钥

## 🚀 快速开始

1. 在VS Code中打开终端
2. 输入命令（即使有拼写错误也没关系！）
3. ShellSage会使用 DeepSeek AI 分析命令并提供建议
4. 按回车键接受建议

### 示例

```bash
# 错误输入 'git status'
$ git stauts
 ShellSage: 建议修正为 'git status'
 置信度: 0.98
 解释: 'stauts' 是 'status' 的常见拼写错误

# 错误输入 'docker ps'
$ dcoker ps
 ShellSage: 建议修正为 'docker ps'
 置信度: 0.95
 解释: 'dcoker' 是 'docker' 的常见拼写错误
```

## ⚙️ 配置

通过VS Code设置面板（`Ctrl+,`）配置ShellSage：

- `shellsage.deepseekApiKey`: DeepSeek API 密钥
- `shellsage.enableAutoCorrect`: 启用/禁用自动纠正
- `shellsage.showInlineCorrections`: 显示内联建议
- `shellsage.maxSuggestions`: 最大建议数量
- `shellsage.confidenceThreshold`: 最低置信度阈值

详细配置选项请参考[配置文档](./docs/CONFIGURATION.md)。

## 📚 文档

- [使用指南](./docs/FAQ_IMPROVEMENT.md)
- [开发指南](./docs/DEVELOPMENT.md)
- [贡献指南](./docs/CONTRIBUTING_GUIDE.md)
- [项目状态](./docs/PROJECT_STATUS.md)
- [常见问题](./docs/FAQ_IMPROVEMENT.md)

## 🤝 参与贡献

我们欢迎各种形式的贡献！

- 🐛 [报告问题](https://github.com/hongping1963-source/shellsage/issues)
- 💡 [提出建议](https://github.com/hongping1963-source/shellsage/issues)
- 📝 [改进文档](./docs/CONTRIBUTING_GUIDE.md)
- 💻 [提交代码](./docs/CONTRIBUTING_GUIDE.md)

查看[贡献指南](./docs/CONTRIBUTING_GUIDE.md)了解更多信息。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [DeepSeek](https://deepseek.ai) - AI 能力支持
- [TheFuck](https://github.com/nvbn/thefuck) - 项目灵感来源
- 所有[贡献者](./CONTRIBUTORS.md)
- VS Code团队提供的优秀扩展API

## 📬 联系我们

- GitHub Issues: 问题报告和功能请求
- GitHub Discussions: 一般讨论和问题解答
- Email: support@shellsage.com（即将推出）

---

<p align="center">
  Made with ❤️ by the ShellSage Team
</p>
