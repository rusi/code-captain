#!/bin/bash

# Code Captain 2.0 Installation Script
# Unified AI Development Agent with Workflow Orchestration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/devobsessed/code-captain"
LOCAL_SOURCE=""  # Set this for local testing
VERSION="main"

# Detect environment
detect_environment() {
    local env=""
    
    # Check for Cursor
    if [ -d ".cursor" ] || command -v cursor >/dev/null 2>&1; then
        env="cursor"
    fi
    
    # Check for Claude Code (adjust detection as needed)
    if command -v claude-code >/dev/null 2>&1; then
        env="claude-code"
    fi
    
    # Default to cursor if uncertain
    if [ -z "$env" ]; then
        env="cursor"
    fi
    
    echo "$env"
}

# Print colored output
print_step() {
    echo -e "${BLUE}[Step]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[Success]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

print_error() {
    echo -e "${RED}[Error]${NC} $1"
}

# Create directory structure
create_directories() {
    print_step "Creating Code Captain directory structure..."
    
    # Create main .code-captain directory with simple structure
    mkdir -p .code-captain/commands
    
    print_success "Directory structure created"
}

# Setup Code Captain command file
setup_cursor_command() {
    print_step "Setting up Code Captain command file..."
    
    # Create .cursor/rules directory
    mkdir -p .cursor/rules
    
    # Copy cc.mdc to .cursor/rules/ (small reference file) 
    if [ -n "$LOCAL_SOURCE" ] && [ -f "$LOCAL_SOURCE/cc.mdc" ]; then
        cp "$LOCAL_SOURCE/cc.mdc" .cursor/rules/cc.mdc
        print_success "Code Captain command file installed to .cursor/rules/cc.mdc"
    elif [ -f ".code-captain/cc.mdc" ]; then
        cp .code-captain/cc.mdc .cursor/rules/cc.mdc
        rm .code-captain/cc.mdc  # Remove from .code-captain since it should only be in .cursor/rules
        print_success "Code Captain command file installed to .cursor/rules/cc.mdc"
    else
        print_warning "cc.mdc not found"
    fi
    
    # Ensure cc.md (complete reference) stays in .code-captain/
    if [ -f ".code-captain/cc.md" ]; then
        print_success "Code Captain complete reference available at .code-captain/cc.md"
    else
        print_warning "cc.md not found in .code-captain directory"
    fi
}

# Setup Claude Code compatibility
setup_claude_code_rules() {
    print_step "Setting up Claude Code compatibility..."
    
    cat > .code-captain/config/claude-code.md << 'EOF'
# Claude Code Integration Guide

## Code Captain (@cc) Commands

Code Captain provides unified AI development capabilities for Claude Code environments.

### Command Structure
All commands follow the pattern: `@cc [command] "description"`

### Available Commands

#### Analysis & Requirements
- `@cc analyze-requirements "description"` - Requirements analysis
- `@cc create-user-story "feature"` - User story generation
- `@cc research "topic"` - Technical research
- `@cc investigate-issue "problem"` - Bug investigation

#### Architecture & Design
- `@cc design-system "architecture"` - System design
- `@cc create-adr "decision"` - Architecture decisions
- `@cc review-architecture` - Architecture analysis
- `@cc select-technology "options"` - Technology recommendations

#### Development & Implementation
- `@cc implement-feature "feature"` - Feature implementation
- `@cc refactor-code "target"` - Code refactoring
- `@cc create-tests "target"` - Test generation
- `@cc debug-code "issue"` - Debugging assistance

#### Quality & Testing
- `@cc create-test-strategy "target"` - Testing strategies
- `@cc review-code "location"` - Code reviews
- `@cc validate-implementation "requirements"` - Validation
- `@cc performance-review "target"` - Performance optimization

#### Documentation & Planning
- `@cc create-prd "product"` - Product requirements
- `@cc status-update` - Project status reports
- `@cc create-commit` - Commit message generation
- `@cc workflow-plan "type" "description"` - Complex workflows

### File Organization
- Commands: `.code-captain/commands/` - All available @cc commands
- Specs: `.code-captain/specs/` - Requirements, user stories, ADRs  
- Research: `.code-captain/research/` - Technical research and analysis
- Docs: `.code-captain/docs/` - Generated documentation and guides

EOF

    print_success "Claude Code compatibility configured"
}

# Select project management system
select_project_management_system() {
    if [ -n "$PM_SYSTEM" ]; then
        # Use predefined system (for automation)
        case "$PM_SYSTEM" in
            "github"|"azure-devops")
                print_success "Using predefined project management system: $PM_SYSTEM"
                return 0
                ;;
            *)
                print_error "Invalid project management system: $PM_SYSTEM"
                print_error "Supported systems: github, azure-devops"
                exit 1
                ;;
        esac
    fi
    
    echo ""
    echo -e "${BLUE}Project Management System Selection${NC}"
    echo "=================================="
    echo ""
    echo "Which project management system would you like to use?"
    echo ""
    echo "1) GitHub Issues & Projects"
    echo "   - GitHub Issues for work item tracking"
    echo "   - GitHub Projects for project management"
    echo "   - Integrates with GitHub repositories"
    echo ""
    echo "2) Azure DevOps"
    echo "   - Azure DevOps Work Items (User Stories, Tasks, Bugs)"
    echo "   - Azure DevOps Boards for sprint planning"
    echo "   - Integrates with Azure DevOps repositories"
    echo ""
    
    while true; do
        echo -n "Enter your choice (1-2): "
        read -r choice
        
        case $choice in
            1)
                PM_SYSTEM="github"
                print_success "Selected: GitHub Issues & Projects"
                break
                ;;
            2)
                PM_SYSTEM="azure-devops"
                print_success "Selected: Azure DevOps"
                break
                ;;
            *)
                print_error "Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done
    echo ""
}

# Download source files
download_files() {
    print_step "Downloading Code Captain system files..."
    
    if [ -n "$LOCAL_SOURCE" ]; then
        print_warning "Using local source: $LOCAL_SOURCE"
        if [ -d "$LOCAL_SOURCE" ]; then
            # Copy common files (excluding cc.mdc which goes only to .cursor/rules)
            rsync -av --exclude='cc.mdc' --exclude='platforms/' --ignore-existing "$LOCAL_SOURCE/" .code-captain/
            
            # Copy core commands
            if [ -d "$LOCAL_SOURCE/commands" ]; then
                rsync -av --ignore-existing "$LOCAL_SOURCE/commands/" .code-captain/commands/
            fi
            
            if [ -d "$LOCAL_SOURCE/platforms/$PM_SYSTEM" ]; then
                rsync -av --ignore-existing "$LOCAL_SOURCE/platforms/$PM_SYSTEM/" .code-captain/commands/
                print_success "Installed $PM_SYSTEM-specific commands"
            else
                print_warning "Platform-specific commands not found for: $PM_SYSTEM"
            fi
        else
            print_error "Local source directory not found: $LOCAL_SOURCE"
            exit 1
        fi
    else
        # Download from remote repository to temp location first
        TEMP_DIR=$(mktemp -d)
        if command -v curl >/dev/null 2>&1; then
            curl -sL "$REPO_URL/archive/$VERSION.tar.gz" | tar xz --strip-components=1 -C "$TEMP_DIR"
        elif command -v wget >/dev/null 2>&1; then
            wget -qO- "$REPO_URL/archive/$VERSION.tar.gz" | tar xz --strip-components=1 -C "$TEMP_DIR"
        else
            print_error "Neither curl nor wget found. Please install one of them."
            exit 1
        fi
        
        # Copy common files (excluding cc.mdc which goes only to .cursor/rules)
        rsync -av --exclude='cc.mdc' --exclude='platforms/' --ignore-existing "$TEMP_DIR/source-files/" .code-captain/
        
        # Copy core commands
        if [ -d "$TEMP_DIR/source-files/commands" ]; then
            rsync -av --ignore-existing "$TEMP_DIR/source-files/commands/" .code-captain/commands/
        fi
        
        if [ -d "$TEMP_DIR/source-files/platforms/$PM_SYSTEM" ]; then
            rsync -av --ignore-existing "$TEMP_DIR/source-files/platforms/$PM_SYSTEM/" .code-captain/commands/
            print_success "Installed $PM_SYSTEM-specific commands"
        else
            print_warning "Platform-specific commands not found for: $PM_SYSTEM"
        fi
        
        rm -rf "$TEMP_DIR"
    fi
    
    print_success "Code Captain system files installed for $PM_SYSTEM"
}



# Configuration handled by cc.mdc and cc.md files
create_config() {
    print_step "Code Captain configuration complete..."
    print_success "All configuration handled by cc.mdc and cc.md"
}

# Main installation function
main() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                Code Captain 2.0                             ║"
    echo "║        Unified AI Development Agent System                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Detect environment
    ENV=$(detect_environment)
    print_step "Detected environment: $ENV"
    
    # Select project management system
    select_project_management_system
    
    # Check if already installed
    if [ -d ".code-captain" ]; then
        print_warning "Code Captain already installed. Updating core files only..."
        # Don't remove the directory - preserve user files
    fi
    
    # Create directory structure
    create_directories
    
    # Download source files
    download_files
    
    # Setup environment-specific integration
    case $ENV in
        "cursor")
            setup_cursor_command
            ;;
        "claude-code")
            setup_claude_code_rules
            ;;
        *)
            print_warning "Unknown environment, setting up default configuration"
            setup_cursor_command
            ;;
    esac
    
    # Create simple configuration
    create_config
    
    echo ""
    print_success "Code Captain 2.0 installed successfully with $PM_SYSTEM integration!"
    echo ""
    echo -e "${BLUE}Quick Start:${NC}"
    echo "@cc analyze-requirements \"your project description\""
    echo "@cc workflow-plan feature-development \"your feature\""
    echo "@cc implement-feature \"specific functionality\""
    echo "@cc create-test-strategy \"testing target\""
    echo ""
    echo -e "${YELLOW}Command Categories:${NC}"
    echo "📋 Analysis: analyze-requirements, create-user-story, research"
    echo "🏗️ Architecture: design-system, create-adr, review-architecture"  
    echo "💻 Development: implement-feature, refactor-code, create-tests"
    echo "🔍 Quality: create-test-strategy, review-code, validate-implementation"
    echo "📚 Documentation: create-prd, status-update, create-commit"
    echo ""
    echo -e "${BLUE}Workflow Types:${NC}"
    echo "feature-development, bug-investigation, architecture-review"
    echo ""
    echo -e "${BLUE}$PM_SYSTEM Integration:${NC}"
    case $PM_SYSTEM in
        "github")
            echo "📋 GitHub: @cc create-github-issues, @cc sync-github-issues"
            echo "🔗 GitHub repository integration enabled"
            ;;
        "azure-devops")
            echo "📋 Azure DevOps: @cc create-azure-work-items, @cc sync-azure-work-items"
            echo "🔗 Azure DevOps project integration enabled"
            ;;
    esac
    echo ""
    echo "Check .code-captain/ directory for all configurations and outputs."
}

# Handle command line arguments
case "${1:-}" in
    --local)
        LOCAL_SOURCE="$2"
        shift 2
        # Check for additional parameters
        case "${1:-}" in
            --pm)
                PM_SYSTEM="$2"
                ;;
        esac
        main
        ;;
    --pm)
        PM_SYSTEM="$2"
        shift 2
        # Check for additional parameters
        case "${1:-}" in
            --local)
                LOCAL_SOURCE="$2"
                ;;
        esac
        main
        ;;
    --version)
        echo "Code Captain 2.0 Installer v2.0.0"
        ;;
    --help)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --local PATH       Use local source directory for testing"
        echo "  --pm SYSTEM        Set project management system (github|azure-devops)"
        echo "  --version          Show version information"
        echo "  --help             Show this help message"
        echo ""
        echo "Project Management Systems:"
        echo "  github            GitHub Issues & Projects integration"
        echo "  azure-devops      Azure DevOps Work Items & Boards integration"
        echo ""
        echo "Examples:"
        echo "  $0                           # Interactive installation"
        echo "  $0 --pm github               # Install with GitHub integration"
        echo "  $0 --pm azure-devops         # Install with Azure DevOps integration"
        echo "  $0 --local ./source --pm github  # Local testing with GitHub"
        echo ""
        ;;
    *)
        main
        ;;
esac 