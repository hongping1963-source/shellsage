# Linux Commands Examples

This document shows how ShellSage enhances your Linux command-line experience with intelligent suggestions and error prevention.

## 1. File Operations

### Basic File Management
```bash
# List files
$ ls
> ls -la                    # List all files with details
> ls -lh                    # Human readable sizes
> ls -R                     # Recursive listing

# File manipulation
$ cp
> cp file1 file2           # Copy file
> cp -r dir1 dir2          # Copy directory
> cp -p file1 file2        # Preserve attributes

# Move/rename files
$ mv
> mv file1 file2           # Move/rename file
> mv -i file1 file2        # Interactive mode
> mv -b file1 file2        # Backup existing
```

## 2. Directory Operations

### Directory Management
```bash
# Create directories
$ mkdir
> mkdir dirname
> mkdir -p path/to/dir     # Create parent directories
> mkdir dir1 dir2 dir3     # Create multiple

# Remove directories
$ rmdir
> rmdir dirname
> rm -rf dirname           # Force remove
> rm -ri dirname           # Interactive remove
```

## 3. Text Processing

### File Content
```bash
# View file content
$ cat
> cat file.txt
> cat -n file.txt          # Show line numbers
> cat file1 file2          # Concatenate files

# Search in files
$ grep
> grep pattern file
> grep -r pattern dir      # Recursive search
> grep -i pattern file     # Case insensitive
```

## 4. Process Management

### Process Control
```bash
# List processes
$ ps
> ps aux                   # All processes
> ps -ef                   # Full format
> ps -u username          # User processes

# Kill processes
$ kill
> kill PID
> kill -9 PID             # Force kill
> killall process_name
```

## 5. System Information

### System Stats
```bash
# System info
$ top
> top                      # Process viewer
> htop                     # Enhanced top
> free -h                  # Memory usage

# Disk usage
$ df
> df -h                    # Human readable
> du -sh *                # Directory sizes
> ncdu                    # NCurses disk usage
```

## 6. Network Operations

### Network Commands
```bash
# Network status
$ netstat
> netstat -tuln           # TCP/UDP listeners
> netstat -anp            # All connections
> ss -tuln               # Modern alternative

# Network testing
$ ping
> ping hostname
> ping -c 4 hostname      # Count limited
> traceroute hostname
```

## 7. User Management

### User Commands
```bash
# User operations
$ useradd
> useradd username
> useradd -m username     # Create home
> useradd -G group username

# Password management
$ passwd
> passwd username
> chage -l username       # Password info
```

## 8. Permission Management

### File Permissions
```bash
# Change permissions
$ chmod
> chmod 755 file
> chmod u+x file          # Add execute
> chmod -R 644 dir       # Recursive

# Change ownership
$ chown
> chown user:group file
> chown -R user dir      # Recursive
```

## 9. Package Management

### APT Commands
```bash
# Package operations
$ apt
> apt update
> apt upgrade
> apt install package
> apt remove package

# Package search
$ apt search
> apt search keyword
> apt show package
> apt list --installed
```

## 10. Archive Operations

### Compression Commands
```bash
# Create archives
$ tar
> tar -czf archive.tar.gz files
> tar -xzf archive.tar.gz
> tar -tvf archive.tar.gz

# Zip files
$ zip
> zip archive.zip files
> unzip archive.zip
> zip -r archive.zip directory
```

## 11. System Maintenance

### System Commands
```bash
# System updates
$ apt
> apt update && apt upgrade
> apt full-upgrade
> apt autoremove

# System cleanup
$ clean
> apt clean
> apt autoclean
> journalctl --vacuum-time=2d
```

## 12. Advanced Operations

### Find Commands
```bash
# Find files
$ find
> find . -name "*.txt"
> find . -type f -mtime +30
> find . -size +100M

# Execute on files
$ find . -exec
> find . -name "*.txt" -exec grep pattern {} \;
> find . -type f -exec chmod 644 {} \;
```
