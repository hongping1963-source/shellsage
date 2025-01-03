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

我们严格遵循 [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)。详细的代码规范请参考 [代码规范文档](docs/code_standards.md)。

### 代码风格要点
- 使用 UTF-8 编码
- Unix 风格换行符（LF）
- 最大行长度 80 字符
- 使用 4 个空格缩进
- 函数名使用小写字母和下划线
- 变量名使用大写字母和下划线

### 注释规范
- 文件头必须包含版权信息和文件描述
- 函数必须有注释说明功能、参数和返回值
- 复杂逻辑必须有注释说明

### 测试要求
- 单元测试覆盖率不低于 80%
- 使用 shunit2 编写单元测试
- 运行测试命令：
  ```bash
  ./tests/run_tests.sh
  ```

### 提交规范
提交信息格式：
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

## Pull Request 流程

1. **确保代码规范**：
   - 运行代码检查：`shellcheck your_script.sh`
   - 运行所有测试
   - 检查代码风格

2. **更新分支**：
   ```bash
   git fetch origin
   git rebase origin/main
   ```

3. **推送改动**：
   ```bash
   git push origin feature/your-feature-name
   ```

4. **创建 Pull Request**：
   - 访问您的 GitHub 仓库页面
   - 点击 "New Pull Request"
   - 选择您的功能分支
   - 填写 PR 描述，包括：
     - 改动内容概述
     - 相关 issue 链接
     - 测试结果
     - 代码规范检查结果

5. **等待审查**：
   - 维护者会审查您的 PR
   - 根据反馈进行修改
   - PR 被接受后会被合并到主分支

## 问题反馈

使用 GitHub Issues 报告问题时，请提供：
- 问题的具体表现
- 复现步骤
- 期望的行为
- 系统环境信息
- 相关的日志或错误信息

## 开发环境设置

1. **安装依赖**：
   ```bash
   # 安装必要的工具
   sudo apt-get update
   sudo apt-get install shellcheck shunit2 jq
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
