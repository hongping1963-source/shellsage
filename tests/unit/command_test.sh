#!/bin/bash

# Unit tests for command handling functionality

source "$(dirname "$0")/../../src/core/command.sh"

test_add_to_history() {
    # Setup
    local test_history_file="/tmp/test_history"
    HISTORY_FILE="$test_history_file"
    
    # Test
    add_to_history "test command"
    
    # Assert
    if grep -q "test command" "$test_history_file"; then
        echo "✓ add_to_history: Command was successfully added"
    else
        echo "✗ add_to_history: Command was not added correctly"
        return 1
    fi
    
    # Cleanup
    rm -f "$test_history_file"
}

test_search_history() {
    # Setup
    local test_history_file="/tmp/test_history"
    HISTORY_FILE="$test_history_file"
    echo "test command 1" > "$test_history_file"
    echo "test command 2" >> "$test_history_file"
    
    # Test
    local result
    result=$(search_history "command")
    
    # Assert
    if [ "$(echo "$result" | wc -l)" -eq 2 ]; then
        echo "✓ search_history: Found correct number of results"
    else
        echo "✗ search_history: Incorrect number of results"
        return 1
    fi
    
    # Cleanup
    rm -f "$test_history_file"
}

# Run tests
test_add_to_history
test_search_history
