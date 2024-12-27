---
layout: default
title: ShellSage - Your Intelligent Terminal Companion
---

# Welcome to ShellSage

ShellSage is your intelligent terminal companion in VS Code, designed to make your command-line experience smoother and more productive. Powered by advanced AI technology, it helps you catch errors, learn best practices, and become more efficient with the command line.

## 🚀 Key Features

### 🔍 Intelligent Command Detection
- Real-time error detection and correction
- Syntax validation and suggestions
- Context-aware command analysis

### 💡 Smart Suggestions
- Command optimization recommendations
- Parameter suggestions
- Best practice tips

### 🛠 Automatic Error Correction
- Typo detection and correction
- Common mistake prevention
- Learning from your patterns

### 📊 Context-Aware Analysis
- Understanding your workflow
- Project-specific suggestions
- Personalized recommendations

## 🎯 Perfect For

- **Developers**: Streamline your development workflow
- **DevOps Engineers**: Optimize your deployment commands
- **System Administrators**: Manage systems more efficiently
- **Students**: Learn command-line best practices

## 🚦 Quick Start

1. **Install from VS Code Marketplace**
   ```bash
   code --install-extension shellsage
   ```

2. **Configure (Optional)**
   - Set up your preferred AI model
   - Customize auto-correction preferences
   - Configure security settings

3. **Start Using**
   - Open your terminal in VS Code
   - Type commands as usual
   - Let ShellSage assist you automatically!

## 📚 Documentation

<div class="doc-grid">
  <div class="doc-card">
    <h3>📖 User Guide</h3>
    <p>Learn how to use ShellSage effectively</p>
    <a href="{{ '/docs/user-guide' | relative_url }}" class="btn">Read More</a>
  </div>

  <div class="doc-card">
    <h3>🔧 Installation</h3>
    <p>Get started with ShellSage</p>
    <a href="{{ '/docs/installation' | relative_url }}" class="btn">Read More</a>
  </div>

  <div class="doc-card">
    <h3>❓ FAQ</h3>
    <p>Common questions and answers</p>
    <a href="{{ '/docs/faq' | relative_url }}" class="btn">Read More</a>
  </div>

  <div class="doc-card">
    <h3>🤝 Contributing</h3>
    <p>Join our development community</p>
    <a href="{{ '/docs/contributing' | relative_url }}" class="btn">Read More</a>
  </div>
</div>

## 📊 Project Status

Visit our [Project Status]({{ '/docs/project-status' | relative_url }}) page to:
- See implemented features
- Check upcoming features
- View development roadmap
- Track recent updates

## 🌟 Latest Updates

{% for post in site.posts limit:3 %}
<div class="update-card">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <time>{{ post.date | date: "%B %d, %Y" }}</time>
  <p>{{ post.excerpt }}</p>
</div>
{% endfor %}

## 🤝 Contributing

We welcome contributions from the community! Check out our [Contributing Guide]({{ '/docs/contributing' | relative_url }}) to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE]({{ '/LICENSE' | relative_url }}) file for details.

<style>
.doc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.doc-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.update-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.update-card time {
  color: #666;
  font-size: 0.9em;
}
</style>
