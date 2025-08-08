---
description: Create new Code Captain workflows following established patterns and conventions for Windsurf
---

# New Command Workflow

## Overview
A meta workflow that creates new Code Captain workflows following established patterns and conventions. This workflow generates properly structured workflow files, updates documentation, and ensures consistency across the Code Captain ecosystem for Windsurf environments.

## Usage Examples

```bash
# Create a new workflow
/new-command "optimize" "Performance optimization for slow code sections"

# Create deployment workflow
/new-command "deploy" "Deploy applications to various cloud platforms"

# Create test generation workflow
/new-command "test-gen" "Generate comprehensive test suites from existing code"
```

## Workflow Process

### Step 1: Command Specification Gathering

**Initial Input Processing:**
- Parse workflow name (validate format: lowercase, hyphens allowed)
- Extract brief description from user input
- Use `find_by_name` to validate workflow name doesn't conflict with existing workflows

**Interactive Specification Building:**

Ask clarifying questions to build complete workflow specification:

1. **Workflow Category**: "Is this a [Setup/Analysis/Implementation/Integration] workflow?"
2. **Execution Style**: "Should this use contract style (extensive clarification rounds like create-spec) or direct execution (immediate action like swab)?"
3. **Usage Pattern**: "Does it take arguments, flags, or is it standalone?"
4. **AI Coordination**: "Does it need AI prompts for complex decision-making?"
5. **Output Location**: "Where should outputs be stored? (.code-captain/[folder])"
6. **Tool Integration**: "Which Windsurf tools will it use? (codebase_search, view_file, etc.)"
7. **Workflow Steps**: "What are the main phases/steps the workflow follows?"

### Step 2: Workflow Structure Generation

**Generate Standard Workflow File Structure:**

Use `write_to_file` to create workflow in `.windsurf/workflows/[command-name].md`:

```markdown
---
description: [Generated from description and clarifying questions]
---

# [Command Name] Workflow

## Overview
[Generated from description and clarifying questions]

## Usage Examples

```bash
# Primary usage
/[command-name] [arguments]

# Example scenarios
/[command-name] [example-args]
```

## Workflow Process

### Step 1: [Phase Name]
[Generated workflow steps]

### Step 2: [Phase Name]
[Generated workflow steps]

## Core Rules
[Generated based on workflow type]

## Integration with Code Captain Ecosystem
[Generated integration details]

## Windsurf Tools Used
[Generated tool list]

## Windsurf Features Used
[Generated features list]

---
*[Generated tagline]*
```

**Template Sections Based on Workflow Type and Execution Style:**

**Contract Style Workflows** (like `create-spec`, `create-adr`):
- Phase 1: Contract Establishment (No File Creation)
- Interactive clarification rounds with structured questions
- Critical analysis and assumption challenging
- Contract proposal phase
- Explicit user agreement before proceeding

**Direct Execution Workflows** (like `swab`, `execute-task`):
- Immediate action workflows
- Minimal clarification if needed
- Clear step-by-step execution
- Progress feedback and completion confirmation

**Setup/Analysis Workflows:**
- Context scanning steps
- File generation workflows
- Documentation creation

**Implementation Workflows:**
- TDD workflows if applicable
- Code modification steps
- Verification procedures

**Integration Workflows:**
- Platform-specific API interactions
- Sync and conflict resolution
- Error handling patterns

### Step 3: Tool Integration Mapping

**Map appropriate Windsurf tools based on workflow type:**

**File Operations:**
- `view_file`, `write_to_file`, `replace_file_content`, `find_by_name`, `list_dir`, `grep_search`

**Code Analysis:**
- `codebase_search`, `view_code_item`, `trajectory_search`

**Web & Browser:**
- `browser_preview`, `open_browser_url`, `search_web`, `read_url_content`

**System & Deployment:**
- `run_command`, `command_status`, `deploy_web_app`

**Memory & Context:**
- `view_content_chunk`, Memories feature for important decisions

### Step 4: Validation and Character Limit Check

**Verify Workflow Integration:**
- Use `view_file` to check workflow file syntax and structure
- Use `run_command` with `wc -c` to validate under 12k character limit
- Use `find_by_name` to ensure no conflicts with existing workflows
- Run basic structure validation

**Character Limit Enforcement:**
```bash
# Check if workflow is under 12k limit
wc -c .windsurf/workflows/[command-name].md

# Validate limit
[ $(wc -c < .windsurf/workflows/[command-name].md) -lt 12000 ] && echo "✅ Under 12k" || echo "⚠️ Over 12k"
```

**Present Summary:**
```
✅ New workflow created successfully!

📁 Files Created:
  - .windsurf/workflows/[command-name].md

🚀 Workflow Ready:
  Usage: /[command-name] [args]
  Documentation: .windsurf/workflows/[command-name].md
  Character count: [X]/12000 characters

📏 Character Limit: ✅ Under 12k limit
```

## Core Rules

1. **Consistent Structure** - All generated workflows follow established Windsurf patterns
2. **Clear Documentation** - Each section has purpose and implementation details
3. **Character Limit Compliance** - All workflows must be under 12k characters
4. **Slash Command Syntax** - Use /command-name format for all examples
5. **Windsurf Tool Integration** - Use appropriate Windsurf tools for functionality
6. **Template Flexibility** - Adapt template based on workflow type and requirements
7. **Language & Shell Agnostic** - Workflows work across different programming languages using Windsurf's tools

## Workflow Generation Templates

### Contract Style Template Structure
```markdown
## Workflow Process

### Step 1: Requirement Clarification
**Gather detailed requirements through structured questions**
- [Specific clarification questions]
- [Assumption challenging]
- [Context gathering]

### Step 2: Contract Proposal
**Present structured contract for user agreement**
- [Contract format specific to workflow type]
- [Success criteria definition]
- [Scope boundaries]

### Step 3: User Agreement
**Explicit confirmation before proceeding**
- [Agreement validation]
- [Scope confirmation]

### Step 4: Implementation
**Execute workflow based on agreed contract**
- [Implementation steps]
- [Progress tracking]
- [Validation procedures]
```

### Direct Execution Template Structure
```markdown
## Workflow Process

### Step 1: Context Analysis
**Analyze current state and requirements**
- [Context gathering steps]
- [Requirement analysis]

### Step 2: Action Execution
**Perform workflow actions directly**
- [Action steps]
- [Tool usage]
- [Progress feedback]

### Step 3: Verification
**Validate results and completion**
- [Verification steps]
- [Quality checks]
- [Completion confirmation]
```

## Command Name Validation

**Validation Rules:**
- Lowercase letters, numbers, hyphens only
- No spaces or special characters
- Maximum 20 characters
- Cannot start with number or hyphen
- Must not conflict with existing workflows

**Validation Process:**
Use `grep_search` and `find_by_name` to check for conflicts:
```bash
# Check existing workflows
find_by_name "[command-name].md" in .windsurf/workflows/

# Validate format using pattern matching
```

## Error Handling

**Common Issues:**
- **Duplicate workflow name**: Check existing workflows, suggest alternatives
- **Invalid workflow name format**: Provide format guidance and examples
- **Character limit exceeded**: Provide optimization suggestions
- **Template generation errors**: Validate inputs, provide clear error messages

**Error Messages:**
```
❌ Workflow creation failed: [specific reason]

Suggestions:
- Check workflow name format (lowercase, hyphens only)
- Ensure name doesn't conflict with existing workflows
- Verify all required inputs are provided
- Ensure generated content is under 12k characters

Try: /new-command "valid-name" "clear description"
```

## Integration with Code Captain Ecosystem

**Workflow relationship:**
- Generates workflows compatible with other Code Captain workflows
- Follows established patterns from existing workflows
- Maintains consistency in structure and tool usage
- Ensures proper slash command syntax throughout

**Cross-workflow integration:**
- New workflows can reference existing workflows with proper `/workflow-name` syntax
- Generated workflows include appropriate tool mappings
- Documentation follows established Windsurf patterns
- Character limit compliance ensures deployability

## Quality Standards

**Structure requirements:**
- Proper frontmatter with description
- Clear overview and usage examples
- Detailed workflow process with numbered steps
- Appropriate tool integration
- Proper slash command syntax

**Content quality:**
- Clear, actionable workflow steps
- Appropriate tool usage for each step
- Proper error handling guidance
- Integration notes with other workflows
- Character count optimization

## Windsurf Tools Used

- `find_by_name`: Locate existing workflows and check for conflicts
- `view_file`: Examine existing workflow patterns for consistency
- `write_to_file`: Create new workflow files
- `run_command`: Validate character limits and file structure
- `codebase_search`: Understand existing workflow patterns
- `grep_search`: Search for workflow naming conflicts and patterns

## Windsurf Features Used

- **Memories**: After creating complex workflows, ask Cascade to "create a memory of this workflow pattern and its structure"

---

*🔧 Building workflows that build workflows - meta automation at its finest.*