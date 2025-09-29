# Code Captain: AI Development Partner

> **Your comprehensive AI coding assistant for the complete development lifecycle**

Code Captain is an intelligent development workflow system that guides you through requirements gathering, planning, implementation, and project management. Think of it as your senior technical lead who can analyze requirements, design systems, implement features, and coordinate with external project management tools.

## 🎯 What is Code Captain?

Code Captain transforms how you work with AI development assistants by providing:

- **📋 Systematic Workflows** - Structured approaches to common development tasks
- **🏗️ Complete Lifecycle Coverage** - From requirements to deployment
- **🔍 Documentation & Tracking** - Organized outputs and progress tracking
- **📚 Organized Documentation** - Everything has its place and purpose

Instead of ad-hoc AI prompting, Code Captain provides proven workflows for:

- **Requirements & Planning** - Specifications, user stories, research, and architectural decisions
- **Implementation** - Test-driven development with progress tracking
- **Project Management** - Seamless integration with external tools
- **Documentation** - Comprehensive, organized outputs

## 🚀 Quick Installation

**Cross-platform interactive installer:**

```bash
npx @devobsessed/code-captain
```

The installer will:

- 🔍 Auto-detect your development environment
- 🎯 Install the appropriate Code Captain integration
- 📦 Set up the complete workflow system
- ✅ Configure everything for immediate use

**Requirements:** Node.js 16 or higher

## 🛠️ Supported Development Environments

Code Captain integrates with multiple AI-powered development environments. Choose your platform:

### [Cursor IDE](cursor/README.md)

_AI-first development with built-in agent system_

- Native `.cursor/rules/` integration
- Command recognition and auto-completion
- Seamless workflow execution
- **→ [Cursor Setup Guide](cursor/README.md)**

### [GitHub Copilot + VS Code](copilot/README.md)

_Classic VS Code with Copilot Chat integration_

- Custom chat modes and prompts
- `.github/` repository integration
- Team collaboration features
- **→ [Copilot Setup Guide](copilot/README.md)**

### [Claude.dev](claude-code/README.md)

_VS Code extension for Claude integration_

- Direct Claude API integration
- Custom agent configurations
- Flexible workflow execution
- **→ [Claude.dev Setup Guide](claude-code/README.md)**

## 🎮 Core Commands (All Platforms)

### 📋 Project Setup & Analysis

- **`initialize`** - Analyze and set up project documentation
- **`plan-product "idea"`** - Comprehensive product planning
- **`research "topic"`** - Systematic technical research
- **`new-command "name" "desc"`** - Extend Code Captain

### 📝 Requirements & Planning

- **`create-spec "feature"`** - Feature specifications with technical details
- **`edit-spec [id] "changes"`** - Modify existing specifications
- **`create-experiment "experiment"`** - Experiment specifications for prototypes and validation
- **`create-adr "decision"`** - Architecture Decision Records with research
- **`explain-code [target]`** - Code explanations with diagrams

### ⚙️ Implementation

- **`execute-task`** - Test-driven development workflow
- **`fix-bug "bug description"`** - Bug investigation and fix planning
- **`commit`** - Intelligent git commits with standardized messages
- **`status`** - Comprehensive project status
- **`swab`** - Small code improvements

_Command syntax and execution varies by IDE - see platform-specific documentation_

## 🔄 Workflow Examples

### Feature Development

```bash
# 1. Research and plan
/research "WebSocket vs Server-Sent Events"
/create-adr "real-time communication strategy"

# 2. Create comprehensive specification
/create-spec "real-time chat system"

# 3. Implement with TDD
/execute-task
```

### Project Analysis

```bash
# Analyze existing codebase
/initialize

# Plan new features based on analysis
/plan-product "enhanced user dashboard"

# Clean up as you go
/swab
```

## 📁 Directory Structure

After installation, Code Captain creates an organized workspace:

```text
.code-captain/
├── commands/            # All available commands
├── docs/               # Generated documentation
├── research/           # Technical research reports
├── decision-records/   # Architecture Decision Records
├── specs/              # Feature specifications with bugfix plans
├── experiments/        # Experimental work and prototypes
└── cc.md              # Complete reference guide
```

Plus IDE-specific integration files in:

- `.cursor/rules/` (Cursor)
- `.github/` (Copilot)
- `.claude/` (Claude.dev)

## 🔧 Platform-Specific Setup

Each development environment has its own setup process and command syntax:

| Platform       | Installation Location | Command Format | Documentation                             |
| -------------- | --------------------- | -------------- | ----------------------------------------- |
| **Cursor**     | `.cursor/commands/`   | `/command`     | [Cursor Guide](cursor/README.md)          |
| **Copilot**    | `.github/`            | `/command`     | [Copilot Guide](copilot/README.md)        |
| **Claude.dev** | `.claude/`            | `/command`     | [Claude.dev Guide](claude-code/README.md) |

## 🚀 Key Advantages

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

## 🛠 Development & Customization

### Local Development

```bash
# Clone and test locally
git clone https://github.com/devobsessed/code-captain.git
cd code-captain

# Install from local source
CC_LOCAL_SOURCE=. npx @devobsessed/code-captain
```

### Adding Platform Support

1. Create `platform-name/` directory
2. Add platform-specific commands and documentation
3. Update installer platform detection
4. Create platform-specific README

## 🔮 Roadmap

- **Additional Platforms** - Neovim, Emacs, JetBrains IDEs
- **Enhanced Templates** - More workflows and automation
- **Team Collaboration** - Multi-developer coordination
- **Enterprise Features** - Organization-wide standards

## 🤝 Contributing

1. **Fork the repository**
2. **Choose your platform** - Add support for new IDEs or enhance existing ones
3. **Follow existing patterns** - Command structure, documentation, installation
4. **Test thoroughly** - Verify installer and platform integration
5. **Submit pull request** - Include platform-specific documentation

---

**Transform your development process with intelligent, organized workflows.**

**Ready to get started?**

1. **Install:** `npx @devobsessed/code-captain`
2. **Choose your IDE** from the links above
3. **Begin with:** `/initialize`
