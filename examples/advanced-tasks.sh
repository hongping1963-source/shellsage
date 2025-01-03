#!/bin/bash

# Advanced usage example for ShellSage

# Source ShellSage
source "$(dirname "$0")/../src/main.sh"

# Initialize with custom configuration
echo "Setting up custom configuration..."
set_config "historySize" 2000
set_config "suggestionDelay" 0.3

# Example 1: Command chaining with history
echo -e "\nExample 1: Command chaining"
add_to_history "find . -type f -name '*.log'"
add_to_history "grep 'ERROR' *.log"
add_to_history "tail -f application.log"

# Get suggestions for log analysis
echo "Getting suggestions for log analysis commands:"
get_suggestions "analyze logs with errors"

# Example 2: Custom AI integration
echo -e "\nExample 2: Custom AI integration"
# Set custom AI model
set_config "aiModel" "custom"
get_suggestions "optimize docker container"

# Example 3: Advanced history search
echo -e "\nExample 3: Advanced history search"
echo "Searching for complex commands:"
search_history "find.*grep.*tail"
