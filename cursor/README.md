# Code Captain for Cursor IDE

> **AI-first development with built-in agent integration**

Cursor IDE offers the most seamless Code Captain experience with native `.cursor/rules/` integration, automatic command recognition, and built-in AI coordination.

## 🚀 Installation

### Automatic Installation (Recommended)

```bash
npx @devobsessed/code-captain
```

The installer will auto-detect Cursor and install to:
- `.cursor/rules/cc.mdc` - Command recognition and auto-completion
- `.code-captain/` - Complete workflow system

### Manual Installation

```bash
# Clone or download the cursor/ directory contents
cp cursor/cc.mdc .cursor/rules/
cp -r cursor/ .code-captain/
```

## 🎯 Command Syntax

Code Captain commands in Cursor use the `cc:` prefix:

```bash
cc: initialize
cc: create-spec "user authentication system"
cc: execute-task
cc: status
```

## 🛠️ Available Commands

### 📋 Project Setup & Analysis
- **`cc: initialize`** - Analyze project and generate foundational documentation
- **`cc: plan-product "product idea"`** - Comprehensive product planning with vision and roadmap
- **`cc: research "topic"`** - Systematic 4-phase technical research
- **`cc: new-command "name" "description"`** - Create custom Code Captain commands

### 📝 Requirements & Planning
- **`cc: create-spec "feature description"`** - Generate comprehensive feature specifications
- **`cc: edit-spec [spec-identifier] "changes"`** - Modify existing specifications with impact analysis
- **`cc: create-adr "architectural decision"`** - Create Architecture Decision Records (auto-research)
- **`cc: explain-code [target]`** - Generate code explanations with visual diagrams

### ⚙️ Implementation
- **`cc: execute-task`** - Test-driven development workflow with progress tracking
- **`cc: status`** - Comprehensive project status and next action recommendations
- **`cc: swab`** - Apply one small improvement (Boy Scout Rule)

## 🔄 Workflow Examples

### Complete Feature Development
```bash
# 1. Project setup and analysis
cc: initialize

# 2. Research and planning
cc: research "WebSocket vs Server-Sent Events for real-time features"
cc: create-adr "real-time communication architecture"

# 3. Feature specification
cc: create-spec "real-time chat with message history"

# 4. Implementation
cc: execute-task
```

### Code Understanding and Cleanup
```bash
# Understand existing code
cc: explain-code AuthenticationService
cc: explain-code "src/components/UserDashboard.tsx:45-120"

# Make incremental improvements
cc: swab

# Check project health
cc: status
```

## 📁 File Organization

Cursor integration creates this structure:

```
.cursor/
└── rules/
    └── cc.mdc              # Command recognition file

.code-captain/
├── commands/               # All available commands
├── docs/                   # Generated documentation
├── research/               # Technical research reports
├── decision-records/       # Architecture Decision Records
├── specs/                  # Feature specifications
│   └── YYYY-MM-DD-feature/
│       ├── spec.md
│       ├── user-stories/
│       └── tasks.md
└── cc.md                  # Complete reference guide
```

## 🎯 Cursor-Specific Features

### Native Command Recognition
- Commands auto-complete in the chat interface
- Syntax highlighting for Code Captain commands
- Contextual command suggestions

### Seamless Tool Integration
- Leverages Cursor's native `codebase_search`, `file_search`, `edit_file`
- Automatic progress tracking with `todo_write`
- Parallel tool execution for maximum efficiency

### Smart Context Awareness
- Reads `.code-captain/state.json` for platform and shell detection
- Adapts commands and file paths for your specific environment
- Maintains context across command executions

## 🚀 Advanced Usage

### Custom Command Creation
```bash
# Create domain-specific commands
cc: new-command "audit" "Security and code quality auditing"
cc: new-command "deploy" "Production deployment workflow"
```

### Specification Management
```bash
# Create and modify specifications
cc: create-spec "user profile management"
cc: edit-spec "user-profile-management" "add avatar upload functionality"

# Implementation workflow
cc: execute-task
```

### Research and Decision Making
```bash
# Systematic research
cc: research "React state management: Redux vs Zustand vs Context"

# Document architectural decisions
cc: create-adr "state management library selection"
```

## 🔧 Configuration

### Environment Setup
Code Captain automatically reads your environment from `.code-captain/state.json`:

```json
{
  "platform": "darwin",
  "shell": "/bin/zsh",
  "ide": "cursor"
}
```

## 📊 Command Reference

| Command | Purpose | Output Location |
|---------|---------|-----------------|
| `initialize` | Project analysis & setup | `.code-captain/docs/` |
| `plan-product` | Product planning | `.code-captain/product/` |
| `create-spec` | Feature specification | `.code-captain/specs/YYYY-MM-DD-feature/` |
| `execute-task` | TDD implementation | Source code + tests |


## 🛠️ Troubleshooting

### Command Not Recognized
**Problem**: Cursor doesn't recognize `cc:` commands  
**Solution**: Ensure `.cursor/rules/cc.mdc` exists and restart Cursor

### Commands Execute But No Output
**Problem**: Commands run but don't generate expected files  
**Solution**: Check `.code-captain/` folder permissions and verify command completion

### Task Generation Issues
**Problem**: Task generation produces incomplete results  
**Solution**: Ensure specifications are detailed and requirements are clear

## 🤝 Contributing

Cursor-specific contributions:

1. **Command Enhancement** - Improve Cursor tool integration
2. **Documentation** - Add Cursor-specific examples and patterns
3. **Testing** - Verify commands work across Cursor versions
4. **Integration** - Enhance `.cursor/rules/` functionality

---

**Ready to supercharge your Cursor development?**

1. **Install:** `npx @devobsessed/code-captain`
2. **Start:** `cc: initialize`
3. **Explore:** `cc: status` for next steps 