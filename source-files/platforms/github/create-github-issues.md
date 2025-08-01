# Create GitHub Issues Command (cc: create-github-issues)

## Overview

Automatically create GitHub issues from existing user stories and tasks, establishing parent-child relationships through sub-issues and updating source documents with issue numbers for traceability.

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

### Step 1: Context Discovery & Validation

**Auto-detect spec folder (if no path provided):**

- Search `.code-captain/specs/` for most recent dated folder
- Validate folder contains required files: `user-stories.md` and `tasks.md`
- Confirm GitHub repository context is available

**Validate required files exist:**

- `user-stories.md` - Source for main issues
- `tasks.md` - Source for sub-task issues
- Optional: `spec.md` for additional context

**GitHub repository detection:**

- Check if current directory is a git repository
- Extract repository owner/name from remote origin
- Validate GitHub access permissions

### Step 2: Create Todo Tracking

**Use `todo_write` to track the issue creation process:**

```json
{
  "todos": [
    {
      "id": "github-issues-parse",
      "content": "Parse user stories and tasks from spec documents",
      "status": "in_progress"
    },
    {
      "id": "github-issues-create-main",
      "content": "Create main GitHub issues from user stories",
      "status": "pending"
    },
    {
      "id": "github-issues-create-subtasks",
      "content": "Create sub-task issues linked to main issues",
      "status": "pending"
    },
    {
      "id": "github-issues-update-docs",
      "content": "Update user-stories.md and tasks.md with issue numbers",
      "status": "pending"
    },
    {
      "id": "github-issues-verify",
      "content": "Verify all issues created and documents updated",
      "status": "pending"
    }
  ]
}
```

### Step 3: Parse Spec Documents

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

### Step 4: Create Main GitHub Issues from User Stories

**For each user story:**

**Issue title format:**

```
[USER STORY] {Story Title}
```

**Issue body template:**

```markdown
## User Story

{User Story Description - "As a ... I want to ... So that ..."}

## Acceptance Criteria

{Acceptance Criteria as GitHub task list}

- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

## Definition of Done

{Definition of Done as GitHub task list}

- [ ] [Testable requirement]
- [ ] [Testable requirement]

---

_Generated from spec: {spec-folder-name}_
_Source: user-stories.md_
```

**Create issues using GitHub MCP:**

- Use `mcp_github_create_issue` for each user story
- Apply labels: `["user-story", "feature"]`
- Store returned issue numbers with user story mapping

### Step 5: Create Sub-Task Issues from Tasks

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

**Create issues with relationships:**

1. Create main task issue first
2. Create subtask issues referencing parent
3. Update main task issue body with subtask links
4. Apply labels: `["task"]` for main tasks, `["subtask"]` for subtasks

### Step 6: Update Source Documents with Issue Numbers

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

### Step 7: Create Issue Relationship Mapping

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

### Step 8: Verification & Summary

**Verify all issues created:**

- Check each returned issue number is valid
- Verify GitHub links are accessible
- Confirm parent-child relationships established

**Update final todos:**

- Mark all todos as completed
- Provide summary of created issues
- Confirm document updates successful

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

🔗 Repository: {owner/repo}
📋 All issues available at: https://github.com/{owner/repo}/issues
```

## Tool Integration

**Uses Code Captain tools:**

- `codebase_search` to find and validate spec folders
- `file_search` to locate user stories and tasks files
- `read_file` to parse spec documents
- `MultiEdit` to update source documents with issue numbers
- `todo_write` for progress tracking throughout process

**Uses GitHub MCP tools:**

- `mcp_github_get_me` to validate GitHub access
- `mcp_github_create_issue` to create all issues
- `mcp_github_update_issue` to establish parent-child relationships
- `mcp_github_list_issues` for verification

**Parallel execution optimization:**

- Parse user stories and tasks simultaneously
- Create main issues in parallel batches
- Update multiple document sections concurrently
- Verify multiple issue links simultaneously

## Error Handling & Edge Cases

**Missing spec files:**

- If user-stories.md missing: Error with guidance to run `create-spec` first
- If tasks.md missing: Create issues only from user stories
- If no spec folder found: Prompt user to specify path

**GitHub access issues:**

- Verify repository permissions before starting
- Handle rate limiting with appropriate delays
- Provide clear error messages for authentication failures

**Document parsing errors:**

- Handle malformed user story structures gracefully
- Skip invalid task hierarchies with warnings
- Continue processing valid entries when possible

**Issue creation failures:**

- Track which issues failed to create
- Provide retry mechanism for failed issues
- Update documents only for successfully created issues

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
- GitHub authentication configured in environment

**Best practices:**

- Run after completing spec creation and review
- Ensure spec documents are finalized before creating issues
- Use consistent labeling and formatting for better GitHub organization

**Limitations:**

- Requires GitHub repository context
- Cannot modify existing issues (creates new ones only)
- Depends on specific user story and task formatting from create-spec
