# ShellSage 使用指南

## 安装

### 通过脚本安装

```bash
curl -L https://github.com/hongping1963-source/shellsage/install.sh | bash
```

### 手动安装

1. 克隆仓库：
```bash
git clone https://github.com/hongping1963-source/shellsage.git
```

2. 进入目录：
```bash
cd shellsage
```

3. 运行安装脚本：
```bash
./scripts/install.sh
```

## 基本使用

### 1. 初始化

首次使用时需要初始化配置：

```bash
shellsage init
```

### 2. 命令历史管理

查看命令历史：
```bash
shellsage history list
```

搜索历史命令：
```bash
shellsage history search "关键词"
```

### 3. AI 命令建议

获取命令建议：
```bash
shellsage suggest "你想做什么"
```

例如：
```bash
shellsage suggest "如何查找大文件"
```

### 4. 配置管理

查看当前配置：
```bash
shellsage config list
```

修改配置：
```bash
shellsage config set key value
```

## 高级功能

### 1. 自定义 AI 模型

设置自定义 AI 模型：
```bash
shellsage config set ai.model custom
shellsage config set ai.endpoint "your-api-endpoint"
```

### 2. 命令分析

分析命令使用模式：
```bash
shellsage analyze
```

### 3. 批处理任务

创建批处理任务：
```bash
shellsage batch create task.txt
```

执行批处理：
```bash
shellsage batch run task.txt
```

## 配置说明

### 配置文件位置

- 全局配置：`/etc/shellsage/config.yaml`
- 用户配置：`~/.shellsage/config.yaml`

### 主要配置项

```yaml
# AI 设置
ai:
  model: "deepseek"  # AI 模型选择
  api_key: ""        # API 密钥
  endpoint: ""       # API 端点

# 历史记录设置
history:
  max_size: 1000    # 最大历史记录数
  path: "~/.shellsage/history"

# 日志设置
logging:
  level: "info"     # 日志级别
  path: "~/.shellsage/shellsage.log"
```

## 故障排除

### 1. 日志查看

查看日志文件：
```bash
tail -f ~/.shellsage/shellsage.log
```

### 2. 调试模式

启用调试模式：
```bash
export SHELLSAGE_DEBUG=true
shellsage command
```

### 3. 常见问题

如果遇到问题：
1. 检查配置文件
2. 查看日志输出
3. 确认权限设置
4. 验证网络连接

更多问题解答请参考 [FAQ](faq.md)。

## 更新与卸载

### 更新

更新到最新版本：
```bash
shellsage update
```

### 卸载

运行卸载脚本：
```bash
./scripts/uninstall.sh
```

## 获取帮助

- 查看命令帮助：`shellsage --help`
- 查看具体命令帮助：`shellsage command --help`
- 访问 [GitHub Issues](https://github.com/hongping1963-source/shellsage/issues)
- 发送邮件至 zhanghongping@gmail.com
