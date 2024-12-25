# ShellSage

ShellSage 是一个智能的命令行助手，它可以帮助你更高效地使用命令行。它结合了命令纠错、智能建议和使用分析等功能，让你的命令行体验更加流畅。

## 主要特性

### 1. 智能命令建议
- 基于历史记录的智能建议
- 上下文感知的命令补全
- 模糊匹配支持
- 实时命令提示

### 2. 高级统计分析
- 命令使用模式分析
- 错误模式识别
- 使用时间分布统计
- 命令复杂度分析

### 3. 预测性命令推荐
- 基于序列的命令预测
- 时间相关性分析
- 命令类型关联分析
- 智能排名系统

### 4. 错误纠正
- 自动错误检测
- 智能命令纠正
- 多样化的纠正建议
- 学习用户偏好

## 安装

```bash
npm install shellsage
```

## 使用方法

1. 在VS Code中安装ShellSage扩展
2. 在终端中使用时，ShellSage会自动提供命令建议和纠错
3. 使用快捷键 `Ctrl+Shift+Space` 查看命令推荐
4. 通过状态栏查看命令统计信息

## 配置选项

```json
{
    "shellsage.suggestions.enabled": true,
    "shellsage.suggestions.triggerCharacters": ["-", ".", "/"],
    "shellsage.suggestions.maxItems": 5,
    "shellsage.recommendations.enabled": true,
    "shellsage.recommendations.maxItems": 5
}
```

## 统计信息

ShellSage提供丰富的使用统计信息：

- 命令使用频率
- 错误率分析
- 时间分布统计
- 命令类型分布
- 复杂度分析
- 序列模式分析

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT
