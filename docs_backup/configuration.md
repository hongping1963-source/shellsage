---
layout: default
title: Configuration
---

# ShellSage Configuration Guide

ShellSage provides a flexible configuration system that supports multiple configuration methods and formats. This guide explains how to configure ShellSage according to your needs.

## Configuration Methods

### 1. Environment Variables

You can configure ShellSage using environment variables. All environment variables should be prefixed with `SHELLSAGE_`.

Example `.env` file:
```env
SHELLSAGE_AI_API_KEY=your-api-key-here
SHELLSAGE_AI_MODEL=gpt-4
SHELLSAGE_HISTORY_MAX_SIZE=200
```

### 2. Configuration Files

ShellSage supports multiple configuration file formats:

- `.shellsagerc`
- `.shellsage.json`
- `.shellsage.yaml` (recommended)
- `.shellsage.yml`
- `shellsage.config.js`

Example `.shellsage.yaml`:
```yaml
ai:
  model: "gpt-4"
  temperature: 0.8
terminal:
  shell: "powershell.exe"
  showExecutionTime: true
```

### 3. VS Code Settings

You can also configure ShellSage through VS Code settings:

```json
{
  "shellsage.ai.model": "gpt-4",
  "shellsage.terminal.shell": "powershell.exe"
}
```

## Configuration Priority

Configuration values are merged in the following order (later sources override earlier ones):

1. Default configuration (lowest priority)
2. VS Code settings
3. Configuration files
4. Environment variables (highest priority)

## Available Configuration Options

### AI Service

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| ai.endpoint | string | https://api.openai.com/v1 | AI service endpoint |
| ai.model | string | gpt-3.5-turbo | AI model to use |
| ai.temperature | number | 0.7 | Model temperature |
| ai.maxTokens | number | 150 | Maximum tokens per request |
| ai.timeout | number | 10000 | Request timeout in milliseconds |

### History

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| history.maxSize | number | 100 | Maximum number of history entries |
| history.saveInterval | number | 300 | Save interval in seconds |
| history.storageLocation | string | .shellsage/history | History storage location |

### Terminal

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| terminal.shell | string | ${env:SHELL} | Shell to use |
| terminal.encoding | string | utf8 | Terminal encoding |
| terminal.clearBeforeCommand | boolean | false | Clear terminal before each command |
| terminal.showExecutionTime | boolean | true | Show command execution time |

### Logging

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| logging.level | string | info | Log level (error/warn/info/debug/trace) |
| logging.file | string | .shellsage/logs/shellsage.log | Log file location |
| logging.maxFiles | number | 5 | Maximum number of log files |
| logging.maxSize | string | 10MB | Maximum size per log file |

### Security

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| security.allowEnvSecrets | boolean | true | Allow secrets in environment variables |
| security.encryptStorage | boolean | true | Encrypt stored data |
| security.maskSensitiveData | boolean | true | Mask sensitive data in logs |

### Features

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| features.autoCorrection | boolean | true | Enable auto-correction |
| features.suggestions | boolean | true | Enable command suggestions |
| features.analytics | boolean | false | Enable analytics |
| features.telemetry | boolean | false | Enable telemetry |

## Examples

### Basic Configuration

```yaml
ai:
  model: "gpt-4"
  temperature: 0.8
terminal:
  shell: "powershell.exe"
  showExecutionTime: true
logging:
  level: "debug"
```

### Advanced Configuration

```yaml
ai:
  model: "gpt-4"
  temperature: 0.8
  maxTokens: 200
  timeout: 15000

terminal:
  clearBeforeCommand: true
  showExecutionTime: true
  shell: "powershell.exe"

logging:
  level: "debug"
  maxFiles: 10
  maxSize: "20MB"

features:
  autoCorrection: true
  suggestions: true
  analytics: false

aliases:
  gs: "git status"
  gc: "git commit"
  gp: "git push"

patterns:
  - pattern: "^gti"
    replacement: "git"
  - pattern: "^dokcer"
    replacement: "docker"
```

## Best Practices

1. **Sensitive Data**: Store sensitive data (like API keys) in environment variables
2. **Version Control**: Add `.shellsage.yaml` to version control for shared settings
3. **Local Overrides**: Use `.env` for local environment-specific settings
4. **Documentation**: Comment your configuration files for better maintainability
