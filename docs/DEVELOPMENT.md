# Development Guide

This guide will help you set up your development environment and understand the development workflow for ShellSage.

## Prerequisites

1. Node.js (v16.x or later)
2. VS Code
3. Git
4. Poetry (Python dependency management)

## Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/hongping1963-source/shellsage.git
   cd shellsage
   ```

2. Set Up Python Environment:
   We use Poetry for dependency management and virtual environments. The project includes setup scripts for both Windows and Unix-like systems.

   #### Windows
   ```powershell
   .\scripts\setup_venv.ps1
   ```

   #### Unix/Linux/MacOS
   ```bash
   chmod +x scripts/setup_venv.sh
   ./scripts/setup_venv.sh
   ```

   This will:
   - Create a virtual environment
   - Install all dependencies
   - Set up pre-commit hooks
   - Configure Poetry for local development

3. Install Node.js Dependencies:
   ```bash
   npm install
   ```

## Project Structure

```
shellsage/
├── .venv/                 # Python virtual environment
├── src/                   # Source code
│   ├── extension.ts       # Extension entry point
│   ├── features/          # Feature implementations
│   └── test/              # Test files
├── python_env/           # Python backend
│   ├── shellsage/       # Python package
│   └── tests/           # Python tests
├── .github/               # GitHub configuration
├── .vscode/              # VS Code configuration
├── docs/                 # Documentation
└── package.json          # Project configuration
```

## Dependency Management

### Python Dependencies

We use Poetry for Python dependency management. The main configuration is in `pyproject.toml`.

#### Adding Dependencies

```bash
# Add a runtime dependency
poetry add package-name

# Add a development dependency
poetry add --group dev package-name
```

#### Updating Dependencies

```bash
# Update all dependencies
poetry update

# Update specific package
poetry update package-name
```

#### Installing Dependencies

```bash
# Install all dependencies
poetry install

# Install only runtime dependencies
poetry install --no-dev
```

### Node.js Dependencies

Node.js dependencies are managed through npm.

#### Adding Dependencies

```bash
# Add a runtime dependency
npm install package-name

# Add a development dependency
npm install --save-dev package-name
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
