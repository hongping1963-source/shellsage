#!/bin/bash

# Basic usage example for ShellSage

# Source ShellSage
source "$(dirname "$0")/../src/main.sh"

# Initialize ShellSage
initialize_shellsage

# Example 1: Add commands to history
echo "Example 1: Adding commands to history"
add_to_history "ls -la"
add_to_history "git status"
add_to_history "docker ps"

# Example 2: Search command history
echo -e "\nExample 2: Searching command history"
echo "Searching for 'git' commands:"
search_history "git"

# Example 3: Get AI suggestions
echo -e "\nExample 3: Getting AI suggestions"
echo "Getting suggestions for 'docker':"
get_suggestions "docker"

# Example 4: Configuration
echo -e "\nExample 4: Configuration management"
echo "Current AI model setting:"
get_config "aiModel"
