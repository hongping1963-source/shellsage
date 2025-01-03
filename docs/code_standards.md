# ShellSage 代码规范

## 代码风格

我们遵循 [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) 的规范。以下是主要规则：

### 1. 文件格式
- 使用 UTF-8 编码
- 使用 Unix 风格的换行符（LF）
- 文件末尾留一个空行
- 最大行长度为 80 个字符

### 2. 缩进和格式化
```bash
# 正确的缩进示例
if [ "$1" -eq 0 ]; then
    echo "参数为零"
else
    echo "参数不为零"
fi

# 函数定义格式
my_function() {
    local my_var="$1"
    echo "$my_var"
}
```

### 3. 命名规范
```bash
# 文件名：小写字母，使用下划线
my_script.sh
test_function.sh

# 函数名：小写字母，使用下划线
parse_input() {
    # 函数实现
}

# 变量名：大写字母，使用下划线
readonly MAX_COUNT=100
local USER_INPUT=""
```

### 4. 注释规范
```bash
# 文件头注释
#!/bin/bash
#
# 简短描述：这个脚本的主要功能
# 详细描述：具体实现的功能和使用方法
# 作者：[作者名]
# 创建日期：[日期]

# 函数注释
#######################################
# 函数的简短描述
# Arguments:
#   $1: 第一个参数的描述
#   $2: 第二个参数的描述
# Returns:
#   返回值的描述
#######################################
function process_data() {
    # 实现代码
}

# 关键逻辑注释
# 检查输入参数的有效性
if [ "$#" -lt 2 ]; then
    echo "错误：需要至少两个参数"
    exit 1
fi
```

## 测试规范

### 1. 单元测试
- 使用 [shunit2](https://github.com/kward/shunit2) 框架
- 测试文件命名：`*_test.sh`
- 测试函数命名：`test_功能名称`

```bash
#!/bin/bash

testAddNumbers() {
    result=$(add_numbers 2 3)
    assertEquals "2 + 3 应该等于 5" "5" "$result"
}

testDivideByZero() {
    result=$(divide_numbers 10 0)
    assertEquals "除以零应该返回错误代码" "1" "$?"
}
```

### 2. 集成测试
- 测试多个组件之间的交互
- 模拟真实环境
- 验证完整的功能流程

### 3. 测试覆盖率要求
- 行覆盖率：≥ 80%
- 分支覆盖率：≥ 80%
- 使用 [kcov](https://github.com/SimonKagstrom/kcov) 工具统计覆盖率

## 代码审查清单

### 1. 功能性
- [ ] 代码实现了预期功能
- [ ] 处理了异常情况
- [ ] 包含适当的错误处理

### 2. 可维护性
- [ ] 代码结构清晰
- [ ] 变量和函数命名合理
- [ ] 注释充分且有意义

### 3. 测试
- [ ] 包含单元测试
- [ ] 包含集成测试
- [ ] 测试覆盖率达标

### 4. 性能
- [ ] 避免不必要的计算
- [ ] 合理使用系统资源
- [ ] 考虑了大数据量情况

## 安全规范

### 1. 输入验证
```bash
# 正确的输入验证示例
validate_input() {
    local input="$1"
    if [[ ! "$input" =~ ^[a-zA-Z0-9_]+$ ]]; then
        echo "错误：输入包含非法字符"
        return 1
    fi
}
```

### 2. 文件操作
```bash
# 安全的文件操作示例
process_file() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "错误：文件不存在"
        return 1
    fi
    if [ ! -r "$file" ]; then
        echo "错误：没有读取权限"
        return 1
    fi
}
```

## 版本控制规范

### 1. 分支命名
- 功能分支：`feature/功能名称`
- 修复分支：`bugfix/问题描述`
- 发布分支：`release/版本号`

### 2. 提交信息格式
```
<类型>: <描述>

[可选的详细描述]

[可选的注释]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
