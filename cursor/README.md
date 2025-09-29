# Code Captain for Cursor IDE

> **AI-first development with built-in agent integration**

Cursor IDE offers the most seamless Code Captain experience with native `.cursor/rules/` integration, automatic command recognition, and built-in AI coordination.

## 🚀 Installation

### Automatic Installation (Recommended)

```bash
npx @devobsessed/code-captain
```

The installer will auto-detect Cursor and install to:

- `.cursor/rules/cc.mdc` - Code Captain identity and behavior rules
- `.cursor/commands/*.md` - Command definitions for native recognition
- `.code-captain/` - Complete workflow system

### Manual Installation

```bash
# Install Cursor rules and commands
cp cursor/cc.mdc .cursor/rules/
cp -r cursor/commands/ .cursor/
cp -r cursor/docs/ .code-captain/
```

## 🎯 Command Syntax

Code Captain commands in Cursor use the `/` slash prefix:

```bash
/initialize
/create-spec "user authentication system"
/execute-task
/status
```

## 🛠️ Available Commands

### 📋 Project Setup & Analysis

- **`/initialize`** - Analyze project and generate foundational documentation
- **`/plan-product "product idea"`** - Comprehensive product planning with vision and roadmap
- **`/research "topic"`** - Systematic 4-phase technical research
- **`/new-command "name" "description"`** - Create custom Code Captain commands

### 📝 Requirements & Planning

- **`/create-spec "feature description"`** - Generate comprehensive feature specifications
- **`/edit-spec [spec-identifier] "changes"`** - Modify existing specifications with impact analysis
- **`/create-experiment "experiment description"`** - Create experiment specifications for prototypes and validation projects
- **`/create-adr "architectural decision"`** - Create Architecture Decision Records (auto-research)
- **`/explain-code [target]`** - Generate code explanations with visual diagrams

### ⚙️ Implementation & Quality

- **`/execute-task`** - Test-driven development workflow with progress tracking
- **`/fix-bug "bug description"`** - Investigate issues, classify problems, and create fix plans
- **`/commit`** - Intelligent git commit with standardized message generation
- **`/status`** - Comprehensive project status and next action recommendations
- **`/swab`** - Apply one small improvement (Boy Scout Rule)

## 🔄 Workflow Examples

### Complete Feature Development

```bash
# 1. Project setup and analysis
/initialize

# 2. Research and planning
/research "WebSocket vs Server-Sent Events for real-time features"
/create-adr "real-time communication architecture"

# 3. Feature specification
/create-spec "real-time chat with message history"

# 4. Implementation
/execute-task
```

### Code Understanding and Cleanup

```bash
# Understand existing code
/explain-code AuthenticationService
/explain-code "src/components/UserDashboard.tsx:45-120"

# Make incremental improvements
/swab

# Check project health
/status
```

## 📁 File Organization

Cursor integration creates this structure:

```text
.cursor/
├── commands/              # Native Cursor command files
│   ├── initialize.md
│   ├── create-spec.md
│   ├── execute-task.md
│   └── ...
└── rules/
    └── cc.mdc              # Code Captain identity & behavior rules

.code-captain/
├── specs/                  # Feature specifications
│   └── YYYY-MM-DD-feature/
│       ├── spec.md
│       ├── spec-lite.md
│       ├── user-stories/
│       ├── sub-specs/
│       └── bugfixes/       # Bug fix documentation and plans
├── experiments/            # Experimental work and prototypes
│   └── YYYY-MM-DD-experiment/
│       ├── experiment.md
│       ├── user-stories/   # Implementation tasks
│       ├── findings/       # Learning capture and results
│       └── research-links.md # Related research connections
├── research/               # Technical research reports
├── decision-records/       # Architecture Decision Records
└── docs/                   # All documentation and best practices
    ├── tech-stack.md
    ├── code-style.md
    └── best-practices.md
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

- Native Cursor integration with automatic environment detection
- Adapts commands and file paths for your specific platform
- Maintains context across command executions

## 🚀 Advanced Usage

### Custom Command Creation

```bash
# Create domain-specific commands
/new-command "audit" "Security and code quality auditing"
/new-command "deploy" "Production deployment workflow"
```

### Specification Management

```bash
# Create and modify specifications
/create-spec "user profile management"
/edit-spec "user-profile-management" "add avatar upload functionality"
```

```bash
# Implementation workflow
/execute-task
```

### Research and Decision Making

```bash
# Systematic research
/research "React state management: Redux vs Zustand vs Context"

# Document architectural decisions
/create-adr "state management library selection"
```

## 📊 Command Reference

| Command           | Purpose                     | Output Location                              |
| ----------------- | --------------------------- | -------------------------------------------- |
| `initialize`      | Project analysis & setup    | `.code-captain/docs/`                        |
| `plan-product`    | Product planning            | `.code-captain/product/`                     |
| `create-spec`     | Feature specification       | `.code-captain/specs/YYYY-MM-DD-feature/`    |
| `create-experiment` | Experiment specification   | `.code-captain/experiments/YYYY-MM-DD-experiment/` |
| `fix-bug`         | Bug investigation & plans   | Spec updates or `.../bugfixes/YYYY-MM-DD-bug/` |
| `execute-task`    | TDD implementation          | Source code + tests                          |
| `commit`          | Intelligent git commits     | Git history with standardized messages      |
| `research`        | Technical research          | `.code-captain/research/`                    |
| `create-adr`      | Architectural decisions     | `.code-captain/decision-records/`            |

## 🛠️ Troubleshooting

### Command Not Recognized

**Problem**: Cursor doesn't recognize `/` commands  
**Solution**: Ensure `.cursor/commands/*.md` and `.cursor/rules/cc.mdc` are properly installed and restart Cursor

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
2. **Start:** `/initialize`
3. **Explore:** `/status` for next steps
