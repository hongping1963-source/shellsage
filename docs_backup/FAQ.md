# Frequently Asked Questions (FAQ)

## General Questions

### What is ShellSage?
ShellSage is a VS Code extension that automatically detects and corrects command-line errors in your terminal. It's inspired by the popular TheFuck command-line tool but integrated directly into VS Code.

### How does it work?
When you type a command that results in an error, ShellSage analyzes the error message and command history to suggest corrections. It uses pattern matching and machine learning techniques to provide accurate suggestions.

### Which shells are supported?
- PowerShell
- Command Prompt (CMD)
- Bash
- Git Bash
- WSL (Windows Subsystem for Linux)

## Installation & Setup

### How do I install ShellSage?
1. Open VS Code
2. Press Ctrl+P
3. Type `ext install shellsage`
4. Press Enter

### Why isn't ShellSage working?
Common issues:
1. VS Code needs to be restarted after installation
2. Terminal integration might need to be enabled
3. Your shell might not be supported

### Does it work offline?
Yes! ShellSage works completely offline and doesn't require any internet connection.

## Usage

### How do I use ShellSage?
1. Type a command in the terminal
2. If there's an error, ShellSage will automatically suggest a correction
3. Press Enter to accept the suggestion

### Can I customize the correction behavior?
Yes, you can customize:
- Auto-correction settings
- Keyboard shortcuts
- Shell-specific settings
- History size

### How do I disable auto-suggestions?
Go to VS Code settings and set `shellsage.autoCorrect` to `false`.

## Troubleshooting

### Common Issues

#### Issue: Suggestions not appearing
- Check if ShellSage is enabled
- Verify your shell is supported
- Check VS Code's terminal integration settings

#### Issue: Wrong suggestions
- Try updating your command history
- Check shell-specific settings
- Report the issue on GitHub

#### Issue: Performance problems
- Reduce history size
- Disable auto-suggestions
- Update to the latest version

### Error Messages

#### "Shell not supported"
Your current shell is not in the supported list. Try switching to a supported shell.

#### "Command not found"
The command doesn't exist in your system. Check if it's installed and in your PATH.

## Security

### Is it safe to use ShellSage?
Yes! ShellSage:
- Runs everything locally
- Doesn't send data anywhere
- Is open source
- Only corrects commands you approve

### Does it store my commands?
ShellSage only stores command history locally for suggestion purposes. You can clear this history at any time.

## Contributing

### How can I contribute?
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

### Where do I report bugs?
Submit issues on our [GitHub repository](https://github.com/hongping1963-source/shellsage/issues).

## Updates & Maintenance

### How often is ShellSage updated?
We release updates regularly with:
- Bug fixes
- New features
- Security patches
- Performance improvements

### How do I update ShellSage?
VS Code will automatically update extensions, or you can manually update from the Extensions panel.

## Getting Help

### Where can I get help?
- Check this FAQ
- Read the documentation
- Submit an issue on GitHub
- Join our discussions

### How do I contact the developers?
- GitHub Issues
- Email support
- Discussion forums
