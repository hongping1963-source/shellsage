# NPM Workflow Examples

This document demonstrates how ShellSage enhances your NPM workflow with intelligent suggestions and error prevention.

## 1. Project Initialization

### Creating New Projects
```bash
# Initialize new project
$ npm init
> npm init                  # Interactive mode
> npm init -y               # Default values
> npm init @scope          # Scoped package

# Set up configuration
$ npm config
> npm config set init-author-name "Your Name"
> npm config set init-license "MIT"
> npm config set init-version "0.1.0"
```

## 2. Package Management

### Installing Packages
```bash
# Install dependencies
$ npm install
> npm install package-name
> npm install -D package-name  # Dev dependency
> npm install -g package-name  # Global install

# Install specific versions
$ npm install package@
> npm install package@latest
> npm install package@1.2.3
> npm install package@^1.2.3
```

## 3. Script Management

### Running Scripts
```bash
# Run scripts
$ npm run
> npm run start
> npm run build
> npm run test

# Common script shortcuts
$ npm
> npm start
> npm test
> npm restart
```

## 4. Version Management

### Updating Packages
```bash
# Check updates
$ npm outdated
> npm outdated
> npm update
> npm update package-name

# Version bumping
$ npm version
> npm version patch
> npm version minor
> npm version major
```

## 5. Publishing Packages

### Package Publishing
```bash
# Publish package
$ npm publish
> npm publish
> npm publish --access public
> npm publish --tag beta

# Managing tags
$ npm dist-tag
> npm dist-tag add package@version tag
> npm dist-tag rm package tag
```

## 6. Dependency Management

### Managing Dependencies
```bash
# List dependencies
$ npm list
> npm list
> npm list --depth=0
> npm list package-name

# Remove packages
$ npm uninstall
> npm uninstall package-name
> npm uninstall -g package-name
> npm uninstall -D package-name
```

## 7. Security

### Security Audits
```bash
# Audit packages
$ npm audit
> npm audit
> npm audit fix
> npm audit fix --force

# Update vulnerable packages
$ npm update
> npm update --save
> npm update --save-dev
```

## 8. Cache Management

### Managing Cache
```bash
# Clean cache
$ npm cache
> npm cache clean --force
> npm cache verify
> npm cache ls
```

## 9. Workspace Management

### Monorepo Operations
```bash
# Workspace commands
$ npm workspace
> npm workspace package-name install
> npm workspace package-name run build
> npm workspace package-name test
```

## 10. Best Practices

### Code Quality
```bash
# Linting
$ npm run lint
> npm run lint
> npm run lint:fix
> npm run lint:watch

# Testing
$ npm test
> npm test
> npm run test:watch
> npm run test:coverage
```

### Build Process
```bash
# Building project
$ npm run build
> npm run build
> npm run build:prod
> npm run build:dev
```

## 11. Common Patterns

### Development Workflow
```bash
# Development server
$ npm run dev
> npm run dev
> npm run serve
> npm run start:dev

# Production build
$ npm run
> npm run build:prod
> npm run deploy
> npm run start:prod
```

### Package Maintenance
```bash
# Check package health
$ npm doctor
> npm doctor
> npm ping
> npm check
```
