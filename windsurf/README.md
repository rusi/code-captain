# Code Captain for Windsurf

> **Codeium's AI-powered development environment with custom workflow integration**

Windsurf provides advanced AI capabilities with custom workflow integration, built-in context management, and intelligent code coordination.

## 🚀 Installation

### Automatic Installation (Recommended)

```bash
npx @devobsessed/code-captain
```

The installer will detect Windsurf and install to:
- `.windsurf/` - Custom workflows and rules
- `.code-captain/` - Complete workflow system

### Manual Installation

```bash
# Clone or download the windsurf/ directory contents to .windsurf/
cp -r windsurf/ .windsurf/
cp -r .code-captain/ .
```

## 🎯 Workflow Integration

Code Captain in Windsurf uses custom workflow files that integrate with Windsurf's AI system:

### Available Workflows
Located in `.windsurf/workflows/`:

- **`initialize.md`** - Project setup and analysis
- **`create-spec.md`** - Feature specification creation
- **`create-adr.md`** - Architecture Decision Records
- **`execute-task.md`** - Test-driven development
- **`explain-code.md`** - Code explanation with diagrams
- **`status.md`** - Project status analysis
- **`edit-spec.md`** - Specification modification
- **`new-command.md`** - Custom command creation

### Workflow Rules
Located in `.windsurf/rules/`:

- **`cc.md`** - Core Code Captain rules and guidelines

## 🛠️ Available Workflows

### 📋 Project Setup & Analysis
- **Initialize Project** - Comprehensive project analysis and documentation setup
- **Product Planning** - Strategic product planning with roadmap generation
- **Technical Research** - Systematic 4-phase research methodology
- **Custom Commands** - Create domain-specific workflow extensions

### 📝 Requirements & Planning
- **Feature Specifications** - Detailed specs with technical implementation details
- **Architecture Decisions** - ADRs with systematic research and alternatives analysis
- **Code Explanations** - Visual diagrams with comprehensive technical analysis
- **Specification Editing** - Contract-first approach to specification modifications

### ⚙️ Implementation
- **Test-Driven Development** - Systematic TDD workflow with progress tracking
- **Project Status** - Comprehensive status analysis with actionable recommendations
- **Code Cleanup** - Incremental improvements following the Boy Scout Rule

## 🔄 Workflow Examples

### Project Initialization

1. **Open Windsurf** and navigate to your project
2. **Reference the initialize workflow**: `.windsurf/workflows/initialize.md`
3. **Follow the systematic process** for project analysis
4. **Review generated documentation** in `.code-captain/docs/`

### Feature Development

1. **Research Phase**
   - Use `.windsurf/workflows/create-adr.md` for architectural decisions
   - Reference research methodology from workflows

2. **Specification Phase**
   - Follow `.windsurf/workflows/create-spec.md`
   - Generate comprehensive feature specifications

3. **Implementation Phase**
   - Use `.windsurf/workflows/execute-task.md`
   - Follow TDD methodology with progress tracking

4. **Status Monitoring**
   - Reference `.windsurf/workflows/status.md`
   - Get comprehensive project health analysis

### Code Understanding

1. **Code Explanation**
   - Use `.windsurf/workflows/explain-code.md`
   - Generate visual diagrams and technical analysis

2. **Incremental Improvements**
   - Follow best practices from `.windsurf/rules/cc.md`
   - Apply small, focused improvements

## 📁 File Organization

Windsurf integration creates this structure:

```
.windsurf/
├── workflows/
│   ├── initialize.md
│   ├── create-spec.md
│   ├── create-adr.md
│   ├── execute-task.md
│   ├── explain-code.md
│   ├── status.md
│   ├── edit-spec.md
│   └── new-command.md
└── rules/
    └── cc.md

.code-captain/
├── commands/              # Reference documentation
├── docs/                  # Generated documentation
├── research/              # Technical research reports
├── decision-records/      # Architecture Decision Records
├── specs/                 # Feature specifications
│   └── YYYY-MM-DD-feature/
│       ├── spec.md
│       ├── user-stories/
│       └── tasks.md
└── cc.md                 # Complete reference guide
```

## 🎯 Windsurf-Specific Features

### Custom Workflow Integration
- **Workflow-based execution** aligned with Windsurf's AI coordination
- **Context-aware processing** using Windsurf's advanced context management
- **Intelligent file organization** with automatic workspace awareness

### Advanced AI Coordination
- **Multi-step workflow execution** with AI guidance
- **Context preservation** across workflow phases
- **Intelligent tool selection** based on workflow requirements

### Built-in Best Practices
- **Critical thinking guidelines** from `windsurf/rules/cc.md`
- **Systematic approaches** to complex development tasks
- **Quality-focused workflows** with verification steps

## 🚀 Advanced Usage

### Custom Workflow Creation

Create new workflows in `.windsurf/workflows/`:

```markdown
# Custom Workflow

## Overview
[Describe workflow purpose and capabilities]

## Process
[Detail step-by-step workflow execution]

## Tool Integration
[Specify Windsurf tool coordination]

## Output Organization
[Define file structure and locations]
```

### Rule Customization

Enhance `.windsurf/rules/cc.md` with team-specific guidelines:

```markdown
## Team-Specific Rules

### Code Standards
[Define team coding standards]

### Review Process
[Specify review requirements]

### Documentation Standards
[Define documentation expectations]
```

### Workflow Chaining

Chain workflows for complex development processes:

1. **Initialize** → **Research** → **Create ADR**
2. **Create Spec** → **Execute Task** → **Status Check**
3. **Explain Code** → **Swab** → **Status Update**

## 🔧 Configuration

### Windsurf Settings
Configure Windsurf to optimize Code Captain integration:

- **Enable advanced context management**
- **Configure AI coordination preferences**
- **Set up workspace awareness**

### Project-Specific Rules
Customize `.windsurf/rules/cc.md` for your project:

- **Domain-specific guidelines**
- **Technology-specific patterns**
- **Team collaboration standards**

## 📊 Workflow Reference

| Workflow | Purpose | Output Location |
|----------|---------|-----------------|
| `initialize` | Project analysis & setup | `.code-captain/docs/` |
| `create-spec` | Feature specification | `.code-captain/specs/` |
| `execute-task` | TDD implementation | Source code + tests |
| `create-adr` | Architecture decisions | `.code-captain/decision-records/` |
| `status` | Project health analysis | Terminal output |

## 🛠️ Troubleshooting

### Workflows Not Executing Properly
**Problem**: Windsurf doesn't follow workflow steps correctly  
**Solution**: Ensure workflow files are in `.windsurf/workflows/` and reference them explicitly

### Context Issues
**Problem**: AI loses context during workflow execution  
**Solution**: Break complex workflows into smaller steps and verify context preservation

### File Organization Problems
**Problem**: Generated files appear in wrong locations  
**Solution**: Check `.code-captain/` folder structure and verify workflow output specifications

## 🤝 Contributing

Windsurf-specific contributions:

1. **Workflow Enhancement** - Improve AI coordination and workflow efficiency
2. **Rule Development** - Add domain-specific rules and guidelines
3. **Documentation** - Create Windsurf-specific examples and patterns
4. **Integration** - Enhance Windsurf AI coordination capabilities

---

**Ready to supercharge your Windsurf development?**

1. **Install:** `npx @devobsessed/code-captain`
2. **Reference:** `.windsurf/workflows/initialize.md`
3. **Begin:** Project initialization workflow 