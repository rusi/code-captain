# Sync Azure DevOps Work Items Command (cc: sync-azure-work-items)

## Overview

Retrieve and synchronize with current Azure DevOps work items, providing organized reports and optionally updating local spec documents with current work item statuses and progress.

## Usage

```bash
cc: sync-azure-work-items [options]
```

**Examples:**

```bash
cc: sync-azure-work-items                           # Full sync with default options
cc: sync-azure-work-items --state active            # Only active work items
cc: sync-azure-work-items --type user-story         # Only user story work items
cc: sync-azure-work-items --update-docs             # Sync status back to local docs
cc: sync-azure-work-items --spec-folder .code-captain/specs/2024-12-28-feature/
```

**Options:**

- `--state [active|closed|all]` - Filter by work item state (default: active)
- `--type [user-story|task|bug|all]` - Filter by work item type (default: all)
- `--update-docs` - Update local spec documents with current work item status
- `--spec-folder [path]` - Target specific spec folder for document updates
- `--format [summary|detailed|json]` - Output format (default: summary)
- `--iteration [current|all]` - Filter by iteration (default: current)

## Command Process

### Step 1: Azure DevOps Project Context & Validation

**Azure DevOps project detection:**

- Verify current directory is a git repository with Azure DevOps remote
- Extract organization and project from remote origin
- Validate Azure DevOps access permissions and PAT configuration
- Confirm project has work items enabled

**Spec folder detection (if --update-docs used):**

- Auto-detect latest spec folder if --spec-folder not provided
- Validate spec folder contains `user-stories.md`, `tasks.md`, or `azure-workitems-mapping.md`
- Check for existing work item references in documents

### Step 2: Create Todo Tracking

**Use `todo_write` to track the sync process:**

```json
{
  "todos": [
    {
      "id": "azure-sync-fetch",
      "content": "Fetch current Azure DevOps work items with filters applied",
      "status": "in_progress"
    },
    {
      "id": "azure-sync-organize",
      "content": "Organize work items by type and categorize by spec relationship",
      "status": "pending"
    },
    {
      "id": "azure-sync-report",
      "content": "Generate organized work item report and summary",
      "status": "pending"
    },
    {
      "id": "azure-sync-update-docs",
      "content": "Update local spec documents with current status (if requested)",
      "status": "pending"
    },
    {
      "id": "azure-sync-summary",
      "content": "Provide sync summary and actionable insights",
      "status": "pending"
    }
  ]
}
```

### Step 3: Fetch Azure DevOps Work Items

**Use Azure DevOps REST API to retrieve work items:**

- Query work items using WIQL (Work Item Query Language)
- Fetch work item details, relationships, and fields
- Handle pagination for projects with many work items
- Sort by state change date, creation date, or priority

**WIQL Query Construction:**

```sql
SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType],
       [System.AssignedTo], [System.CreatedDate], [System.ChangedDate]
FROM WorkItems
WHERE [System.TeamProject] = '{project-name}'
  AND [System.State] IN ({state-filter})
  AND [System.WorkItemType] IN ({type-filter})
  AND [System.Tags] CONTAINS 'code-captain'
ORDER BY [System.ChangedDate] DESC
```

**Work item categorization:**

- **User Story Work Items**: WorkItemType = "User Story"
- **Task Work Items**: WorkItemType = "Task"
- **Bug Work Items**: WorkItemType = "Bug"
- **Feature Work Items**: WorkItemType = "Feature"
- **Code Captain Items**: Tags contain "code-captain"

### Step 4: Organize and Analyze Work Items

**Create work item organization structure:**

```javascript
{
  summary: {
    total: number,
    active: number,
    closed: number,
    byType: {
      userStories: number,
      tasks: number,
      bugs: number,
      features: number
    },
    byState: {
      new: number,
      active: number,
      resolved: number,
      closed: number
    }
  },
  userStories: [
    {
      id: 123,
      title: "User Profile Creation",
      state: "Active",
      assignee: "user@company.com",
      tags: ["user-story", "code-captain"],
      created: "2024-12-28",
      changed: "2024-12-29",
      url: "https://dev.azure.com/org/project/_workitems/edit/123",
      linkedSpec: ".code-captain/specs/2024-12-28-feature/",
      areaPath: "ProjectName\\FeatureName",
      iterationPath: "ProjectName\\Sprint 1",
      progressInfo: {
        totalCriteria: 5,
        completedCriteria: 2
      }
    }
  ],
  tasks: [
    {
      id: 124,
      title: "User Authentication System",
      state: "Active",
      parent: 123,
      childTasks: [125, 126, 127],
      completedChildTasks: 1,
      totalChildTasks: 3,
      remainingWork: 16,
      completedWork: 8
    }
  ],
  bugs: [
    {
      id: 128,
      title: "Login form validation error",
      state: "New",
      severity: "2 - High",
      priority: 2
    }
  ],
  orphanedWorkItems: [], // Work items without clear spec relationship
  staleWorkItems: []     // Work items not updated in X days
}
```

**Analyze work item relationships:**

- Identify parent-child relationships between User Stories and Tasks
- Match work items to local spec documents using work item mapping
- Detect orphaned work items not linked to any spec
- Identify stale work items (not updated in configurable timeframe)
- Calculate progress metrics based on work item states and remaining work

### Step 5: Generate Work Item Reports

**Summary Report Format:**

```markdown
# Azure DevOps Work Items Sync Report

> Generated: {current-date}
> Organization: {org-name}
> Project: {project-name}
> Filters Applied: {filter-summary}

## 📊 Work Item Summary

| Type         | Active | Closed | Total  |
| ------------ | ------ | ------ | ------ |
| User Stories | 3      | 2      | 5      |
| Tasks        | 12     | 18     | 30     |
| Bugs         | 2      | 5      | 7      |
| Features     | 1      | 0      | 1      |
| **Total**    | **18** | **25** | **43** |

## 🎯 User Stories

### Active User Stories

- [123](link) **User Profile Creation**
  - State: Active | Assignee: user@company.com | Updated: 2 days ago
  - Progress: 2/5 acceptance criteria completed
  - Iteration: Sprint 1 | Area: ProjectName\FeatureName
  - Linked to: `.code-captain/specs/2024-12-28-user-profile/`

### Recently Closed User Stories

- [121](link) **User Registration**
  - State: Closed | Completed: 1 day ago
  - All acceptance criteria completed ✅

## 🔧 Tasks & Subtasks

### Active Tasks

- [124](link) **User Authentication System** (2/3 child tasks complete)
  - Remaining Work: 16 hours | Completed: 8 hours
  - [125](link) ✅ Write tests for authentication (closed)
  - [126](link) 🔄 Implement JWT token generation (active)
  - [127](link) ⏳ Create password hashing utilities (new)

### Blocked Tasks

- [128](link) **Database Migration** - Waiting for infrastructure approval
  - Blocked Reason: External dependency

## 🐛 Bugs & Issues

### Active Bugs

- [129](link) **Login form validation error** (Severity: High, Priority: 2)
  - Assignee: dev@company.com | Created: 3 days ago
  - Area: ProjectName\Authentication

## ⚠️ Work Items Requiring Attention

### Stale Work Items (No updates > 7 days)

- [119](link) **API Documentation** - Last updated 10 days ago
- [115](link) **Error Handling** - Last updated 14 days ago

### Orphaned Work Items (No spec relationship)

- [130](link) **Bug: Login form styling** - Not linked to any spec

### High Priority Items

- [131](link) **Critical: Data loss on logout** (Priority 1, Severity 1)

## 📈 Sprint Progress

### Current Iteration: Sprint 1

- **Planned Work:** 80 hours
- **Completed Work:** 32 hours (40%)
- **Remaining Work:** 48 hours
- **Burndown Status:** On track

### Velocity Metrics

- **Average Completion Rate:** 1.2 work items per day
- **Story Points Completed:** 13/21 (62%)
- **Estimated Completion:** 5 days remaining

## 🔄 Sync Status

- **Last Sync:** {timestamp}
- **Work Items Fetched:** {count}
- **Spec Documents:** {updated-count} updated
- **New Work Items Since Last Sync:** {new-count}
- **Closed Work Items Since Last Sync:** {closed-count}
```

### Step 6: Update Local Spec Documents (Optional)

**If --update-docs flag provided:**

**Update user-stories.md:**

Add state indicators and progress tracking:

```markdown
## Story 1: User Profile Creation [#123] 🔄

**State:** Active | **Assignee:** user@company.com | **Updated:** 2 days ago
**Iteration:** Sprint 1 | **Area:** ProjectName\FeatureName

**As a** new user
**I want to** create a profile with basic information  
**So that** I can personalize my experience

### Work Item: [123](https://dev.azure.com/org/project/_workitems/edit/123)

### Acceptance Criteria (2/5 completed)

- [x] Given a new user, when they access profile creation, then form is displayed
- [x] Given valid profile data, when submitted, then profile is created
- [ ] Given invalid email, when submitted, then validation error shown
- [ ] Given profile creation, when successful, then welcome email sent
- [ ] Given profile creation, when successful, then user redirected to dashboard

### Progress: 40% complete (2/5 criteria)

### Remaining Work: 12 hours | Completed: 8 hours
```

**Update tasks.md:**

Add state and progress indicators:

```markdown
## Tasks

- [x] 1. User Authentication System [#124] 🔄 (2/3 child tasks complete)

  - [x] 1.1 Write tests for authentication middleware [#125] ✅
  - [ ] 1.2 Implement JWT token generation [#126] 🔄 (6h remaining)
  - [ ] 1.3 Create password hashing utilities [#127] ⏳ (8h estimated)

### Task Progress:

- Main Task: [124](https://dev.azure.com/org/project/_workitems/edit/124) - 67% complete
- Overall Progress: 2/3 child tasks completed
- Remaining Work: 14 hours total
- Estimated Completion: Based on current velocity
```

### Step 7: Generate Actionable Insights

**Identify actionable items:**

```markdown
## 🎯 Recommended Actions

### Immediate Actions Needed

1. **Review Stale Work Items** - 2 work items haven't been updated in >7 days
2. **Assign Orphaned Work Items** - 1 work item needs spec relationship established
3. **Address High Priority Bugs** - 1 critical bug needs immediate attention

### Sprint Health Check

- **User Stories:** 60% completion rate (3/5 closed)
- **Tasks:** Making good progress, 67% of active tasks on track
- **Velocity:** Average 1.2 work items closed per day over last 7 days
- **Burndown:** Currently on track for sprint completion

### Capacity Planning

- **Team Capacity:** 40 hours/week total
- **Current Workload:** 48 hours remaining work
- **Recommendation:** Sprint completion achievable with current pace

### Risk Indicators

- **Blocked Items:** 1 task waiting for external dependency
- **Overdue Items:** 0 work items past due date
- **Unassigned Critical Work:** 0 high-priority items unassigned
```

### Step 8: Save Sync Results

**Create sync report document:**

Save to `.code-captain/reports/azure-sync-{date}-{time}.md`

**Update sync metadata:**

Create or update `.code-captain/azure-sync-status.json`:

```json
{
  "lastSync": "2024-12-29T10:30:00Z",
  "organization": "orgname",
  "project": "projectname",
  "totalWorkItems": 43,
  "activeWorkItems": 18,
  "filters": {
    "state": "all",
    "type": "all",
    "iteration": "current"
  },
  "syncDuration": "2.8s",
  "workItemsUpdated": 8,
  "newWorkItemsSinceLastSync": 2,
  "closedWorkItemsSinceLastSync": 3,
  "sprintMetrics": {
    "currentIteration": "Sprint 1",
    "plannedWork": 80,
    "completedWork": 32,
    "remainingWork": 48,
    "velocityPerDay": 1.2
  }
}
```

## Configuration Requirements

**Azure DevOps Access:**

- Personal Access Token (PAT) with Work Items (read) permissions
- Organization and project access
- Environment variable: `AZURE_DEVOPS_PAT`

**Project Configuration:**

- Extract organization and project from git remote URL
- Support both SSH and HTTPS Azure DevOps remotes
- Validate access to target project

## Error Handling & Edge Cases

**Azure DevOps API Issues:**

- Handle rate limiting with appropriate backoff
- Provide clear error messages for authentication failures
- Continue with partial results if some API calls fail
- Cache results to minimize API calls

**Missing Local Documents:**

- If no spec folders found: Generate report without local sync
- If mapping file missing: Create new mapping from current state
- If spec documents missing: Note in report but continue sync

**Large Projects:**

- Handle pagination for projects with hundreds of work items
- Implement filtering to avoid overwhelming output
- Provide progress indicators for long-running syncs
- Option to limit results to current iteration only

## Integration with Existing Commands

**Works with create-azure-work-items:**

- Reads and validates work item mapping files created by create-azure-work-items
- Updates progress on work items created from specs
- Maintains consistency with Code Captain work item tagging

**Azure DevOps specific features:**

- Utilizes Azure DevOps iterations and area paths
- Tracks remaining work and capacity metrics
- Integrates with Azure DevOps sprint planning
- Provides burndown and velocity analytics

## Usage Notes

**Prerequisites:**

- Azure DevOps project with existing work items
- Azure DevOps PAT configured in environment
- Optional: Existing spec folders with work item mappings

**Best practices:**

- Run regularly (daily) during active sprints
- Use iteration filtering to focus on current sprint work
- Review actionable insights for daily standups
- Update docs regularly to maintain traceability

**Performance considerations:**

- Large projects may require filtering to avoid API limits
- Use caching for frequently accessed work item data
- Consider pagination limits for projects with >200 work items
- Respect Azure DevOps API rate limits
