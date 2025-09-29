# Enhanced Create Experiment Command (create-experiment)

## Overview

Generate comprehensive experiment specifications for exploratory work, prototypes, and validation projects that might evolve into production features. This command uses a contract-first approach to establish clear experiment goals, success criteria, and implementation tasks while maintaining traceability to related research and providing clear evolution paths to production features.

## Command Process

### Phase 1: Contract Establishment (No File Creation)

**Mission Statement:**

> Your goal is to turn my rough experiment idea into a very clear experiment specification with structured learning objectives. You will deliver the complete experiment package only after we both agree on the experiment contract. **Important: Challenge experiment ideas that don't have clear learning goals or seem too complex for throwaway implementation - it's better to surface concerns early than build unfocused experiments.**

#### Step 1.1: Initial Context Scan

- Scan existing `.code-captain/research/` for related research documents
- Scan existing `.code-captain/experiments/` for related experiments
- Scan existing `.code-captain/specs/` for related specifications
- Analyze current codebase architecture and patterns using `codebase_search`
- Load project context files (`tech-stack.md`, `code-style.md`, `objective.md`)
- **Output:** Context summary with related work references (no files created yet)

#### Step 1.2: Gap Analysis & Silent Enumeration

**Internal Process (not shown to user):**

- Silently list every missing fact, constraint, or learning objective
- Identify ambiguities in the initial experiment description
- Note potential integration points with existing research/specs
- Catalog unknowns across these domains:
  - Experiment purpose & learning objectives
  - Success criteria & validation methods
  - Technical implementation approach (throwaway vs. explorative)
  - Scope boundaries (what to build vs. what to learn)
  - Resource constraints & timeline expectations
  - Risk tolerance & implementation complexity
  - Integration points with existing codebase
  - Path to production considerations
  - Knowledge gaps to fill through experimentation

#### Step 1.3: Structured Clarification Loop

**Rules:**

- Ask ONE focused question at a time
- After each answer, re-scan codebase and research for additional context if relevant
- Continue until reaching 95% confidence on experiment deliverable
- Each question should target the highest-impact unknown
- **Never declare "final question"** - let the conversation flow naturally
- Let the user signal when they're ready to lock the contract
- **Challenge experiment ideas that lack focus or clear learning goals** - better to surface concerns early than build unfocused experiments

**Critical Analysis Responsibility:**

- If experiment seems too broad, recommend breaking it down into focused learning objectives
- If scope seems too large for throwaway implementation, suggest simplification
- If experiment conflicts with existing research findings, point out the inconsistency
- If learning objectives aren't clear or measurable, ask for clarification
- If experiment would duplicate existing work, highlight overlap and suggest alternatives

**Pushback Phrasing Examples:**

- "This experiment seems quite broad. Would focusing on [specific aspect] give you the key learning you need?"
- "I see you have existing research on [topic] that suggests [finding]. How does this experiment relate to those findings?"
- "The scope you're describing might require significant implementation. Should we focus on validating [core assumption] first?"
- "I'm concerned this experiment might take too long for throwaway work. Could we achieve the same learning with [simpler approach]?"

**Question Categories (examples):**

- "What specific assumption or risk are you trying to validate through this experiment?"
- "Should this experiment integrate with [existing system found in codebase], or remain completely separate?"
- "What would 'success' look like - how will you know the experiment answered your questions?"
- "Are there performance or scalability aspects you need to validate, or is this purely about feasibility?"
- "Where in your source tree would you like the experimental code to live?"
- "Is this experiment likely to evolve into a production feature, or purely for learning?"

**Transition to Contract:**

- When confidence is high, present contract without declaring it "final"
- Use phrases like "I think I understand the experiment you need" or "Based on our discussion, here's the experiment specification"
- Always leave room for more questions if needed

#### Step 1.4: Echo Check (Contract Proposal)

When confident, present an experiment contract proposal with any concerns surfaced:

**Format:**

```text
## Experiment Contract

**Experiment Name:** [validated-experiment-name]

**Primary Learning Objective:** [One clear sentence describing what you want to learn/validate]

**Success Criteria:** [How you'll know the experiment succeeded or failed]

**Implementation Approach:** [Throwaway/prototype/proof-of-concept strategy]

**Scope Boundaries:**
- Will Build: [2-3 key experimental components]
- Will Learn: [2-3 specific questions to answer]  
- Won't Build: [2-3 things outside scope]

**Evolution Path:** [How this might become a production feature if successful]

**Related Work:** [Existing research/specs this connects to]

**⚠️ Implementation Concerns (if any):**
- [Specific concern about complexity, timeline, or focus]
- [Suggested alternative or mitigation approach]

**💡 Recommendations:**
- [Suggestions for improving the experiment based on codebase analysis]
- [Ways to focus learning objectives or reduce complexity]

---
Options:
- Type 'yes' to lock this contract and create the experiment package
- Type 'edit: [your changes]' to modify the contract
- Type 'risks' to explore potential implementation risks in detail
- Type 'blueprint' to see the planned folder structure and documents
- Ask more questions if anything needs clarification
```

### Phase 2: Experiment Package Creation (Post-Agreement Only)

Triggered only after user confirms contract with 'yes'

#### Step 2.1: Initialize Tracking

```bash
# Use todo_write to track creation process
1. Get current date and create experiment folder structure
2. Generate core experiment document
3. Create user stories with implementation tasks
4. Generate research links and related work references
5. Set up findings structure for ongoing learning capture
6. Present package for user review and validation
```

#### Step 2.2: Determine Current Date

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

Use this date format for folder naming:
`.code-captain/experiments/[DATE]-[experiment-name]/`

#### Step 2.3: Create Directory Structure

**Generated folder using current date in YYYY-MM-DD format:**

```text
.code-captain/experiments/[DATE]-{experiment-name}/
├── experiment.md             # Main experiment specification (from contract)
├── experiment-lite.md        # Condensed version for AI context
├── user-stories/             # Individual implementation task files
│   ├── README.md             # Overview and progress tracking
│   ├── story-1-{name}.md     # Individual story with focused tasks
│   ├── story-2-{name}.md     # Each story kept small and manageable
│   └── story-N-{name}.md     # Max 5-7 implementation tasks per story
├── findings/                 # Learning capture during experiment
│   ├── README.md             # Findings overview and summary
│   ├── daily-notes.md        # Ongoing discoveries and learnings
│   └── final-summary.md      # Post-experiment analysis and recommendations
└── research-links.md         # References to related research, specs, experiments
```

#### Step 2.4: Generate Core Documents

**experiment.md** - Built directly from the locked contract:

```markdown
# [Experiment Name] Specification

> Created: [DATE from Step 2.2 determination process]
> Status: Planning  
> Contract Locked: ✅

## Contract Summary

[Echo check content verbatim]

## Learning Objectives

[Expanded from clarification responses - specific questions to answer]

## Implementation Approach

[Technical strategy for throwaway implementation based on codebase analysis]

## Success Criteria

[How success/failure will be measured - from contract]

## Evolution Path to Production

[If successful, how this could become a real feature]

## Related Work

[Links to related research, specs, or experiments]

## Implementation Location

[Where in the source tree the experimental code will live]
```

**user-stories/ folder structure** - Individual user story files for experiment implementation:

**user-stories/README.md** - Overview and progress tracking:

```markdown
# Experiment Implementation Stories

> **Experiment:** [Experiment Name] > **Created:** [DATE] > **Status:** Planning

## Stories Summary

| Story | Title         | Status      | Tasks | Progress |
| ----- | ------------- | ----------- | ----- | -------- |
| 1     | [Story title] | Not Started | 5     | 0/5      |
| 2     | [Story title] | Not Started | 4     | 0/4      |
| 3     | [Story title] | Not Started | 6     | 0/6      |

**Total Progress:** 0/15 tasks (0%)

## Story Dependencies

- Story 2 depends on Story 1 completion
- Story 3 can run parallel to Story 2

## Learning Checkpoints

- After Story 1: Validate [specific assumption]
- After Story 2: Measure [specific metric]
- After Story 3: Document [specific finding]

## Quick Links

- [Story 1: Initial Setup](./story-1-initial-setup.md)
- [Story 2: Core Implementation](./story-2-core-implementation.md)
- [Story 3: Validation Testing](./story-3-validation-testing.md)
```

**user-stories/story-1-{name}.md** - Individual story files (max 5-7 tasks each):

```markdown
# Story 1: [Title from experiment objectives]

> **Status:** Not Started
> **Priority:** High
> **Dependencies:** None
> **Learning Goal:** [What this story will help validate/learn]

## Implementation Story

**As a** developer experimenting with [technology/approach]
**I want to** [specific implementation goal]  
**So that** [learning objective from contract]

## Acceptance Criteria

- [ ] Given [context], when [action], then [outcome] (validates [assumption])
- [ ] Given [context], when [action], then [outcome] (measures [metric])
- [ ] Given [context], when [action], then [outcome] (documents [finding])

## Implementation Tasks

- [ ] 1.1 Set up experimental environment/structure
- [ ] 1.2 [Focused technical step for throwaway implementation]
- [ ] 1.3 [Focused technical step for throwaway implementation]
- [ ] 1.4 [Validation or measurement step]
- [ ] 1.5 Document findings in findings/daily-notes.md
- [ ] 1.6 Verify learning objectives are met

## Learning Questions

[Specific questions this story should answer from the experiment objectives]

## Notes

[Any specific technical considerations, risks, or dependencies for this story]

## Definition of Done

- [ ] All tasks completed
- [ ] All acceptance criteria met
- [ ] Learning questions answered and documented
- [ ] Findings captured in findings/daily-notes.md
- [ ] Code working in experimental location
```

#### Step 2.5: Generate Research Links & Findings Structure

**research-links.md** - Automatically generated from context scan:

```markdown
# Related Work References

> **Experiment:** [Experiment Name] > **Created:** [DATE]

## Related Research

[Auto-scanned from .code-captain/research/]
- [Research Document 1](../research/document-link.md) - [Brief relevance description]
- [Research Document 2](../research/document-link.md) - [Brief relevance description]

## Related Specifications

[Auto-scanned from .code-captain/specs/]
- [Spec 1](../specs/spec-folder/spec.md) - [Brief relevance description]
- [Spec 2](../specs/spec-folder/spec.md) - [Brief relevance description]

## Related Experiments

[Auto-scanned from .code-captain/experiments/]
- [Previous Experiment](../experiment-folder/experiment.md) - [Brief relevance description]

## External References

[User-provided or discovered during clarification]
- [External Resource 1] - [Description]
- [External Resource 2] - [Description]
```

**findings/README.md** - Structure for learning capture:

```markdown
# Experiment Findings

> **Experiment:** [Experiment Name] > **Created:** [DATE] > **Status:** In Progress

## Quick Summary

[Brief overview of current state and key learnings - updated as experiment progresses]

## Learning Progress

| Learning Objective | Status | Key Finding |
| ------------------ | ------ | ----------- |
| [Objective 1] | In Progress | [Current understanding] |
| [Objective 2] | Not Started | - |
| [Objective 3] | Not Started | - |

## Files

- [daily-notes.md](./daily-notes.md) - Ongoing discoveries and learnings
- [final-summary.md](./final-summary.md) - Post-experiment analysis and recommendations

## Evolution Status

- [ ] Experiment complete
- [ ] Learning objectives met
- [ ] Ready for production consideration
- [ ] Recommendation: Proceed with /create-spec
- [ ] Recommendation: Additional research needed
- [ ] Recommendation: Abandon approach
```

**findings/daily-notes.md** - Template for ongoing learning:

```markdown
# Daily Experiment Findings

> **Experiment:** [Experiment Name] > **Started:** [DATE]

## [DATE] - Experiment Start

### What I Built Today
- [Implementation progress]

### What I Learned  
- [Key insights, surprises, or validations]

### Questions That Emerged
- [New questions or concerns discovered]

### Next Steps
- [What to focus on next]

---

## [DATE] - Day N

[Template for ongoing entries - add new sections as experiment progresses]

### What I Built Today
- 

### What I Learned  
- 

### Questions That Emerged
- 

### Next Steps
- 

---
```

#### Step 2.6: Final Package Review & User Validation

Present complete package with file references:

```text
✅ Experiment package created successfully!

📁 .code-captain/experiments/[DATE]-experiment-name/
├── 🔬 experiment.md - Main experiment specification
├── 📝 experiment-lite.md - AI context summary
├── 🛠️ user-stories/ - Implementation task files
│   ├── 📊 README.md - Overview and progress tracking
│   ├── 📝 story-1-{name}.md - Focused story with 5-7 tasks
│   ├── 📝 story-2-{name}.md - Manageable task groups
│   └── 📝 story-N-{name}.md - Easy navigation and parallel work
├── 🔍 findings/ - Learning capture structure
│   ├── 📊 README.md - Findings overview and progress
│   ├── 📓 daily-notes.md - Ongoing discoveries journal
│   └── 📋 final-summary.md - Post-experiment analysis
└── 🔗 research-links.md - References to related research, specs, experiments

**Stories Created:** [N] implementation stories with focused task groups (max 5-7 tasks each)
**Total Tasks:** [X] implementation tasks across all stories
**Learning Objectives:** [Y] specific questions to answer through experimentation

The experiment captures everything we discussed, including:
- [Brief summary of key learning objectives]
- [Notable implementation approach or constraints]
- [Evolution path to production if successful]

**Related Work Found:**
- [X] related research documents automatically linked
- [Y] related specifications referenced
- [Z] previous experiments connected

Please take a moment to review the experiment documents. The spec captures:
- Clear learning objectives and success criteria
- Structured implementation approach with progress tracking  
- Ongoing findings capture for continuous learning
- Evolution path to production features if successful
- Connections to existing research and specifications

Please let me know:
- Does this accurately capture your experiment goals?
- Are the learning objectives clear and measurable?
- Are the user stories appropriately sized for experimental work?
- Should any stories be split further or combined?

**Next Steps:**
- Use /execute-task to start implementing the experiment
- Document findings in findings/daily-notes.md as you progress
- Update findings/README.md with learning progress
- When complete, use findings to inform /create-spec if evolving to production

Once you're satisfied with the experiment specification, I can help you start implementation with the first story, or we can make any needed adjustments.
```

## Key Differences from Create-Spec

### 1. Learning-Focused Approach

- **Primary goal:** Answer questions and validate assumptions, not build production features
- **Success criteria:** Based on learning objectives rather than user value delivery
- **Implementation approach:** Throwaway/prototype code designed for experimentation

### 2. Research Integration

- **Auto-linking:** Automatically scans and connects to related research documents
- **Context awareness:** Questions shaped by existing research findings
- **Knowledge building:** Each experiment builds on previous research and experiments

### 3. Findings Capture

- **Ongoing documentation:** Daily notes structure for capturing learnings as they happen
- **Progress tracking:** Learning objectives progress alongside implementation progress
- **Evolution planning:** Clear path from experiment findings to production specifications

### 4. Flexible Implementation Location

- **Source tree placement:** Experimental code goes in user's preferred location in source tree
- **No .code-captain code:** Only documentation and findings in .code-captain structure
- **Clean separation:** Easy to keep or discard experimental implementation

## Core Rules

1. **Learning-Focused** - Every experiment must have clear, measurable learning objectives
2. **Research-Connected** - Automatically link to related research and previous work
3. **Findings-Driven** - Structured capture of learnings throughout the experiment process
4. **Evolution-Ready** - Clear path to production features if experiment proves successful
5. **Context-Aware** - Questions shaped by existing codebase, research, and specifications
6. **Throwaway-Safe** - Implementation approach suitable for experimental, disposable code

## Tool Integration

**Primary Code Captain tools:**

- `todo_write` - Progress tracking throughout experiment process
- `codebase_search` - Research document scanning and context analysis
- `list_dir` - Discover related work in research, specs, and experiments folders
- `file_search` - Pattern discovery for research connections

**Research Integration:**

- Auto-scan `.code-captain/research/` for related documents
- Auto-scan `.code-captain/specs/` for related specifications
- Auto-scan `.code-captain/experiments/` for previous experiments
- Generate research-links.md with automatic connections

**Learning Capture:**

- Structured findings documentation
- Progress tracking for learning objectives
- Daily notes template for ongoing discovery
- Final summary framework for post-experiment analysis

## Integration Notes

This command integrates with the Code Captain ecosystem by:

1. **Research Continuity** - Builds on existing research documents and feeds into future specs
2. **Spec Evolution** - Provides structured input for `/create-spec` when experiments succeed
3. **Knowledge Building** - Each experiment contributes to organizational learning
4. **Pattern Consistency** - Follows established Code Captain patterns adapted for experimentation
5. **Progress Tracking** - Uses `todo_write` for visibility into experiment progress

## Usage Examples

### Basic Usage

```bash
/create-experiment "WebRTC real-time collaboration feasibility study"
# Analyzes related research, creates experiment package with learning objectives
```

### Typical Workflow

```bash
# After researching a technology
/create-experiment "GraphQL federation performance validation"
# → Scans research documents on GraphQL and federation
# → Creates experiment with performance measurement tasks
# → Generates findings structure for ongoing learning
# → User implements throwaway GraphQL federation setup
# → Documents performance findings in daily-notes.md
# → If successful: /create-spec "production GraphQL federation" (references experiment)
```

### Evolution to Production

```bash
# After successful experiment
/create-spec "real-time collaboration feature"
# → create-spec scans experiments folder
# → References experiment findings and learnings
# → Uses experimental validation to inform production specification
```

## Future Enhancements

Potential improvements (not in initial version):

- **Experiment Templates** - Pre-built experiment structures for common validation types
- **Learning Metrics** - Structured measurement frameworks for different experiment types
- **Experiment Dependencies** - Handle experiments that build on other experiments
- **Auto Evolution** - Automated suggestions when experiments are ready for production specs
- **Team Learning** - Shared experiment knowledge base across team members

But for now: Focus on structured learning objectives, research integration, findings capture, and clear evolution paths to production features.
