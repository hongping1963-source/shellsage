# ShellSage

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-^1.85.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Your intelligent terminal companion in VS Code! Automatically detects and corrects command errors, enhancing your terminal productivity.

![功能演示](images/demo.gif)

## ✨ 特性

- **完全集成**
  - 内置 Python 环境和 TheFuck
  - 无需额外安装
  - 开箱即用

- **智能纠错**
  - 自动检测命令错误
  - 实时提供纠正建议
  - 支持多种 shell

- **历史记录**
  - 保存纠正历史
  - 快速重用命令
  - 差异对比显示

## 🚀 快速开始

1. 在 VS Code 中安装扩展
2. 在终端中输入命令
3. 如果命令出错，按 `Ctrl+Alt+F` (Mac: `Cmd+Alt+F`)
4. 选择纠正建议
5. 执行纠正后的命令

## ⚙️ 配置选项

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `pythonPath` | Python 可执行文件路径 | 内置环境 |
| `thefuckPath` | TheFuck 可执行文件路径 | 内置环境 |
| `showDiff` | 显示命令差异 | `true` |
| `requireConfirmation` | 执行前确认 | `true` |
| `enableNotifications` | 启用通知 | `true` |
| `historySize` | 历史记录数量 | `100` |

## 🔧 支持的 Shell

- PowerShell
- CMD
- Bash
- ZSH
- WSL (如果可用)

## 📋 使用技巧

1. **快捷键**
   - `Ctrl+Alt+F`: 纠正命令
   - `Ctrl+Shift+P`: 打开命令面板，输入 "TheFuck"

2. **状态栏**
   - 点击状态栏图标快速访问功能
   - 显示当前 Shell 类型

3. **历史记录**
   - 使用命令面板查看历史
   - 快速重用之前的纠正

## 🔒 安全说明

- 所有命令本地执行
- 支持命令确认
- 可审查规则
- 无外部依赖

## 🐛 问题反馈

如果您遇到问题或有建议：

1. 检查 [常见问题](docs/FAQ.md)
2. 提交 [Issue](https://github.com/vscode-thefuck-team/vscode-thefuck/issues)
3. 查看 [贡献指南](docs/CONTRIBUTING.md)

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [TheFuck](https://github.com/nvbn/thefuck) 项目团队
- VS Code 扩展社区
- 所有贡献者

## 🔄 更新日志

详见 [CHANGELOG.md](CHANGELOG.md)
