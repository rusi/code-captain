# Create Azure DevOps Work Items Command (cc: create-azure-work-items)

## Overview

Automatically create Azure DevOps work items from existing user stories and tasks, establishing parent-child relationships through hierarchical work item types and updating source documents with work item IDs for traceability.

## Usage

```bash
cc: create-azure-work-items [spec-folder-path]
```

**Examples:**

```bash
cc: create-azure-work-items .code-captain/specs/2024-12-28-user-profile-dashboard/
cc: create-azure-work-items  # Auto-detect latest spec folder
```

## Command Process

### Step 1: Context Discovery & Validation

**Auto-detect spec folder (if no path provided):**

- Search `.code-captain/specs/` for most recent dated folder
- Validate folder contains required files: `user-stories.md` and `tasks.md`
- Confirm Azure DevOps project context is available

**Validate required files exist:**

- `user-stories.md` - Source for User Story work items
- `tasks.md` - Source for Task and Sub-task work items
- Optional: `spec.md` for additional context

**Azure DevOps project detection:**

- Check if current directory is a git repository with Azure DevOps remote
- Extract organization and project from remote origin
- Validate Azure DevOps access permissions and PAT configuration

### Step 2: Create Todo Tracking

**Use `todo_write` to track the work item creation process:**

```json
{
  "todos": [
    {
      "id": "azure-workitems-parse",
      "content": "Parse user stories and tasks from spec documents",
      "status": "in_progress"
    },
    {
      "id": "azure-workitems-create-stories",
      "content": "Create User Story work items from user stories",
      "status": "pending"
    },
    {
      "id": "azure-workitems-create-tasks",
      "content": "Create Task work items linked to User Stories",
      "status": "pending"
    },
    {
      "id": "azure-workitems-update-docs",
      "content": "Update user-stories.md and tasks.md with work item IDs",
      "status": "pending"
    },
    {
      "id": "azure-workitems-verify",
      "content": "Verify all work items created and documents updated",
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

### Step 4: Create User Story Work Items

**For each user story:**

**Work item title format:**

```
{Story Title}
```

**Work item fields:**

- **Work Item Type:** User Story
- **Title:** Story title
- **Description:** Full user story with acceptance criteria
- **State:** New
- **Area Path:** Current project area
- **Iteration Path:** Current iteration
- **Tags:** user-story, code-captain

**Description template:**

```markdown
## User Story

{User Story Description - "As a ... I want to ... So that ..."}

## Acceptance Criteria

{Acceptance Criteria formatted as checklist}

- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

## Definition of Done

{Definition of Done formatted as checklist}

- [ ] [Testable requirement]
- [ ] [Testable requirement]

---

_Generated from spec: {spec-folder-name}_
_Source: user-stories.md_
```

**Create work items using Azure DevOps REST API:**

- Use Azure DevOps REST API to create User Story work items
- Store returned work item IDs with user story mapping

### Step 5: Create Task Work Items

**For each main task:**

**Main task work item:**

- **Work Item Type:** Task
- **Title:** Main task title
- **Parent Link:** Link to related User Story (if applicable)
- **Description:** Task overview with subtask list
- **State:** New
- **Tags:** task, code-captain

**For each subtask:**

**Subtask work item:**

- **Work Item Type:** Task
- **Title:** Subtask title
- **Parent Link:** Link to main task
- **Description:** Subtask details
- **State:** New
- **Tags:** subtask, code-captain

**Description template for main tasks:**

```markdown
## Task Overview

{Main Task Description}

## Sub-Tasks

This task includes the following sub-tasks:

{List of subtask work items with links - populated after creation}

---

_Generated from spec: {spec-folder-name}_
_Source: tasks.md_
```

**Description template for subtasks:**

```markdown
## Subtask Details

{Subtask Description}

## Parent Task

This subtask belongs to: {parent-task-work-item-link}

---

_Generated from spec: {spec-folder-name}_
_Source: tasks.md_
```

### Step 6: Update Source Documents with Work Item IDs

**Update user-stories.md:**

For each user story, add work item ID reference:

```markdown
## Story 1: User Profile Creation [#123]

**As a** new user
**I want to** create a profile with basic information
**So that** I can personalize my experience

### Work Item: [123](https://dev.azure.com/org/project/_workitems/edit/123)

### Acceptance Criteria

...
```

**Update tasks.md:**

For each task and subtask, add work item ID references:

```markdown
## Tasks

- [ ] 1. User Authentication System [#124]

  - [ ] 1.1 Write tests for authentication middleware [#125]
  - [ ] 1.2 Implement JWT token generation [#126]
  - [ ] 1.3 Create password hashing utilities [#127]

### Task Work Items:

- Main Task: [124](https://dev.azure.com/org/project/_workitems/edit/124)
- Subtasks: [125](https://dev.azure.com/org/project/_workitems/edit/125), [126](https://dev.azure.com/org/project/_workitems/edit/126), [127](https://dev.azure.com/org/project/_workitems/edit/127)
```

### Step 7: Create Work Item Relationship Mapping

**Generate mapping document:**

Create `.code-captain/specs/{spec-folder}/azure-workitems-mapping.md`:

```markdown
# Azure DevOps Work Items Mapping

> Generated: {current-date}
> Spec: {spec-folder-name}
> Organization: {org-name}
> Project: {project-name}

## User Story Work Items

| Story Title   | Work Item # | Azure DevOps Link                                             |
| ------------- | ----------- | ------------------------------------------------------------- |
| Story 1 Title | 123         | [Link](https://dev.azure.com/org/project/_workitems/edit/123) |
| Story 2 Title | 124         | [Link](https://dev.azure.com/org/project/_workitems/edit/124) |

## Task Work Items

| Task Title   | Main Work Item | Sub Work Items           |
| ------------ | -------------- | ------------------------ |
| Task 1 Title | [125](link)    | [126](link), [127](link) |
| Task 2 Title | [128](link)    | [129](link), [130](link) |

## Summary

- **Total Work Items Created:** {count}
- **User Stories:** {count}
- **Main Tasks:** {count}
- **Subtasks:** {count}

## Source Files Updated

- ✅ user-stories.md - Added work item references
- ✅ tasks.md - Added work item references and links
- ✅ azure-workitems-mapping.md - Created mapping document
```

### Step 8: Verification & Summary

**Verify all work items created:**

- Check each returned work item ID is valid
- Verify Azure DevOps links are accessible
- Confirm parent-child relationships established

**Present completion summary:**

```
✅ Azure DevOps Work Items Creation Complete

📊 Summary:
- User Stories: {count} work items created
- Main Tasks: {count} work items created
- Subtasks: {count} work items created
- Total: {total-count} work items

📁 Updated Files:
- user-stories.md - Added work item references
- tasks.md - Added work item references and task links
- azure-workitems-mapping.md - Created mapping document

🔗 Organization: {org-name}
📋 Project: {project-name}
📋 All work items available at: https://dev.azure.com/{org}/{project}/_workitems
```

## Configuration Requirements

**Azure DevOps Access:**

- Personal Access Token (PAT) with Work Items (read, write) permissions
- Organization and project access
- Environment variable: `AZURE_DEVOPS_PAT`

**Project Configuration:**

- Extract organization and project from git remote URL
- Support both SSH and HTTPS Azure DevOps remotes
- Validate access to target project

## Error Handling & Edge Cases

**Missing configuration:**

- If PAT not configured: Provide setup instructions
- If not an Azure DevOps repository: Error with guidance
- If project access denied: Clear permission error message

**API limitations:**

- Handle rate limiting with appropriate delays
- Retry failed work item creation attempts
- Validate work item field requirements

**Document parsing errors:**

- Handle malformed user story structures gracefully
- Skip invalid task hierarchies with warnings
- Continue processing valid entries when possible

## Integration with Existing Commands

**Works with create-spec:**

- Automatically detects create-spec output format
- Reads user-stories.md and tasks.md generated by create-spec
- Maintains consistency with spec folder structure

**Azure DevOps specific features:**

- Utilizes Azure DevOps work item hierarchy (User Story > Task)
- Creates proper parent-child relationships
- Applies Azure DevOps specific tags and fields
- Integrates with Azure DevOps iterations and areas

## Usage Notes

**Prerequisites:**

- Existing spec folder with user-stories.md and tasks.md
- Azure DevOps project with appropriate permissions
- Azure DevOps PAT configured in environment

**Best practices:**

- Run after completing spec creation and review
- Ensure spec documents are finalized before creating work items
- Use consistent area and iteration paths for better organization
