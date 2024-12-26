# Development Guide

This guide will help you set up your development environment and start contributing to ShellSage.

## Prerequisites

1. Node.js (v16.x or later)
2. VS Code
3. Git

## Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/hongping1963-source/shellsage.git
   cd shellsage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Open in VS Code:
   ```bash
   code .
   ```

## Project Structure

```
shellsage/
├── src/                    # Source code
│   ├── extension.ts        # Extension entry point
│   ├── features/          # Feature implementations
│   └── test/              # Test files
├── .github/               # GitHub configuration
├── .vscode/              # VS Code configuration
├── docs/                 # Documentation
└── package.json          # Project configuration
```

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them:
   - Press F5 in VS Code to launch the extension in debug mode
   - Use the Extension Development Host to test your changes

3. Run tests:
   ```bash
   npm test
   ```

4. Build the extension:
   ```bash
   npm run compile
   ```

5. Package the extension:
   ```bash
   npm run package
   ```

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Add comments for complex logic
- Write unit tests for new features
- Update documentation as needed

## Testing

### Running Tests
```bash
npm test
```

### Writing Tests
- Place test files in the `src/test` directory
- Name test files with `.test.ts` extension
- Use the VS Code extension testing framework

## Debugging

1. Set breakpoints in your code
2. Press F5 to start debugging
3. Use the Debug Console to view output
4. Check the Extension Development Host Output panel

## Common Issues

### Issue: Extension not loading
- Check if all dependencies are installed
- Ensure TypeScript is compiling correctly
- Check the VS Code Developer Tools console

### Issue: Tests failing
- Ensure test environment is properly set up
- Check if all dependencies are installed
- Verify test data is available

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a release branch
4. Run tests and build
5. Create a GitHub release
6. Publish to VS Code Marketplace

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [VS Code Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)

## Getting Help

- Check existing [issues](https://github.com/hongping1963-source/shellsage/issues)
- Join our [discussions](https://github.com/hongping1963-source/shellsage/discussions)
- Contact the maintainers
