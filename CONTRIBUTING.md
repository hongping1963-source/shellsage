# 贡献指南

欢迎参与 ShellSage 的开发！以下是贡献指南，帮助您快速上手。

## 如何参与贡献

1. **Fork 仓库**：点击 GitHub 页面右上角的 "Fork" 按钮，将仓库复制到您的账户。

2. **克隆仓库**：
   ```bash
   git clone https://github.com/您的用户名/shellsage.git
   cd shellsage
   ```

3. **创建分支**：
   ```bash
   git checkout -b feature/your-feature-name
   # 或者
   git checkout -b bugfix/your-bugfix-name
   ```

## 开发规范

### 代码风格
- 遵循 Shell 脚本最佳实践
- 使用 4 个空格进行缩进
- 函数名使用小写字母和下划线
- 变量名使用大写字母和下划线
- 添加适当的注释说明代码功能

### 提交规范
提交信息应该清晰描述改动内容，建议使用以下格式：

```
<类型>: <描述>

[可选的详细描述]

[可选的关闭 issue]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat: 添加命令历史搜索功能

- 实现命令历史的本地存储
- 添加模糊搜索功能
- 优化搜索结果展示

Closes #123
```

### 测试规范
- 为新功能添加单元测试
- 确保所有测试通过
- 运行测试命令：
  ```bash
  ./tests/run_tests.sh
  ```

## Pull Request 流程

1. **更新分支**：
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **推送改动**：
   ```bash
   git push origin feature/your-feature-name
   ```

3. **创建 Pull Request**：
   - 访问您的 GitHub 仓库页面
   - 点击 "New Pull Request"
   - 选择您的功能分支
   - 填写 PR 描述，包括：
     - 改动内容概述
     - 相关 issue 链接
     - 测试结果
     - 其他相关信息

4. **等待审查**：
   - 维护者会审查您的 PR
   - 根据反馈进行修改
   - PR 被接受后会被合并到主分支

## 问题反馈

- 使用 GitHub Issues 报告 bug 或提出新功能建议
- 描述问题时请尽可能详细，包括：
  - 问题的具体表现
  - 复现步骤
  - 期望的行为
  - 系统环境信息

## 开发环境设置

1. **安装依赖**：
   ```bash
   # 安装必要的工具
   sudo apt-get update
   sudo apt-get install shellcheck jq
   ```

2. **配置开发环境**：
   ```bash
   # 配置 git hooks
   cp scripts/pre-commit .git/hooks/
   chmod +x .git/hooks/pre-commit
   ```

## 版权声明

通过提交 PR，您同意将您的代码以 MIT 许可证的形式贡献给本项目。请确保您提交的代码是原创的，或者您有权将其贡献给本项目。

## 联系方式

如有任何问题，请联系项目维护者：
- 邮箱：zhanghongping@gmail.com
- GitHub：[@zhanghongping](https://github.com/hongping1963-source)

感谢您的贡献！

# Contributing to ShellSage

We love your input! We want to make contributing to ShellSage as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
