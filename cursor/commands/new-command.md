# New Command Creator (cc: new-command)

## Overview

A meta command that creates new Code Captain commands following established patterns and conventions. This command generates properly structured command files, updates documentation, and ensures consistency across the Code Captain ecosystem.

## Usage

```bash
cc: new-command "command-name" "brief description"
```

**Examples:**
```bash
cc: new-command "optimize" "Performance optimization for slow code sections"
cc: new-command "deploy" "Deploy applications to various cloud platforms"
cc: new-command "test-gen" "Generate comprehensive test suites from existing code"
```

## Command Process

### Step 1: Command Specification Gathering

**Initial Input Processing:**
- Parse command name (validate format: lowercase, hyphens allowed)
- Extract brief description from user input
- Validate command name doesn't conflict with existing commands

**Interactive Specification Building:**
Ask clarifying questions to build complete command specification:

1. **Command Category**: "Is this a [Setup/Analysis/Implementation/Integration] command?"
2. **Execution Style**: "Should this use contract style (extensive clarification rounds like create-spec) or direct execution (immediate action like swab)?"
3. **Usage Pattern**: "Does it take arguments, flags, or is it standalone?"
4. **AI Coordination**: "Does it need AI prompts for complex decision-making?"
5. **Output Location**: "Where should outputs be stored? (.code-captain/[folder])"
6. **Tool Integration**: "Which Cursor tools will it use? (codebase_search, read_file, etc.)"
7. **Workflow Steps**: "What are the main phases/steps the command follows?"

### Step 2: Command Structure Generation

**Generate Standard Command File Structure:**

```markdown
# [Command Name] Command (cc: [command-name])

## Overview
[Generated from description and clarifying questions]

## Usage
```bash
cc: [command-name] [arguments]
```

## Command Process

### Step 1: [Phase Name]
[Generated workflow steps]

### Step 2: [Phase Name]
[Generated workflow steps]

## Core Rules
[Generated based on command type]

## AI Implementation Prompt
[Generated if AI coordination needed]

## Integration Notes
[Generated integration details]
```

**Template Sections Based on Command Type and Execution Style:**

**Contract Style Commands** (like `create-spec`, `create-adr`):
- Phase 1: Contract Establishment (No File Creation)
- Interactive clarification rounds with structured questions
- Critical analysis and assumption challenging
- Echo check/contract proposal phase
- Explicit user agreement before proceeding

**Direct Execution Commands** (like `swab`, `execute-task`):
- Immediate action workflows
- Minimal clarification if needed
- Clear step-by-step execution
- Progress feedback and completion confirmation

**Setup/Analysis Commands:**
- Context scanning steps
- File generation workflows
- Progress tracking with `todo_write`

**Implementation Commands:**
- TDD workflows if applicable
- Code modification steps
- Verification procedures

**Integration Commands:**
- Platform-specific API interactions
- Sync and conflict resolution
- Error handling patterns

### Step 3: Documentation Updates

**Automatically update main documentation files:**

1. **cc.md Updates:**
   - Add to appropriate category section
   - Add to command documentation reading list
   - Add to usage examples

2. **cc.mdc Updates:**
   - Add to Core Commands or Platform Integration section
   - Include brief description

3. **README.md Updates:**
   - Add to appropriate feature section
   - Add to command reference table
   - Include in workflow examples if relevant

### Step 4: Validation and Integration

**Verify Command Integration:**
- Check command file syntax and structure
- Validate documentation updates
- Ensure no conflicts with existing commands
- Run basic structure validation

**Present Summary:**
```
✅ New command created successfully!

📁 Files Created/Updated:
  - .code-captain/commands/[command-name].md
  - cc.md (updated)
  - cc.mdc (updated) 
  - README.md (updated)

🚀 Command Ready:
  Usage: cc: [command-name] [args]
  Documentation: .code-captain/commands/[command-name].md
```

## Core Rules

1. **Consistent Structure** - All generated commands follow established patterns
2. **Clear Documentation** - Each section has purpose and implementation details
3. **Automatic Integration** - Updates all necessary documentation files
4. **Validation Required** - Check for conflicts and proper structure
5. **Template Flexibility** - Adapt template based on command type and requirements
6. **Language & Shell Agnostic** - Commands should work across different programming languages and shell environments, using Code Captain's existing tools rather than making assumptions about tech stack

## AI Implementation Prompt

```
You are creating a new Code Captain command following established patterns.

MISSION: Generate a complete, well-structured command file and update documentation.

COMMAND SPECIFICATION:
- Name: {command_name}
- Description: {description}
- Category: {category}
- Execution Style: {contract_style_or_direct_execution}
- Usage Pattern: {usage_pattern}
- AI Coordination: {needs_ai_prompts}
- Output Location: {output_location}
- Tool Integration: {cursor_tools}
- Workflow Steps: {workflow_phases}

TEMPLATE STRUCTURE:
1. Title: # [Command Name] Command (cc: [command-name])
2. Overview: Purpose and capabilities
3. Usage: Command syntax with examples
4. Command Process: Detailed step-by-step workflow
5. Core Rules: Implementation guidelines
6. AI Implementation Prompt: (if AI coordination needed)
7. Integration Notes: Cursor tool coordination

TEMPLATE ADAPTATION RULES:
- Contract Style commands: Include clarification phases, contract establishment, critical analysis, user agreement checkpoints
- Direct Execution commands: Include immediate action workflows, minimal interaction, clear progress feedback
- Setup/Analysis commands: Include context scanning, file generation, todo tracking
- Implementation commands: Include TDD workflows, code modification, verification
- Integration commands: Include API interactions, sync, error handling
- All commands: Include clear examples, tool coordination, progress tracking
- CRITICAL: Be language and shell agnostic - use codebase_search, list_dir, file_search instead of language-specific find commands or hardcoded file extensions

DOCUMENTATION UPDATES:
Update these files with the new command:
- cc.md: Add to appropriate category, command list, examples
- cc.mdc: Add to Core Commands with brief description  
- README.md: Add to features, command table, workflow examples

OUTPUT REQUIREMENTS:
1. Generate complete command file following the template
2. Identify exact locations in documentation files to update
3. Provide specific text additions for each documentation file
4. Ensure consistency with existing command patterns
5. Validate no conflicts with existing commands

QUALITY CHECKS:
- Command name follows naming conventions (lowercase, hyphens)
- Usage examples are clear and practical
- Workflow steps are actionable and specific
- Integration points are clearly documented
- All sections serve a clear purpose
- No hardcoded language assumptions or shell-specific commands
- Uses Code Captain's existing tools (codebase_search, list_dir, file_search) rather than system-specific commands
```

## Implementation Details

### Command Name Validation

**Validation Rules:**
- Lowercase letters, numbers, hyphens only
- No spaces or special characters
- Maximum 20 characters
- Cannot start with number or hyphen
- Must not conflict with existing commands

**Validation Process:**
```bash
# Check format
echo "command-name" | grep -E '^[a-z][a-z0-9-]*[a-z0-9]$'

# Check conflicts
ls .code-captain/commands/ | grep "^command-name.md$"
```

### Template Selection Logic

**Command Categories and Templates:**

1. **Setup/Analysis** (`initialize`, `research`, `explain-code`)
   - Context scanning workflows
   - Documentation generation
   - Progress tracking emphasis

2. **Planning/Specification** (`create-spec`, `create-adr`, `plan-product`)
   - Interactive clarification phases
   - Structured output formats
   - Contract-based workflows

3. **Implementation** (`execute-task`, `swab`)
   - Code modification workflows
   - TDD patterns
   - Verification steps

4. **Quality** (`status`, `swab`)
5. **Meta** (`new-command`, `explain-code`)
   - Platform API interactions
   - Sync and conflict handling
   - Status reporting

### Documentation Update Locations

**cc.md Update Points:**
- Line ~15-50: Available Commands sections
- Line ~95-110: Command documentation list
- Line ~150-190: Usage examples

**cc.mdc Update Points:**
- Line ~25-35: Core Commands list
- Line ~35-45: Enhanced workflows (if integration)

**README.md Update Points:**
- Line ~120-140: Feature sections
- Line ~400-415: Command reference table
- Line ~250-270: Source structure

### Error Handling

**Common Issues:**
- **Duplicate command name**: Check existing commands, suggest alternatives
- **Invalid command name format**: Provide format guidance and examples
- **Documentation update conflicts**: Use safe merge strategies, manual review if needed
- **Template generation errors**: Validate inputs, provide clear error messages

**Error Messages:**
```
❌ Command creation failed: [specific reason]

Suggestions:
- Check command name format (lowercase, hyphens only)
- Ensure name doesn't conflict with existing commands
- Verify all required inputs are provided

Try: cc: new-command "valid-name" "clear description"
```

## Integration Notes

This command integrates with Code Captain by:

1. **Following Established Patterns** - Uses same structure as existing commands
2. **Maintaining Consistency** - Ensures all new commands match style and format
3. **Automatic Documentation** - Updates all necessary files without manual intervention
4. **Extensibility** - Makes it easy to add new capabilities to Code Captain
5. **Quality Assurance** - Validates structure and prevents conflicts

## Future Enhancements

Potential improvements (not in initial version):

- **Template Library**: Multiple command templates for different use cases
- **Interactive Wizard**: Step-by-step command creation with guidance
- **Integration Testing**: Automated testing of generated commands
- **Version Control**: Track command changes and updates
- **Command Dependencies**: Handle commands that depend on other commands

But for now: Focus on core functionality - create well-structured commands that integrate seamlessly with the existing Code Captain ecosystem.