---
layout: default
title: ShellSage Documentation
---

# ShellSage Documentation

Welcome to the ShellSage documentation! Here you'll find everything you need to know about using and customizing ShellSage.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Features](#features)
3. [Configuration](#configuration)
4. [Examples](#examples)
5. [Advanced Usage](#advanced-usage)
6. [API Reference](#api-reference)
7. [Contributing](#contributing)
8. [FAQs](#faqs)

## Getting Started

### Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "ShellSage"
4. Click Install

### Basic Usage

1. Open a terminal in VS Code
2. Start typing a command
3. See intelligent suggestions appear
4. Use arrow keys to select
5. Press Enter to execute

## Features

### Intelligent Command Suggestions

ShellSage provides smart suggestions based on:
- Command history
- Current context
- Time patterns
- Project type
- User preferences

### Advanced Analytics

Access detailed statistics about your command usage:
- Usage patterns
- Success rates
- Error analysis
- Complexity metrics

### Error Prevention

Prevent common mistakes with:
- Syntax validation
- Smart alternatives
- Warning messages
- Best practices

### Smart Predictions

Get intelligent predictions based on:
- Command sequences
- Time-based patterns
- Project context
- User behavior

## Configuration

### Basic Settings

```json
{
    "shellsage.suggestions.enabled": true,
    "shellsage.suggestions.maxItems": 5,
    "shellsage.suggestions.triggerCharacters": ["-", ".", "/"]
}
```

### Advanced Settings

```json
{
    "shellsage.analytics.enabled": true,
    "shellsage.errorPrevention.level": "high",
    "shellsage.predictions.contextWeight": 0.7
}
```

## Examples

Check out our [examples directory](https://github.com/hongping1963-source/shellsage/tree/master/examples) for:
- Git workflows
- Docker operations
- NPM commands
- Linux operations

## Advanced Usage

### Custom Patterns

Define your own command patterns:
```json
{
    "shellsage.patterns": [
        {
            "sequence": ["npm install", "npm start"],
            "name": "setup-project"
        }
    ]
}
```

### Context Rules

Create context-specific suggestions:
```json
{
    "shellsage.contexts": {
        "docker-compose.yml": {
            "suggestions": ["docker-compose up", "docker-compose down"]
        }
    }
}
```

## API Reference

### Command API

```typescript
interface Command {
    name: string;
    description: string;
    usage: string;
    examples: string[];
}
```

### Configuration API

```typescript
interface Config {
    suggestions: SuggestionConfig;
    analytics: AnalyticsConfig;
    errorPrevention: ErrorConfig;
}
```

## Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/hongping1963-source/shellsage/blob/master/CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies
3. Run tests
4. Submit a pull request

## FAQs

### General Questions

**Q: How does ShellSage learn from my commands?**  
A: ShellSage analyzes your command history, success rates, and patterns to provide better suggestions over time.

**Q: Can I use ShellSage offline?**  
A: Yes! ShellSage works completely offline and doesn't require internet connection.

### Troubleshooting

**Q: Why aren't suggestions appearing?**  
A: Check if:
1. ShellSage is enabled
2. You're in a supported terminal
3. Suggestions are configured correctly

**Q: How do I reset my command history?**  
A: Use the command palette (Ctrl+Shift+P) and search for "ShellSage: Reset History"
