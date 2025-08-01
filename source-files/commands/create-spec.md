# Create Spec Command (cc: create-spec)

## Overview

Generate comprehensive feature specifications with technical details, task breakdown, and implementation roadmap. This command creates a complete specification package including requirements, technical specs, database schemas, API documentation, and implementation tasks.

## Usage

```bash
cc: create-spec "feature description"
```

## Command Process

### Step 1: Spec Initiation & Context Gathering

**Check for existing context files:**

- If `.code-captain/specs/` contains relevant specs, analyze them for consistency
- If project has `tech-stack.md`, `code-style.md`, or `objective.md`, load for context
- Scan codebase to understand current architecture and patterns

**Clarify requirements:**

- Scope boundaries (what's included/excluded)
- Technical considerations and constraints
- UI/UX requirements if applicable
- Integration points with existing systems
- Performance and scalability requirements

### Step 2: Create Spec Directory Structure

**Create todo tracking and folder setup:**

Use `todo_write` to track the spec creation process:

```
1. Create spec folder with date and feature name
2. Generate core specification documents
3. Create technical sub-specifications
4. Generate user stories and acceptance criteria
5. Create implementation task breakdown
6. Review and validate complete specification
```

**Generate dated folder:**

1. **Determine current date** - Use file system timestamp for accuracy
2. **Create feature name** - Convert description to kebab-case (max 5 words)
3. **Create directory structure:**

```bash
mkdir -p .code-captain/specs/YYYY-MM-DD-{feature-name}/sub-specs/
```

**Final folder structure:**

```
.code-captain/specs/YYYY-MM-DD-{feature-name}/
├── spec.md                    # Main specification document
├── spec-lite.md              # Condensed summary for AI context
├── user-stories.md           # Detailed user stories and acceptance criteria
├── tasks.md                  # Implementation task breakdown
└── sub-specs/                # Detailed technical specifications
    ├── technical-spec.md     # Technical requirements and architecture
    ├── database-schema.md    # Database changes (if needed)
    └── api-spec.md          # API documentation (if needed)
```

**Example folder names:**

- `2024-12-28-user-profile-dashboard/`
- `2024-12-28-password-reset-flow/`
- `2024-12-28-api-rate-limiting/`

### Step 3: Generate Core Specification (spec.md)

**Template Structure:**

```markdown
# Spec Requirements Document

> Spec: [FEATURE_NAME]
> Created: [CURRENT_DATE]
> Status: Planning

## Overview

[1-2 sentence goal and objective]

## User Stories

_Detailed user stories with acceptance criteria are documented in @user-stories.md_

## Spec Scope

1. **[FEATURE_NAME]** - [One sentence description]
2. **[FEATURE_NAME]** - [One sentence description]

## Out of Scope

- [Excluded functionality 1]
- [Excluded functionality 2]

## Expected Deliverable

1. [Testable outcome 1]
2. [Testable outcome 2]
```

### Step 4: Create User Stories Document (user-stories.md)

**Purpose:** Detailed user stories with INVEST principles and acceptance criteria

**Template Structure:**

```markdown
# User Stories

> Related Spec: @spec.md
> Created: [CURRENT_DATE]

## Story 1: [STORY_TITLE]

**As a** [USER_TYPE]
**I want to** [ACTION]
**So that** [BENEFIT]

### Acceptance Criteria

- [ ] Given [CONTEXT], when [ACTION], then [OUTCOME]
- [ ] Given [CONTEXT], when [ACTION], then [OUTCOME]
- [ ] Given [CONTEXT], when [ACTION], then [OUTCOME]

### Definition of Done

- [ ] [TESTABLE_REQUIREMENT]
- [ ] [TESTABLE_REQUIREMENT]

---

## Story 2: [STORY_TITLE]

**As a** [USER_TYPE]
**I want to** [ACTION]
**So that** [BENEFIT]

### Acceptance Criteria

- [ ] Given [CONTEXT], when [ACTION], then [OUTCOME]
- [ ] Given [CONTEXT], when [ACTION], then [OUTCOME]

### Definition of Done

- [ ] [TESTABLE_REQUIREMENT]
- [ ] [TESTABLE_REQUIREMENT]
```

**Content guidelines:**

- 1-5 user stories per feature specification
- Follow INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- Include Given-When-Then acceptance criteria
- Add definition of done checklist for each story
- Focus on user value and business outcomes

### Step 5: Generate Technical Specifications

**Technical Spec (sub-specs/technical-spec.md):**

- Functionality details and business logic
- UI/UX specifications and wireframes
- Integration requirements with existing systems
- Performance criteria and scalability considerations
- Security requirements and data protection
- External dependencies (only if new libraries needed)

**Database Schema (sub-specs/database-schema.md) - Conditional:**

- Only created if database changes are required
- New tables, columns, and modifications
- Migration scripts and SQL syntax
- Indexes, constraints, and relationships
- Performance considerations and data integrity

**API Specification (sub-specs/api-spec.md) - Conditional:**

- Only created if API changes are required
- HTTP methods, endpoints, and parameters
- Request/response formats and examples
- Error handling and status codes
- Authentication and authorization requirements

### Step 6: Create Implementation Tasks (tasks.md)

**Task Structure:**

- 1-5 major tasks grouped by feature or component
- Up to 8 subtasks per major task using decimal notation (1.1, 1.2)
- First subtask typically: "Write tests for [component]"
- Last subtask typically: "Verify all tests pass"
- Follow Test-Driven Development (TDD) approach

**Example:**

```markdown
# Spec Tasks

## Tasks

- [ ] 1. User Authentication System

  - [ ] 1.1 Write tests for authentication middleware
  - [ ] 1.2 Implement JWT token generation
  - [ ] 1.3 Create password hashing utilities
  - [ ] 1.4 Build login/logout endpoints
  - [ ] 1.5 Verify all tests pass

- [ ] 2. User Profile Management
  - [ ] 2.1 Write tests for profile CRUD operations
  - [ ] 2.2 Design profile database schema
  - [ ] 2.3 Implement profile API endpoints
  - [ ] 2.4 Create profile validation logic
  - [ ] 2.5 Verify all tests pass
```

### Step 7: Generate Summary Document (spec-lite.md)

**Purpose:** Condensed spec for efficient AI context usage

**Content:** 1-3 sentences summarizing the core goal and objective from spec.md

**Example:**

```markdown
# Spec Summary (Lite)

Implement secure user profile dashboard with real-time notifications to improve user engagement and provide personalized experience. Users can manage their profile information, preferences, and receive live updates about relevant activities and system events.
```

### Step 8: User Review & Validation

**Present complete package:**

- Spec Requirements: `spec.md`
- User Stories: `user-stories.md`
- Spec Summary: `spec-lite.md`
- Technical Spec: `sub-specs/technical-spec.md`
- Additional sub-specs as applicable
- Task Breakdown: `tasks.md`

**Request approval:**

```
I've created the spec documentation:
- Spec Requirements: @.code-captain/specs/YYYY-MM-DD-feature-name/spec.md
- User Stories: @.code-captain/specs/YYYY-MM-DD-feature-name/user-stories.md
- Spec Summary: @.code-captain/specs/YYYY-MM-DD-feature-name/spec-lite.md
- Technical Spec: @.code-captain/specs/YYYY-MM-DD-feature-name/sub-specs/technical-spec.md
[List other created specs]

Please review and let me know if any changes are needed before I create the task breakdown.
```

### Step 9: Execution Readiness

**Summary and next steps:**

- Spec name and description
- First task summary from tasks.md
- Estimated complexity/scope
- Key deliverables for task 1

**Prompt for implementation:**

```
The spec planning is complete. The first task is:

**Task 1:** [FIRST_TASK_TITLE]
[Brief description of task 1 and subtasks]

Would you like me to proceed with implementing Task 1? I will focus only on this first task and its subtasks unless you specify otherwise.

Type 'yes' to proceed with Task 1, or let me know if you'd like to review or modify the plan first.
```

## Tool Integration

**Uses Code Captain tools:**

- `todo_write` for progress tracking during spec creation
- `codebase_search` to understand existing architecture
- `file_search` to find related specifications
- `edit_file` to create all specification documents
- `grep_search` to analyze current code patterns

**Parallel execution when possible:**

- Context gathering (multiple file reads)
- Sub-spec creation (technical, database, API specs)
- Cross-reference validation

## Output Organization

**All outputs go to `.code-captain/specs/YYYY-MM-DD-{feature-name}/`:**

- Maintains chronological organization
- Kebab-case naming (max 5 words)
- Self-contained specification packages
- Easy cross-referencing between related specs

## Quality Standards

**Comprehensive documentation:**

- Clear implementation path
- Testable outcomes
- Technical coherence
- Consistency with existing codebase

**TDD approach:**

- Test-first task ordering
- Incremental build strategy
- Verification steps included
- Dependency consideration

## Integration with Existing Commands

**Works with other Code Captain commands:**

- Custom implementation can reference spec tasks
- Testing should align with spec requirements
- Implementation validation checks against spec criteria

**Cross-references:**

- Links to related specifications and requirements
- References existing architecture documentation
- Connects to research findings and technology evaluations
