#!/bin/bash
#
# Copyright (c) 2025 zhanghongping (zhanghongping@gmail.com)
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#

# Command handling and history management
# Based on the original commandHistory.ts functionality

HISTORY_FILE="$HOME/.shellsage_history"

# Initialize command history
init_command_history() {
    touch "$HISTORY_FILE"
}

# Add command to history
add_to_history() {
    local cmd="$1"
    echo "$cmd" >> "$HISTORY_FILE"
}

# Get command history
get_history() {
    if [ -f "$HISTORY_FILE" ]; then
        cat "$HISTORY_FILE"
    fi
}

# Search command history
search_history() {
    local query="$1"
    grep -i "$query" "$HISTORY_FILE"
}
