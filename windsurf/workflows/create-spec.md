---
description: Generate comprehensive feature specifications using contract-first approach with complete alignment before file creation
---

# Create Spec Workflow

## Overview
Generate comprehensive feature specifications using a contract-first approach that ensures complete alignment between developer and AI before creating any supporting files. This eliminates presumptuous file creation by establishing a clear "contract" through structured clarification rounds.

## Command Process

### Phase 1: Contract Establishment (No File Creation)

**Mission Statement:**
> Turn rough feature ideas into clear work specifications. Deliver the complete spec package only after both parties agree on the requirements contract. **Challenge ideas that don't make technical or business sense - better to surface concerns early than build the wrong thing.**

#### Step 1.1: Initial Context Scan
- Use `find_by_name` to scan existing `.code-captain/specs/` for related specifications
- Use `codebase_search` to analyze current architecture and patterns
- Use `view_file` to load project context files (`tech-stack.md`, `code-style.md`, `objective.md`)
- **Output:** Context summary (no files created yet)

#### Step 1.2: Gap Analysis & Silent Enumeration
**Internal Process (not shown to user):**
- Silently list every missing fact, constraint, or requirement
- Identify ambiguities in the initial description
- Note potential integration points and dependencies
- Catalog unknowns across domains:
  - Purpose & business value
  - Target audience & user personas
  - Technical constraints & requirements
  - Success criteria & acceptance tests
  - Scope boundaries (in/out of scope)
  - UI/UX requirements & design constraints
  - Performance & scalability needs
  - Security & compliance requirements
  - Integration points with existing systems
  - Risk tolerance & implementation approach

#### Step 1.3: Structured Clarification Loop
**Rules:**
- Ask ONE focused question at a time
- After each answer, re-scan codebase with `codebase_search` for new context if relevant
- Continue until reaching 95% confidence on deliverable
- Each question should target the highest-impact unknown
- **Never declare "final question"** - let the conversation flow naturally
- Let the user signal when they're ready to lock the contract
- **Challenge ideas that don't make technical or business sense**

**Critical Analysis Responsibility:**
- Challenge technically infeasible requirements; suggest alternatives
- Break down overly large scope into focused features
- Point out conflicts with existing codebase patterns
- Surface performance/security/scalability concerns proactively

**Question Categories:**
- "What specific user problem does this solve, and who experiences it?"
- "Should this integrate with [existing system], or remain separate?"
- "What does 'success' look like - how will we measure if this works?"
- "Are there performance requirements (response time, throughput, scale)?"
- "What UI/UX constraints exist - web only, mobile responsive, accessibility?"
- "What's your risk tolerance - stable/proven vs cutting-edge solutions?"

#### Step 1.4: Echo Check (Contract Proposal)
When confident, present a contract proposal with any concerns surfaced:

```
## Specification Contract

**Deliverable:** [One clear sentence describing what will be built]

**Must Include:** [Critical requirement that makes this valuable]

**Hardest Constraint:** [Biggest technical/business limitation to navigate]

**Success Criteria:** [How we'll know it's working correctly]

**Scope Boundaries:**
- In Scope: [2-3 key features]
- Out of Scope: [2-3 things we won't build]

**⚠️ Technical Concerns (if any):**
- [Specific concern about feasibility, performance, or architecture]
- [Suggested alternative or mitigation approach]

**💡 Recommendations:**
- [Suggestions for improving the approach based on codebase analysis]
- [Ways to reduce risk or complexity]

---
Options:
- Type 'yes' to lock this contract and create the spec package
- Type 'edit: [your changes]' to modify the contract
- Type 'risks' to explore potential implementation risks in detail
- Type 'blueprint' to see the planned folder structure and documents
- Ask more questions if anything needs clarification
```

### Phase 2: Spec Package Creation (Post-Agreement Only)

**Triggered only after user confirms contract with 'yes'**

#### Step 2.1: Determine Current Date
Use `run_command` to get current date:
```bash
date +%Y-%m-%d
```

#### Step 2.2: Create Directory Structure
Use `write_to_file` to create organized folder structure:
```
.code-captain/specs/[DATE]-{feature-name}/
├── spec.md                    # Main specification (from contract)
├── spec-lite.md              # Condensed version for AI context
├── user-stories/             # Individual user story files
│   ├── README.md             # Overview and progress tracking
│   ├── story-1-{name}.md     # Individual user story with focused tasks
│   ├── story-2-{name}.md     # Each story kept small and manageable
│   └── story-N-{name}.md     # Max 5-7 implementation tasks per story
└── sub-specs/                # Technical deep-dives
    ├── technical-spec.md     # Architecture & implementation details
    ├── database-schema.md    # Database changes (if needed)
    ├── api-spec.md          # API documentation (if needed)
    └── ui-wireframes.md     # UI/UX specifications (if needed)
```

#### Step 2.3: Generate Core Documents

**spec.md** - Built directly from the locked contract:
```markdown
# [Feature Name] Specification

> Created: [DATE]
> Status: Planning
> Contract Locked: ✅

## Contract Summary
[Echo check content verbatim]

## Detailed Requirements
[Expanded from clarification responses]

## Implementation Approach
[Technical strategy based on codebase analysis]
```

**user-stories/README.md** - Overview and progress tracking:
```markdown
# User Stories Overview

> **Specification:** [Feature Name]
> **Created:** [DATE]
> **Status:** Planning

## Stories Summary

| Story | Title | Status | Tasks | Progress |
|-------|-------|--------|-------|----------|
| 1 | [Story title] | Not Started | 5 | 0/5 |
| 2 | [Story title] | Not Started | 4 | 0/4 |
| 3 | [Story title] | Not Started | 6 | 0/6 |

**Total Progress:** 0/15 tasks (0%)

## Story Dependencies
- Story 2 depends on Story 1 completion
- Story 3 can run parallel to Story 2

## Quick Links
- [Story 1: Feature Name](./story-1-feature-name.md)
- [Story 2: Feature Name](./story-2-feature-name.md)
- [Story 3: Feature Name](./story-3-feature-name.md)
```

**user-stories/story-1-{name}.md** - Individual story files:
```markdown
# Story 1: [Title]

> **Status:** Not Started | **Priority:** High | **Dependencies:** None

## User Story
**As a** [user type] **I want to** [action] **So that** [value]

## Acceptance Criteria
- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

## Implementation Tasks
- [ ] 1.1 Write tests for [component]
- [ ] 1.2 [Technical step]
- [ ] 1.3 [Technical step]
- [ ] 1.4 Verify acceptance criteria
- [ ] 1.5 Verify all tests pass

## Definition of Done
- [ ] All tasks completed | [ ] Tests passing | [ ] Code reviewed
```

#### Step 2.4: Generate Technical Sub-Specs

**Only create relevant sub-specs based on contract requirements:**

- **technical-spec.md**: Always created - architecture, patterns, dependencies
- **database-schema.md**: Only if database changes needed
- **api-spec.md**: Only if new API endpoints required
- **ui-wireframes.md**: Only if UI/UX requirements were discussed

#### Step 2.5: Final Package Review & User Validation

Present complete package:
```
✅ Specification package created successfully!

📁 .code-captain/specs/[DATE]-feature-name/
├── 📋 spec.md - Main specification
├── 📝 spec-lite.md - AI context summary
├── 👥 user-stories/ - Individual story files
│   ├── 📊 README.md - Overview and progress tracking
│   └── 📝 story-N-{name}.md - Focused stories (5-7 tasks each)
└── 📂 sub-specs/ - Technical specifications

**Stories Created:** [N] user stories | **Total Tasks:** [X] implementation tasks

Please review the specification documents and let me know:
- Does this accurately capture your vision?
- Are there any missing requirements or incorrect assumptions?
- Should any stories be split further or combined?

Once satisfied, I can help start implementation or make adjustments.
```

#### Step 2.6: Create Memory of Specification (Optional)
After successful spec creation, ask Cascade:
"Please create a memory of this feature specification: [brief summary of deliverable and key technical approach]"

## Key Improvements

### 1. Contract-First Approach
- **No presumptuous file creation** - Nothing gets built until contract is locked
- **Structured clarification** - One question at a time, building understanding
- **Echo check validation** - Clear contract summary before proceeding

### 2. Codebase-Aware Questioning
- **Context scanning between questions** - Each answer triggers fresh codebase analysis
- **Integration-focused queries** - Questions shaped by what exists in the codebase
- **Architecture consistency** - Recommendations align with existing patterns

### 3. User Control & Transparency
- **Clear decision points** - User explicitly approves before file creation
- **Risk assessment option** - Can explore implementation risks before committing
- **Blueprint preview** - Can see planned structure before creation
- **Edit capability** - Can modify contract before locking

### 4. Efficient Clarification Process
- **Gap enumeration** - Systematically identifies all unknowns
- **95% confidence threshold** - Stops asking when ready to deliver
- **Token efficiency** - Focused questions, no verbose explanations during clarification

## User Stories Folder Structure

**Philosophy:** Each story gets its own file (max 5-7 tasks), README.md provides overview and progress tracking, follows TDD approach.

**Benefits:** Manageable files, easy navigation, parallel work, clear progress tracking, every task traces to user value.

## Windsurf Tools Used

- `find_by_name`: Locate existing specifications and project files
- `view_file`: Read existing documentation and context files
- `codebase_search`: Analyze current architecture and patterns
- `write_to_file`: Create specification documents and folder structure
- `run_command`: Get current date for folder naming
- `search_web`: Research best practices and technical approaches (if needed)

## Windsurf Features Used

- **Memories**: After completion, optionally create memory of specification decision and approach

---

*📋 Great specifications lead to great implementations. Invest in clarity upfront.*