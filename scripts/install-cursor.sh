#!/bin/bash

# Code Captain Cursor Installation Script
# Usage: ./scripts/install-cursor.sh /path/to/project

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to extract directories from JSON config using jq
extract_directories() {
    local json="$1"
    echo "$json" | jq -r '.directories[]' 2>/dev/null || echo ""
}

# Function to extract file operations from JSON config using jq
extract_files() {
    local json="$1"
    echo "$json" | jq -r '.files[] | "\(.source)|\(.destination)|\(.isDirectory // false)"' 2>/dev/null || echo ""
}

# Check if target directory is provided
if [ $# -eq 0 ]; then
    print_error "Usage: $0 <target_project_directory>"
    echo "Example: $0 ~/sources/my_project"
    exit 1
fi

TARGET_DIR="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$SCRIPT_DIR/install-config.json"

print_status "Installing Code Captain for Cursor..."
print_status "Target directory: $TARGET_DIR"
print_status "Source directory: $REPO_ROOT"

# Verify target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    print_error "Target directory does not exist: $TARGET_DIR"
    exit 1
fi

# Verify we're in a Code Captain repository
if [ ! -f "$REPO_ROOT/cursor/cc.mdc" ]; then
    print_error "Cannot find cursor files. Make sure you're running this from the Code Captain repository."
    exit 1
fi

# Verify config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    print_error "Configuration file not found: $CONFIG_FILE"
    exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
    print_error "jq is required but not installed. Please install jq to continue."
    print_status "Install jq with:"
    print_status "  macOS: brew install jq"
    print_status "  Ubuntu/Debian: sudo apt-get install jq"
    print_status "  CentOS/RHEL: sudo yum install jq"
    exit 1
fi

# Change to target directory
cd "$TARGET_DIR"
print_status "Working in: $(pwd)"

# Load configuration
CONFIG_CONTENT=$(cat "$CONFIG_FILE")

# Create directory structure
print_status "Creating directory structure..."

# Create directories from config
while IFS= read -r dir; do
    if [ -n "$dir" ]; then
        mkdir -p "$dir"
        print_success "Created directory: $dir"
    fi
done <<< "$(extract_directories "$CONFIG_CONTENT")"

print_success "Directory structure created"

# Install files based on configuration
print_status "Installing files..."

# Process files from config using jq
while IFS='|' read -r SOURCE DEST IS_DIR; do
    if [ -n "$SOURCE" ] && [ -n "$DEST" ]; then
        if [ "$IS_DIR" = "true" ]; then
            print_status "Installing directory: $SOURCE -> $DEST"
            if [ -d "$REPO_ROOT/$SOURCE" ]; then
                cp -r "$REPO_ROOT/$SOURCE"* "$DEST"
                print_success "Directory copied: $SOURCE -> $DEST"
            else
                print_warning "Source directory not found: $REPO_ROOT/$SOURCE"
            fi
        else
            print_status "Installing file: $SOURCE -> $DEST"
            if [ -f "$REPO_ROOT/$SOURCE" ]; then
                cp "$REPO_ROOT/$SOURCE" "$DEST"
                print_success "File copied: $SOURCE -> $DEST"
            else
                print_warning "Source file not found: $REPO_ROOT/$SOURCE"
            fi
        fi
    fi
done <<< "$(extract_files "$CONFIG_CONTENT")"

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    print_warning "No git repository found. Consider running 'git init' to track your changes."
fi

# Code Captain files should be tracked in version control as they represent
# important project artifacts (specs, research, decisions)

# Extract messages from config
SUCCESS_MSG=$(echo "$CONFIG_CONTENT" | jq -r '.messages.success // "Code Captain installation complete!"')
NEXT_STEPS=$(echo "$CONFIG_CONTENT" | jq -r '.messages.nextSteps[]' 2>/dev/null || echo "")
AVAILABLE_COMMANDS=$(echo "$CONFIG_CONTENT" | jq -r '.messages.availableCommands // "Available commands: /initialize, /create-spec, /execute-task, /research, /status, /swab, and more!"')

print_success "$SUCCESS_MSG"
echo ""

# Show installation summary based on what was actually installed
print_status "Installation summary:"
while IFS='|' read -r SOURCE DEST IS_DIR; do
    if [ -n "$SOURCE" ] && [ -n "$DEST" ]; then
        if [ "$IS_DIR" = "true" ]; then
            echo "  ✓ Directory: $DEST"
        else
            echo "  ✓ File: $DEST"
        fi
    fi
done <<< "$(extract_files "$CONFIG_CONTENT")"

echo ""
if [ -n "$NEXT_STEPS" ]; then
    print_status "Next steps:"
    echo "$NEXT_STEPS" | while IFS= read -r step; do
        if [ -n "$step" ]; then
            echo "  $step"
        fi
    done
    echo ""
fi

print_status "$AVAILABLE_COMMANDS"
