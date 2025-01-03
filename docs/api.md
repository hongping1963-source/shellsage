# ShellSage API 参考文档

## 核心 API

### 命令历史管理

#### `add_to_history`
将命令添加到历史记录中。

```bash
add_to_history "command_string"
```

参数：
- `command_string`: 要记录的命令字符串

返回值：
- 成功返回 0
- 失败返回非 0 值

#### `search_history`
搜索命令历史。

```bash
search_history "search_term"
```

参数：
- `search_term`: 搜索关键词

返回值：
- 匹配的命令列表

### 配置管理

#### `get_config`
获取配置项的值。

```bash
get_config "config_key"
```

参数：
- `config_key`: 配置项的键名

返回值：
- 配置项的值

#### `set_config`
设置配置项的值。

```bash
set_config "config_key" "config_value"
```

参数：
- `config_key`: 配置项的键名
- `config_value`: 配置项的值

返回值：
- 成功返回 0
- 失败返回非 0 值

### AI 集成

#### `get_suggestions`
获取命令建议。

```bash
get_suggestions "command_string"
```

参数：
- `command_string`: 用户输入的命令

返回值：
- 建议命令的列表

## 工具函数

### `validate_input`
验证用户输入。

```bash
validate_input "input_string"
```

参数：
- `input_string`: 要验证的输入字符串

返回值：
- 有效返回 0
- 无效返回非 0 值

### `log_message`
记录日志信息。

```bash
log_message "message" "level"
```

参数：
- `message`: 日志消息
- `level`: 日志级别（INFO/WARNING/ERROR）

返回值：
- 成功返回 0
- 失败返回非 0 值

## 错误代码

| 代码 | 描述 |
|------|------|
| 0 | 成功 |
| 1 | 一般错误 |
| 2 | 无效参数 |
| 3 | 文件不存在 |
| 4 | 权限不足 |
| 5 | 配置错误 |

## 配置项

| 配置键 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| history_size | 整数 | 1000 | 历史记录最大条数 |
| suggestion_delay | 浮点数 | 0.5 | 建议延迟时间(秒) |
| enable_ai | 布尔值 | true | 是否启用 AI |
| log_level | 字符串 | "INFO" | 日志级别 |

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| SHELLSAGE_HOME | ShellSage 安装目录 | /usr/local/shellsage |
| SHELLSAGE_CONFIG | 配置文件路径 | ~/.shellsage/config |
| SHELLSAGE_HISTORY | 历史文件路径 | ~/.shellsage/history |
| SHELLSAGE_LOG | 日志文件路径 | ~/.shellsage/shellsage.log |
