# Update Story Command (update-story)

## Overview

Reorganize user stories within an existing specification by reordering, splitting, combining, or inserting stories while preserving implementation progress and maintaining clear task organization. This command focuses on optimizing development workflow and story dependencies without modifying the core specification requirements.

## Command Process

### Phase 1: Story Loading & Reorganization Contract (No File Modifications)

**Mission Statement:**
> Your goal is to help me reorganize user stories safely and efficiently. You will deliver the updated story package only after we both agree on the reorganization contract. **Important: If proposed changes affect specification requirements or scope, redirect to edit-spec command - this command only handles story organization and implementation details.**

#### Step 1.1: Specification Discovery & Story Loading

**Locate Target Specification:**
1. **SCAN** `.code-captain/specs/` directory for all existing specifications
2. **IF** spec-identifier provided:
   - **SEARCH** for exact folder name match: `[DATE]-{spec-identifier}`
   - **SEARCH** for partial name match in folder names
   - **SEARCH** for identifier in spec.md titles/content
3. **IF** spec-identifier is "latest":
   - **FIND** most recent folder by date prefix
4. **IF** no spec-identifier provided:
   - **LIST** all available specifications for user selection
5. **IF** multiple matches found:
   - **PRESENT** options for user disambiguation

**Load Current Story State:**
1. **READ** user stories overview (`user-stories/README.md`)
2. **READ** all individual story files in `user-stories/` directory
3. **SCAN** for task completion status across all stories
4. **ANALYZE** current story dependencies and order
5. **CHECK** for any implementation progress or completed tasks
6. **OUTPUT:** Current story organization summary with completion status

#### Step 1.2: Change Type Analysis & Spec Boundary Detection

**Internal Process (not shown to user):**
- Analyze proposed reorganization against current story structure
- Detect if changes affect:
  - **Story organization only** (reordering, splitting, combining) ✅ update-story
  - **Specification requirements** (new features, changed acceptance criteria) ❌ edit-spec needed
  - **Technical architecture** (new components, changed patterns) ❌ edit-spec needed
  - **Scope boundaries** (adding/removing functionality) ❌ edit-spec needed
- Catalog reorganization domains:
  - Story priority and execution order
  - Story size optimization (splitting large stories, combining small ones)
  - Task redistribution across stories
  - Dependency relationship updates
  - Progress preservation for completed work

**Spec Change Detection:**
If proposed changes include:
- Adding new functionality or features
- Changing acceptance criteria or user requirements
- Modifying technical architecture or patterns
- Changing project scope or success criteria

**Auto-redirect to edit-spec:**
```
⚠️ Specification Change Detected

Your proposed changes affect the core specification requirements, not just story organization:
- [Specific spec changes detected]

These changes require the edit-spec command instead of update-story.

Would you like me to:
- Run /edit-spec "[spec-identifier]" "[your proposed changes]" 
- Continue with story reorganization only (removing spec changes)
- Explain the difference between story reorganization vs specification changes

Which option would you prefer?
```

#### Step 1.3: Reorganization Clarification Loop

**Rules:**
- Ask ONE focused question at a time about the proposed reorganization
- After each answer, re-analyze current story structure for context
- Continue until reaching 95% confidence on reorganization impact
- Each question should target the highest-impact unknown
- **Never declare "final question"** - let the conversation flow naturally
- **Challenge reorganizations that could disrupt completed work** - better to surface concerns early

**Critical Analysis Responsibility:**
- If reorganization affects stories with completed tasks, explain impact and suggest preservation strategies
- If story splits would create unmanageable small stories, recommend combining approaches
- If reordering affects critical dependencies, assess timeline implications
- If changes would disrupt team workflow, surface coordination concerns

**Question Categories (examples):**
- "Story 3 has 4 completed tasks. When you split it, should those tasks stay in the original story or move to the new one?"
- "This reordering changes the dependency flow. Should Story 2 still wait for Story 1, or can it now run in parallel?"
- "You want to move Story 4 to execute before Story 1. Are you changing priority, or inserting it as Story 1b to run after Story 1?"
- "Story 6 currently has 2 tasks. After the split, both pieces would be very small. Should we combine one piece with another story?"
- "This reorganization affects [X] stories with existing progress. Should we preserve all completed work?"

#### Step 1.4: Reorganization Contract Proposal

When confident about reorganization, present a detailed contract:

**Format:**
```
## Reorganization Contract

**Target Specification:** [Specification name and date]

**Reorganization Type:** [Reordering/Splitting/Combining/Inserting]

**Proposed Changes:** [Clear description of story reorganization]

**Story Impact Assessment:**
- **Stories Affected:** [List of specific story files that need changes]
- **New Stories Created:** [Any additional story files to be created with numbering]
- **Stories Combined:** [Any story files that will be merged]
- **Stories Reordered:** [Changes in execution sequence and dependencies]

**Numbering Strategy:**
- **Letter insertion:** [e.g., Story 1, 1b, 1c, 2, 3, 3b...] for minimal disruption
- **Full renumbering:** [e.g., Story 1, 2, 3, 4, 5...] for major restructure
- **Rationale:** [Why this numbering approach was chosen]

**Task Preservation Plan:**
- **Completed Tasks Preserved:** [X] tasks across [Y] stories remain marked complete
- **Tasks Requiring Review:** [N] tasks need status reevaluation due to reorganization
- **Task Redistribution:** [How tasks move between stories during splits/combines]

**Dependency Updates:**
- **New Dependencies:** [Story X now depends on Story Y]
- **Removed Dependencies:** [Story A no longer waits for Story B]
- **Parallel Opportunities:** [Stories that can now run simultaneously]

**Development Workflow Impact:**
- **Team Coordination:** [How this affects parallel development]
- **Progress Tracking:** [Changes to README.md progress overview]
- **Timeline Effects:** [Impact on development schedule]

**⚠️ Risks & Concerns:**
- [Specific risks from the reorganization]
- [Potential disruption to ongoing work]

**💡 Recommendations:**
- [Suggestions for smoother reorganization]
- [Ways to minimize workflow disruption]

**Effort Estimate:** [Time needed to reorganize and update documentation]

---
Options:
- Type 'yes' to lock this reorganization contract and update the stories
- Type 'edit: [your changes]' to modify the contract
- Type 'preview' to see the new story structure before committing
- Type 'dependencies' to review the updated dependency flow in detail
- Ask more questions if anything needs clarification
```

### Phase 2: Story Reorganization (Post-Agreement Only)

**Triggered only after user confirms reorganization contract with 'yes'**

#### Step 2.1: Initialize Reorganization Tracking

```bash
# Use todo_write to track reorganization process
1. Backup original user-stories folder and README.md
2. Create new story files with updated numbering
3. Redistribute tasks across reorganized stories
4. Update user-stories/README.md with new structure and dependencies
5. Preserve completed task status where appropriate
6. Create change log entry
7. Present updated story package for validation
```

#### Step 2.2: Create Backup & Change Documentation

**Backup Process:**
1. **CREATE** backup folder: `.code-captain/specs/[spec-folder]/backups/`
2. **COPY** all current user-stories files to `backups/[timestamp]/`
3. **CREATE** change log entry in `CHANGELOG.md` within spec folder

**Change Log Format:**
```markdown
# Specification Change Log

## [Date] - Story Reorganization
**Modified by:** [User identifier or "Manual edit"]
**Reorganization Contract:** [Brief summary]

### Story Changes Made:
- [Story-level change 1: e.g., "Story 3 split into Story 3 and Story 3b"]
- [Story-level change 2: e.g., "Story 4 moved to Story 1b position"]

### Task Changes Made:
- [Task-level change 1: e.g., "Tasks 3.4-3.7 moved to Story 3b"]
- [Task-level change 2: e.g., "Completed tasks preserved across reorganization"]

### Dependency Changes:
- [Dependency change 1: e.g., "Story 3b now depends on Story 2"]
- [Dependency change 2: e.g., "Story 5 can now run parallel to Story 4"]

### Files Updated:
- user-stories/README.md - [progress tracking and dependency updates]
- user-stories/story-X-{name}.md - [specific story reorganization]

### Backup Location:
`backups/[timestamp]/`

---
```

#### Step 2.3: Execute Story Reorganization

**Story File Management:**

**For Story Reordering:**
- Rename story files with new numbering (1, 1b, 1c, 2, 3, 3b...)
- Update internal task numbering (1.1, 1.2... becomes 1b.1, 1b.2...)
- Preserve all story content and task completion status

**For Story Splitting:**
- Create new story file with appropriate letter designation
- Redistribute tasks between original and new story files
- Preserve completed task status in their final locations
- Update task numbering for each story (maintain 1.X, 1b.X pattern)
- Ensure both stories maintain clear user value and coherent task groups

**For Story Combining:**
- Merge tasks from multiple stories into single file
- Renumber combined tasks sequentially
- Preserve all completed task status
- If combined story exceeds 7 tasks, recommend split or task consolidation

**For Story Insertion:**
- Use letter designation for inserted stories (1b, 2c, etc.)
- Update subsequent story references if needed
- Maintain dependency chain coherence

**Task Status Preservation Rules:**
- ✅ **Preserve completed status** for tasks that remain functionally identical
- ⚠️ **Mark for review** tasks that move between stories but remain valid  
- ❌ **Reset status** only for tasks that fundamentally change due to reorganization

#### Step 2.4: Update user-stories/README.md

**Progress Tracking Table Update:**
```markdown
## Stories Summary

| Story | Title | Priority | Status | Tasks | Progress | Dependencies |
|-------|-------|----------|--------|-------|----------|--------------|
| 1     | [Original or updated title] | High | [Status] | 6 | 3/6 | None |
| 1b    | [New inserted story] | High | Not Started | 4 | 0/4 | Story 1 |
| 2     | [Reordered story] | Medium | [Status] | 5 | 5/5 | Story 1b |
| 3     | [Split story part 1] | Medium | [Status] | 4 | 2/4 | Story 2 |
| 3b    | [Split story part 2] | Low | Not Started | 3 | 0/3 | Story 3 |

**Total Progress:** [X]/[Y] tasks ([Z]%)
```

**Dependency Section Update:**
```markdown
## Story Dependencies

- Story 1b depends on Story 1 completion
- Story 2 depends on Story 1b completion  
- Story 3b depends on Story 3 completion
- Stories 2 and 3 can run in parallel

## Development Workflow

**Phase 1:** Stories 1 → 1b → 2
**Phase 2:** Story 3 (parallel with Phase 1 completion)
**Phase 3:** Story 3b
```

#### Step 2.5: Final Reorganization Review & Validation

Present updated story package with reorganization summary:

```
✅ Stories successfully reorganized!

📁 .code-captain/specs/[DATE]-feature-name/
├── 📋 spec.md - (Unchanged - spec requirements preserved)
├── 👥 user-stories/ - ⭐ Reorganized story structure
│   ├── 📊 README.md - ⭐ Updated progress tracking and dependencies
│   ├── 📝 story-1-{name}.md - ⭐ [Status: original/reordered/updated]
│   ├── 📝 story-1b-{name}.md - 🆕 [New inserted story]
│   ├── 📝 story-2-{name}.md - ⭐ [Status: reordered/updated]
│   ├── 📝 story-3-{name}.md - ⭐ [Status: split - part 1]
│   ├── 📝 story-3b-{name}.md - 🆕 [Status: split - part 2]
│   └── 📝 story-N-{name}.md - ⭐ [Other reorganized stories]
├── 📂 sub-specs/ - (Unchanged - technical specs preserved)
├── 💾 backups/[timestamp]/ - Original story organization preserved
└── 📝 CHANGELOG.md - ⭐ Reorganization documentation

## Reorganization Summary:
- **Stories Reordered:** [X] stories moved to new positions
- **Stories Split:** [Y] stories divided for better task management
- **Stories Combined:** [Z] stories merged for efficiency
- **New Stories Created:** [N] additional story files
- **Numbering Strategy:** [Letter insertion/Full renumbering] - [rationale]

## Task Preservation Results:
- **Tasks Preserved:** [X] completed tasks maintained their status
- **Tasks Moved:** [Y] tasks redistributed across stories during splits/combines
- **Tasks for Review:** [Z] tasks marked for status reevaluation
- **Total Tasks:** [N] tasks across all stories

## Development Impact:
- **Dependency Changes:** [Summary of new dependency flow]
- **Parallel Opportunities:** [Stories that can now run simultaneously]
- **Timeline Effect:** [Impact on overall development schedule]
- **Team Coordination:** [How this affects parallel development work]

Please review the reorganized stories:
- Does the new story order improve development workflow?
- Are story dependencies logical and achievable?
- Do split stories maintain clear user value?
- Is task distribution balanced across stories?
- Should any additional reorganization be made?

The reorganized user-stories folder now provides:
- **Improved workflow**: Better story sequencing and dependencies
- **Balanced effort**: More evenly distributed task complexity
- **Clearer focus**: Each story maintains coherent user value
- **Preserved progress**: All completed work remains intact
- **Team efficiency**: Better parallel development opportunities

The original story organization is safely backed up. If you need to rollback any changes, I can help restore from backup.
```

## Core Rules

1. **Scope Boundaries** - Only reorganize stories; redirect to edit-spec for requirement changes
2. **Progress Preservation** - Maintain completed task status where functionally appropriate  
3. **User Value Focus** - Ensure each reorganized story delivers standalone user value
4. **Dependency Coherence** - Maintain logical story execution order and dependencies
5. **Task Balance** - Keep stories manageable while allowing flexibility in task counts
6. **Safe Reorganization** - Always backup before changes, provide rollback capability
7. **Clear Documentation** - Track all changes with detailed rationale and impact analysis

## Tool Integration

**Primary Tools:**
- `codebase_search` - Find and analyze current story structure and dependencies
- `list_dir` - Discover story files and organization
- `read_file` - Load story content and track completion status
- `search_replace` / `MultiEdit` - Update story files with new numbering and content
- `todo_write` - Track reorganization progress and maintain workflow

**Story Management Pattern:**
1. **Discovery**: Use `list_dir` and `codebase_search` to map current story structure
2. **Analysis**: Use `read_file` to understand story content, tasks, and dependencies  
3. **Planning**: Use `todo_write` to track reorganization steps
4. **Execution**: Use `MultiEdit` for efficient story file updates
5. **Validation**: Use `read_file` to verify reorganization results

## AI Implementation Prompt

```
You are reorganizing user stories within a Code Captain specification.

MISSION: Safely reorganize story structure while preserving implementation progress and maintaining clear development workflow.

REORGANIZATION SPECIFICATION:
- Target Spec: {spec_identifier}
- Current Stories: {story_count} stories with {task_count} total tasks
- Reorganization Type: {reordering/splitting/combining/inserting}
- Proposed Changes: {detailed_changes}
- Numbering Strategy: {letter_insertion/full_renumbering}
- Progress Preservation: {completed_task_count} completed tasks to preserve

CRITICAL BOUNDARIES:
- ONLY reorganize story structure - no specification requirement changes
- PRESERVE all legitimately completed task status
- MAINTAIN user value coherence in each story
- ENSURE logical dependency flow after reorganization

WORKFLOW PHASES:
1. Load current story state and analyze completion status
2. Detect any specification changes and redirect to edit-spec if needed
3. Clarify reorganization details through structured questions
4. Present reorganization contract for approval
5. Execute safe reorganization with backup and change tracking

NUMBERING RULES:
- Use letter insertion (1, 1b, 1c, 2, 3, 3b...) for minimal disruption
- Use full renumbering (1, 2, 3, 4, 5...) for major restructures
- Auto-detect when full renumbering is more appropriate than letter insertion
- Update all cross-references and dependencies consistently

OUTPUT REQUIREMENTS:
1. Updated story files with new organization and numbering
2. Updated user-stories/README.md with new progress tracking and dependencies
3. Comprehensive backup and change documentation
4. Preserved task completion status where appropriate
5. Clear reorganization summary and validation points

QUALITY CHECKS:
- Each story maintains clear user value and coherent task groups
- Dependencies flow logically from reorganized story order
- Completed task status preserved appropriately across reorganization
- README.md accurately reflects new story structure and progress
- Backup created before any changes
- Change log documents all story and task level modifications
```

## Integration Notes

This command integrates with Code Captain by:

1. **Complementing edit-spec** - Handles story organization while edit-spec handles requirement changes
2. **Following Backup Patterns** - Uses same backup/changelog system for consistency
3. **Preserving Implementation** - Maintains development momentum while improving organization
4. **Smart Boundaries** - Auto-detects when changes require different commands
5. **Progress Continuity** - Preserves completed work across reorganization changes

The command focuses specifically on optimizing development workflow through story reorganization while maintaining clear boundaries around specification changes that require the more comprehensive edit-spec process.
