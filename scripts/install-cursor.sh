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

# Check if target directory is provided
if [ $# -eq 0 ]; then
    print_error "Usage: $0 <target_project_directory>"
    echo "Example: $0 ~/sources/my_project"
    exit 1
fi

TARGET_DIR="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

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

# Change to target directory
cd "$TARGET_DIR"
print_status "Working in: $(pwd)"

# Create directory structure
print_status "Creating directory structure..."

mkdir -p .cursor/rules
mkdir -p .cursor/commands
mkdir -p .code-captain/docs

print_success "Directory structure created"

# Copy cursor rules
print_status "Installing cursor rules..."
cp "$REPO_ROOT/cursor/cc.mdc" .cursor/rules/
print_success "Cursor rules installed (.cursor/rules/cc.mdc)"

# Copy cursor commands
print_status "Installing cursor commands..."
cp -r "$REPO_ROOT/cursor/commands/"* .cursor/commands/
print_success "Cursor commands installed (.cursor/commands/)"

# Copy documentation
print_status "Installing documentation..."
cp -r "$REPO_ROOT/cursor/docs/"* .code-captain/docs/
cp "$REPO_ROOT/cursor/PROJECT_README.md" CODE_CAPTAINS.md
print_success "Documentation installed (.code-captain/docs/)"
print_success "Code Captain guide installed (CODE_CAPTAINS.md)"

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
