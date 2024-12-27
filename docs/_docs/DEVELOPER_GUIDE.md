# VS Code TheFuck 开发者指南

## 开发环境设置

### 前提条件
- Node.js 14+
- VS Code
- Git

### 初始设置
1. 克隆仓库
```bash
git clone https://github.com/your-username/vscode-thefuck.git
cd vscode-thefuck
```

2. 安装依赖
```bash
npm install
```

3. 打开 VS Code
```bash
code .
```

## 项目结构

```
vscode-thefuck/
├── src/                    # 源代码
│   ├── extension.ts        # 扩展主入口
│   ├── utils.ts           # 工具函数
│   ├── features/          # 功能模块
│   └── integrations/      # 集成模块
├── docs/                  # 文档
├── test/                  # 测试文件
├── images/               # 图标和图片
└── python_env/           # 内置 Python 环境
```

## 开发工作流

### 本地开发
1. 运行 watch 模式
```bash
npm run watch
```

2. 按 F5 启动调试实例

### 测试
```bash
npm run test        # 运行所有测试
npm run lint        # 运行 linter
```

### 打包
```bash
npm run vscode:prepublish  # 生产构建
npm run package-web        # Web 版本打包
```

## Web 扩展开发

### 配置
- 使用 webpack 打包
- 目标环境为 webworker
- 支持 source maps

### 构建
```bash
npm run package-web
```

### 测试
1. 在 vscode.dev 中测试
2. 使用 Live Server 测试

## 代码规范

### TypeScript
- 使用严格模式
- 避免 any 类型
- 使用接口定义类型

### 命名规范
- 使用 camelCase 命名变量和函数
- 使用 PascalCase 命名类和接口
- 使用 UPPER_CASE 命名常量

### 错误处理
- 使用类型化错误
- 提供详细错误信息
- 记录错误日志

## 发布流程

### 准备
1. 更新版本号
2. 更新 CHANGELOG.md
3. 运行所有测试

### 打包
```bash
npm run vscode:prepublish
npm run package-web
```

### 发布
```bash
npm run publish
npm run publish-web
```

## 安全考虑

### 命令执行
- 使用参数数组而非字符串拼接
- 验证用户输入
- 使用安全的执行环境

### 配置存储
- 加密敏感信息
- 使用 VS Code 安全存储
- 清理临时数据

## 性能优化

### 异步操作
- 使用 Promise
- 避免阻塞主线程
- 实现取消机制

### 缓存策略
- 实现智能缓存
- 定期清理过期数据
- 优化内存使用

## 调试技巧

### VS Code 调试
- 使用断点
- 查看变量
- 使用调试控制台

### 日志记录
- 使用不同日志级别
- 记录关键操作
- 包含上下文信息

## 常见问题

### 构建错误
- 检查 Node.js 版本
- 清理 node_modules
- 检查依赖版本

### 调试问题
- 检查启动配置
- 使用正确的调试器
- 查看调试控制台

## 资源

### 文档
- [VS Code API](https://code.visualstudio.com/api)
- [TheFuck 文档](https://github.com/nvbn/thefuck)
- [TypeScript 手册](https://www.typescriptlang.org/docs)

### 工具
- [VS Code 扩展生成器](https://code.visualstudio.com/api/get-started/your-first-extension)
- [vsce](https://github.com/microsoft/vscode-vsce)
- [webpack](https://webpack.js.org/)
