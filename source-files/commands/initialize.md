# Initialize Command Workflow

## Command: `cc: initialize`

### Purpose

Intelligently set up project foundation by detecting if this is a greenfield (new) or brownfield (existing) project and executing the appropriate workflow.

### Detection Logic

1. **Scan current directory** for indicators:

   - Presence of package.json, requirements.txt, Cargo.toml, go.mod, etc.
   - Existing source code directories (src/, lib/, app/, etc.)
   - Git repository status
   - Configuration files

2. **Classify as**:
   - **Greenfield**: Empty directory or minimal files
   - **Brownfield**: Existing codebase with established structure

---

## Greenfield Workflow

### Phase 1: Discovery Questions

#### Greenfield Todo Checklist

Use `todo_write` to track progress through discovery:

```json
{
  "todos": [
    {
      "id": "greenfield-discovery",
      "content": "Complete discovery questionnaire (project type, users, functionality)",
      "status": "in_progress"
    },
    {
      "id": "greenfield-tech-stack",
      "content": "Select and document technology stack in .code-captain/docs/tech-stack.md",
      "status": "pending"
    },
    {
      "id": "greenfield-structure",
      "content": "Create project directory structure and config files",
      "status": "pending"
    },
    {
      "id": "greenfield-objective",
      "content": "Create project objective document in .code-captain/docs/objective.md",
      "status": "pending"
    },

    {
      "id": "greenfield-readme",
      "content": "Generate project README.md with overview and setup",
      "status": "pending"
    }
  ]
}
```

**Ask strategic questions**:

1. **Project Type**: "What are you building? (web app, API, mobile app, library, CLI tool, etc.)"
2. **Target Users**: "Who will use this? (internal team, external customers, developers, etc.)"
3. **Core Functionality**: "What's the main problem this solves?"
4. **Technical Constraints**: "Any specific technologies, frameworks, or platforms required?"
5. **Scale Expectations**: "Expected user load? (prototype, small team, enterprise scale)"
6. **Timeline**: "What's the target timeline? (hackathon, MVP, production-ready)"

### Phase 2: Technology Recommendations

Based on answers, recommend:

- **Tech Stack**: Languages, frameworks, databases
- **Architecture Pattern**: Monolith, microservices, serverless, etc.
- **Development Tools**: Testing, CI/CD, monitoring
- **Project Structure**: Directory layout, naming conventions

### Phase 3: Project Foundation Setup

#### Directory Structure (Pre-existing)

The `.code-captain/` directory structure already exists from installation:

- `.code-captain/docs/` - For documentation files, objective.md and tech-stack.md
- `.code-captain/research/` - For research outputs
- `.code-captain/commands/` - Pre-installed command definitions

#### Configuration Files

- **Package/dependency files** (package.json, requirements.txt, etc.)
- **Git configuration** (.gitignore, .gitattributes)
- **Development configuration** (prettier, eslint, etc.)

#### Documentation Creation (Exact File Paths)

1. **`.code-captain/docs/objective.md`** - Project mission and goals
2. **`.code-captain/docs/tech-stack.md`** - Technology stack decisions
3. **`.code-captain/docs/code-style.md`** - Coding standards (if applicable)
4. **`README.md`** - Project overview and quick start (includes setup instructions)

---

## Brownfield Workflow

### Phase 1: Codebase Analysis

#### Brownfield Todo Checklist

Use `todo_write` to track analysis progress:

```json
{
  "todos": [
    {
      "id": "brownfield-analysis",
      "content": "Analyze existing codebase structure, dependencies, and patterns",
      "status": "in_progress"
    },
    {
      "id": "brownfield-tech-stack",
      "content": "Document current tech stack in .code-captain/docs/tech-stack.md",
      "status": "pending"
    },
    {
      "id": "brownfield-objective",
      "content": "Infer and document project objectives in .code-captain/docs/objective.md",
      "status": "pending"
    },
    {
      "id": "brownfield-code-style",
      "content": "Analyze and document code patterns in .code-captain/docs/code-style.md",
      "status": "pending"
    }
  ]
}
```

**Scan and analyze**:

- **File structure** and organization patterns
- **Dependencies** and technology stack
- **Code patterns** and conventions
- **Configuration files** and build processes
- **Documentation gaps**

### Phase 2: Documentation Generation

#### tech-stack.md

```markdown
# Technology Stack

## Languages

- [Primary language with version]
- [Secondary languages if any]

## Frameworks & Libraries

- [Main framework with version and purpose]
- [Key dependencies with purposes]

## Infrastructure

- [Database technology]
- [Deployment platform]
- [CI/CD tools]

## Development Tools

- [Package manager]
- [Testing framework]
- [Linting/formatting tools]

## Architecture Pattern

[Monolith/Microservices/Serverless/etc. with reasoning]
```

#### code-style.md

```markdown
# Code Style Guide

## File Organization

[Directory structure patterns observed]

## Naming Conventions

- [Variable naming patterns]
- [Function naming patterns]
- [File naming patterns]

## Code Patterns

[Common patterns observed in codebase]

## Testing Patterns

[How tests are structured and named]

## Documentation Style

[Comment and documentation patterns]
```

#### objective.md

```markdown
# Project Objective

## Purpose

[Inferred from code structure, README, and package descriptions]

## Core Functionality

[Main features identified from codebase]

## Target Users

[Inferred from code patterns and API design]

## Architecture Goals

[Patterns that suggest scalability, maintainability, or performance focus]

## Current Status

[Analysis of completeness and active development areas]
```

### Phase 3: Gap Analysis

Identify and document:

- **Missing documentation**
- **Inconsistent patterns**
- **Potential improvements**
- **Testing gaps**

---

## Implementation Notes

### Tool Integration

- Use `codebase_search` for semantic understanding
- Use `file_search` for pattern discovery
- Use `todo_write` for progress tracking throughout both workflows
- Use `edit_file` to create documentation files

### Output Locations & File Structure

#### Directory Structure (Created by Install Script)

```
.code-captain/
├── commands/                 # CC command definitions (pre-installed)
└── docs/
    ├── best-practices.md     # Development best practices (pre-installed)
    ├── code-style.md         # Code conventions and patterns
    ├── objective.md          # Project goals and purpose
    └── tech-stack.md         # Technology decisions and rationale
```

#### Specific File Locations

**Docs Directory** (`.code-captain/docs/`):

- `best-practices.md` - Development best practices (pre-installed)
- `code-style.md` - Coding standards, naming conventions, patterns
- `objective.md` - Project mission, goals, and success criteria
- `tech-stack.md` - Technology choices with justifications

**Research Directory** (`.code-captain/research/`):

- Research outputs, technical analysis, and investigation results

**Commands Directory** (`.code-captain/commands/`):

- Pre-installed CC command definitions (managed by system)

**Root Directory**:

- `README.md` - Project overview and quick start (only for new projects)

### Todo Integration

Each phase should update todos to show progress, enabling Cursor's todo tracking:

#### Example Todo Updates

```javascript
// Mark discovery complete and start documentation phase
todo_write({
  merge: true,
  todos: [
    { id: "greenfield-discovery", status: "completed" },
    { id: "greenfield-tech-stack", status: "in_progress" },
  ],
});

// Update when creating documentation files
todo_write({
  merge: true,
  todos: [
    { id: "greenfield-tech-stack", status: "completed" },
    { id: "greenfield-objective", status: "completed" },
    { id: "greenfield-readme", status: "in_progress" },
  ],
});
```

#### Todo Best Practices

- **Always include file paths** in todo content for clarity
- **Use descriptive IDs** that indicate workflow type (greenfield/brownfield)
- **Update todos immediately** after completing each task
- **Mark todos as completed** only after files are actually created
- **Use `merge: true`** to update existing todos without replacing the entire list

#### File Creation Verification

Before marking documentation todos as complete, ensure:

1. **Directory exists**: `.code-captain/docs/`
2. **File is created**: Use `write` tool to create the actual file
3. **Content is complete**: File contains all required sections
4. **Path is correct**: Double-check exact file path matches todo description
