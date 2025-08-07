---
description: Set up technical foundation and development infrastructure for greenfield or brownfield projects
---

# Initialize Workflow

## Overview
Set up technical foundation and development infrastructure by detecting if this is a greenfield (new) or brownfield (existing) project and executing the appropriate technical setup workflow.

## Detection Logic

**Scan current directory for indicators:**
- Presence of package.json, requirements.txt, Cargo.toml, go.mod, etc.
- Existing source code directories (src/, lib/, app/, etc.)
- Git repository status
- Configuration files

**Classify as:**
- **Greenfield**: Empty directory or minimal files
- **Brownfield**: Existing codebase with established structure

## Workflow Process

### Step 1: Project Type Detection

**Use Windsurf tools to analyze project state:**

- Use `list_dir` to scan current directory structure
- Use `find_by_name` to search for common project files (package.json, requirements.txt, etc.)
- Use `view_file` to check existing configuration files
- Use `codebase_search` to understand existing code patterns and architecture

**Detection criteria:**
- **Greenfield indicators**: Empty/minimal directory, no dependency files, no src/ directories
- **Brownfield indicators**: Existing dependency files, established directory structure, source code present

### Step 2A: Greenfield Workflow (New Projects)

**Phase 1: Technical Foundation Setup**

**Ask focused technical questions:**
1. **Project Type**: "What type of application are you building? (web app, API, mobile app, library, CLI tool, etc.)"
2. **Technical Constraints**: "Any required technologies, frameworks, or platforms?"
3. **Development Environment**: "What's your preferred development setup? (local, containerized, cloud-based)"
4. **Scale Requirements**: "Expected technical scale? (prototype, small team, enterprise)"

**Phase 2: Technology Recommendations**

Based on technical requirements, recommend:
- **Tech Stack**: Languages, frameworks, databases suitable for the project type
- **Architecture Pattern**: Monolith, microservices, serverless based on scale needs
- **Development Tools**: Testing frameworks, build tools, linting/formatting
- **Project Structure**: Directory layout, naming conventions, configuration

**Phase 3: Technical Foundation Setup**

**Create project structure:**
- Use `write_to_file` to create package/dependency files (package.json, requirements.txt, etc.)
- Use `write_to_file` to create Git configuration (.gitignore, .gitattributes)
- Use `write_to_file` to create development configuration (prettier, eslint, testing config)
- Use `write_to_file` to create build and deployment configuration (if applicable)

**Documentation Creation:**

1. **`.code-captain/docs/tech-stack.md`** - Technology stack decisions and rationale
2. **`.code-captain/docs/code-style.md`** - Coding standards and development patterns
3. **`README.md`** - Technical overview and setup instructions

**Tech Stack Documentation Template:**
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

**Code Style Documentation Template:**
```markdown
# Code Style Guide

## File Organization
[Directory structure patterns]

## Naming Conventions
- [Variable naming patterns]
- [Function naming patterns]
- [File naming patterns]

## Code Patterns
[Common patterns for the technology stack]

## Testing Patterns
[How tests are structured and named]

## Documentation Style
[Comment and documentation patterns]
```

### Step 2B: Brownfield Workflow (Existing Projects)

**Phase 1: Codebase Analysis**

**Scan and analyze existing project:**
- Use `codebase_search` to understand overall architecture and patterns
- Use `list_dir` to analyze file structure and organization patterns
- Use `view_file` to examine dependencies and technology stack
- Use `grep_search` to find code patterns, conventions, and architecture
- Use `view_file` to review configuration files and build processes
- Use `find_by_name` to locate testing setup and development tools
- Use `codebase_search` to identify documentation gaps and technical debt

**Analysis areas:**
- **File structure** and organization patterns
- **Dependencies** and technology stack
- **Code patterns**, conventions, and architecture
- **Configuration files** and build processes
- **Testing setup** and development tools
- **Documentation gaps** and technical debt

**Phase 2: Documentation Generation**

**Create comprehensive technical documentation:**

Use `write_to_file` to create:

1. **`.code-captain/docs/tech-stack.md`** - Current technology stack analysis
2. **`.code-captain/docs/code-style.md`** - Observed code patterns and conventions
3. **`.code-captain/docs/architecture.md`** - System architecture and technical decisions (if complex)

**Phase 3: Gap Analysis & Recommendations**

Identify and document:
- **Missing technical documentation**
- **Inconsistent code patterns**
- **Technical debt and improvement opportunities**
- **Testing coverage gaps**
- **Development workflow improvements**
- **Architecture optimization opportunities**

### Step 3: Directory Structure Setup

**Ensure Code Captain structure exists:**

Use `list_dir` to check and `write_to_file` to create if missing:

```
.code-captain/
├── docs/
│   ├── best-practices.md     # Development best practices (pre-installed)
│   ├── code-style.md         # Code conventions and patterns
│   ├── tech-stack.md         # Technology decisions and rationale
│   └── architecture.md       # System architecture (if complex)
└── research/                 # Research outputs and technical analysis
```

### Step 4: Final Steps & Guidance

**For Greenfield Projects:**
```
🚀 Technical Foundation Complete!

Your development environment is now set up and documented:
- Technology stack documented and configured
- Development tools and standards established  
- Project structure and configuration ready

## Recommended Next Steps:

### For Product Strategy (Recommended First):
/plan-product "your product idea" - Define product vision, strategy, and roadmap

### For Feature Development:
/create-spec "feature description" - Create detailed feature specifications
/execute-task - Implement features with TDD workflow

### For Research:
/research "topic" - Conduct systematic technical research
/create-adr "decision" - Document architectural decisions

Ready to define your product strategy and start building!
```

**For Brownfield Projects:**
```
🔍 Technical Foundation Analysis Complete!

Your existing project has been analyzed and documented:
- Current technology stack and architecture documented
- Code patterns and conventions identified
- Technical gaps and improvement opportunities noted

## Recommended Next Steps:

### For Product Strategy (Recommended First):
/plan-product "enhanced product vision" - Define product strategy and roadmap

### For Feature Development:
/create-spec "feature description" - Create detailed feature specifications
/execute-task - Implement features following established patterns

### For Technical Improvements:
/research "technical topic" - Research solutions for identified gaps
/create-adr "technical decision" - Document architectural improvements

Ready to define your product strategy and enhance your codebase!
```

## Integration with Code Captain Ecosystem

**Workflow relationship:**
- **Initialize** handles ONLY technical foundation
- **/plan-product** handles product strategy and vision  
- Users need both for complete project setup
- **/plan-product** should be the next step before feature development

**Cross-workflow integration:**
- Documentation created here used by `/create-spec` for understanding patterns
- Tech stack analysis used by `/execute-task` for implementation guidance
- Architecture documentation used by `/create-adr` for decision context
- Gap analysis used by `/research` for improvement priorities

## Technical Implementation

**File creation process:**
1. Use `write_to_file` to create all documentation files
2. Ensure `.code-captain/docs/` directory exists
3. Create comprehensive content in each file
4. Verify file paths match expected locations

**Analysis process:**
- Use `codebase_search` for semantic understanding of existing code
- Use `find_by_name` for discovering project files and patterns
- Use `view_file` for examining specific configuration and code files
- Use `grep_search` for finding specific patterns and conventions

## Quality Standards

**Documentation completeness:**
- Tech stack with versions and justifications
- Code style with observable patterns
- Architecture decisions and rationale
- Clear setup and development instructions

**Analysis thoroughness:**
- Complete technology inventory
- Consistent pattern identification
- Gap analysis with actionable recommendations
- Integration point documentation

## Error Handling

**Common scenarios:**
- **Empty directory**: Proceed with greenfield workflow
- **Ambiguous project type**: Ask user for clarification
- **Missing permissions**: Guide user to resolve access issues
- **Complex architecture**: Break analysis into smaller components

**Fallback strategies:**
- If automated detection fails, ask user directly
- If file creation fails, provide manual instructions
- If analysis is incomplete, document known limitations
- If tools fail, provide alternative approaches

## Windsurf Tools Used

- `list_dir`: Explore project directory structure and organization
- `find_by_name`: Locate project files, configurations, and dependencies
- `view_file`: Examine existing code, configurations, and documentation
- `write_to_file`: Create technical documentation and configuration files
- `codebase_search`: Understand architecture, patterns, and codebase structure
- `grep_search`: Find specific patterns, conventions, and code structures
- `run_command`: Execute setup commands and validate configurations

## Windsurf Features Used

- **Memories**: After setup completion, ask Cascade to "create a memory of the technology stack and architectural decisions"

---

*🏗️ Building solid technical foundations for sustainable development.*