# Git Workflow Examples

This document demonstrates how ShellSage enhances your Git workflow with intelligent suggestions and error prevention.

## 1. Basic Git Operations

### Creating and Pushing Changes
```bash
# Start a new feature branch
$ git checkout -b
> git checkout -b feature/new-feature
> git checkout -b bugfix/issue-123
> git checkout -b release/v1.0.0

# Making changes and committing
$ git add
> git add .                    # Add all changes
> git add src/                 # Add specific directory
> git add README.md           # Add specific file

# Commit with meaningful message
$ git commit -m
> git commit -m "feat: add new feature"
> git commit -m "fix: resolve issue #123"
> git commit -m "docs: update README"

# Push changes
$ git push
> git push origin feature/new-feature
> git push --set-upstream origin feature/new-feature
```

## 2. Advanced Git Operations

### Managing Branches
```bash
# List branches
$ git branch
> git branch -a               # List all branches
> git branch -r              # List remote branches
> git branch -v              # List branches with last commit

# Clean up branches
$ git branch -d
> git branch -d feature/old-feature
> git branch -D feature/abandoned
> git push origin --delete feature/old-feature
```

### Handling Merge Conflicts
```bash
# When conflicts occur
$ git status                 # Check status
$ git diff                   # View differences
$ git merge --abort          # Abort merge if needed

# After resolving conflicts
$ git add .
$ git commit -m "resolve merge conflicts"
$ git push
```

## 3. Error Prevention

### Common Mistakes and Corrections
```bash
# Typo in branch name
$ git checkout feature/new-featur
> Did you mean? git checkout feature/new-feature

# Wrong remote URL
$ git remote add origin https://github.com/user/repo.git
> Warning: Remote 'origin' already exists
> Suggestion: git remote set-url origin https://github.com/user/repo.git

# Forgot to add files
$ git commit -m "update features"
> Warning: No files added to commit
> Suggestion: git add . && git commit -m "update features"
```

## 4. Advanced Features

### Interactive Rebase
```bash
# Start interactive rebase
$ git rebase -i
> git rebase -i HEAD~3
> git rebase -i master
> git rebase --abort          # If needed

# After rebase
$ git push --force-with-lease  # Safe force push
```

### Stashing Changes
```bash
# Save changes temporarily
$ git stash
> git stash save "work in progress"
> git stash push -m "feature half done"

# Apply stashed changes
$ git stash pop
> git stash apply stash@{0}
> git stash drop stash@{0}
```

## 5. Best Practices

### Commit Message Format
```bash
# Conventional commits
$ git commit -m
> git commit -m "feat(ui): add new button component"
> git commit -m "fix(api): resolve null pointer exception"
> git commit -m "docs(readme): update installation guide"
```

### Branch Management
```bash
# Create feature branch
$ git checkout -b feature/
> git checkout -b feature/user-auth
> git checkout -b feature/payment-integration

# Create release branch
$ git checkout -b release/
> git checkout -b release/v1.0.0
> git checkout -b release/v1.1.0-beta
```

## 6. Tips and Tricks

### Git Aliases
```bash
# Set up aliases
$ git config --global alias.
> git config --global alias.co checkout
> git config --global alias.br branch
> git config --global alias.ci commit
> git config --global alias.st status
```

### Search History
```bash
# Search commit history
$ git log --grep
> git log --grep="feat"
> git log --grep="fix"
> git log --author="username"
```
