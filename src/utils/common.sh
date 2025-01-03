#!/bin/bash

# Common utility functions
# Based on the original utils.ts functionality

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Safe JSON parsing
parse_json() {
    if command_exists jq; then
        echo "$1" | jq -r "$2"
    else
        echo "Error: jq is required but not installed"
        return 1
    fi
}

# Logging utilities
log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1" >&2
}

log_debug() {
    if [ "${DEBUG:-false}" = "true" ]; then
        echo "[DEBUG] $1"
    fi
}
