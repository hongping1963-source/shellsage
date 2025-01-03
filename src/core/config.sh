#!/bin/bash

# Configuration management
# Based on the original configuration.ts functionality

CONFIG_FILE="$HOME/.shellsage/config"

# Default configuration
DEFAULT_CONFIG='{
    "historySize": 1000,
    "suggestionDelay": 0.5,
    "enableAI": true,
    "aiModel": "deepseek"
}'

# Initialize configuration
init_config() {
    mkdir -p "$(dirname "$CONFIG_FILE")"
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "$DEFAULT_CONFIG" > "$CONFIG_FILE"
    fi
}

# Get configuration value
get_config() {
    local key="$1"
    jq -r ".$key" "$CONFIG_FILE"
}

# Set configuration value
set_config() {
    local key="$1"
    local value="$2"
    local temp_config
    temp_config=$(jq ".$key = $value" "$CONFIG_FILE")
    echo "$temp_config" > "$CONFIG_FILE"
}
