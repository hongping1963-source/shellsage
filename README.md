# ShellSage 

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=shellsage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/hongping1963-source/shellsage/graphs/commit-activity)
[![GitHub issues](https://img.shields.io/github/issues/hongping1963-source/shellsage)](https://github.com/hongping1963-source/shellsage/issues)

> 您的VS Code智能终端助手！自动检测并纠正命令错误，提升您的终端使用效率。

<p align="center">
  <img src="images/demo.gif" alt="ShellSage Demo" width="600">
</p>

## 📌 项目状态

当前版本：v0.1.0-alpha（早期开发阶段）

[查看完整项目状态和路线图](./docs/PROJECT_STATUS.md)

### 已实现功能
- ✅ 基础Shell集成
- ✅ 基本的错误检测
- ✅ VS Code扩展框架
- ✅ 简单的配置选项

### 开发中功能
- 🚧 高级错误检测
- 🚧 AI驱动的建议系统
- 🚧 更多Shell支持
- 🚧 性能优化

## 🌟 主要特性

- **智能命令纠正**
  - 实时检测并建议修正错误命令
  - 支持多种Shell环境
  - 上下文感知的建议系统

- **VS Code深度集成**
  - 无缝融入VS Code终端
  - 快捷键支持
  - 自定义配置选项

- **性能优化**
  - 快速响应
  - 资源占用小
  - 高效缓存系统

## 📥 安装

### 系统要求
- VS Code 1.60.0 或更高版本
- Node.js 16.x 或更高版本
- 支持的操作系统：Windows、macOS、Linux

### 安装步骤
1. 打开VS Code
2. 按下 `Ctrl+P` / `Cmd+P`
3. 输入 `ext install shellsage`
4. 按下回车键

## 🚀 快速开始

1. 在VS Code中打开终端
2. 输入命令（即使有拼写错误也没关系！）
3. ShellSage会自动检测并提供纠正建议
4. 按回车键接受建议

### 示例

```bash
# 错误输入 'git status'
$ git stauts
 ShellSage: 您是想输入 'git status' 吗？

# 错误输入 'docker ps'
$ dcoker ps
 ShellSage: 您是想输入 'docker ps' 吗？
```

## ⚙️ 配置

通过VS Code设置面板（`Ctrl+,`）配置ShellSage：

- `shellsage.enableAutoCorrect`: 启用/禁用自动纠正
- `shellsage.showInlineCorrections`: 显示内联建议
- `shellsage.maxSuggestions`: 最大建议数量

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
