---
layout: default
title: ShellSage - Intelligent Command-Line Assistant
---

# Welcome to ShellSage

![ShellSage Banner](assets/banner.png)

## Your Intelligent Command-Line Assistant

ShellSage is a powerful VS Code extension that enhances your terminal experience with smart command suggestions, advanced statistics, and intelligent error prevention.

[Get Started](#quick-start){: .btn .btn-primary .mr-2 }
[View on GitHub](https://github.com/hongping1963-source/shellsage){: .btn }

## ✨ Key Features

- 🤖 **Intelligent Command Suggestions**
  - Context-aware completions
  - Pattern recognition
  - Time-based predictions
  
- 📊 **Advanced Analytics**
  - Usage patterns
  - Success rates
  - Command complexity
  
- 🛡️ **Error Prevention**
  - Syntax validation
  - Smart alternatives
  - Common mistake detection
  
- 🎯 **Smart Predictions**
  - Command sequences
  - Project context
  - User preferences

## 🚀 Quick Start

1. Install ShellSage from VS Code Marketplace
2. Open a terminal in VS Code
3. Start typing commands
4. See intelligent suggestions appear

## 📚 Latest Blog Posts

{% for post in site.posts limit:3 %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}

[View all posts](/blog)

## 💡 Example Use Cases

### Git Workflow
```bash
$ git
> git status              # Most common command
> git add .              # Based on status
> git commit -m ""       # Natural sequence
```

### Docker Operations
```bash
$ docker
> docker ps             # Check containers
> docker images         # List images
> docker-compose up     # Project context
```

### NPM Commands
```bash
$ npm
> npm install          # New project
> npm start           # After install
> npm test            # Development
```

## 📈 Why ShellSage?

- **Save Time**: Smart suggestions reduce typing and searching
- **Prevent Errors**: Catch mistakes before they happen
- **Learn Faster**: Discover new commands and best practices
- **Work Smarter**: Let AI enhance your workflow

## 🤝 Join Our Community

- [Star on GitHub](https://github.com/hongping1963-source/shellsage)
- [Report Issues](https://github.com/hongping1963-source/shellsage/issues)
- [Contribute](https://github.com/hongping1963-source/shellsage/blob/master/CONTRIBUTING.md)
- [Read Documentation](/docs)

## 📞 Get Support

Need help? We're here for you!

- [Documentation](/docs)
- [FAQs](/docs/faq)
- [GitHub Issues](https://github.com/hongping1963-source/shellsage/issues)
- [Community Discussions](https://github.com/hongping1963-source/shellsage/discussions)
