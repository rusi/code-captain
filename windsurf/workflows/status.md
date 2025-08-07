---
description: Code Captain status report for project orientation and next actions
---

# Code Captain Status Workflow

## Overview
Provides comprehensive status report when starting work or switching context. Analyzes git state, active work, and project health to orient developers and suggest next actions.

## Core Functionality

### 1. Git Status & Context Analysis
Use `run_command` to gather git information:
- Current branch and relationship to main/origin
- Commits ahead/behind main branch  
- Last commit message and timestamp
- Uncommitted changes summary
- Stash status

### 2. Active Work Detection
Use `codebase_search` and `view_file` to find:
- Code Captain specs in `.code-captain/specs/`
- Current task progress from most recent spec
- Completed vs pending tasks
- Current user story context

### 3. Project Health Check
Use `run_command` for language-specific checks:
- Can the project build/compile?
- Dependencies status (package.json, requirements.txt, etc.)
- Configuration issues
- Missing environment variables

### 4. Contextual Suggestions
Based on current state, suggest appropriate next commands.

## Implementation Steps

### Step 1: Git Analysis
```bash
# Use run_command for these git operations:
git status --porcelain              # File changes
git log --oneline -5                # Recent commits  
git log main..HEAD --oneline        # Commits ahead
git log HEAD..main --oneline        # Commits behind
git stash list                      # Stashed changes
git branch -v                       # Branch info
```

### Step 2: Code Captain Integration
Use `find_by_name` to locate specs:
```bash
# Find most recent spec directory
find .code-captain/specs -name "spec.md" -type f
```

Use `view_file` to read spec content and task progress:
- Read overall progress from user stories overview
- Parse individual story files for task completion
- Count completed tasks (marked with [x])
- Find next incomplete task

### Step 3: Project Health
Use `run_command` for health checks:
```bash
# Node.js
npm run build --if-present
node -c package.json

# Python
python -m py_compile main.py
pip check
```

### Step 4: Generate Status Report

**Output Format** (clean formatted text, not code blocks):

```
⚓ Code Captain Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 CURRENT POSITION
   Branch: feature/dashboard-websockets (2 commits ahead of main)
   Last commit: "Add WebSocket connection hook" (2 hours ago)
   Uncommitted: 3 modified files in src/components/

📋 ACTIVE WORK
   Spec: Real-time Dashboard with WebSocket Integration 
   Progress: Story 2 (User receives real-time notifications) - In Progress
   Tasks completed: 3/6 tasks (50%)
   Next task: 2.4 Implement client-side WebSocket connection

🎯 SUGGESTED ACTIONS
   • Continue with task 2.4 (WebSocket connection management)
   • Commit current changes before switching tasks
   • Review recent main branch changes

⚡ QUICK COMMANDS
   Execute task workflow    # Continue current task
   Code cleanup workflow    # Quick code improvements
   Sync main workflow       # Pull latest from main
```

## Task Progress Analysis

### Parsing Logic
For each story file in `user-stories/story-N-{name}.md`:

1. **Count completed tasks**:
   ```bash
   grep -c "^\- \[x\].*✅" story-file.md
   ```

2. **Count total tasks**:
   ```bash
   grep -c "^\- \[[x ]\]" story-file.md
   ```

3. **Find next incomplete task**:
   ```bash
   grep -n "^\- \[ \]" story-file.md | head -1
   ```

4. **Extract status from story header**:
   ```bash
   grep "^> \*\*Status:\*\*" story-file.md
   ```

### Status Detection
- `Not Started` - No tasks completed
- `In Progress` - Some tasks completed, some remaining
- `Completed ✅` - All tasks and acceptance criteria completed

## Error Handling

### Not a Git Repository
```
❌ Not in a git repository
   Initialize git first: git init
```

### No Code Captain Structure
```
📋 ACTIVE WORK
   No Code Captain specifications found
   Project structure: Standard git repository

🎯 SUGGESTED ACTIONS
   • Set up Code Captain workflow
   • Create first feature specification
```

### Project Issues
```
⚠️  PROJECT ISSUES DETECTED
   • package.json syntax error
   • Missing critical dependencies
   • Build process failing

🔧 SUGGESTED FIXES
   • Fix package.json syntax
   • Run npm install or equivalent
   • Check build configuration
```

## Decision Tree for Suggestions

1. **Merge conflict?** → Suggest conflict resolution
2. **Working directory dirty?** → Suggest commit or stash
3. **Branch behind main?** → Suggest sync
4. **Active task?** → Suggest continue task
5. **Current task complete?** → Suggest next task
6. **No active work?** → Suggest create spec
7. **Always** → Suggest code cleanup

## Usage Patterns

### Morning Routine
Developer starts day, gets oriented on yesterday's work, sees exactly what to do next.

### Context Switching  
After meetings or interruptions, quick reminder of current state, resume work efficiently.

### Project Handoff
When picking up someone else's work, understand current project state without diving into code.

## Performance Considerations

- Target <2 second execution time
- Limit git log queries to reasonable ranges
- Cache expensive operations when possible
- Use efficient file scanning with `find_by_name`

## Windsurf Tools Used

- `run_command`: Git operations, build checks
- `codebase_search`: Find specs and project structure
- `view_file`: Read spec content and progress
- `find_by_name`: Locate Code Captain files
- `grep_search`: Parse task completion status
- `list_dir`: Directory structure analysis

## Security & Privacy

- All analysis happens locally
- No external API calls or data transmission
- Git history and file contents remain private
- Sanitize sensitive information in output

---

*⚓ Keep your bearings, maintain your heading, and always know where you stand in the code.*