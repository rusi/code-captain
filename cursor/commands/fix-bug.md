# Enhanced Fix Bug Command (fix-bug)

## Overview

Investigate reported issues through systematic analysis, classify problems (missing spec, wrong spec, true bug, edge cases), and create appropriate documentation and fix plans following Code Captain patterns. This command uses an investigation-first approach to understand the root cause before determining the appropriate remediation strategy.

## Command Process

### Phase 1: Investigation & Classification (No File Creation)

**Mission Statement:**

> Your goal is to systematically investigate the reported issue, understand its root cause, and classify the problem type to determine the appropriate fix strategy. You will deliver the complete remediation plan only after thorough investigation and classification. **Important: Challenge assumptions about the bug - investigate thoroughly before accepting the initial problem description.**

#### Step 1.1: Initial Issue Analysis

- Gather bug description, reproduction steps, and affected functionality details
- Scan related code areas using `codebase_search` to understand implementation
- Analyze error messages, logs, or user reports for technical details
- Identify the scope of impact and affected user workflows
- **Output:** Issue summary with technical context (no files created yet)

#### Step 1.2: Related Work Investigation

- Scan `.code-captain/specs/` for related specifications
- Scan `.code-captain/experiments/` for related experimental work
- Scan `.code-captain/research/` for relevant research documents
- Look for existing bugfixes in `specs/*/bugfixes/` that might be related
- Analyze codebase architecture and patterns around affected area
- **Output:** Context map of related work and documentation

#### Step 1.3: Code Analysis & Reverse Engineering

**For systematic understanding:**

- Map the actual implementation behavior in the affected area
- Trace data flow and control flow related to the issue  
- Identify integration points with other systems/features
- Document current implementation patterns and assumptions
- Note any gaps between apparent intent and actual behavior
- **Output:** Implementation analysis (internal understanding, not shown to user)

#### Step 1.4: Classification Analysis

**Systematic classification against these types:**

**Missing Spec:**

- No related specification found in `.code-captain/specs/`
- Functionality exists but lacks documented requirements
- Implementation appears intentional but undocumented

**Wrong/Incomplete Spec:**

- Related spec exists but acceptance criteria don't cover the bug scenario
- User stories missing for the affected functionality
- Spec describes different behavior than what users expect
- Requirements are ambiguous or contradictory

**True Bug:**

- Related spec exists with clear acceptance criteria
- Expected behavior is well-defined in documentation
- Implementation doesn't match the specified requirements
- Bug is a deviation from correct specification

**Edge Cases:**

- **Feature Interaction Bug:** Issue occurs when multiple features interact
- **Integration Bug:** Problem in shared/utility code affecting multiple features
- **Conflicting Requirements:** Multiple specs have contradictory requirements
- **Missing Integration Tests:** Issue reveals gaps in integration testing
- **Scale/Performance Bug:** Implementation works in development but fails at scale

#### Step 1.5: Structured Clarification Loop

**Rules:**

- Ask ONE focused question at a time based on investigation findings
- Each question should clarify classification or gather missing context
- Continue until reaching 95% confidence on problem classification and solution approach
- **Challenge initial assumptions** - use investigation findings to probe deeper
- Let the user signal when they're ready to proceed with the fix plan

**Critical Analysis Responsibility:**

- If bug description conflicts with investigation findings, surface the discrepancy
- If multiple classification types apply, explain the complexity and ask for prioritization  
- If fix would require significant architectural changes, recommend alternatives
- If issue reveals deeper systemic problems, point out the broader implications

**Question Categories (examples):**

- "My investigation shows [finding] which suggests [classification]. Does this match your experience?"
- "I found existing spec [X] but it doesn't cover [scenario]. Is this a known gap?"
- "The bug appears to occur when [condition A] interacts with [condition B]. Have you seen similar interaction issues?"
- "Should I focus on fixing this specific case, or address the broader pattern I discovered?"
- "The implementation suggests [intent] but users expect [different behavior]. Which should be correct?"

#### Step 1.6: Classification Decision & Approach Proposal

Present findings and proposed approach:

**Format:**

```text
## Bug Investigation Summary

**Issue Classification:** [Primary type with confidence level]

**Root Cause:** [Technical explanation based on investigation]

**Affected Scope:** [What functionality/users are impacted]

**Related Work Found:**
- [Existing specs, experiments, research that relate to this issue]

**Proposed Approach:** [Specific workflow based on classification]

**⚠️ Complexity Concerns (if any):**
- [Issues that make this fix non-trivial]
- [Recommended approach to manage complexity]

**🔍 Investigation Findings:**
- [Key discoveries that informed the classification]
- [Any broader patterns or systemic issues discovered]

---
Options:
- Type 'yes' to proceed with the proposed approach
- Type 'reclassify: [type]' if you disagree with classification
- Type 'scope: [description]' to adjust the fix scope
- Ask more questions if anything needs clarification
```

### Phase 2: Remediation Based on Classification

Triggered only after user confirms the approach.

#### Branch 2A: Missing Spec → Reverse Engineering + Spec Creation

**When no related spec exists for the buggy functionality:**

##### Step 2A.1: Initialize Spec Creation Tracking

Use `todo_write` to track reverse engineering process:

```bash
1. Analyze existing implementation to understand intended behavior
2. Document current functionality patterns and assumptions  
3. Create comprehensive spec through create-spec contract process
4. Reclassify issue against new spec (likely becomes wrong spec or true bug)
```

##### Step 2A.2: Implementation Reverse Engineering

**Comprehensive analysis of existing functionality:**

- Map all user-visible behaviors and edge cases
- Document integration points and dependencies
- Identify business rules encoded in the implementation
- Note performance characteristics and constraints
- Catalog error handling and validation patterns
- **Output:** Functional requirements based on existing implementation

##### Step 2A.3: Spec Contract Process

**Follow create-spec workflow with reverse engineering context:**

- Start with implementation-derived requirements as initial context
- Ask clarifying questions to validate reverse-engineered understanding
- Challenge implementation patterns that seem problematic
- Build complete spec contract following create-spec format
- Ensure new spec covers the original bug scenario
- **Output:** Complete specification package

##### Step 2A.4: Reclassification

**After spec creation, reclassify the original issue:**

- Compare bug against new spec acceptance criteria
- Determine if it's now a wrong spec (needs spec updates) or true bug (needs implementation fix)
- Proceed with appropriate workflow for the new classification

#### Branch 2B: Wrong/Incomplete Spec → Direct Spec Updates  

**When existing spec needs corrections or additions:**

##### Step 2B.1: Initialize Spec Update Tracking

Use `todo_write` to track spec update process:

```bash
1. Locate and analyze existing spec for affected functionality
2. Identify specific gaps or errors in acceptance criteria
3. Update spec with corrected/additional requirements
4. Create fix plan based on updated spec
```

##### Step 2B.2: Spec Gap Analysis

**Analyze existing spec against bug findings:**

- Compare bug scenario to existing acceptance criteria
- Identify missing user stories or test cases
- Note contradictions between spec and expected behavior
- Document integration scenarios not covered by spec
- **Output:** Specific gaps and corrections needed

##### Step 2B.3: Spec Updates

**Directly modify existing spec files:**

- Add missing acceptance criteria to cover bug scenario
- Create additional user stories if needed  
- Update technical specifications for integration issues
- Modify success criteria to prevent regression
- Update spec contract if fundamental assumptions changed
- **Output:** Updated specification with bug scenario covered

##### Step 2B.4: Implementation Plan Creation

**Generate plan to align implementation with corrected spec:**

- Create task list for implementation changes needed
- Identify test cases to add for new acceptance criteria
- Note any breaking changes or migration requirements
- **Output:** Implementation plan to fix the spec-implementation gap

#### Branch 2C: True Bug → Bugfix Plan Creation

**When spec is correct but implementation is wrong:**

##### Step 2C.1: Initialize Bugfix Tracking  

Use `todo_write` to track bugfix process:

```bash
1. Create bugfix documentation structure under related spec
2. Document reproduction steps and root cause analysis
3. Create fix implementation plan with test requirements
4. Generate verification plan to prevent regression
```

##### Step 2C.2: Determine Current Date

**CRITICAL: Always check the current date and time before creating any date-related files.**

Get current date and time by running:

```bash
# macOS / Linux
date +"%Y-%m-%d %H:%M:%S %Z"
```

```powershell
# Windows (PowerShell)
Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
```

**⚠️ For filename creation, use ONLY the date portion (YYYY-MM-DD) from the output above.**

##### Step 2C.3: Create Bugfix Structure

**Under the related spec folder:**

```text
.code-captain/specs/[EXISTING-SPEC]/bugfixes/[DATE]-[bug-name]/
├── bugfix.md                 # Issue analysis, root cause, fix approach
├── reproduction.md           # Steps and conditions to reproduce the bug
├── fix-tasks/                # Implementation tasks organized like user stories  
│   ├── README.md             # Fix progress tracking
│   ├── task-1-{name}.md      # Focused fix tasks (5-7 max per task group)
│   └── task-N-{name}.md      # Each task group manageable and atomic
└── verification.md           # Test strategy to ensure fix works and no regression
```

##### Step 2C.4: Generate Bugfix Documents

**bugfix.md** - Core issue analysis:

```markdown
# [Bug Name] Fix Plan

> **Created:** [DATE] > **Spec:** [Related Spec Link] > **Status:** Planning

## Issue Summary

[Description of the bug and its impact]

## Root Cause Analysis

[Technical explanation of why the bug occurs based on investigation]

## Fix Approach

[Strategy for resolving the issue while maintaining spec compliance]

## Risk Assessment

[Potential side effects or breaking changes from the fix]

## Related Work

[Links to related specs, experiments, or previous bugfixes]
```

**reproduction.md** - Bug reproduction guide:

```markdown
# Bug Reproduction Guide

> **Bug:** [Bug Name] > **Created:** [DATE]

## Prerequisites

[Environment setup, data requirements, etc.]

## Reproduction Steps

1. [Step-by-step instructions to trigger the bug]
2. [Include specific inputs, conditions, timing]
3. [Note any environmental factors]

## Expected vs Actual Behavior

**Expected:** [What should happen according to spec]
**Actual:** [What actually happens - the bug]

## Reproduction Success Rate

[How reliably the bug can be triggered]

## Additional Notes

[Edge cases, variations, or related symptoms]
```

**fix-tasks/README.md** - Fix progress tracking:

```markdown
# Bugfix Implementation Tasks

> **Bug:** [Bug Name] > **Created:** [DATE] > **Status:** Planning

## Task Summary

| Task | Title         | Status      | Items | Progress |
| ---- | ------------- | ----------- | ----- | -------- |
| 1    | [Task title]  | Not Started | 5     | 0/5      |
| 2    | [Task title]  | Not Started | 4     | 0/4      |

**Total Progress:** 0/9 items (0%)

## Task Dependencies

[Order requirements and blocking relationships]

## Verification Checkpoints

- After Task 1: [Specific verification step]
- After Task 2: [Specific verification step]

## Quick Links

- [Task 1: Root Cause Fix](./task-1-root-cause-fix.md)
- [Task 2: Regression Prevention](./task-2-regression-prevention.md)
```

#### Branch 2D: Edge Cases → Specialized Handling

**For complex multi-spec or systemic issues:**

##### Feature Interaction Bugs

- Create interaction documentation under both affected specs
- Generate integration test requirements
- Coordinate fix approach across multiple features

##### Integration/Shared Code Bugs

- Create shared bugfix documentation in most relevant spec
- Link from all affected specs
- Generate comprehensive test coverage for shared components

##### Conflicting Requirements

- Document the conflict and impact analysis
- Create decision record for resolution approach
- Update all affected specs consistently
- Generate migration plan if breaking changes needed

### Phase 3: Final Package Review & Next Steps

Present complete remediation package:

```text
✅ Bug investigation complete!

**Classification:** [Final classification type]

**Documentation Created:**
[List of files and locations created based on classification]

**Recommended Next Steps:**
- Use /execute-task to begin implementation
- [Classification-specific guidance]
- Update progress tracking as work progresses

**Integration Points:**
[How this connects to existing specs, experiments, or other work]
```

## Key Classification Logic

### Missing Spec Detection

- No related specifications found in `.code-captain/specs/`
- Functionality exists but lacks documented requirements  
- Implementation appears intentional but undocumented

### Wrong/Incomplete Spec Detection

- Related spec exists but acceptance criteria missing for bug scenario
- User stories don't cover the affected functionality adequately
- Spec describes different behavior than users expect or need

### True Bug Detection  

- Related spec exists with clear acceptance criteria defining correct behavior
- Implementation doesn't match the specified requirements
- Bug is deviation from documented and agreed-upon specification

### Edge Case Detection

- **Multi-Feature:** Issue involves interaction between multiple specs
- **Shared Code:** Bug in utility/shared code affecting multiple features  
- **Conflicting Requirements:** Multiple specs define contradictory behavior
- **Scale Issues:** Works in development, fails in production conditions
- **Integration Gaps:** Missing integration tests reveal system-level problems

## Core Rules

1. **Investigation-First** - Thoroughly analyze before accepting initial bug description
2. **Classification-Driven** - Different problem types require different remediation approaches  
3. **Spec Integrity** - Maintain single source of truth by updating specs directly
4. **Systematic Documentation** - All analysis and decisions captured for future reference
5. **Root Cause Focus** - Address underlying causes, not just symptoms
6. **Regression Prevention** - Every fix includes verification strategy

## Tool Integration

**Primary Code Captain tools:**

- `todo_write` - Progress tracking throughout investigation and fix process
- `codebase_search` - Code analysis, spec scanning, and context discovery
- `list_dir` - Discover related work in specs, experiments, and research folders
- `file_search` - Pattern discovery for bug analysis and impact assessment

**Investigation Workflow:**

- Systematic code analysis around affected functionality
- Related work discovery across all Code Captain documentation
- Integration point identification and impact analysis
- Classification decision based on comprehensive evidence

**Remediation Workflow:**

- Branch to appropriate fix strategy based on classification
- Leverage existing create-spec patterns for missing specifications
- Direct spec updates for wrong/incomplete requirements
- Focused bugfix plans for true implementation issues
- Specialized handling for edge cases and systemic issues

## Integration Notes

This command integrates with the Code Captain ecosystem by:

1. **Spec Evolution** - Updates existing specs to cover discovered gaps and edge cases
2. **Knowledge Building** - Each bug investigation contributes to organizational learning
3. **Pattern Recognition** - Identifies systemic issues across multiple features or specs
4. **Quality Improvement** - Bugfixes include regression prevention strategies
5. **Documentation Continuity** - Maintains connections between bugs, specs, experiments, and research

## Usage Examples

### Basic Usage

```bash
/fix-bug "User login fails with social authentication"
# → Investigates login flow, scans auth specs, classifies issue type
```

### Missing Spec Scenario

```bash
/fix-bug "Shopping cart persists incorrectly across browser sessions"
# → No cart spec found, reverse engineers cart functionality
# → Creates comprehensive cart spec through contract process  
# → Reclassifies as wrong spec or true bug against new spec
```

### Wrong Spec Scenario  

```bash
/fix-bug "Password reset email not sent for inactive users"
# → Finds auth spec but acceptance criteria don't cover inactive user case
# → Updates spec with missing acceptance criteria
# → Creates implementation plan to match updated spec
```

### True Bug Scenario

```bash
/fix-bug "Search results show deleted items"
# → Finds search spec with clear acceptance criteria excluding deleted items
# → Creates bugfix plan under specs/search-feature/bugfixes/[DATE]-deleted-items/
# → Includes reproduction steps, fix tasks, and verification strategy
```

### Edge Case Scenario

```bash
/fix-bug "Performance degrades when search + recommendations + chat all active"
# → Identifies multi-feature interaction issue
# → Creates shared analysis affecting search, recommendations, and chat specs
# → Generates integration testing requirements and coordination plan
```

## Future Enhancements

Potential improvements (not in initial version):

- **Bug Pattern Recognition** - Learn from previous bugs to suggest likely causes
- **Automated Reproduction** - Generate test scripts from reproduction steps
- **Impact Analysis** - Automated assessment of fix complexity and breaking change risk
- **Fix Verification** - Automated checking that fixes address root causes
- **Bug Clustering** - Identify related bugs that might indicate systemic issues

But for now: Focus on systematic investigation, accurate classification, and appropriate remediation strategies that maintain Code Captain's documentation integrity and quality standards.
