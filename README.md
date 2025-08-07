# Code Captain: AI Development Partner

> **Your comprehensive AI coding assistant for the complete development lifecycle**

Code Captain is an intelligent development workflow system that guides you through requirements gathering, planning, implementation, and project management. Think of it as your senior technical lead who can analyze requirements, design systems, implement features, and coordinate with external project management tools.

## 🎯 Key Features

**Complete Development Lifecycle Coverage**

- 📋 **Requirements & Planning** - Specifications, user stories, and research
- 🏗️ **Implementation** - Test-driven development with progress tracking
- 🔍 **Project Management** - GitHub and Azure DevOps integration
- 📚 **Documentation** - Organized outputs and comprehensive tracking

**Key Capabilities:**

- 🤖 **Intelligent Workflows** - Systematic approach to feature development
- 📊 **Progress Tracking** - Todo management and status reporting
- 🎯 **Platform Integration** - GitHub Issues, Azure DevOps Work Items
- 🔧 **Tool Coordination** - Leverages Cursor's native tools efficiently

## 🚀 Quick Installation

### NPX Interactive Installer (Recommended) ✨

**Cross-platform interactive installer with beautiful UI:**

```bash
npx @devobsessed/code-captain
```

**Features:**
- 🎨 Beautiful terminal UI with progress indicators
- 🔍 Auto-detection of your IDE environment
- ✅ Cross-platform compatibility (Windows, macOS, Linux)
- 🚀 Interactive selection for Cursor, VS Code, or Windsurf
- 📦 No dependencies - works with just Node.js

**Requirements:** Node.js 16 or higher

### One-Line Installation

**Auto-detect and install:**
```bash
npx @devobsessed/code-captain
```

**Local testing (Development):**
```bash
CC_LOCAL_SOURCE=. npx @devobsessed/code-captain
```

### IDE-Specific Instructions

The installer supports multiple development environments:

- **Cursor** - AI-first editor with built-in agent capabilities (installs to `.code-captain/` + `.cursor/rules/`)
- **VS Code with GitHub Copilot** - Classic VS Code with Copilot extension (installs to `.github/` + `.code-captain/docs/`)
- **Windsurf** - Codeium's AI-powered development environment

The installer will auto-detect your environment and recommend the best option, or you can choose manually during the interactive setup.

### Troubleshooting

#### Common Installation Issues

**Problem**: "npx: command not found"  
**Solution**: Install Node.js from https://nodejs.org/ (version 16 or higher required)

**Problem**: Permission denied errors  
**Solution**: Ensure you have write permissions in the current directory, or use `sudo` if needed (not recommended)

**Problem**: IDE not detected correctly  
**Solution**: The installer will prompt you to manually select your IDE if auto-detection fails

**Problem**: Installation fails to download files  
**Solution**: Check your internet connection or use local source mode: `CC_LOCAL_SOURCE=path npx @devobsessed/code-captain`

**Problem**: IDE can't find the installed commands  
**Solution**: Code Captain installs locally to your project directory (`.code-captain/` + `.cursor/rules/` for Cursor, `.github/` + `.code-captain/docs/` for VS Code, or `windsurf/` for Windsurf). Restart your IDE to load the new configurations.

**Problem**: Installation seems to hang  
**Solution**: Use environment variables for non-interactive installation:
```bash
PM_SYSTEM=github curl -sSL https://raw.githubusercontent.com/devobsessed/code-captain/main/install.sh | bash
```

#### General Issues

**Need to reinstall or update?**
```bash
./install.sh --local . --pm github --overwrite
```

**Want help with all options?**
```bash
./install.sh --help
```

## 🚀 Available Commands

### 📋 Project Setup & Analysis

- **`initialize`** - Analyze greenfield/brownfield projects and generate foundational documentation
- **`plan-product "product idea"`** - Generate comprehensive product planning documentation with vision, roadmap, and business strategy
- **`new-command "name" "description"`** - Create new Code Captain commands following established patterns and conventions
- **`research "topic"`** - Conduct systematic 4-phase research with structured findings
- **`explain-code [target]`** - Generate comprehensive code explanations with visual diagrams

### 📝 Requirements & Planning

- **`create-spec "feature"`** - Generate comprehensive feature specifications with technical details and task breakdown
- **`edit-spec [spec-identifier] "changes"`** - Modify existing feature specifications using contract-first approach with impact analysis
- **`create-adr "architectural decision"`** - Create Architecture Decision Records with systematic research and alternatives analysis. **Automatically executes research workflow if no research exists.**
- **User Stories & Tasks** - Automatically created as part of specifications

### ⚙️ Implementation

- **`execute-task`** - Systematically implement features using Test-Driven Development (TDD) workflow
- **`status`** - Get comprehensive status report when starting work or switching context, analyzing git state, active work, and project health
- **`swab`** - Make one small, focused improvement to the codebase following the "Boy Scout Rule"

### 🔗 Platform Integration

#### GitHub Integration

- **`create-github-issues [spec-path]`** - Create GitHub issues from specifications with full traceability
- **`sync [--full|--my-work-only|--spec]`** - Intelligent bidirectional sync with partitioned cache for optimal performance
- **`sync-github-issues`** - Basic sync to retrieve and save all GitHub issues

#### Azure DevOps

- **`create-azure-work-items [spec-path]`** - Create Azure DevOps work items from specifications
- **`sync-azure-work-items [options]`** - Sync with Azure DevOps and track progress

## 🔄 Workflow Examples

### GitHub Development Workflow

```bash
# 1. Create comprehensive specification
cc: create-spec "user profile dashboard with real-time notifications"

# 2. Create GitHub issues from tasks
cc: create-github-issues

# 3. Sync with GitHub to build cache
cc: sync

# 4. Continue development and sync as needed
cc: sync --my-work-only          # Quick sync of your work
cc: sync --spec user-dashboard   # Sync specific spec only
```

### Product Planning & Research

```bash
# Start with comprehensive product planning
cc: plan-product "enterprise authentication platform with SSO"

# Research technology options
cc: research "OAuth 2.0 vs SAML for enterprise authentication"

# Document the architectural decision
cc: create-adr "OAuth 2.0 vs SAML authentication strategy"

# Create detailed specification based on research and decision
cc: create-spec "enterprise SSO integration"

# Later, modify specifications as requirements evolve
cc: edit-spec "enterprise-sso-integration" "add LDAP directory support"

# Generate implementation tasks
# (Tasks are automatically created as part of specification)
```

### Code Understanding & Analysis

```bash
# Explain complex functions with visual diagrams
cc: explain-code AuthenticationService

# Understand legacy code patterns
cc: explain-code "src/legacy/UserManager.js:45-120"

# Analyze entire modules
cc: explain-code PaymentProcessor
```

### Project Analysis

```bash
# Analyze existing codebase
cc: initialize

# Research integration options
cc: research "API rate limiting strategies"

# Document architectural decision
cc: create-adr "Redis vs in-memory rate limiting implementation"

# Plan new feature based on findings and decision
cc: create-spec "API rate limiting with Redis"

# Clean up code as you go
cc: swab
```

## 📁 Directory Structure

### Source Structure (Repository)

```
code-captain/
├── cc.md                    # Complete Code Captain reference
├── cc.mdc                   # Cursor IDE integration file
├── commands/                # Core development commands
│   ├── create-spec.md      # Feature specification creation
│   ├── create-adr.md       # Architecture Decision Records creation
│   ├── execute-task.md     # TDD implementation workflow
│   ├── explain-code.md     # Code explanation with diagrams
│   ├── initialize.md       # Project setup and analysis
│   ├── research.md         # Systematic research methodology
│   ├── swab.md             # Code cleanup methodology
│   └── new-command.md      # Meta command creation methodology
├── integrations/           # Platform-specific command sources
│   ├── github/             # GitHub Issues & Projects commands
│   │   ├── create-github-issues.md
│   │   ├── sync-github-issues.md
│   │   └── sync.md
│   └── azure-devops/       # Azure DevOps Work Items commands
│       ├── create-azure-work-items.md
│       └── sync-azure-work-items.md
├── docs/                   # Documentation and best practices
├── install.sh              # Installation script
└── README.md               # This file
```

### Installed Structure (Target Project)

```
.code-captain/
├── commands/            # All command documentation (core + platform-specific)
├── docs/               # Generated documentation (created when needed)
├── research/           # Research reports and findings (created when needed)
├── decision-records/   # Architecture Decision Records (created when needed)
├── explanations/       # Code explanations with diagrams (created when needed)
├── specs/              # Feature specifications and requirements (created when needed)
│   └── YYYY-MM-DD-feature-name/
│       ├── spec.md     # Main specification
│       ├── user-stories.md
│       ├── tasks.md    # Implementation breakdown
│       └── sub-specs/  # Technical details
└── cc.md              # Complete reference guide
```

## 🔧 Installation & Setup

### Platform Selection

During installation, choose your project management platform:

- **GitHub Issues & Projects** - Integrates with GitHub repositories
- **Azure DevOps** - Integrates with Azure DevOps work items and boards

### Cursor IDE Integration

The installer automatically:

- Copies `cc.mdc` to `.cursor/rules/` for command recognition
- Installs core commands and platform-specific commands
- Sets up the `.code-captain/` directory structure

### Configuration Files

- **`.cursor/rules/cc.mdc`** - Cursor IDE command reference
- **`.code-captain/cc.md`** - Complete Code Captain documentation
- **`.code-captain/commands/`** - All available command documentation

## 🎮 Usage Examples

### Starting a New Project

```bash
# Analyze the codebase and set up documentation
cc: initialize

# Plan the overall product strategy and vision
cc: plan-product "modern social media platform with real-time features"

# Create custom commands for your workflow
cc: new-command "audit" "Security and code quality auditing"

# Understand existing code patterns
cc: explain-code AuthenticationService

# Research key technology decisions
cc: research "React state management: Redux vs Zustand vs Context"

# Document the architectural decision
cc: create-adr "React state management library selection"

# Create your first feature specification
cc: create-spec "user authentication with social login"
```

### Feature Development Workflow

```bash
# 1. Plan the feature with comprehensive specifications
cc: create-spec "real-time chat with WebSocket integration"

# 2. Document architectural decisions
cc: create-adr "WebSocket vs Server-Sent Events for real-time chat"

# 3. Understand existing patterns before implementing
cc: explain-code WebSocketManager

# 4. Review the generated files:
#    Specifications: .code-captain/specs/2024-12-28-realtime-chat/spec.md
#    ADRs: .code-captain/decision-records/0001-websocket-vs-sse.md
#    Explanations: .code-captain/explanations/2024-12-28-WebSocketManager.md

# 5. Check current status and get oriented
cc: status

# 6. Implement using Test-Driven Development
cc: execute-task

# 7. Create GitHub issues for project tracking
cc: create-github-issues .code-captain/specs/2024-12-28-realtime-chat/

# 8. Monitor progress
cc: sync-github-issues
```

## 🚀 Advanced Features

### Intelligent Documentation

- **Specification Creation**: Comprehensive specs with technical details, database schemas, API docs
- **Architecture Decision Records**: Systematic documentation of architectural decisions with research and alternatives analysis
- **User Story Generation**: INVEST principles with Given-When-Then acceptance criteria
- **Task Breakdown**: TDD-focused implementation tasks with verification steps
- **Code Explanations**: Visual diagrams with intermediate-level technical analysis

### Tool Integration

- **Cursor Native**: Leverages `codebase_search`, `file_search`, `edit_file`, `run_terminal_cmd`
- **Progress Tracking**: Uses `todo_write` for systematic task management
- **Parallel Execution**: Coordinates multiple tools simultaneously for efficiency

### Platform Integration

- **Traceability**: Links specifications to GitHub issues/Azure work items
- **Synchronization**: Bi-directional sync between local specs and project management tools
- **Progress Monitoring**: Real-time status updates and comprehensive reporting

## 🔄 Key Advantages

### vs. Manual AI Prompting

- ✅ **Systematic workflows** vs. ad-hoc requests
- ✅ **Organized documentation** vs. scattered outputs
- ✅ **Project management integration** vs. isolated interactions
- ✅ **Progress tracking** vs. manual status management

### vs. Traditional Development Tools

- ✅ **AI-powered planning** vs. manual specification creation
- ✅ **Integrated TDD workflow** vs. separate testing processes
- ✅ **Automatic issue creation** vs. manual project management setup
- ✅ **Comprehensive documentation** vs. minimal or missing docs

## 📊 Command Reference

### Core Commands

| Command                 | Purpose                                      | Output Location                                |
| ----------------------- | -------------------------------------------- | ---------------------------------------------- |
| `initialize`            | Project analysis & setup                     | `.code-captain/docs/`                          |
| `plan-product "idea"`   | Comprehensive product planning               | `.code-captain/product/`                       |
| `new-command "name" "desc"` | Create new Code Captain commands        | `.code-captain/commands/`                      |
| `create-spec "feature"` | Feature specification                        | `.code-captain/specs/YYYY-MM-DD-feature/`      |
| `edit-spec [id] "changes"` | Modify existing specifications            | `.code-captain/specs/YYYY-MM-DD-feature/`      |
| `create-adr "decision"` | Architecture Decision Record (auto-research) | `.code-captain/decision-records/NNNN-title.md` |
| `research "topic"`      | Technical research                           | `.code-captain/research/`                      |
| `explain-code [target]` | Code explanation with diagrams               | `.code-captain/explanations/`                  |
| `execute-task`          | TDD implementation                           | Source code + tests                            |
| `status`                | Comprehensive status report                   | Clean formatted text with suggested actions   |
| `swab`                  | Small code cleanup (Boy Scout Rule)         | Modified source files                          |

### GitHub Integration

| Command                        | Purpose                  | Requirements             |
| ------------------------------ | ------------------------ | ------------------------ |
| `create-github-issues [path]`  | Create issues from specs | GitHub repo, spec folder |
| `sync-github-issues [options]` | Sync and report status   | GitHub repo access       |

### Azure DevOps Integration

| Command                           | Purpose                      | Requirements                      |
| --------------------------------- | ---------------------------- | --------------------------------- |
| `create-azure-work-items [path]`  | Create work items from specs | Azure DevOps project, spec folder |
| `sync-azure-work-items [options]` | Sync and report status       | Azure DevOps access               |

## 🛠 Development & Customization

### Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/devobsessed/code-captain.git
cd code-captain

# Install from local source
./install.sh --local . --pm github

# Test with your preferred platform
./install.sh --local . --pm azure-devops
```

### Command Structure

Each command follows a documented structure:

- **Overview** - Purpose and capabilities
- **Usage** - Command syntax and examples
- **Process** - Step-by-step workflow
- **Tool Integration** - Cursor tool coordination
- **Output Organization** - File structure and locations

### Adding Platform Support

To add a new platform (e.g., Jira, Linear):

1. Create `integrations/your-platform/`
2. Add platform-specific commands following existing patterns
3. Update install script platform selection
4. Test integration and documentation

## 🔮 Roadmap

### Short Term

- [ ] **Additional Platform Support** - Jira, Linear, Asana integrations
- [ ] **Enhanced Templates** - More specification and task templates
- [ ] **Improved Analytics** - Better progress tracking and reporting

### Medium Term

- [ ] **Team Collaboration** - Multi-developer workflow coordination
- [ ] **AI Model Integration** - Support for different AI providers
- [ ] **Enterprise Features** - Organization-wide templates and standards

### Long Term

- [ ] **Intelligent Automation** - Self-adapting workflows based on project patterns
- [ ] **Cross-Project Insights** - Learning from historical project data
- [ ] **Advanced Integrations** - Deep IDE and toolchain integration

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-platform-support`
3. **Follow existing patterns**: Commands, documentation structure, install integration
4. **Test thoroughly**: Verify install script and command functionality
5. **Submit pull request**: Include documentation and usage examples

### Areas for Contribution

- **Platform Integrations**: Jira, Linear, Asana, Notion
- **Command Enhancements**: New workflows, templates, automation
- **Documentation**: Examples, tutorials, best practices
- **Testing**: Command validation, integration testing

---

**Transform your development process with intelligent, organized workflows.**

_Ready to get started? Run `./install.sh` and begin with `cc: initialize`_
