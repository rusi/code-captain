# Create GitHub Issues Command (cc: create-github-issues)

## Overview

Automatically create GitHub issues from existing user stories and tasks, establishing parent-child relationships through sub-issues and updating source documents with issue numbers for traceability.

**🚨 EXECUTION METHOD:**
**This command uses a dedicated shell script (`scripts/create-issues-batch.sh`) for reliable issue creation with dynamic rate limiting. The LLM's role is to parse specs and prepare data, then call the script for execution.**

## Usage

```bash
cc: create-github-issues [spec-folder-path]
```

**Examples:**

```bash
cc: create-github-issues .code-captain/specs/2024-12-28-user-profile-dashboard/
cc: create-github-issues  # Auto-detect latest spec folder
```

## Command Process

**📋 LLM Responsibilities:**
1. **Parse spec documents** and extract user stories/tasks
2. **Prepare JSON data files** for script consumption  
3. **Call shell script** for reliable issue creation
4. **Process results** and update documentation
5. **Trigger sync** to update local cache

**🛠️ Shell Script Handles:**
- Dynamic rate limiting and batch sizing
- Parallel issue creation within limits
- Error handling and retry logic
- Progress tracking and logging

### Step 1: Context Discovery & Validation

**Auto-detect spec folder (if no path provided):**

- Search `.code-captain/specs/` for most recent dated folder
- Validate folder contains required files: `user-stories.md` and `tasks.md`
- Confirm GitHub repository context is available

**Validate required files exist:**

- `user-stories.md` - Source for main issues
- `tasks.md` - Source for sub-task issues
- Optional: `spec.md` for additional context

**GitHub CLI and repository validation:**

- Verify GitHub CLI is installed using `gh --version`
- Check if current directory is a git repository using `git remote get-url origin`
- Extract repository owner/name from remote origin
- Validate GitHub CLI authentication using `gh auth status`
- Verify repository access using `gh repo view {owner/repo}`

**Ensure required labels exist:**

- Create or verify standard labels exist in repository
- Use `gh label create` with platform-appropriate error handling to handle existing labels gracefully
- Set up consistent label schema for issue organization

### Step 2: Label Management & Setup

**Create required labels:**

Create all required labels (Code Captain will use platform-appropriate error handling based on your shell from `state.json`):
- "user-story" (blue #0052cc) - User story issues
- "feature" (light blue #a2eeef) - New feature  
- "task" (purple #d4c5f9) - Implementation tasks
- "subtask" (pink #f9c5d4) - Sub-implementation tasks
- "enhancement" (blue #84b6eb) - Enhancement to existing feature
- "testing" (yellow #fef2c0) - Testing related work

Use `gh label create` commands with appropriate error handling for existing labels.

**Verify label creation:**
- Use `gh label list` to confirm all labels were created successfully
- Handle any label creation failures gracefully
- Continue with issue creation only after labels are confirmed

### Step 3: Prepare Script Dependencies

**Verify batch creation script exists:**

```bash
SCRIPT_PATH="integrations/github/scripts/create-issues-batch.sh"

if [ ! -f "$SCRIPT_PATH" ]; then
    echo "🚨 ERROR: Batch creation script not found at $SCRIPT_PATH"
    exit 1
fi

if [ ! -x "$SCRIPT_PATH" ]; then
    echo "📝 Making script executable..."
    chmod +x "$SCRIPT_PATH"
fi

echo "✅ Batch creation script ready: $SCRIPT_PATH"
```

**Create temporary working directory:**

```bash
TEMP_DIR="/tmp/cc-github-issues-$$"
Create temporary directory (Code Captain will use platform-appropriate commands based on your shell from `state.json`)

echo "📁 Working directory: $TEMP_DIR"
echo "   - user-stories.json (to be created)"
echo "   - tasks.json (to be created)" 
echo "   - subtasks.json (to be created)"
echo "   - results/ (for script output)"
```

### Step 4: Create Todo Tracking

**Use `todo_write` to track the complete issue creation process:**

```json
{
  "todos": [
    {
      "id": "github-setup",
      "content": "Validate GitHub CLI and create required labels",
      "status": "completed"
    },
    {
      "id": "github-issues-parse",
      "content": "Parse user stories and tasks from spec documents",
      "status": "in_progress"
    },
    {
      "id": "github-issues-create-stories",
      "content": "Create ALL user story issues (no skipping)",
      "status": "pending"
    },
    {
      "id": "github-issues-create-tasks",
      "content": "Create ALL main task issues (no skipping)",
      "status": "pending"
    },
    {
      "id": "github-issues-create-subtasks",
      "content": "Create ALL subtask issues (no skipping)",
      "status": "pending"
    },
    {
      "id": "github-issues-update-docs",
      "content": "Update all spec documents with issue numbers",
      "status": "pending"
    },
    {
      "id": "github-issues-verify",
      "content": "Verify all issues created and documents updated",
      "status": "pending"
    },
    {
      "id": "github-sync-trigger",
      "content": "Trigger sync to update cache with new issues",
      "status": "pending"
    }
  ]
}
```

**Enhanced progress tracking:**
- Track exact counts: "Creating user story 3 of 6: [title]"
- Mark each individual creation as it completes
- **No skipping allowed** - all tasks from spec must be created
- Show percentage completion throughout process

### Step 5: Parse Spec Documents

**Read and parse user-stories.md:**

- Extract each user story with its structure:
  - Title
  - "As a/I want to/So that" format
  - Acceptance criteria list
  - Definition of done checklist

**Read and parse tasks.md:**

- Extract main tasks and their subtasks
- Identify task hierarchy (1.0, 1.1, 1.2, etc.)
- Preserve task descriptions and checkboxes

**Create mapping structure:**

```javascript
{
  userStories: [
    {
      title: "Story Title",
      description: "As a user...",
      acceptanceCriteria: ["Given...", "When...", "Then..."],
      definitionOfDone: ["Testable requirement 1", "..."],
      originalLineRange: [25, 45]
    }
  ],
  tasks: [
    {
      title: "Main Task Title",
      subtasks: [
        { title: "Subtask 1", description: "...", originalLineRange: [10, 12] },
        { title: "Subtask 2", description: "...", originalLineRange: [13, 15] }
      ],
      originalLineRange: [8, 20]
    }
  ]
}
```

### Step 6: Create User Story Issues via Shell Script

**Prepare user stories JSON data:**

```bash
echo "📝 Preparing user stories data for batch creation..."

# Create JSON array for user stories
USER_STORIES_JSON="$TEMP_DIR/user-stories.json"
cat > "$USER_STORIES_JSON" << 'EOF'
[
EOF

STORY_COUNT=0
while IFS= read -r story_line; do
    if [[ "$story_line" =~ ^##[[:space:]]*Story[[:space:]]*[0-9]+: ]]; then
        STORY_TITLE=$(echo "$story_line" | sed 's/^## Story [0-9]*: //' | sed 's/ \[#[0-9]*\]$//')
        
        # Extract story body (As a/I want/So that + acceptance criteria)
        STORY_BODY=$(extract_story_body_from_file "$story_line")
        
        # Add to JSON array
        cat >> "$USER_STORIES_JSON" << EOF
  {
    "title": "[USER STORY] $STORY_TITLE",
    "body": "$STORY_BODY",
    "labels": ["user-story", "feature"]
  }$([ $STORY_COUNT -lt $((TOTAL_STORIES - 1)) ] && echo ",")
EOF
        
        STORY_COUNT=$((STORY_COUNT + 1))
    fi
done < user-stories.md

cat >> "$USER_STORIES_JSON" << 'EOF'
]
EOF

echo "✅ Prepared $STORY_COUNT user stories in $USER_STORIES_JSON"
```

**Execute batch creation via shell script:**

```bash
echo "🚀 Executing user story creation via batch script..."

# Call the shell script for reliable creation
USER_STORY_RESULTS=$(
    cd "$(dirname "$0")" &&
    ./integrations/github/scripts/create-issues-batch.sh \
        "$USER_STORIES_JSON" \
        "user-story"
)

# Parse results into array
IFS=$'\n' read -d '' -r -a USER_STORY_ISSUE_NUMBERS <<< "$USER_STORY_RESULTS"

echo "✅ Created ${#USER_STORY_ISSUE_NUMBERS[@]} user story issues:"
for i in "${!USER_STORY_ISSUE_NUMBERS[@]}"; do
    echo "   Story $((i + 1)): Issue #${USER_STORY_ISSUE_NUMBERS[$i]}"
done
```

**Simple and reliable execution:**
- **LLM parses** user stories and creates JSON data file
- **Shell script handles** all rate limiting, batching, and parallel creation
- **Results parsed** back into arrays for document updates
- **No complex rate limiting logic** in LLM-generated code

### Step 7: Create Task and Subtask Issues via Shell Script

**For each main task:**

**Main task issue title format:**

```
[TASK] {Main Task Title}
```

**Main task issue body:**

```markdown
## Task Overview

{Main Task Description}

## Sub-Tasks

This task is broken down into the following sub-issues:

{List of sub-task issues with links - populated after creation}

---

_Generated from spec: {spec-folder-name}_
_Source: tasks.md_
```

**For each subtask:**

**Subtask issue title format:**

```
[SUBTASK] {Subtask Title}
```

**Subtask issue body:**

```markdown
## Subtask Details

{Subtask Description}

## Parent Task

This subtask belongs to: #{parent-task-issue-number}

---

_Generated from spec: {spec-folder-name}_
_Source: tasks.md_
```

**Prepare tasks JSON data:**

```bash
echo "📝 Preparing main tasks data for batch creation..."

# Create JSON array for main tasks
TASKS_JSON="$TEMP_DIR/tasks.json"
cat > "$TASKS_JSON" << 'EOF'
[
EOF

TASK_COUNT=0
while IFS= read -r task_line; do
    if [[ "$task_line" =~ ^###[[:space:]]*Task[[:space:]]*[0-9]+\.[0-9]+: ]]; then
        TASK_TITLE=$(echo "$task_line" | sed 's/^### Task [0-9]*\.[0-9]*: //' | sed 's/ \[#[0-9]*\]$//')
        TASK_BODY=$(extract_task_body_from_file "$task_line")
        
        # Add to JSON array
        cat >> "$TASKS_JSON" << EOF
  {
    "title": "[TASK] $TASK_TITLE",
    "body": "$TASK_BODY",
    "labels": ["task"]
  }$([ $TASK_COUNT -lt $((TOTAL_TASKS - 1)) ] && echo ",")
EOF
        
        TASK_COUNT=$((TASK_COUNT + 1))
    fi
done < tasks.md

cat >> "$TASKS_JSON" << 'EOF'
]
EOF

echo "✅ Prepared $TASK_COUNT main tasks in $TASKS_JSON"
```

**Execute main task creation via shell script:**

```bash
echo "🚀 Executing main task creation via batch script..."

TASK_RESULTS=$(
    ./integrations/github/scripts/create-issues-batch.sh \
        "$TASKS_JSON" \
        "task"
)

# Parse results into array
IFS=$'\n' read -d '' -r -a TASK_ISSUE_NUMBERS <<< "$TASK_RESULTS"

echo "✅ Created ${#TASK_ISSUE_NUMBERS[@]} main task issues"
```

**Prepare subtasks JSON data:**

```bash
echo "📝 Preparing subtasks data for batch creation..."

# Create JSON array for subtasks
SUBTASKS_JSON="$TEMP_DIR/subtasks.json"
cat > "$SUBTASKS_JSON" << 'EOF'
[
EOF

SUBTASK_COUNT=0
# Parse subtasks from tasks.md and associate with parent tasks
while IFS= read -r subtask_line; do
    if [[ "$subtask_line" =~ ^-[[:space:]]*\[[[:space:]]*\] ]]; then
        SUBTASK_TITLE=$(echo "$subtask_line" | sed 's/^- \[ \] //')
        PARENT_TASK_INDEX=$(get_parent_task_index_for_subtask "$subtask_line")
        PARENT_TASK_NUMBER=${TASK_ISSUE_NUMBERS[$PARENT_TASK_INDEX]}
        
        SUBTASK_BODY="## Subtask Details\n\n$SUBTASK_TITLE\n\n## Parent Task\n\nThis subtask belongs to: #$PARENT_TASK_NUMBER"
        
        # Add to JSON array
        cat >> "$SUBTASKS_JSON" << EOF
  {
    "title": "[SUBTASK] $SUBTASK_TITLE",
    "body": "$SUBTASK_BODY",
    "labels": ["subtask"]
  }$([ $SUBTASK_COUNT -lt $((TOTAL_SUBTASKS - 1)) ] && echo ",")
EOF
        
        SUBTASK_COUNT=$((SUBTASK_COUNT + 1))
    fi
done < tasks.md

cat >> "$SUBTASKS_JSON" << 'EOF'
]
EOF

echo "✅ Prepared $SUBTASK_COUNT subtasks in $SUBTASKS_JSON"
```

**Execute subtask creation via shell script:**

```bash
echo "🚀 Executing subtask creation via batch script..."

SUBTASK_RESULTS=$(
    ./integrations/github/scripts/create-issues-batch.sh \
        "$SUBTASKS_JSON" \
        "subtask"
)

# Parse results into array
IFS=$'\n' read -d '' -r -a SUBTASK_ISSUE_NUMBERS <<< "$SUBTASK_RESULTS"

echo "✅ Created ${#SUBTASK_ISSUE_NUMBERS[@]} subtask issues"
```

**Execution summary:**
- **LLM parses** tasks.md and creates JSON data files for main tasks and subtasks
- **Shell script handles** all rate limiting, batching, and parallel creation
- **Parent-child relationships** established via issue numbers in subtask bodies
- **Results captured** and parsed back for document updates
- **No complex batching logic** required in LLM-generated code

### Step 8: Update Source Documents with Issue Numbers

**Update user-stories.md:**

For each user story, add issue number reference:

```markdown
## Story 1: User Profile Creation [#123]

**As a** new user
**I want to** create a profile with basic information
**So that** I can personalize my experience

### Issue: [#123](https://github.com/owner/repo/issues/123)

### Acceptance Criteria

...
```

**Update tasks.md:**

For each task and subtask, add issue number references:

```markdown
## Tasks

- [ ] 1. User Authentication System [#124]

  - [ ] 1.1 Write tests for authentication middleware [#125]
  - [ ] 1.2 Implement JWT token generation [#126]
  - [ ] 1.3 Create password hashing utilities [#127]

### Task Issues:

- Main Task: [#124](https://github.com/owner/repo/issues/124)
- Subtasks: [#125](https://github.com/owner/repo/issues/125), [#126](https://github.com/owner/repo/issues/126), [#127](https://github.com/owner/repo/issues/127)
```

**Document update strategy:**

- Use `MultiEdit` tool for efficient multiple edits
- Preserve existing formatting and structure
- Add issue links in consistent format
- Maintain original content integrity

### Step 9: Create Issue Relationship Mapping

**Generate mapping document:**

Create `.code-captain/specs/{spec-folder}/github-issues-mapping.md`:

```markdown
# GitHub Issues Mapping

> Generated: {current-date}
> Spec: {spec-folder-name}
> Repository: {owner/repo}

## User Story Issues

| Story Title   | Issue # | GitHub Link                                      |
| ------------- | ------- | ------------------------------------------------ |
| Story 1 Title | #123    | [Link](https://github.com/owner/repo/issues/123) |
| Story 2 Title | #124    | [Link](https://github.com/owner/repo/issues/124) |

## Task Issues

| Task Title   | Main Issue   | Sub-Issues                 |
| ------------ | ------------ | -------------------------- |
| Task 1 Title | [#125](link) | [#126](link), [#127](link) |
| Task 2 Title | [#128](link) | [#129](link), [#130](link) |

## Summary

- **Total Issues Created:** {count}
- **User Stories:** {count}
- **Main Tasks:** {count}
- **Subtasks:** {count}

## Source Files Updated

- ✅ user-stories.md - Added issue references
- ✅ tasks.md - Added issue references and links
- ✅ github-issues-mapping.md - Created mapping document
```

### Step 10: Verification & Summary

**Verify all issues created using GitHub CLI:**

- Use `gh issue list` to check each created issue number exists
- Verify issue URLs are valid and accessible
- Use `gh issue view {issue-number}` to confirm parent-child relationships
- Validate all labels were applied correctly

**Update final todos:**

- Mark all todos as completed
- Provide summary of created issues
- Confirm document updates successful

### Step 11: Sync Integration & Cache Update

**Trigger GitHub sync to update local cache:**

- **Automatic sync trigger**: Run `cc: sync` to update `.code-captain/github/cache/` with new issues
- **Cache consistency**: Ensure local cache reflects newly created issues
- **Available tasks update**: Refresh available tasks list with new unassigned issues
- **Traceability**: Update spec mapping to include GitHub issue states

**Integration verification:**
```bash
# Verify sync integration worked
gh issue list --limit 50 --json number,title,state | jq '.[] | select(.title | test("\\[(USER STORY|TASK|SUBTASK)\\]"))'
```

- Confirm all created issues appear in sync cache
- Verify issue counts match between creation log and cache
- Update project dashboard with new available work

**Present completion summary:**

```
✅ GitHub Issues Creation Complete

📊 Summary:
- User Stories: {count} issues created
- Main Tasks: {count} issues created  
- Subtasks: {count} issues created
- Total: {total-count} issues

📁 Updated Files:
- user-stories.md - Added issue references
- tasks.md - Added issue references and task links
- github-issues-mapping.md - Created mapping document

🔄 Sync Status:
- GitHub cache updated with new issues
- Available tasks refreshed: {available-count} tasks ready
- Project dashboard reflects current state

🔗 Repository: {owner/repo}
📋 All issues available at: https://github.com/{owner/repo}/issues

Next Steps:
- Use `cc: sync` to synchronize with GitHub and update local cache
- Use `cc: execute-task` to begin implementation
```

### Step 12: Cleanup Temporary Resources

**Clean up temporary working directory:**

```bash
echo "🧹 Cleaning up temporary resources..."

# Remove temporary working directory and files
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
    echo "✅ Cleaned up temporary directory: $TEMP_DIR"
fi

# Remove any temporary issue result files
rm -f /tmp/issue_result_$$_*

echo "✅ Cleanup complete"
```

**Final status:**
- All temporary JSON files removed
- Working directory cleaned up
- System resources freed
- Process complete and ready for next operation

## Tool Integration

**Uses Code Captain tools:**

- `codebase_search` to find and validate spec folders
- `file_search` to locate user stories and tasks files
- `read_file` to parse spec documents
- `MultiEdit` to update source documents with issue numbers
- `todo_write` for progress tracking throughout process
- `run_terminal_cmd` for all GitHub CLI command executions

**Uses shell script for issue creation:**

- `scripts/create-issues-batch.sh` - Handles all GitHub CLI operations
  - Dynamic rate limiting and batch sizing
  - Parallel issue creation within limits
  - Error handling and retry logic
  - Progress tracking and logging

**GitHub CLI commands (via shell script):**

- `gh auth status` to validate GitHub access
- `gh api rate_limit` for rate limit monitoring
- `gh issue create` for batch issue creation
- `gh label create` for label management
- `gh issue list` for verification

**Execution flow optimization:**

- LLM handles parsing and JSON preparation
- Shell script handles all rate-limited operations
- Clean separation of concerns for reliability
- Create main issues in parallel batches
- Update multiple document sections concurrently
- Verify multiple issue links simultaneously

## Error Handling & Edge Cases

**Missing spec files:**

- If user-stories.md missing: Error with guidance to run `create-spec` first
- If tasks.md missing: Create issues only from user stories
- If no spec folder found: Prompt user to specify path

**GitHub CLI access issues:**

- Verify GitHub CLI is installed and authenticated using `gh auth status`
- Check repository permissions with `gh repo view` before starting
- Handle rate limiting and network errors from CLI commands
- Provide clear error messages for authentication failures (`gh auth login` guidance)

**Document parsing errors:**

- Handle malformed user story structures gracefully
- Skip invalid task hierarchies with warnings
- Continue processing valid entries when possible

**GitHub CLI command failures (Enhanced):**

- **Retry logic**: 3 attempts for each `gh issue create` command with 2-second delays
- **Exit code tracking**: Capture and log specific failure reasons (network, auth, rate limiting)
- **URL validation**: Parse CLI output to confirm issue creation success via URL regex
- **Fail-fast approach**: Stop execution on any permanent failure (don't continue with partial success)
- **Label creation failures**: Handle missing labels gracefully with `|| true` fallback
- **Rate limiting**: Detect and handle GitHub API rate limiting with exponential backoff
- **Network timeouts**: Implement timeout handling for CLI commands
- **Authentication issues**: Provide clear guidance for `gh auth login` when auth fails

**Deterministic execution guarantees:**
- **No AI discretion**: All tasks and subtasks from spec must be created - no selective skipping allowed
- **Complete or fail**: Either create ALL issues successfully or fail completely
- **Progress transparency**: Show exact counts and progress percentages throughout
- **Consistent state**: Ensure documents are only updated after ALL issues are created successfully

## Integration with Existing Commands

**Works with create-spec:**

- Automatically detects create-spec output format
- Reads user-stories.md and tasks.md generated by create-spec
- Maintains consistency with spec folder structure

**Enhances project workflow:**

- Links GitHub issues to specification documents
- Creates traceable connection between requirements and work items
- Enables GitHub-based project tracking from Code Captain specs

**Cross-references:**

- Updates spec documents with issue links for easy navigation
- Creates bidirectional traceability between specs and GitHub
- Maintains consistency with existing Code Captain file organization

## Usage Notes

**Prerequisites:**

- Existing spec folder with user-stories.md and tasks.md
- GitHub repository with appropriate permissions
- GitHub CLI (`gh`) installed and authenticated (`gh auth login`)
- Current directory must be within the target git repository

**Best practices:**

- Run after completing spec creation and review with `cc: create-spec`
- Ensure spec documents are finalized before creating issues
- Verify GitHub CLI authentication before running: `gh auth status`
- Check repository permissions with: `gh repo view {owner/repo}`
- Run during periods of stable network connectivity for best results
- Review created issues after completion for quality assurance
- Use `cc: sync` after completion to update local cache

**Enhanced capabilities:**

- **Shell script architecture** - reliable execution with dynamic rate limiting
- **Intelligent batching** - adapts batch sizes based on GitHub quota status
- **Complete deterministic execution** - creates ALL tasks without skipping
- **Robust error handling** - retry logic and fail-fast for reliability
- **Label management** - automatically creates required labels
- **Sync integration** - updates local cache automatically
- **Progress tracking** - shows detailed progress throughout execution
- **Quality assurance** - verifies all issues before completion
- **Resource cleanup** - automatically removes temporary files and directories

**Limitations:**

- Requires GitHub repository context and proper permissions
- Creates new issues only (does not modify existing issues)
- Depends on specific user story and task formatting from `cc: create-spec`
- Requires stable network connection for GitHub CLI operations
- **Cannot be run multiple times on same spec** - creates duplicate issues
