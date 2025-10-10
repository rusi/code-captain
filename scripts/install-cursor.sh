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

# Function to extract directories from JSON config
extract_directories() {
    local json="$1"
    echo "$json" | sed -n '/"directories":\[/,/\]/p' | grep -o '"[^"]*"' | tr -d '"' | grep -v '^directories$'
}

# Function to extract file operations from JSON config
extract_files() {
    local json="$1"
    echo "$json" | sed -n '/"files":\[/,/\]/p' | grep -E '"(source|destination|isDirectory)"' | while IFS= read -r line; do
        echo "$line"
    done
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
    fi
done <<< "$(extract_directories "$CONFIG_CONTENT")"

print_success "Directory structure created"

# Install files based on configuration
print_status "Installing files..."

# Process files from config using sed
echo "$CONFIG_CONTENT" | sed -n '/"files":\[/,/\]/p' | while IFS= read -r line; do
    if echo "$line" | grep -q '"source"'; then
        SOURCE=$(echo "$line" | sed 's/.*"source": *"\([^"]*\)".*/\1/')
    elif echo "$line" | grep -q '"destination"'; then
        DEST=$(echo "$line" | sed 's/.*"destination": *"\([^"]*\)".*/\1/')
    elif echo "$line" | grep -q '"isDirectory"'; then
        IS_DIR=$(echo "$line" | sed 's/.*"isDirectory": *\([^,}]*\).*/\1/')
        
        # Process the file/directory
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
done

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    print_warning "No git repository found. Consider running 'git init' to track your changes."
fi

# Code Captain files should be tracked in version control as they represent
# important project artifacts (specs, research, decisions)

print_success "Code Captain installation complete!"
echo ""
print_status "Installation summary:"
echo "  ✓ Cursor rules: .cursor/rules/cc.mdc"
echo "  ✓ Commands: .cursor/commands/*.md"
echo "  ✓ Documentation: .code-captain/docs/"
echo "  ✓ Code Captain guide: CODE_CAPTAINS.md"
echo ""
print_status "Next steps:"
echo "  1. Restart Cursor IDE to recognize new commands"
echo "  2. Try running: /initialize"
echo "  3. Use /status to check your project state"
echo ""
print_status "Available commands: /initialize, /create-spec, /execute-task, /research, /status, /swab, and more!"
