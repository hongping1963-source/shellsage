#!/bin/bash

# ShellSage Installation Script

# Configuration
INSTALL_DIR="/usr/local/shellsage"
BIN_DIR="/usr/local/bin"

# Create installation directory
mkdir -p "$INSTALL_DIR"

# Copy files
cp -r ../src/* "$INSTALL_DIR/"

# Create symlink
ln -sf "$INSTALL_DIR/main.sh" "$BIN_DIR/shellsage"

# Set permissions
chmod +x "$BIN_DIR/shellsage"

echo "ShellSage has been successfully installed!"
