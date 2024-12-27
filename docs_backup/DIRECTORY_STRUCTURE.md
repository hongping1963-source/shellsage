# VS Code TheFuck 扩展目录结构

## 根目录文件
```
vscode-thefuck-final/
├── .eslintrc.json          # ESLint 配置文件
├── .gitignore              # Git 忽略文件配置
├── .vscodeignore           # VS Code 打包忽略文件配置
├── CHANGELOG.md            # 变更日志
├── LICENSE                 # MIT 许可证
├── README.md              # 项目说明文档
├── package.json           # NPM 包配置文件
├── package-lock.json      # NPM 依赖锁定文件
├── tsconfig.json          # TypeScript 配置文件
├── webpack.config.js      # Webpack 配置文件
└── vscode-thefuck-1.0.0.vsix  # 打包后的扩展文件
```

## 源代码目录 (src/)
```
src/
├── extension.ts           # 扩展主入口文件
├── utils.ts              # 工具函数
├── features/             # 功能模块
│   └── enhancedCorrection.ts  # 增强的命令纠正功能
├── test/                 # 测试文件
│   ├── suite/           # 测试套件
│   │   ├── extension.test.ts  # 扩展测试
│   │   └── index.ts    # 测试入口
│   └── runTest.ts       # 测试运行器
└── integrations.ts       # 集成功能
```

## 文档目录 (docs/)
```
docs/
├── USER_GUIDE.md         # 用户指南
├── DEVELOPER_GUIDE.md    # 开发者指南
├── TEST_REPORT.md        # 测试报告
├── RELEASE_NOTES.md      # 发布说明
└── DIRECTORY_STRUCTURE.md # 目录结构说明
```

## 资源目录
```
images/                   # 图标和图片资源
└── icon.png             # 扩展图标

python_env/              # Python 环境
├── Lib/                 # Python 库
├── Scripts/             # Python 脚本
└── python.exe           # Python 可执行文件
```

## 构建和输出目录
```
out/                     # TypeScript 编译输出
├── extension.js         # 编译后的扩展代码
├── utils.js            # 编译后的工具函数
└── test/               # 编译后的测试文件

.vscode-test/           # VS Code 测试环境
└── vscode-win32-x64-archive-1.96.2/  # VS Code 测试实例
```

## 配置目录
```
.vscode/                 # VS Code 配置
├── launch.json          # 调试配置
├── tasks.json          # 任务配置
└── settings.json       # 项目设置
```

## 临时和生成的文件
```
node_modules/           # NPM 依赖包
dist/                  # Web 版本构建输出
```

## 目录说明

### 核心开发文件
- `src/`: 包含所有源代码文件
- `test/`: 包含测试相关文件
- `docs/`: 包含所有文档

### 配置文件
- `.eslintrc.json`: ESLint 代码规范配置
- `tsconfig.json`: TypeScript 编译配置
- `webpack.config.js`: Web 版本打包配置

### 构建输出
- `out/`: TypeScript 编译输出
- `dist/`: Web 版本构建输出
- `.vsix`: 打包后的扩展文件

### 环境和依赖
- `python_env/`: 内置 Python 环境
- `node_modules/`: Node.js 依赖包

### 文档和资源
- `docs/`: 项目文档
- `images/`: 图片资源

## 开发工作流

1. 源代码开发
   - 在 `src/` 目录下进行开发
   - 使用 TypeScript 编写代码
   - 遵循 ESLint 规范

2. 测试
   - 在 `test/` 目录下编写测试
   - 使用 `npm test` 运行测试
   - 查看 `docs/TEST_REPORT.md` 了解测试结果

3. 文档
   - 在 `docs/` 目录下更新文档
   - 保持文档与代码同步
   - 记录重要的更改

4. 构建和发布
   - 使用 `npm run compile` 编译代码
   - 使用 `npm run package-web` 构建 Web 版本
   - 使用 `vsce package` 打包扩展

## 注意事项

1. 代码组织
   - 保持目录结构清晰
   - 遵循命名规范
   - 及时更新文档

2. 资源管理
   - 优化资源大小
   - 合理组织静态文件
   - 清理临时文件

3. 版本控制
   - 遵循 Git 工作流
   - 保持提交信息清晰
   - 定期更新依赖
