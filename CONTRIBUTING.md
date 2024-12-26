# Contributing to ShellSage

First off, thank you for considering contributing to ShellSage! It's people like you that make ShellSage such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check [this list](https://github.com/hongping1963-source/shellsage/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots or animated GIFs if possible
* Include your environment details:
  - VS Code version
  - ShellSage version
  - OS type and version
  - Python version
  - Node.js version

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/hongping1963-source/shellsage/issues). When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful
* List any alternatives you've considered
* Include mockups or examples if applicable

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguides
* Include screenshots and animated GIFs in your pull request whenever possible
* Document new code
* End all files with a newline
* Avoid platform-dependent code
* Ensure your code passes all tests
* Update documentation accordingly

## Development Process

1. Fork the repo
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the tests
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

1. Install VS Code
2. Clone your fork
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run compile
   ```
5. Press F5 in VS Code to start debugging

### Project Structure

```
shellsage/
├── src/                    # Source files
│   ├── extension.ts        # Extension entry point
│   ├── features/          # Feature implementations
│   ├── utils/             # Utility functions
│   └── integrations/      # External integrations
├── test/                  # Test files
├── docs/                  # Documentation
└── scripts/              # Build and maintenance scripts
```

## Coding Standards

### TypeScript Style Guide

* Use TypeScript for all new code
* Follow the [TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)
* Use 2 spaces for indentation
* Use semicolons
* Use single quotes for strings
* Use PascalCase for class names
* Use camelCase for function names
* Use UPPER_CASE for constants
* Add type annotations for function parameters and return types
* Use async/await over raw promises
* Use early returns to reduce nesting
* Keep functions small and focused
* Write self-documenting code
* Add JSDoc comments for public APIs

### Code Quality

* Write unit tests for new code
* Maintain at least 80% code coverage
* Use ESLint and Prettier
* Follow SOLID principles
* Write defensive code
* Handle errors appropriately
* Add logging for important operations
* Optimize performance where necessary

## Git Commit Guidelines

### Commit Message Format

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### Type
Must be one of the following:
* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools

#### Scope
The scope could be anything specifying the place of the commit change, such as:
* config
* terminal
* command
* error
* etc.

#### Subject
The subject contains a succinct description of the change:
* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

### Git Workflow

1. Keep your branch up to date
2. Rebase your branch before merging
3. Squash commits if necessary
4. Write meaningful commit messages
5. Reference issues in commits when applicable

## Additional Notes

### Issue and Pull Request Labels

* `bug`: Something isn't working
* `enhancement`: New feature or request
* `good first issue`: Good for newcomers
* `help wanted`: Extra attention is needed
* `question`: Further information is requested
* `documentation`: Improvements or additions to documentation
* `duplicate`: This issue or pull request already exists
* `invalid`: This doesn't seem right
* `wontfix`: This will not be worked on

### Documentation

* Keep README.md up to date
* Update API documentation
* Add comments to complex code
* Update CHANGELOG.md
* Document breaking changes
* Include examples where appropriate

Thank you for contributing to ShellSage! 🚀
