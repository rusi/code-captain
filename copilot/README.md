# Code Captain for GitHub Copilot + VS Code

> **Classic VS Code with AI-powered chat modes and prompts**

Transform GitHub Copilot Chat into a structured development workflow system with custom chat modes, prompts, and organized documentation.

## 🚀 Installation

### Automatic Installation (Recommended)

```bash
npx @devobsessed/code-captain
```

The installer will detect VS Code with Copilot and install to:
- `.github/chatmodes/` - Code Captain chat mode
- `.github/prompts/` - Workflow prompt templates
- `.code-captain/` - Complete workflow system

### Manual Installation

```bash
# Clone or download the copilot/ directory contents to .github/
cp -r copilot/chatmodes/ .github/chatmodes/
cp -r copilot/prompts/ .github/prompts/
cp -r .code-captain/ .
```

## 🎯 Command Syntax

Code Captain integrates with Copilot Chat through a custom chat mode. After installation:

1. **Select Code Captain chat mode** from the chat mode dropdown
2. **Use slash commands** directly:

```bash
/initialize
/create-spec "user authentication system"
/execute-task
/status
```

## 📁 Chat Modes & Prompts

### Chat Mode
Located in `.github/chatmodes/`:

- **Code Captain.chatmode.md** - Automatically available in chat mode selector

### Available Prompts
Located in `.github/prompts/`:

- **`create-spec.prompt.md`** - Feature specification creation
- **`create-adr.prompt.md`** - Architecture Decision Records
- **`execute-task.prompt.md`** - Test-driven development workflow
- **`initialize.prompt.md`** - Project setup and analysis
- **`plan-product.prompt.md`** - Product planning and strategy
- **`research.prompt.md`** - Systematic technical research
- **`explain-code.prompt.md`** - Code explanation with diagrams
- **`status.prompt.md`** - Project status analysis
- **`swab.prompt.md`** - Code cleanup methodology
- **`edit-spec.prompt.md`** - Specification modification
- **`new-command.prompt.md`** - Custom command creation

## 🛠️ Available Workflows

### 📋 Project Setup & Analysis
- **Initialize Project** - Analyze codebase and generate documentation
- **Product Planning** - Comprehensive product strategy and roadmap
- **Technical Research** - Systematic 4-phase research methodology
- **Custom Commands** - Create domain-specific workflows

### 📝 Requirements & Planning
- **Feature Specifications** - Comprehensive specs with technical details
- **Architecture Decisions** - ADRs with research and alternatives analysis
- **Code Explanations** - Visual diagrams and technical analysis
- **Specification Editing** - Contract-first modification approach

### ⚙️ Implementation
- **Test-Driven Development** - Systematic TDD workflow
- **Project Status** - Comprehensive status analysis
- **Code Cleanup** - Small improvements following Boy Scout Rule

## 🔄 Workflow Examples

### Using the Chat Mode

1. **Open Copilot Chat** in VS Code
2. **Select "Code Captain"** from the chat mode dropdown
3. **Type:** `/initialize`
4. **Follow the prompts** for project analysis
5. **Review generated files** in `.code-captain/docs/`

### Using Prompts Directly

1. **Open a prompt file** (e.g., `.github/prompts/create-spec.prompt.md`)
2. **Copy the prompt** content
3. **Paste in Copilot Chat** (any mode)
4. **Provide your feature description**

### Complete Feature Development

```bash
# Select "Code Captain" chat mode, then:

# 1. Project setup
/initialize

# 2. Research phase
/research "React state management options"

# 3. Document decision
/create-adr "React state management library selection"

# 4. Create specification
/create-spec "user dashboard with real-time notifications"

# 5. Implementation
/execute-task

# 6. Status check
/status
```

## 📁 File Organization

Copilot integration creates this structure:

```
.github/
├── chatmodes/
│   └── Code Captain.chatmode.md
└── prompts/
    ├── create-spec.prompt.md
    ├── create-adr.prompt.md
    ├── execute-task.prompt.md
    ├── initialize.prompt.md
    ├── plan-product.prompt.md
    ├── research.prompt.md
    ├── explain-code.prompt.md
    ├── status.prompt.md
    ├── swab.prompt.md
    ├── edit-spec.prompt.md
    └── new-command.prompt.md

.code-captain/
├── docs/                  # Generated documentation
├── research/              # Technical research reports
├── decision-records/      # Architecture Decision Records
├── specs/                 # Feature specifications
└── cc.md                 # Complete reference guide
```

## 🎯 Copilot-Specific Features

### Custom Chat Modes
- **Structured workflows** through chat mode activation
- **Context-aware responses** based on project state
- **Guided interactions** with step-by-step processes

### Prompt Templates
- **Reusable workflows** for consistent outputs
- **Copy-paste convenience** for complex processes
- **Customizable templates** for team standards

### GitHub Integration
- **Repository-based configuration** through `.github/` structure
- **Team collaboration** through shared chat modes and prompts
- **Version-controlled workflows** alongside your codebase


## 📊 Command Reference

| Slash Command | Purpose | Output Location |
|---------------|---------|-----------------|
| `/initialize` | Project analysis | `.code-captain/docs/` |
| `/create-spec` | Feature specification | `.code-captain/specs/` |
| `/status` | Project status | Terminal output |
| `/research` | Technical research | `.code-captain/research/` |

## 🛠️ Troubleshooting

### Chat Mode Not Available
**Problem**: Code Captain doesn't appear in chat mode selector  
**Solution**: Ensure `.github/chatmodes/Code Captain.chatmode.md` exists and restart VS Code

### Prompts Don't Work as Expected
**Problem**: Prompts generate inconsistent results  
**Solution**: Copy the exact prompt text and include all context sections

### File Generation Issues
**Problem**: Files aren't created in expected locations  
**Solution**: Check `.code-captain/` folder exists and has write permissions

## 🤝 Contributing

Copilot-specific contributions:

1. **Chat Mode Enhancement** - Improve workflow integration
2. **Prompt Templates** - Add new workflow templates
3. **Documentation** - Add Copilot-specific examples
4. **GitHub Integration** - Enhance repository templates

---

**Ready to enhance your Copilot workflow?**

1. **Install:** `npx @devobsessed/code-captain`
2. **Open:** Copilot Chat in VS Code
3. **Start:** Select "Code Captain" mode and type `/initialize` 