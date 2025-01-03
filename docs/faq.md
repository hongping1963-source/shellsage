# ShellSage 常见问题解答 (FAQ)

## 1. 安装相关

### Q: 如何安装 ShellSage？
A: 您可以通过以下命令安装：
```bash
git clone https://github.com/hongping1963-source/shellsage.git
cd shellsage
./scripts/install.sh
```

### Q: 安装时出现权限错误怎么办？
A: 请确保您有足够的权限，可以尝试使用 sudo：
```bash
sudo ./scripts/install.sh
```

### Q: 如何卸载 ShellSage？
A: 使用卸载脚本：
```bash
./scripts/uninstall.sh
```

## 2. 配置相关

### Q: 如何修改配置？
A: 配置文件位于 `~/.shellsage/config`，您可以直接编辑或使用命令：
```bash
shellsage config set key value
```

### Q: 配置文件在哪里？
A: 默认位置：
- 全局配置：`/etc/shellsage/config`
- 用户配置：`~/.shellsage/config`

### Q: 如何重置配置？
A: 删除配置文件后重新启动：
```bash
rm ~/.shellsage/config
shellsage init
```

## 3. 使用相关

### Q: 如何启用 AI 建议功能？
A: 在配置中启用：
```bash
shellsage config set enable_ai true
```

### Q: 命令历史存储在哪里？
A: 默认存储在 `~/.shellsage/history` 文件中。

### Q: 如何清除历史记录？
A: 使用清除命令：
```bash
shellsage history clear
```

## 4. 故障排除

### Q: 为什么没有收到命令建议？
A: 请检查：
1. AI 功能是否启用
2. 网络连接是否正常
3. API 密钥是否配置正确

### Q: 日志文件在哪里？
A: 日志文件位于 `~/.shellsage/shellsage.log`

### Q: 如何开启调试模式？
A: 设置环境变量：
```bash
export SHELLSAGE_DEBUG=true
```

## 5. 开发相关

### Q: 如何贡献代码？
A: 请参考 [贡献指南](../CONTRIBUTING.md)

### Q: 如何报告 bug？
A: 请在 GitHub Issues 中报告，并提供：
1. 问题描述
2. 复现步骤
3. 期望行为
4. 系统环境信息

### Q: 如何运行测试？
A: 执行测试命令：
```bash
./tests/run_tests.sh
```

## 6. 其他问题

### Q: 支持哪些操作系统？
A: 目前支持：
- Linux (所有主流发行版)
- macOS
- WSL (Windows Subsystem for Linux)

### Q: 如何获取更新？
A: 使用更新命令：
```bash
shellsage update
```

### Q: 在哪里可以获取帮助？
A: 您可以：
1. 查看 [使用文档](usage.md)
2. 提交 [GitHub Issues](https://github.com/hongping1963-source/shellsage/issues)
3. 发送邮件至 zhanghongping@gmail.com
