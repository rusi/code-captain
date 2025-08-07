---
description: Create comprehensive Architecture Decision Records with systematic analysis and structured documentation
---

# Create ADR Workflow

## Overview
Create comprehensive Architecture Decision Records (ADRs) that systematically document architectural decisions with clear rationale, alternatives considered, and consequences through structured analysis and review process.

## When to Use
- Making significant architectural decisions affecting system structure
- Documenting technology choices with vendor lock-in or high switching costs
- Recording decisions contrary to team expectations or industry standards
- Capturing complex trade-offs between competing approaches
- Establishing architectural patterns and standards for team consistency

## Prerequisites

**MANDATORY:** This workflow automatically executes research if no relevant research exists.

Process:
1. Check for existing research on the decision topic
2. If no research found: **automatically execute** complete research workflow
3. Only proceed with ADR creation after research is completed

## Implementation Steps

### Step 1: Check for Existing Research and Auto-Execute if Missing

Use `find_by_name` to search for related research:
```bash
find .code-captain/research -name "*[topic]*" -type f
```

Use `list_dir` to explore research directory structure.

If no relevant research found:
```
❌ No existing research found for this architectural decision.

🔄 AUTOMATICALLY EXECUTING RESEARCH WORKFLOW FIRST...

Reading .code-captain/commands/research.md and executing complete research process...
```

**Execute research workflow automatically:**
- Use `view_file` to read research workflow documentation
- Execute 4-phase research methodology:
  - Phase 1: Define Research Scope
  - Phase 2: Initial Discovery  
  - Phase 3: Deep Dive Analysis
  - Phase 4: Synthesis and Recommendations
- Use `write_to_file` to create research document
- **ONLY CONTINUE** with ADR creation after research is completed

### Step 2: Analyze Decision Context and Current State

**Analysis Actions:**

1. **Understand current architectural patterns:**
   - Use `codebase_search` with queries:
     - "What architectural patterns are currently in use?"
     - "How are similar decisions handled in the codebase?"
     - "What dependencies and integrations exist?"

2. **Find existing ADRs:**
   - Use `find_by_name` to locate existing ADRs in `.code-captain/decision-records/`
   - Use `list_dir` to explore system structure

3. **Gather decision context:**
   - Identify decision stakeholders and concerns
   - Determine specific decision needed and urgency
   - Document current architectural context

### Step 3: Define Decision Scope and Criteria

**Actions:**
1. Define the specific architectural decision requiring documentation
2. Identify driving forces and constraints:
   - Business requirements and goals
   - Technical constraints and limitations
   - Performance, security, scalability requirements
   - Team skills and organizational capabilities
   - Timeline and budget constraints
3. Establish decision criteria and priorities
4. Determine decision maker(s) and approval process
5. Set boundaries for decision scope

### Step 4: Research Alternatives and Evaluate Options

**Research Actions:**

1. **Leverage existing research (if found in Step 1):**
   - Use `view_file` to review research documents
   - Extract key insights, alternatives, and recommendations
   - Identify gaps needing additional investigation

2. **Conduct additional web research:**
   - Use `search_web` for:
     - "[technology/pattern] architectural approaches"
     - "[decision area] best practices"
     - "[technology] vs [alternative] comparison"
     - "[pattern] pros and cons"

3. **Use `codebase_search` to understand current implementation**

4. **Document alternative options:**
   - Current state/status quo option
   - Industry standard approaches
   - Innovative or emerging alternatives
   - Hybrid approaches

**Evaluation Framework:**
For each alternative, evaluate:
- Technical feasibility and complexity
- Performance and scalability implications
- Security and compliance considerations
- Development effort and timeline
- Long-term maintenance and evolution
- Risk assessment and mitigation strategies

### Step 5: Document ADR with Decision Rationale

**Preparation:**

1. **Get current date:**
   ```bash
   date +%Y-%m-%d
   ```

2. **Determine ADR number:**
   - Check existing ADRs in `.code-captain/decision-records/`
   - Use sequential numbering (0001, 0002, etc.)

3. **Create ADR using `write_to_file`:**

4. **After completion, create memory of the decision:**
   Ask Cascade: "Please create a memory of this architectural decision: [brief summary of the chosen option and key rationale]"

## ADR Template

```markdown
# NNNN. [Decision Title]

**Date:** [Current date]
**Status:** [Proposed/Accepted/Deprecated/Superseded]
**Deciders:** [Names or roles of decision makers]
**Technical Story:** [Brief reference to related requirement]

## Context and Problem Statement

[Describe the architectural problem requiring decision. Include business context, technical context, and driving forces.]

### Driving Forces
- **Business Driver 1:** [e.g., Need to support 10x user growth]
- **Technical Driver 2:** [e.g., Current monolith becoming unmaintainable]
- **Organizational Driver 3:** [e.g., Team scaling requires better separation]

### Assumptions
- [Any assumptions made during decision process]
- [External dependencies assumed to remain stable]

## Decision Drivers

[Key factors influencing this decision, in order of importance]
- **Driver 1:** [e.g., Scalability requirements]
- **Driver 2:** [e.g., Team autonomy and development velocity]
- **Driver 3:** [e.g., Technology stack modernization]

## Considered Options

### Option 1: [Name, e.g., "Maintain Current Monolithic Architecture"]

**Description:** [Brief description]

**Pros:**
- [Positive aspect 1]
- [Positive aspect 2]

**Cons:**
- [Negative aspect 1]
- [Negative aspect 2]

**Effort:** [Implementation effort assessment]
**Risk:** [Risk level and key risks]

### Option 2: [Name, e.g., "Migrate to Microservices Architecture"]

**Description:** [Brief description]

**Pros:**
- [Positive aspect 1]
- [Positive aspect 2]

**Cons:**
- [Negative aspect 1]
- [Negative aspect 2]

**Effort:** [Implementation effort assessment]
**Risk:** [Risk level and key risks]

### Option 3: [Name, e.g., "Hybrid Modular Monolith Approach"]

**Description:** [Brief description]

**Pros:**
- [Positive aspect 1]
- [Positive aspect 2]

**Cons:**
- [Negative aspect 1]
- [Negative aspect 2]

**Effort:** [Implementation effort assessment]
**Risk:** [Risk level and key risks]

## Decision Outcome

**Chosen Option:** [Selected option with brief rationale]

### Rationale
[Detailed explanation of why this option was selected. Reference decision drivers and how this option best addresses them.]

### Confirmation
[How will we know this decision is working? What metrics will we monitor?]

## Consequences

### Positive Consequences
- [Positive outcome 1 - improvements this enables]
- [Positive outcome 2 - capabilities this provides]
- [Positive outcome 3 - risks this mitigates]

### Negative Consequences
- [Negative outcome 1 - complexities this introduces]
- [Negative outcome 2 - trade-offs this requires]
- [Negative outcome 3 - new risks this creates]

### Mitigation Strategies
- [Strategy 1 for addressing negative consequences]
- [Strategy 2 for managing introduced complexities]

## Implementation Notes

### Prerequisites
- [What needs to be in place before implementing]
- [Dependencies that must be resolved first]

### Implementation Steps
1. [Step 1 - immediate actions required]
2. [Step 2 - follow-up activities]
3. [Step 3 - validation and monitoring setup]

### Success Criteria
- [Measurable criteria for successful implementation]
- [Timeline for achieving implementation milestones]

## Follow-up Actions
- [Action item 1 with owner and timeline]
- [Action item 2 with owner and timeline]
- [Review date for evaluating decision effectiveness]

## References
- [Link to related ADRs]
- [Prior research documents from .code-captain/research/]
- [External documentation, articles, or research]
- [Code repositories or examples]

## Related Decisions
- [ADR-XXXX: Related decision that influences this one]
- [ADR-YYYY: Decision that this supersedes or is superseded by]
```

## Best Practices

### Decision Scope and Focus
- Focus on one significant architectural decision per ADR
- Clearly separate problem from potential solutions
- Include sufficient context for future readers
- Document decision even if it seems obvious
- Consider both technical and business implications

### Alternatives Analysis
- Always include "do nothing" or "status quo" option
- Research industry standards and best practices
- Consider short-term and long-term implications
- Include effort and risk assessments for each option
- Seek diverse perspectives and expert opinions

### Decision Documentation
- Use clear, jargon-free language for new team members
- Include relevant diagrams, code examples, or architectural sketches
- Reference external sources and supporting documentation
- Document both positive and negative consequences honestly
- Plan for decision review and potential revision

### Stakeholder Engagement
- Involve all teams affected by architectural decision
- Allow time for thoughtful review and feedback
- Document dissenting opinions and how they were addressed
- Ensure decision makers have sufficient context and time
- Follow up on implementation and measure success

## Windsurf Tools Used

- `find_by_name`: Locate existing research and ADRs
- `list_dir`: Explore directory structures
- `view_file`: Read existing documentation and research
- `write_to_file`: Create ADR document
- `codebase_search`: Understand current architectural patterns
- `search_web`: Research alternatives and best practices
- `run_command`: Get current date and system information

## Windsurf Features Used

- **Memories**: After completing the ADR, ask Cascade to "create a memory of the architectural decision and its rationale" for future reference

## Common Pitfalls to Avoid

- Rushing to document without proper analysis
- Making decisions without stakeholder input
- Failing to research alternative approaches thoroughly
- Not considering long-term consequences
- Writing ADRs too technical for business stakeholders
- Not updating ADR status when decisions change
- Creating ADRs for trivial decisions
- Not linking ADRs to related architectural documentation

---

*📐 Architecture decisions shape the future. Document them well.*