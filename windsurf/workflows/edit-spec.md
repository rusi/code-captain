---
description: Modify existing feature specifications using contract-first approach with safe change management
---

# Edit Spec Workflow

## Overview
Modify existing feature specifications using a contract-first approach that ensures complete alignment between developer and AI before updating any supporting files. Prevents assumptions by establishing a clear "modification contract" through structured clarification rounds.

## Usage Examples
- "user-authentication" "add social login options"
- "2024-01-15-payment-gateway" "change from Stripe to PayPal"  
- "latest" "remove the mobile app requirement"

## Command Process

### Phase 1: Specification Loading & Change Contract (No File Modifications)

**Mission Statement:**
> Help modify existing specifications safely and precisely. Deliver updated spec package only after both parties agree on the modification contract. **Challenge changes that could break existing functionality or create technical debt - better to surface concerns early than implement problematic modifications.**

#### Step 1.1: Specification Discovery & Loading

**Locate Target Specification:**
1. Use `find_by_name` to scan `.code-captain/specs/` directory for all existing specifications
2. If spec-identifier provided:
   - Search for exact folder name match: `[DATE]-{spec-identifier}`
   - Search for partial name match in folder names
   - Search for identifier in spec.md titles/content using `view_file`
3. If spec-identifier is "latest":
   - Find most recent folder by date prefix using `list_dir`
4. If no spec-identifier provided:
   - List all available specifications for user selection
5. If multiple matches found:
   - Present options for user disambiguation

**Load Current State:**
1. Use `view_file` to read primary specification file (`spec.md`)
2. Use `view_file` to read user stories overview (`user-stories/README.md`)
3. Use `view_file` to read all individual story files in `user-stories/` directory
4. Use `view_file` to read all sub-specifications in `sub-specs/` directory
5. Use `codebase_search` to scan for any implementation progress related to this spec
6. **Output:** Current specification summary with story status (no modifications yet)

#### Step 1.2: Impact Analysis & Change Assessment

**Internal Process (not shown to user):**
- Analyze proposed changes against current specification
- Identify affected individual story files and task groups
- Note potential ripple effects on:
  - Existing implementation (if any)
  - Specific user story files in user-stories/ folder
  - Story dependencies and sequencing
  - Technical architecture
  - Acceptance criteria within affected stories
  - Project timelines and story priorities
- Catalog modification domains:
  - Scope changes (adding/removing/splitting stories)
  - Technical approach modifications
  - Individual story adjustments or combinations
  - Task group reorganization (keeping 5-7 tasks max)
  - Performance/security requirement changes
  - Integration point modifications
  - Success criteria updates within stories

#### Step 1.3: Change Clarification Loop

**Rules:**
- Ask ONE focused question at a time about the proposed changes
- After each answer, re-analyze the existing spec and codebase using `codebase_search`
- Continue until reaching 95% confidence on modification impact
- Each question should target the highest-impact unknown or risk
- **Never declare "final question"** - let the conversation flow naturally
- **Challenge changes that could break existing functionality or create technical debt**

**Critical Analysis Responsibility:**
- If proposed changes conflict with existing implementation, explain impact and suggest migration strategies
- If scope changes affect other dependent specifications, identify and discuss dependencies
- If modifications introduce technical complexity, assess if benefits justify the cost
- If changes affect user stories that may already be in progress, surface timeline implications
- If proposed changes contradict original business value, question the modification rationale

**Risk Assessment Categories:**
- **Breaking Changes**: Will this break existing functionality?
- **Implementation Impact**: How much existing work needs to be modified/discarded?
- **Architecture Consistency**: Do changes align with existing patterns?
- **Scope Creep**: Are we expanding beyond the original contract boundaries?
- **Business Value**: Do changes improve or compromise original user value?

**Question Categories:**
- "This change would affect [existing user story]. Should we modify that story or create a new one?"
- "I see this conflicts with [existing implementation]. Should we plan a migration strategy?"
- "This modification increases complexity in [area]. Is the added value worth the technical cost?"
- "The original spec was focused on [goal]. How does this change serve that same goal?"
- "This would require changes to [dependent system]. Have you considered the downstream impact?"

#### Step 1.4: Modification Contract Proposal

When confident about changes, present a modification contract:

```
## Modification Contract

**Target Specification:** [Specification name and date]

**Proposed Changes:** [Clear description of what will be modified]

**Change Type:** [Addition/Removal/Modification/Refactor]

**Impact Assessment:**
- **Story Files Affected:** [Specific story-N-{name}.md files needing changes]
- **New Stories Required:** [Additional story files to create]
- **Stories to Remove/Combine:** [Story files becoming obsolete]
- **Technical Components Affected:** [Code/architecture areas needing updates]
- **Implementation Status:** [Existing work affected across stories]

**Migration Strategy:** [Handle existing implementation, preserve work, rollback plan]

**Updated Success Criteria:** [How success metrics change]

**Revised Scope:** Still/Now/Removed/Out of scope [summarized changes]

**⚠️ Risks & Concerns:**
- [Specific technical or business risks from the changes]
- [Potential complications or dependencies]

**💡 Recommendations:**
- [Suggestions for safer implementation approaches]
- [Ways to minimize disruption to existing work]

**Effort Estimate:** [How much additional/changed work is involved]

---
Options:
- Type 'yes' to lock this modification contract and update the specification
- Type 'edit: [your changes]' to modify the contract
- Type 'compare' to see a detailed before/after comparison
- Type 'risks' to explore implementation risks in detail
- Type 'rollback' to understand how to undo these changes later
- Ask more questions if anything needs clarification
```

### Phase 2: Specification Update (Post-Agreement Only)

**Triggered only after user confirms modification contract with 'yes'**

#### Step 2.1: Create Backup & Change Documentation

**Backup Process:**
1. Use `run_command` to get current timestamp:
   ```bash
   date +%Y%m%d-%H%M%S
   ```
2. Use `write_to_file` to create backup folder structure
3. Use `view_file` to read all current files and copy to backup location
4. Use `write_to_file` to create change log entry in `CHANGELOG.md`

**Change Log Format:**
```markdown
# Specification Change Log

## [Date] - [Change Type]
**Modified by:** [User] | **Contract:** [Brief summary]

### Changes: [List changes] | ### Files: [List files] | ### Backup: `backups/[timestamp]/`
```

#### Step 2.2: Update Core Specification Files

**spec.md Updates:**
- Use `view_file` to read current content
- Use `write_to_file` to update with:
  - Modified contract summary to reflect new agreement
  - Updated detailed requirements based on clarification
  - Revised implementation approach if changed
  - Change log reference
  - Updated status if appropriate

**user-stories/ folder Updates:**
- **README.md**: Update progress tracking table and story dependencies
- **Individual story files**: Modify affected story-N-{name}.md files
- **Story additions**: Create new story files with focused task groups (5-7 tasks max)
- **Story combinations**: Merge related stories if they become too granular
- **Story removals**: Archive or delete story files no longer needed
- **Task reorganization**: Ensure task groups within stories remain manageable
- **Status updates**: Mark completed tasks that might need rework across all stories

#### Step 2.3: Update Technical Sub-Specifications

**Selective Updates:**
- Only update sub-specs affected by the changes using `view_file` and `write_to_file`
- Create new sub-specs if new technical areas introduced
- Archive sub-specs no longer relevant
- Update cross-references between documents

#### Step 2.4: Story-Based Task Reconciliation

**Task Status Assessment Across Stories:**
- Review each story file for task status and relevance
- Identify completed tasks within stories that remain valid
- Flag tasks requiring rework due to changes
- Add new tasks while maintaining 5-7 task limit per story
- Split stories if task count would exceed 7 tasks
- Combine stories if task counts become too small
- Reorder stories if dependencies changed

**Story-Level Task Annotations:**
```markdown
# In story-1-user-auth.md:
- [x] 1.1 Write tests for user authentication ✅ (Still valid)
- [ ] 1.2 Implement OAuth provider ⚠️ (Needs modification)
- [ ] 1.3 Create social login UI 🆕 (New task from scope change)
- [~~] 1.4 Implement mobile-specific auth ❌ (Moved to new story-4-mobile-auth.md)
```

**Story Management:**
- **Split large stories**: If modifications would create >7 tasks, create additional story files
- **Archive obsolete stories**: Move removed stories to archived/ subfolder with timestamp
- **Update story dependencies**: Modify README.md to reflect new story relationships
- **Maintain story cohesion**: Ensure each story delivers standalone user value

#### Step 2.5: Final Update Review & Validation

Present updated package:
```
✅ Specification successfully updated!

📁 .code-captain/specs/[DATE]-feature-name/
├── 📋 spec.md - ⭐ Updated specification
├── 👥 user-stories/ - ⭐ Updated story organization  
│   ├── 📊 README.md - ⭐ Updated progress tracking
│   └── 📝 story-N-{name}.md - ⭐ Modified stories (5-7 tasks each)
├── 📂 sub-specs/ - ⭐ Updated technical specifications
├── 💾 backups/[timestamp]/ - Original files preserved
└── 📝 CHANGELOG.md - ⭐ Change documentation

**Changes:** [X] stories modified, [Y] added, [Z] archived | **Tasks:** [N] total (max 5-7 per story)

Please review: Does this accurately reflect the agreed modifications? Should any stories be split/combined?

Original version backed up. Can help with rollback if needed.
```

#### Step 2.6: Create Memory of Specification Changes (Optional)
After successful spec update, ask Cascade:
"Please create a memory of these specification changes: [brief summary of modifications and their impact on the feature]"

## Key Features

**Safe Modification:** Backup creation, change tracking, rollback capability, impact assessment

**Precise Control:** Focused clarification, risk assessment, migration strategy, selective updates

**Implementation Continuity:** Task status preservation, clear rework annotation, timeline impact analysis

**Change Documentation:** Detailed logs, comparison capability, rationale capture, rollback instructions

## Windsurf Tools Used

- `find_by_name`: Locate existing specifications and story files
- `list_dir`: Explore specification directories and folder structures
- `view_file`: Read current specification content and story files
- `write_to_file`: Update specification documents and create backups
- `codebase_search`: Analyze implementation progress and conflicts
- `run_command`: Get timestamps for backup folder naming

## Windsurf Features Used

- **Memories**: After completion, optionally create memory of specification changes and their rationale

---

*📝 Safe evolution keeps specifications valuable. Change with intention, preserve with care.*