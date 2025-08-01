# Sync GitHub Issues Command (cc: sync-github-issues)

## Overview

Automatically retrieve all GitHub issues, save them to a file, and update matching spec documents with current issue statuses.

## Usage

```bash
cc: sync-github-issues
```

**Example:**

```bash
cc: sync-github-issues    # Lists all issues, saves to file, and updates matching specs
```

## Command Process

### Step 1: Repository Context & Validation

**GitHub repository detection:**

- Verify current directory is a git repository
- Extract repository owner/name from remote origin
- Validate GitHub access permissions
- Confirm repository has issues enabled

**Spec folder detection:**

- Auto-detect all spec folders in the project
- Find documents containing issue number references (#123 format)
- Prepare list of files that may need updating

### Step 2: Create Todo Tracking

**Use `todo_write` to track the sync process:**

```json
{
  "todos": [
    {
      "id": "github-sync-fetch",
      "content": "Fetch all GitHub issues from repository",
      "status": "in_progress"
    },
    {
      "id": "github-sync-save",
      "content": "Save issues to github-issues.json file",
      "status": "pending"
    },
    {
      "id": "github-sync-update-specs",
      "content": "Update spec documents with matching issue statuses",
      "status": "pending"
    }
  ]
}
```

### Step 3: Fetch GitHub Issues

**Use GitHub MCP tools to retrieve all issues:**

- `mcp_github_list_issues` to fetch all issues (open and closed)
- Handle pagination for repositories with many issues
- Sort by issue number for consistent ordering

**Fetch all issue states:**

```javascript
const allIssues = await fetchAllPages([
  mcp_github_list_issues({ state: "all", sort: "created", direction: "asc" }),
]);
```

### Step 4: Save Issues to File

**Create issues data structure:**

```javascript
{
  lastSync: "2024-12-29T10:30:00Z",
  repository: "owner/repo",
  totalIssues: number,
  issues: [
    {
      number: 123,
      title: "User Profile Creation",
      state: "open",
      assignee: "username",
      labels: ["user-story", "feature"],
      created: "2024-12-28",
      updated: "2024-12-29",
      url: "https://github.com/owner/repo/issues/123",
      body: "Issue description..."
    }
  ]
}
```

**Save to file:**

- Save all issue data to `github-issues.json` in project root
- Include complete issue information for reference
- Update file timestamp with current sync time

### Step 5: Update Spec Documents with Issue Status

**Scan for matching issue references:**

- Search all `.md` files in the project for issue number patterns (`#123`)
- Create mapping of issue numbers to file locations and line numbers
- Extract current issue statuses from fetched GitHub data

**Update matching spec documents:**

**For each found issue reference:**

1. **Find issue number in document** (e.g., `#123`)
2. **Look up current status** from fetched GitHub data
3. **Update status indicators** next to issue references:

```markdown
# Original:

## Story 1: User Profile Creation [#123]

# Updated based on issue status:

## Story 1: User Profile Creation [#123] ✅ (if closed)

## Story 1: User Profile Creation [#123] 🔄 (if open)
```

**Status indicator patterns:**

- `✅` - Closed/Completed issues
- `🔄` - Open/In Progress issues
- `❌` - Issues that couldn't be found

**Update process:**

- Use `grep_search` to find all issue number references
- Use `MultiEdit` to update status indicators in multiple files
- Preserve original content, only update status symbols

### Step 6: Complete Sync Process

**Provide sync summary:**

```markdown
✅ GitHub issues sync completed successfully!

- **Issues fetched:** {total_count}
- **Issues saved to:** github-issues.json
- **Spec files updated:** {updated_files_count}
- **Issue references updated:** {updated_references_count}

**Files updated:**

- {list of files with updated status indicators}
```

**Mark todos as complete:**

Update all todo items to completed status and provide final summary of work done.

## Tool Integration

**Uses Code Captain tools:**

- `todo_write` for progress tracking throughout sync process
- `grep_search` to find issue number references in all markdown files
- `read_file` to parse spec documents
- `MultiEdit` to update status indicators in multiple files
- `write` to save issues data to github-issues.json

**Uses GitHub MCP tools:**

- `mcp_github_list_issues` to fetch all repository issues
- `mcp_github_get_me` to validate GitHub access

**Parallel execution optimization:**

- Fetch all issues with pagination handling
- Search for issue references across multiple files simultaneously
- Update multiple files with status indicators in parallel

## Error Handling & Edge Cases

**GitHub API Issues:**

- Handle rate limiting with appropriate backoff
- Provide clear error messages for authentication failures
- Continue with partial results if some API calls fail

**Missing Local Documents:**

- If no markdown files found: Complete sync but skip spec updates
- If issue references not found: Save issues to file but note no updates made

**Large Repositories:**

- Handle pagination for repositories with hundreds of issues
- Provide progress indicators for long-running syncs

## Integration with Existing Commands

**Works with create-github-issues:**

- Updates status indicators for issues created from specs
- Maintains consistency with Code Captain issue formatting

**Enhances project workflow:**

- Provides current status of all GitHub-tracked work in a simple file
- Updates spec documents with current issue statuses automatically
- Creates feedback loop between GitHub activity and local specs

## Usage Notes

**Prerequisites:**

- GitHub repository with existing issues
- GitHub authentication configured in environment

**Best practices:**

- Run regularly (daily/weekly) to maintain current status indicators
- Review github-issues.json file for complete issue information

**Performance considerations:**

- Large repositories handled through pagination
- Parallel updates for efficiency
