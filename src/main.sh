#!/bin/bash
#
# Copyright (c) 2025 zhanghongping (zhanghongping@gmail.com)
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#

# ShellSage Main Entry Script
# Author: hongping1963-source
# Description: Main entry point for ShellSage

# Source core modules
source "$(dirname "$0")/core/core.sh"

# Main function
main() {
    # Initialize ShellSage
    initialize_shellsage
    
    # Process command line arguments
    process_arguments "$@"
    
    # Execute main logic
    execute_main_logic
}

# Run main function
main "$@"
