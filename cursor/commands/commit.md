# Commit Command (/commit)

## Overview

An intelligent git commit command that stages modified files, analyzes changes, and creates standardized commit messages following established project conventions. This command handles the complete commit workflow from staging to message generation based on project context and change patterns.

## Command Process

### Step 1: Initialize Progress Tracking

**Create todos for the commit process using `todo_write`:**

```text
- Analyze git status and determine staging strategy [in_progress]
- Stage modified files or review staged changes [pending]
- Analyze changes to determine commit format [pending]
- Generate appropriate commit message [pending]
- Execute commit with generated message [pending]
```

### Step 2: Git Status Analysis & Intelligent Staging Strategy

**Analyze current git state:**

Use `run_terminal_cmd` to check git status and categorize files:

```bash
git status --porcelain
```

**Intelligent Staging Logic:**

1. **If no staged files exist:**
   - Include all changes that appear to be part of current work
   - Exclude obvious temporary/build files
   - Present staging plan for user confirmation

2. **If staged files exist:**
   - Review staged changes and proceed or modify

3. **If no changes to commit:**
   - Display clean status and exit

**File Inclusion Strategy:**

**Include files that are part of your current work:**
- All modified files related to the feature/change being implemented
- New files related to the feature/change being implemented
- Configuration changes, tests, documentation for the feature
- Even editor/IDE files if they're part of the intended changes

**Exclude only obvious non-work files:**
- Build artifacts (`dist/`, `node_modules/`, `*.log`)
- Temporary system files (`.DS_Store`, `*.tmp`)
- Accidental personal files clearly unrelated to the work

**Staging Presentation:**

```text
📁 Files to stage:

✅ Modified (will include):
  M  src/components/Auth.tsx
  M  src/utils/validation.js

🔍 New files (analyzing):
  ?? src/components/Auth.test.tsx     [INCLUDE - test for modified component]
  ?? src/types/auth.ts                [INCLUDE - types for auth feature]  
  ?? .DS_Store                        [EXCLUDE - system file]
  ?? notes.txt                        [EXCLUDE - personal file]

Stage these files? [Y/n/selective]
```

**Staging Actions:**

- **Y**: Stage all recommended files
- **n**: Cancel staging and exit
- **selective**: Allow user to choose specific files interactively

**Interactive Selection (if 'selective' chosen):**

Present each file individually:
```text
Stage src/components/Auth.test.tsx? [y/N/view]
```

Options:
- **y**: Include this file
- **N**: Skip this file  
- **view**: Show file contents/diff before deciding

### Step 3: Generate Commit Message

**Create appropriate commit message based on the changes:**

1. **Check for plan context** - If changes relate to plan steps, use `Step X.X:` format
2. **Otherwise classify by type** - `Feat:`, `Fix:`, `Docs:`, `Refactor:`, etc.
3. **Create descriptive message** - Brief subject line describing what was actually done
4. **Add details if needed** - Bullet points for complex changes

**Message formats:**
- **Plan work**: `Step X.X: [description of completed step]`
- **Other work**: `[Type]: [description of changes]`

### Step 4: Detailed Message Generation

**Determine commit message format based on analysis:**

#### Plan Execution Format Detection

**Check for plan context:**
1. Scan for plan files and current development phase
2. Identify if changes correspond to specific plan steps
3. Extract step number and description if applicable

**Plan Format:**

```text
Step X.X: [brief description of completed step]

[Optional detailed description with bullet points of changes]
```

#### Non-Plan Format Selection

**Commit Type Selection based on change analysis:**

- **`Plan:`** - Creating or updating development plans
- **`Fix:`** - Bug fixes and corrections  
- **`Docs:`** - Documentation updates (README, guides, etc.)
- **`Refactor:`** - Code restructuring without feature changes
- **`Feat:`** - New features not tied to a specific plan step
- **`Rules:`** - Updates to development rules/workflow
- **`Chore:`** - Maintenance tasks (dependency updates, cleanup, etc.)
- **`Test:`** - Adding or updating tests
- **`Config:`** - Configuration file changes
- **`Deploy:`** - Deployment-related changes

**Non-Plan Format:**

```text
[Type]: [brief description]

[Optional detailed description with bullet points of changes]
```

#### Message Generation Logic

1. **Analyze file changes** to determine primary change type
2. **Generate concise subject line** (under 80 characters)
3. **Create optional detailed body** with bullet points for multiple changes
4. **Follow format guidelines:**
   - Capitalize first word after colon
   - Use imperative mood
   - No period at end of subject line
   - Wrap body at 80 characters

### Step 5: User Review & Commit Execution

**Present generated commit message:**

```text
🔍 Staged Changes Analysis:
  Modified: 3 files
  Added: 0 files  
  Deleted: 0 files

💬 Generated Commit Message:
┌─────────────────────────────────────────────
│ Fix: resolve Safari compatibility issue with ES module loading
│ 
│ - Add Safari-specific build targets to Vite configuration
│ - Update browser compatibility settings for ES2020  
│ - Test frontend rendering across Chrome and Safari
└─────────────────────────────────────────────

Proceed with this commit? [y/N/edit]
```

**User Options:**
- **y**: Execute commit with generated message
- **N**: Cancel commit operation  
- **edit**: Allow user to modify commit message before committing

**Execute Commit:**

```bash
git commit -m "[generated message]"
```

**Present completion summary:**

```text
✅ Commit completed successfully!

📝 Commit: a1b2c3d - Fix: resolve Safari compatibility issue with ES module loading
📁 Files: 3 modified
📊 Changes: +12 -8 lines

Next steps:
- Use /status to check project state
- Consider pushing changes with: git push
```

## Core Rules

1. **Intelligent Staging** - Include all files that are part of the current feature/changes (modified AND related new files)
2. **Relevance Analysis** - Analyze new files for relationship to current changes, exclude unrelated files  
3. **User Control** - Always present staging plan and generated message for review before committing
4. **Format Compliance** - Follow established project commit message conventions
5. **Context Awareness** - Consider plan context and change patterns for accurate categorization
6. **Safety First** - Provide clear feedback and confirmation before executing git commands

## Tool Integration

**Primary Code Captain tools:**
- `todo_write` - Progress tracking throughout commit process
- `run_terminal_cmd` - Git command execution and status analysis
- `codebase_search` - Plan detection and change context analysis
- `list_dir` - Project structure analysis for change categorization

**Git Integration:**
- Analyze current status and changes
- Stage relevant files based on user's current work
- Generate appropriate commit messages
- Execute commits with user confirmation

## Commit Message Format Rules

### Plan Execution Commits
For work that directly implements a specific step from a development plan:

```
Step X.X: [brief description of completed step]

[Optional detailed description with bullet points of changes]
```

### Non-Plan Commits  
For all other development work not tied to a specific plan step:

```
[Type]: [brief description]

[Optional detailed description with bullet points of changes]
```

### Format Guidelines

**Subject Line Requirements:**
- Length: Keep under 80 characters for the first line
- Capitalization: Capitalize the first word after the colon  
- Tense: Use imperative mood ("Add feature" not "Added feature")
- Punctuation: No period at the end of the subject line

**Body Guidelines (Optional):**
- Separation: Leave blank line between subject and body
- Content: Explain what was changed and why
- Format: Use bullet points for multiple changes
- Length: Wrap lines at 80 characters

### Commit Type Detection

The command analyzes your changes and selects the most appropriate commit type based on what you actually implemented.

## Error Handling

### Common Scenarios

**No changes to commit:**
```text
ℹ️ No changes to commit.
Working directory is clean.

Consider:
- Making changes to tracked files
- Using /status to check project state
```

**Merge conflicts present:**
```text
⚠️ Cannot commit: merge conflicts detected.

Please resolve conflicts first:
- Edit conflicted files
- Stage resolved files: git add <file>
- Then retry /commit
```

**No git repository:**
```text
❌ Not a git repository.

Initialize git first:
- git init
- git add .
- git commit -m "Initial commit"
```

### Staging Issues

**Only untracked files exist:**
```text
📁 Only untracked files found.

Analyzing files for feature relevance...

🔍 New files found:
  ?? src/components/NewFeature.tsx  [INCLUDE - appears to be feature work]
  ?? temp-notes.txt                 [EXCLUDE - temporary file]

/commit will analyze and suggest relevant files to stage.
Use 'selective' option if you want to choose manually.
```

**All new files excluded by analysis:**
```text
📁 New files found but none appear related to current feature work.

Files excluded:
  ?? .DS_Store         [system file]  
  ?? notes.txt         [personal file]
  ?? temp/debug.log    [temporary file]

If these files should be committed:
- Stage them manually: git add <filename>  
- Then retry /commit
```

## Integration Notes

This command integrates with the Code Captain ecosystem by:

1. **Following Git Best Practices** - Safe staging and commit operations
2. **Project Context Awareness** - Uses codebase analysis for intelligent message generation  
3. **Workflow Integration** - Complements `/status` and other project management commands
4. **Format Standardization** - Ensures consistent commit history across projects
5. **Progress Tracking** - Uses `todo_write` for visibility into commit process

## Usage Examples

### Basic Usage
```bash
/commit
# Analyzes all changes, stages relevant files, generates message, and commits
```

### Typical Workflow
```bash
# After implementing a feature (modified files + new test files)
/commit
# → Analyzes: Modified Auth.tsx + new Auth.test.tsx + new types/auth.ts
# → Stages feature-related files, excludes unrelated files
# → Generates: "Feat: add user authentication with JWT tokens"
# → User confirms: Y
# → Commits with generated message
```

### Interactive Selection
```bash  
# When you want to choose specific files
/commit
# → Shows staging plan with recommendations
# → Choose: selective
# → Individually confirm each file: y/N/view
# → Commits only selected files
```

### Plan-based Development
```bash
# After completing a plan step
/commit  
# → Detects plan context
# → Generates: "Step 2.3: Complete user authentication backend"
# → Includes bullet points of changes
```

## Future Enhancements

Potential improvements (not in initial version):

- **Smart Commit Splitting** - Detect if changes should be multiple commits
- **Conventional Commits** - Support for conventional commit format option
- **Change Impact Analysis** - Assess breaking changes for version hints
- **Plan Integration** - Auto-update plan status after plan-related commits
- **Team Patterns** - Learn from team commit patterns for better suggestions

But for now: Focus on reliable staging, intelligent message generation, and safe commit execution with clear user feedback.
