# Code Quality Guide

This guide outlines our code quality standards and practices for the ShellSage project.

## Code Style

We follow the PEP 8 style guide for Python code with some modifications:

- Line length limit: 100 characters
- Use double quotes for strings
- Use trailing commas in multi-line structures
- Follow the [Black](https://black.readthedocs.io/) code style

## Code Quality Tools

### 1. Black (Code Formatter)

Black is our chosen code formatter. It's non-negotiable and enforces a consistent style across the project.

```bash
# Format a single file
poetry run black path/to/file.py

# Format the entire project
poetry run black .
```

### 2. isort (Import Sorter)

isort automatically sorts and formats imports according to our style guide.

```bash
# Sort imports in a file
poetry run isort path/to/file.py

# Sort all project imports
poetry run isort .
```

### 3. Flake8 (Linter)

Flake8 checks for PEP 8 compliance and common programming errors.

```bash
# Check a single file
poetry run flake8 path/to/file.py

# Check the entire project
poetry run flake8
```

### 4. Pylint (Static Code Analyzer)

Pylint performs in-depth code analysis and helps maintain high code quality.

```bash
# Analyze a single file
poetry run pylint path/to/file.py

# Analyze the entire project
poetry run pylint shellsage
```

### 5. MyPy (Type Checker)

MyPy ensures proper type usage throughout the codebase.

```bash
# Check types in a file
poetry run mypy path/to/file.py

# Check types in the entire project
poetry run mypy .
```

### 6. Bandit (Security Linter)

Bandit checks for common security issues in Python code.

```bash
# Scan a single file
poetry run bandit path/to/file.py

# Scan the entire project
poetry run bandit -r .
```

## Pre-commit Hooks

We use pre-commit hooks to automatically check code quality before commits:

```bash
# Install pre-commit hooks
poetry run pre-commit install

# Run hooks manually
poetry run pre-commit run --all-files
```

Our pre-commit configuration includes:
- Code formatting (Black)
- Import sorting (isort)
- Linting (Flake8)
- Type checking (MyPy)
- Security scanning (Bandit)
- Various file checks (trailing whitespace, file endings, etc.)

## VS Code Integration

Our VS Code workspace settings are configured to:
- Format code on save using Black
- Sort imports on save using isort
- Enable real-time linting with Flake8 and Pylint
- Show type checking errors from MyPy
- Run security checks with Bandit

## Code Review Guidelines

### Before Submitting Code

1. **Self-Review Checklist**:
   - [ ] Code follows PEP 8 style guide
   - [ ] All tests pass
   - [ ] Documentation is updated
   - [ ] Type hints are added
   - [ ] Security considerations are addressed
   - [ ] No sensitive data is exposed
   - [ ] Pre-commit hooks pass

2. **Documentation**:
   - Add docstrings to all public functions/methods
   - Update relevant documentation files
   - Include inline comments for complex logic

3. **Testing**:
   - Write unit tests for new functionality
   - Ensure test coverage is maintained
   - Include edge cases in tests

### During Code Review

1. **Code Quality Aspects**:
   - Code readability and maintainability
   - Proper error handling
   - Performance considerations
   - Security implications
   - Type safety
   - Test coverage

2. **Review Comments**:
   - Be specific and constructive
   - Reference relevant documentation
   - Suggest improvements
   - Acknowledge good practices

## Best Practices

### 1. Code Organization

- Keep functions and methods focused and small
- Use meaningful names for variables and functions
- Organize imports logically
- Maintain a clear project structure

### 2. Type Safety

- Use type hints for all function arguments and returns
- Define custom types when appropriate
- Use generic types correctly
- Document type variables

### 3. Error Handling

- Use specific exception types
- Handle errors at appropriate levels
- Log errors with context
- Provide helpful error messages

### 4. Documentation

- Write clear and concise docstrings
- Include examples in docstrings
- Document exceptions and edge cases
- Keep documentation up to date

### 5. Testing

- Write tests before or while writing code
- Test edge cases and error conditions
- Use meaningful test names
- Maintain high test coverage

### 6. Security

- Follow security best practices
- Review code for security implications
- Use secure defaults
- Handle sensitive data carefully

## Continuous Integration

Our CI pipeline checks:
- Code style compliance
- Type safety
- Test coverage
- Documentation build
- Security vulnerabilities

## Measuring Code Quality

We track code quality metrics including:
- Test coverage
- Maintainability index
- Cyclomatic complexity
- Documentation coverage
- Type coverage

## Resources

- [PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/)
- [Black Documentation](https://black.readthedocs.io/)
- [MyPy Documentation](https://mypy.readthedocs.io/)
- [Pylint Documentation](https://pylint.readthedocs.io/)
- [Flake8 Documentation](https://flake8.pycqa.org/)
- [Bandit Documentation](https://bandit.readthedocs.io/)
