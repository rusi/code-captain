# Enhanced GitHub Sync Command (cc: sync)

## Overview

Advanced bidirectional synchronization between Code Captain local specs and GitHub issues using partitioned cache for optimal performance. This replaces the basic `sync-github-issues` with comprehensive sync capabilities.

## Usage

```bash
cc: sync [--full] [--my-work-only] [--spec spec-name]
```

**Examples:**

```bash
cc: sync                              # Default incremental sync
cc: sync --full                       # Full refresh (slower)
cc: sync --my-work-only               # Sync only my assigned tasks (fastest)
cc: sync --spec user-dashboard        # Sync specific spec only
```

## Command Process

### Step 1: Initialize Cache Structure

**Create partitioned cache directories:**

```
.code-captain/state/
├── index.json              # Project overview (always <50KB)
├── sync-metadata.json      # Sync history and status
├── my-assignments.json     # Current developer's work only
├── available-tasks.json    # Unassigned tasks only
├── specs/
│   ├── user-dashboard.json # Per-spec GitHub state
│   ├── payment-system.json
│   └── ...
└── sync-logs/
    ├── 2024-01-15.log      # Daily sync logs
    └── conflicts.json      # Active sync conflicts
```

### Step 2: Determine Sync Strategy

**Incremental Sync (Default):**
- Get last sync timestamp from `index.json`
- Only fetch issues updated since last sync
- Update affected cache partitions only

**Full Sync:**
- Fetch all issues with essential fields
- Rebuild entire cache structure
- Comprehensive but slower

**My Work Only:**
- Only sync issues assigned to current user
- Fastest option for personal workflow

**Spec-Specific:**
- Sync only issues related to specific spec/milestone
- Efficient for focused work

### Step 3: GitHub Data Retrieval

**Authentication & Rate Limit Check:**
```bash
gh auth status || exit "GitHub CLI not authenticated"
gh api rate_limit | jq '.rate.remaining' # Check rate limits
```

**Incremental Sync Query:**
```bash
LAST_SYNC=$(jq -r '.last_sync' .code-captain/state/index.json)
gh issue list \
  --json number,title,state,assignees,labels,milestone,updatedAt \
  --search "updated:>$LAST_SYNC" \
  --limit 1000
```

**Full Sync Query:**
```bash
gh issue list \
  --json number,title,state,assignees,labels,milestone,createdAt,updatedAt \
  --state all \
  --limit 1000
```

**My Assignments Query:**
```bash
gh issue list \
  --json number,title,state,labels,milestone,updatedAt \
  --assignee @me \
  --state all
```

### Step 4: Data Transformation & Partitioning

**Transform GitHub Issues to Code Captain Format:**

```typescript
interface GitHubIssue {
  number: number;
  title: string;
  state: 'OPEN' | 'CLOSED';
  assignees: Array<{login: string, name?: string}>;
  labels: Array<{name: string, color: string}>;
  milestone?: {title: string};
  createdAt: string;
  updatedAt: string;
}

interface CodeCaptainTask {
  platform_id: string;
  task_id: string;
  title: string;
  status: 'open' | 'in_progress' | 'completed' | 'blocked';
  assignee: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  spec_folder: string;
  created_date: string;
  last_modified: string;
}
```

**Priority Extraction from Labels:**
```typescript
function extractPriority(labels: Array<{name: string}>): string {
  const labelNames = labels.map(l => l.name.toLowerCase());
  
  if (labelNames.some(name => ['urgent', 'critical', 'p0'].includes(name))) {
    return 'urgent';
  }
  if (labelNames.some(name => ['high-priority', 'high', 'p1'].includes(name))) {
    return 'high';
  }
  if (labelNames.some(name => ['low-priority', 'low', 'p3'].includes(name))) {
    return 'low';
  }
  return 'medium'; // Default
}
```

**Status Mapping:**
```typescript
function mapGitHubState(state: string, assignees: Array<any>): string {
  if (state === 'CLOSED') return 'completed';
  if (state === 'OPEN' && assignees.length > 0) return 'in_progress';
  if (state === 'OPEN' && assignees.length === 0) return 'open';
  return 'open';
}
```

### Step 5: Update Cache Partitions

**Update index.json:**
```json
{
  "last_sync": "2024-01-15T14:30:00Z",
  "sync_status": "current",
  "platform": "github",
  "repository": "company/main-app",
  "gh_cli_version": "2.40.1",
  
  "summary": {
    "total_issues": 89,
    "open_issues": 34,
    "my_assigned": 3,
    "available_tasks": 12,
    "high_priority_open": 5
  },

  "my_active_work": [
    {
      "issue_number": 124,
      "title": "Create dashboard route and controller",
      "spec": "user-dashboard",
      "task_id": "1.2",
      "priority": "high"
    }
  ],

  "attention_needed": [
    "5 high-priority issues unassigned",
    "user-dashboard spec has 2 blocked tasks"
  ],

  "specs_status": {
    "user-dashboard": {"total": 5, "completed": 2, "in_progress": 2, "available": 1},
    "payment-system": {"total": 8, "completed": 1, "in_progress": 3, "available": 4}
  }
}
```

**Update my-assignments.json:**
```json
{
  "developer": {
    "github_username": "bob-dev",
    "display_name": "Bob Developer"
  },
  "last_updated": "2024-01-15T14:30:00Z",
  
  "assignments": [
    {
      "issue_number": 124,
      "title": "Create dashboard route and controller",
      "state": "OPEN",
      "spec_folder": "2024-01-15-user-dashboard",
      "task_id": "1.2",
      "priority": "high",
      "labels": ["enhancement", "high-priority", "backend"],
      "milestone": "User Dashboard v1.0",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T13:00:00Z",
      "url": "https://github.com/company/repo/issues/124"
    }
  ]
}
```

**Update available-tasks.json:**
```json
{
  "last_updated": "2024-01-15T14:30:00Z",
  "filter_criteria": {
    "assignee": null,
    "state": "OPEN",
    "exclude_labels": ["blocked", "on-hold"]
  },
  
  "available_tasks": [
    {
      "issue_number": 125,
      "title": "Implement account details API",
      "spec_folder": "2024-01-15-user-dashboard",
      "task_id": "1.3",
      "priority": "high",
      "labels": ["enhancement", "high-priority", "backend"],
      "milestone": "User Dashboard v1.0",
      "dependencies": ["124"],
      "estimated_hours": 4,
      "url": "https://github.com/company/repo/issues/125"
    }
  ]
}
```

**Update per-spec cache files:**
```json
{
  "spec_folder": "2024-01-15-user-dashboard",
  "milestone_name": "User Dashboard v1.0",
  "last_sync": "2024-01-15T14:30:00Z",
  
  "github_issues": [
    {
      "issue_number": 123,
      "task_id": "1.1",
      "title": "Write tests for dashboard component",
      "state": "CLOSED",
      "assignee": "alice-dev",
      "priority": "high",
      "created_at": "2024-01-15T09:00:00Z",
      "closed_at": "2024-01-15T12:00:00Z"
    }
  ],

  "mapping": {
    "local_to_github": {
      "1.1": 123,
      "1.2": 124,
      "1.3": 125
    },
    "github_to_local": {
      "123": "1.1",
      "124": "1.2", 
      "125": "1.3"
    }
  },

  "stats": {
    "total_tasks": 5,
    "issues_created": 5,
    "completed": 1,
    "in_progress": 2,
    "available": 2
  }
}
```

### Step 6: Conflict Detection & Resolution

**Detect sync conflicts:**
```json
{
  "conflicts": [
    {
      "type": "assignment_conflict",
      "issue_number": 124,
      "local_assignee": "alice-dev",
      "github_assignee": "bob-dev", 
      "detected_at": "2024-01-15T14:30:00Z",
      "resolution": "pending"
    },
    {
      "type": "status_conflict",
      "issue_number": 125,
      "local_status": "completed",
      "github_status": "OPEN",
      "detected_at": "2024-01-15T14:25:00Z", 
      "resolution": "accept_github"
    }
  ]
}
```

**Handle conflicts:**
- Assignment conflicts: GitHub wins (most recent assignment)
- Status conflicts: GitHub wins (authoritative state)
- Title/description conflicts: GitHub wins
- Log all conflicts for review

### Step 7: Update Local Spec Files

**Update spec files with latest GitHub state:**
- Update task status indicators
- Update assignee information
- Update issue links
- Preserve original spec content structure

### Step 8: Generate Sync Report

**Create sync summary:**
```markdown
✅ GitHub Sync Complete

📊 Summary:
- Sync Type: Incremental
- Issues Updated: 15
- Cache Files Updated: 3
- Conflicts Detected: 2 (auto-resolved)

📁 Updated Cache Files:
- index.json - Project overview updated
- my-assignments.json - 2 new assignments
- available-tasks.json - 5 new available tasks
- specs/user-dashboard.json - Status updates

⚠️ Conflicts Resolved:
- Issue #124: Assignment updated (alice-dev → bob-dev)
- Issue #125: Status updated (completed → open)

🕐 Last Sync: 2024-01-15T14:30:00Z
🔄 Next Recommended Sync: 2024-01-15T15:30:00Z
```

## Tool Integration

**GitHub CLI Commands:**
- `gh issue list` for fetching issues
- `gh auth status` for authentication check
- `gh api rate_limit` for rate limit monitoring

**Code Captain Tools:**
- `todo_write` for progress tracking
- `read_file` for cache file management
- `write` for cache updates
- `MultiEdit` for spec file updates
- `grep_search` for finding issue references

## Error Handling

**GitHub API Issues:**
- Handle authentication failures gracefully
- Implement rate limit backoff
- Provide partial sync on API errors

**Cache Corruption:**
- Validate cache file integrity
- Rebuild corrupted partitions
- Maintain backup of previous state

**Network Issues:**
- Graceful degradation when offline
- Resume interrupted syncs
- Clear error messaging

## Performance Optimizations

**Incremental Updates:**
- Only sync changed issues
- Update affected cache partitions only
- Parallel cache file updates

**Memory Management:**
- Stream large issue lists
- Partition data by concern
- Lazy load cache files

**API Efficiency:**
- Batch GitHub API calls
- Use appropriate pagination
- Cache expensive queries

## Integration with Existing Commands

**Enhances create-github-issues:**
- Automatically sync after issue creation
- Update cache with new issue mappings
- Maintain bidirectional traceability

**Works with existing workflows:**
- Maintains compatibility with current spec formats
- Preserves existing GitHub integration
- Extends functionality without breaking changes