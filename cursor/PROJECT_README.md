# Code Captain: Your AI Development Partner

> **Comprehensive AI coding assistant for the complete development lifecycle**

Code Captain is an intelligent development workflow system that guides you through requirements gathering, planning, implementation, and project management. It transforms ad-hoc AI prompting into systematic, organized workflows for professional software development.

## 🎯 What Code Captain Provides

- **📋 Systematic Workflows** - Structured approaches to common development tasks
- **🏗️ Complete Lifecycle Coverage** - From requirements to deployment
- **🔍 Documentation & Tracking** - Organized outputs and progress tracking
- **📚 Project Organization** - Everything has its place and purpose

Instead of scattered AI interactions, Code Captain provides proven workflows for:

- **Requirements & Planning** - Specifications, user stories, research, and architectural decisions
- **Implementation** - Test-driven development with progress tracking
- **Project Management** - Seamless integration with external tools
- **Documentation** - Comprehensive, organized outputs

## 🎮 Available Commands

All commands use the `/` slash prefix in Cursor:

### 📋 Project Setup & Analysis

- **`/initialize`** - Analyze project and generate foundational documentation
- **`/plan-product "product idea"`** - Comprehensive product planning with vision and roadmap
- **`/research "topic"`** - Systematic 4-phase technical research
- **`/status`** - Comprehensive project status and next action recommendations

### 📝 Requirements & Planning

- **`/create-spec "feature description"`** - Generate comprehensive feature specifications
- **`/edit-spec [spec-identifier] "changes"`** - Modify existing specifications with impact analysis
- **`/create-adr "architectural decision"`** - Create Architecture Decision Records with auto-research
- **`/explain-code [target]`** - Generate code explanations with visual diagrams

### ⚙️ Implementation & Quality

- **`/execute-task`** - Test-driven development workflow with progress tracking
- **`/commit`** - Intelligent git commit with standardized message generation
- **`/swab`** - Apply one small improvement (Boy Scout Rule)
- **`/new-command "name" "description"`** - Create custom Code Captain commands

## 🚀 Getting Started

### First Time Setup

1. **Initialize your project:**
   ```text
   /initialize
   ```
   This analyzes your codebase and creates foundational documentation.

2. **Plan your next feature:**
   ```text
   /plan-product "enhanced user dashboard"
   # OR
   /create-spec "user authentication system"
   ```

3. **Check your project status:**
   ```text
   /status
   ```

### Daily Development Workflow

```text
# Morning: Check project status
/status

# Research before building
/research "WebSocket vs Server-Sent Events for real-time features"

# Document architectural decisions
/create-adr "real-time communication strategy"

# Create detailed specifications
/create-spec "real-time chat system"

# Implement with TDD
/execute-task

# Commit your progress
/commit

# Clean up as you go
/swab
```

## 📁 Project Organization

Code Captain organizes all work in your project:

```text
.cursor/
├── commands/              # Native Cursor command files
└── rules/
    └── cc.mdc              # Code Captain identity & behavior rules

.code-captain/
├── specs/                  # Feature specifications
│   └── YYYY-MM-DD-feature/
│       ├── spec.md         # Main specification
│       ├── spec-lite.md    # AI context summary
│       ├── user-stories/   # Individual user story files
│       └── sub-specs/      # Technical details
├── research/               # Technical research reports
├── decision-records/       # Architecture Decision Records
└── docs/                   # Project documentation
    ├── tech-stack.md       # Technology decisions
    ├── code-style.md       # Code conventions
    └── best-practices.md   # Development guidelines
```

## 🔄 Complete Workflow Examples

### Feature Development

```bash
# 1. Project setup (first time)
/initialize

# 2. Research and planning
/research "WebSocket vs Server-Sent Events for real-time features"
/create-adr "real-time communication architecture"

# 3. Feature specification
/create-spec "real-time chat with message history"

# 4. Implementation
/execute-task

# 5. Check progress
/status
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

### Project Analysis

```bash
# Analyze existing codebase
/initialize

# Plan new features based on analysis
/plan-product "enhanced user experience"

# Research technical approaches
/research "modern React state management patterns"
```

## 🎯 Cursor-Specific Features

### Native Integration

- **Command Auto-completion** - Commands appear in Cursor's chat interface
- **Syntax Highlighting** - Code Captain commands are recognized
- **Tool Integration** - Uses Cursor's `codebase_search`, `file_search`, `edit_file`
- **Progress Tracking** - Automatic `todo_write` integration
- **Context Awareness** - Maintains context across command executions

### Workflow Benefits

- **Organized Development** - No more scattered AI conversations
- **Progress Visibility** - Track what's done and what's next
- **Team Coordination** - Shared specifications and decisions
- **Knowledge Capture** - Research and decisions are preserved
- **Quality Assurance** - TDD workflows and systematic approaches

## 📊 Command Reference

| Command        | Purpose                  | Output Location                           |
| -------------- | ------------------------ | ----------------------------------------- |
| `initialize`   | Project analysis & setup | `.code-captain/docs/`                     |
| `plan-product` | Product planning         | `.code-captain/product/`                  |
| `create-spec`  | Feature specification    | `.code-captain/specs/YYYY-MM-DD-feature/` |
| `execute-task` | TDD implementation       | Source code + tests                       |
| `commit`       | Intelligent git commits  | Git history with standardized messages    |
| `research`     | Technical research       | `.code-captain/research/`                 |
| `create-adr`   | Architectural decisions  | `.code-captain/decision-records/`         |

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

## 🚀 Key Advantages

### vs. Manual AI Prompting

- ✅ **Systematic workflows** vs. ad-hoc requests
- ✅ **Organized documentation** vs. scattered outputs
- ✅ **Progress tracking** vs. manual status management
- ✅ **Reusable patterns** vs. starting from scratch

### vs. Traditional Development Tools

- ✅ **AI-powered planning** vs. manual specification creation
- ✅ **Integrated TDD workflow** vs. separate testing processes
- ✅ **Comprehensive documentation** vs. minimal or missing docs
- ✅ **Intelligent analysis** vs. manual code review

## 📈 Best Practices

1. **Start with `/initialize`** - Understand your project foundation
2. **Use `/status` frequently** - Stay oriented and focused
3. **Research before building** - Use `/research` for technical decisions
4. **Document decisions** - Use `/create-adr` for architectural choices
5. **Specify before implementing** - Use `/create-spec` for detailed planning
6. **Clean as you go** - Use `/swab` for incremental improvements

## 💡 Pro Tips

- **Morning routine**: Start each day with `/status` to get oriented
- **Before meetings**: Use `/explain-code` to understand complex components
- **Planning sessions**: Use `/research` and `/plan-product` for strategic decisions
- **Code reviews**: Use `/swab` to make incremental improvements
- **Feature planning**: Always start with `/create-spec` for complex features

---

**Transform your development process with intelligent, organized workflows.**

**Ready to begin?** Start with `/initialize` to analyze your project and create foundational documentation.
