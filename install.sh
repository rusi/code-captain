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
BASE_URL="https://raw.githubusercontent.com/devobsessed/code-captain/main"
LOCAL_SOURCE=""  # Set this for local testing
VERSION="main"

# Initialize overwrite flags (Agent OS style)
OVERWRITE_FILES=false

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

# Check Windows compatibility and warn users
check_windows_compatibility() {
    # Detect if we're on Windows (but not WSL)
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Running in Git Bash or Cygwin - good!
        print_success "Detected Git Bash/Cygwin - compatible environment ✓"
        return 0
    elif [[ -n "$WSL_DISTRO_NAME" ]] || [[ -f /proc/version ]] && grep -q Microsoft /proc/version 2>/dev/null; then
        # Running in WSL - good!
        print_success "Detected WSL environment - compatible ✓"
        return 0
    elif [[ "$OS" == "Windows_NT" ]]; then
        # Native Windows without bash compatibility
        print_error "❌ Incompatible Windows environment detected!"
        echo ""
        echo "This script requires a bash environment. Please use:"
        echo ""
        echo "✅ RECOMMENDED: Git Bash"
        echo "   Download from: https://git-scm.com/download/win"
        echo "   Then run this script in Git Bash"
        echo ""
        echo "✅ ALTERNATIVE: Windows Subsystem for Linux (WSL)"
        echo "   Enable WSL, then run this script in your Linux distribution"
        echo ""
        echo "❌ PowerShell and Command Prompt are not supported"
        echo ""
        echo "For help, see: ./install.sh --help"
        exit 1
    fi
    # macOS/Linux - no warnings needed
    return 0
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
    
    # Create main .code-captain directory with complete structure
    mkdir -p .code-captain/commands
    mkdir -p .code-captain/integrations/github
    mkdir -p .code-captain/integrations/azure-devops
    mkdir -p .code-captain/specs
    mkdir -p .code-captain/research
    mkdir -p .code-captain/decision-records
    mkdir -p .code-captain/docs
    mkdir -p .code-captain/reports
    
    # Create GitHub sync infrastructure
    mkdir -p .code-captain/state/specs
    mkdir -p .code-captain/state/sync-logs
    mkdir -p .code-captain/work-context
    
    print_success "Enhanced directory structure created with GitHub sync support"
}

# Setup Code Captain command file
setup_cursor_command() {
    print_step "Setting up Code Captain command file..."
    
    # Create .cursor/rules directory
    mkdir -p .cursor/rules
    
    # Download cc.mdc to .cursor/rules/ (small reference file)
    download_file "cc.mdc" ".cursor/rules/cc.mdc" "Cursor command file"
    
    print_success "Code Captain command file installed to .cursor/rules/cc.mdc"
}

# Setup Claude Code compatibility
setup_claude_code_rules() {
    print_step "Setting up Claude Code compatibility..."
    
    # Create config directory if it doesn't exist
    mkdir -p .code-captain/docs
    
    cat > .code-captain/docs/claude-code-integration.md << 'EOF'
# Claude Code Integration Guide

## Code Captain (cc:) Commands

Code Captain provides unified AI development capabilities for Claude Code environments.

### Command Structure
All commands follow the pattern: `cc: [command] "description"`

### Available Commands

#### Project Setup
- `cc: initialize` - Project analysis and setup

#### Analysis & Requirements  
- `cc: create-spec "feature"` - Comprehensive feature specifications
- `cc: create-adr "decision"` - Architecture Decision Records
- `cc: research "topic"` - Systematic technical research
- `cc: explain-code [target]` - Code explanation and documentation

#### Implementation
- `cc: execute-task` - TDD implementation from specifications

#### Enhanced GitHub Workflow
- `cc: generate-tasks` - Generate implementation tasks from specs
- `cc: create-github-issues` - Create GitHub issues from tasks
- `cc: sync` - Advanced bidirectional GitHub sync
- `cc: next-task` - Find best next task to work on
- `cc: start-work <issue>` - Claim task and generate LLM context
- `cc: my-tasks` - Show your current GitHub assignments
- `cc: available-tasks` - Browse unassigned tasks
- `cc: complete-task <issue>` - Mark task complete
- `cc: team-status` - Team coordination overview
- `cc: resolve-conflicts` - Handle sync conflicts

#### Azure DevOps Integration
- `cc: create-azure-work-items` - Create Azure DevOps work items
- `cc: sync-azure-work-items` - Sync with Azure DevOps status

### File Organization
- Commands: `.code-captain/commands/` - Core command documentation
- Integrations: `.code-captain/integrations/` - Platform-specific commands  
- Specs: `.code-captain/specs/` - Requirements, user stories, specifications, tasks
- Research: `.code-captain/research/` - Technical research and analysis
- Decision Records: `.code-captain/decision-records/` - Architecture decisions
- Docs: `.code-captain/docs/` - Generated documentation and guides
- State: `.code-captain/state/` - GitHub sync cache (assignments, available tasks)
- Work Context: `.code-captain/work-context/` - Generated LLM context for active tasks

For complete documentation, see `.code-captain/cc.md`

EOF

    print_success "Claude Code compatibility configured"
}

# Check GitHub CLI availability
check_github_cli() {
    if [ "$PM_SYSTEM" = "github" ]; then
        print_step "Checking GitHub CLI availability..."
        
        if command -v gh >/dev/null 2>&1; then
            print_success "GitHub CLI (gh) found - enhanced workflow available"
            
            # Check if authenticated
            if gh auth status >/dev/null 2>&1; then
                print_success "GitHub CLI is authenticated and ready"
            else
                print_warning "GitHub CLI found but not authenticated"
                echo "💡 Run 'gh auth login' to enable sync operations"
            fi
        else
            print_warning "GitHub CLI (gh) not found - basic integration only"
            echo "💡 Install GitHub CLI for enhanced workflow:"
            echo "   macOS: brew install gh"
            echo "   Linux: See https://cli.github.com/"
            echo "   Windows: winget install GitHub.cli"
        fi
    fi
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
    
    # Check if running non-interactively (like curl | bash)
    if [ ! -t 0 ]; then
        print_warning "Non-interactive installation detected (piped from curl)"
        print_step "Defaulting to GitHub Issues & Projects integration"
        print_warning "To specify a different system, use: PM_SYSTEM=azure-devops curl ... | bash"
        PM_SYSTEM="github"
        print_success "Selected: GitHub Issues & Projects (default)"
        echo ""
        return 0
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

# Download a single file with existence checking (Agent OS style)
download_file() {
    local source_path="$1"
    local dest_path="$2"
    local description="$3"
    local file_existed=false
    
    # Check if file already exists
    if [ -f "$dest_path" ]; then
        file_existed=true
        if [ "$OVERWRITE_FILES" = false ]; then
            echo "  ⚠️  $dest_path already exists - skipping"
            return
        fi
    fi
    
    if [ -n "$LOCAL_SOURCE" ]; then
        # Local source mode
        if [ -f "$LOCAL_SOURCE/$source_path" ]; then
            cp "$LOCAL_SOURCE/$source_path" "$dest_path"
            if [ "$file_existed" = true ]; then
                echo "  ✓ $dest_path (overwritten)"
            else
                echo "  ✓ $dest_path"
            fi
        else
            print_warning "Local file not found: $LOCAL_SOURCE/$source_path"
        fi
    else
        # Remote download mode
        if command -v curl >/dev/null 2>&1; then
            curl -s -o "$dest_path" "${BASE_URL}/$source_path"
            if [ -f "$dest_path" ]; then
                if [ "$file_existed" = true ]; then
                    echo "  ✓ $dest_path (overwritten)"
                else
                    echo "  ✓ $dest_path"
                fi
            else
                print_error "Failed to download: $source_path"
            fi
        else
            print_error "curl not found. Please install curl."
            exit 1
        fi
    fi
}

# Download core files
download_core_files() {
    print_step "Downloading core Code Captain files..."
    
    # Download main reference file
    download_file "cc.md" ".code-captain/cc.md" "Main reference"
    
    # Download docs
    download_file "docs/best-practices.md" ".code-captain/docs/best-practices.md" "Best practices"
    
    print_success "Core files downloaded"
}

# Download command files
download_command_files() {
    print_step "Downloading command files..."
    
    # Core commands
    download_file "commands/create-adr.md" ".code-captain/commands/create-adr.md" "Create ADR command"
    download_file "commands/create-spec.md" ".code-captain/commands/create-spec.md" "Create spec command"
    download_file "commands/execute-task.md" ".code-captain/commands/execute-task.md" "Execute task command"
    download_file "commands/explain-code.md" ".code-captain/commands/explain-code.md" "Explain code command"
    download_file "commands/initialize.md" ".code-captain/commands/initialize.md" "Initialize command"
    download_file "commands/research.md" ".code-captain/commands/research.md" "Research command"
    
    print_success "Command files downloaded"
}

# Download platform-specific files
download_platform_files() {
    print_step "Downloading $PM_SYSTEM integration files..."
    
    # Create integrations directory structure
    mkdir -p .code-captain/integrations
    
    case $PM_SYSTEM in
        "github")
            mkdir -p .code-captain/integrations/github
            download_file "integrations/github/create-github-issues.md" ".code-captain/integrations/github/create-github-issues.md" "GitHub issues command"
            download_file "integrations/github/sync-github-issues.md" ".code-captain/integrations/github/sync-github-issues.md" "GitHub sync command (legacy)"
            download_file "integrations/github/sync.md" ".code-captain/integrations/github/sync.md" "Enhanced GitHub sync"
            download_file "integrations/github/generate-tasks.md" ".code-captain/integrations/github/generate-tasks.md" "Task generation command"
            download_file "integrations/github/workflow-commands.md" ".code-captain/integrations/github/workflow-commands.md" "GitHub workflow commands"
            download_file "integrations/github/resolve-conflicts.md" ".code-captain/integrations/github/resolve-conflicts.md" "Conflict resolution command"
            ;;
        "azure-devops")
            mkdir -p .code-captain/integrations/azure-devops
            download_file "integrations/azure-devops/create-azure-work-items.md" ".code-captain/integrations/azure-devops/create-azure-work-items.md" "Azure DevOps work items command"
            download_file "integrations/azure-devops/sync-azure-work-items.md" ".code-captain/integrations/azure-devops/sync-azure-work-items.md" "Azure DevOps sync command"
            ;;
    esac
    
    print_success "Installed $PM_SYSTEM-specific commands"
}

# Main download function
download_files() {
    if [ -n "$LOCAL_SOURCE" ]; then
        print_warning "Using local source: $LOCAL_SOURCE"
        if [ ! -d "$LOCAL_SOURCE" ]; then
            print_error "Local source directory not found: $LOCAL_SOURCE"
            exit 1
        fi
    fi
    
    # Download all file categories
    download_core_files
    download_command_files
    download_platform_files
    
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
    
    # Check Windows compatibility first
    check_windows_compatibility
    
    # Detect environment
    ENV=$(detect_environment)
    print_step "Detected environment: $ENV"
    
    # Select project management system
    select_project_management_system
    
    # Check GitHub CLI if using GitHub integration
    check_github_cli
    
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
    echo "cc: initialize"
    echo "cc: create-spec \"your feature description\""
    echo "cc: execute-task"
    echo "cc: research \"topic to investigate\""
    echo ""
    echo -e "${YELLOW}Available Commands:${NC}"
    echo "🚀 Project Setup: initialize"
    echo "📋 Analysis: create-spec, create-adr, research, explain-code"  
    echo "💻 Implementation: execute-task"
    echo ""
    echo -e "${BLUE}$PM_SYSTEM Integration:${NC}"
    case $PM_SYSTEM in
        "github")
            echo "📋 Enhanced GitHub Workflow Available:"
            echo "   • cc: generate-tasks - Generate tasks from specs"
            echo "   • cc: sync - Advanced bidirectional sync with cache"
            echo "   • cc: next-task - Find best task to work on"
            echo "   • cc: start-work <issue> - Claim task with LLM context"
            echo "   • cc: my-tasks - Your GitHub assignments"
            echo "   • cc: available-tasks - Browse unassigned work"
            echo "   • cc: team-status - Team coordination overview"
            echo "🔗 GitHub CLI required for sync operations (install with: brew install gh)"
            ;;
        "azure-devops")
            echo "📋 Azure DevOps: cc: create-azure-work-items, cc: sync-azure-work-items"
            echo "🔗 Azure DevOps project integration enabled"
            ;;
    esac
    echo ""
    echo "Check .code-captain/ directory for all configurations and outputs."
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --local)
            LOCAL_SOURCE="$2"
            shift 2
            ;;
        --pm)
            PM_SYSTEM="$2"
            shift 2
            ;;
        --overwrite)
            OVERWRITE_FILES=true
            shift
            ;;
        --version)
            echo "Code Captain 2.0 Installer v2.0.0"
            exit 0
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --local PATH       Use local source directory for testing"
            echo "  --pm SYSTEM        Set project management system (github|azure-devops)"
            echo "  --overwrite        Overwrite existing files"
            echo "  --version          Show version information"
            echo "  --help             Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  PM_SYSTEM          Set project management system for non-interactive installs"
            echo "                     (github|azure-devops, defaults to github for curl | bash)"
            echo ""
            echo "Project Management Systems:"
            echo "  github            GitHub Issues & Projects integration"
            echo "  azure-devops      Azure DevOps Work Items & Boards integration"
            echo ""
            echo "Platform-Specific Instructions:"
            echo ""
            echo "Windows Users:"
            echo "  ⚠️  IMPORTANT: This script requires a bash environment"
            echo "  ✅ Recommended: Use Git Bash (comes with Git for Windows)"
            echo "  ✅ Alternative: Use WSL (Windows Subsystem for Linux)"
            echo "  ❌ Won't work: PowerShell or Command Prompt"
            echo ""
            echo "  Install Git for Windows (includes Git Bash):"
            echo "    https://git-scm.com/download/win"
            echo ""
            echo "  Then run in Git Bash:"
            echo "    curl -sSL https://raw.githubusercontent.com/devobsessed/code-captain/main/install.sh | bash"
            echo ""
            echo "macOS/Linux Users:"
            echo "  ✅ Works in Terminal, iTerm2, or any bash-compatible shell"
            echo ""
            echo "Examples:"
            echo "  $0                           # Interactive installation"
            echo "  $0 --pm github               # Install with GitHub integration"
            echo "  $0 --pm azure-devops         # Install with Azure DevOps integration"
            echo "  $0 --local ./source --pm github  # Local testing with GitHub"
            echo "  $0 --local ./source --overwrite  # Overwrite existing files"
            echo ""
            echo "One-liner installations:"
            echo "  curl -sSL https://raw.githubusercontent.com/devobsessed/code-captain/main/install.sh | bash"
            echo "  PM_SYSTEM=azure-devops curl -sSL https://...../install.sh | bash"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main installation
main 