#!/bin/bash

# Integration tests for full workflow

source "$(dirname "$0")/../../src/main.sh"

test_full_workflow() {
    # Setup
    local test_config_dir="/tmp/shellsage_test"
    mkdir -p "$test_config_dir"
    
    # Test initialization
    if initialize_shellsage; then
        echo "✓ Initialization successful"
    else
        echo "✗ Initialization failed"
        return 1
    fi
    
    # Test command history
    add_to_history "test command"
    if [ "$(get_history | tail -n1)" = "test command" ]; then
        echo "✓ Command history working"
    else
        echo "✗ Command history failed"
        return 1
    fi
    
    # Test AI integration
    if [ -n "$(get_suggestions 'test command')" ]; then
        echo "✓ AI suggestions working"
    else
        echo "✗ AI suggestions failed"
        return 1
    fi
    
    # Cleanup
    rm -rf "$test_config_dir"
}

# Run integration tests
test_full_workflow
