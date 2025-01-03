# Contributing to ShellSage

感谢您对ShellSage的贡献兴趣！本指南将帮助您了解如何参与项目开发。

## 开发环境设置

### 前置要求
- Node.js (v16.x或更高版本)
- VS Code
- Git
- 基本的TypeScript知识

### 环境搭建步骤
1. Fork并克隆仓库：
   ```bash
   git clone https://github.com/[YOUR_USERNAME]/shellsage.git
   cd shellsage
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 打开VS Code：
   ```bash
   code .
   ```

4. 按F5启动调试模式

## 代码规范

### 代码风格
- 使用TypeScript编写代码
- 遵循ESLint规则
- 使用2空格缩进
- 使用单引号
- 每个文件末尾保留一个空行

### 命名规范
- 类名：PascalCase
- 函数和变量：camelCase
- 常量：UPPER_SNAKE_CASE
- 文件名：kebab-case

### 注释规范
- 为所有公共API添加JSDoc注释
- 为复杂逻辑添加行内注释
- 保持注释简洁明了
- 及时更新过时的注释

## 提交规范

### 分支管理
- main：主分支，保持稳定
- develop：开发分支
- feature/*：新功能分支
- bugfix/*：bug修复分支
- release/*：发布分支

### Commit消息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- feat：新功能
- fix：bug修复
- docs：文档更新
- style：代码格式（不影响代码运行的变动）
- refactor：重构
- test：测试相关
- chore：构建过程或辅助工具的变动

### Pull Request流程
1. 创建功能分支
2. 编写代码和测试
3. 提交变更
4. 推送到您的Fork
5. 创建Pull Request
6. 等待代码审查
7. 根据反馈修改
8. 合并到主分支

## 测试指南

### 单元测试
- 使用Jest框架
- 测试文件命名：*.test.ts
- 保持测试简单且独立
- 模拟外部依赖

### 运行测试
```bash
npm test
```

### 测试覆盖率
```bash
npm run test:coverage
```

## 文档维护

### 文档结构
- README.md：项目概述
- CONTRIBUTING.md：贡献指南
- docs/：详细文档
  - API.md：API文档
  - DEVELOPMENT.md：开发指南
  - FAQ.md：常见问题

### 文档更新
- 新功能需要更新相关文档
- 保持文档与代码同步
- 使用清晰的语言和示例
- 包含必要的截图和动画

## 发布流程

### 版本号规范
遵循语义化版本控制（Semantic Versioning）：
- 主版本号：不兼容的API修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 发布步骤
1. 更新版本号
2. 更新CHANGELOG.md
3. 创建发布分支
4. 运行测试
5. 构建产品
6. 创建标签
7. 发布到VS Code市场

## 问题反馈

### Issue提交指南
- 使用Issue模板
- 提供详细的复现步骤
- 包含错误信息和日志
- 说明运行环境

### Feature Request
- 清晰描述需求
- 解释使用场景
- 提供可能的实现方案

## 社区参与

### 参与方式
- 提交代码
- 改进文档
- 报告问题
- 回答问题
- 参与讨论

### 行为准则
- 尊重所有参与者
- 接受建设性批评
- 关注技术讨论
- 维护友好氛围

## 获取帮助

### 联系方式
- GitHub Issues
- GitHub Discussions
- Email: support@shellsage.com

### 资源链接
- [VS Code API文档](https://code.visualstudio.com/api)
- [TypeScript文档](https://www.typescriptlang.org/docs/)
- [Jest文档](https://jestjs.io/docs/getting-started)

感谢您的贡献！
