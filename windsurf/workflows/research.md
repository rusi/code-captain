---
description: "Conduct systematic research using structured phases with web search capabilities and actionable todos"
---

# Research Workflow

## Overview

Conduct systematic research using structured phases with web search capabilities and actionable todos.

## Usage

```bash
/research "topic description"
```

## Process

### Phase 1: Define Research Scope

**Create research todos:**

Use memory feature to track progress:
```
- Phase 1: Define scope and questions [in_progress]
- Phase 2: Initial discovery [pending]  
- Phase 3: Deep dive analysis [pending]
- Phase 4: Synthesis and recommendations [pending]
```

**Actions:**
1. Define primary research question(s)
2. Identify key stakeholders and information needs
3. Set success criteria for research

### Phase 2: Initial Discovery

**Objective:** Gather broad understanding of topic landscape

**Actions:**
1. Use `search_web` with broad search terms
2. Search for:
   - Overview articles and introductory content
   - Current trends and recent developments
   - Key players and thought leaders
   - Common terminology and concepts
3. Document initial findings and themes
4. Identify knowledge gaps for deeper investigation

**Search Strategy:**
- Start with general terms: "[topic] overview", "[topic] 2024", "[topic] trends"
- Look for authoritative sources: documentation, whitepapers, industry reports
- Note recurring themes for Phase 3

### Phase 3: Deep Dive Analysis

**Objective:** Investigate specific aspects identified in Phase 2

**Actions:**
1. Use `search_web` with targeted queries from Phase 2 findings
2. Research specific sub-topics:
   - Technical implementation details
   - Pros and cons of different approaches
   - Real-world case studies and examples
   - Performance metrics and benchmarks
3. Compare alternatives and trade-offs
4. Validate claims from multiple sources

**Search Strategy:**
- Use specific terminology from Phase 2
- Search for: "[approach] vs [alternative]", "[topic] case study", "[topic] performance"
- Look for criticism and limitations, not just benefits

### Phase 4: Synthesis and Recommendations

**Objective:** Transform research into actionable insights

**Actions:**
1. Synthesize findings into key insights
2. Create recommendations based on research
3. Identify next steps or further investigation needs
4. Document sources and evidence
5. Create research document in `.code-captain/research/` folder

**Deliverables:**
- Executive summary of key findings
- Pros/cons analysis of options
- Specific recommendations with rationale
- Risk assessment and mitigation strategies
- Research document: `.code-captain/research/[DATE]-[topic-name]-research.md`

## Date Determination

### Primary Method: System Clock

1. Read the current UTC date from the system clock and format as `YYYY-MM-DD`.
2. Store it for naming:  
   `.code-captain/research/[DATE]-[topic-name]-research.md`

### Fallback Method

If system clock access isn't available:
1. Prompt: "What is today's date? (YYYY-MM-DD)"
2. Validate against `^\d{4}-\d{2}-\d{2}$`
3. Store the date for naming

## Research Document Template

Create: `.code-captain/research/[DATE]-[topic-name]-research.md`

```markdown
# [Topic Name] Research

**Date:** [Current date]
**Researcher:** [Name]
**Status:** [In Progress/Complete]

## Research Question(s)

[Primary questions this research aimed to answer]

## Executive Summary

[2-3 paragraph overview of key findings and recommendations]

## Background & Context

[Why research was needed, current situation, stakeholders]

## Methodology

[How research was conducted, sources used, timeframe]

## Key Findings

### Finding 1: [Title]

- **Evidence:** [Supporting data/sources]
- **Implications:** [What this means for project/decision]

### Finding 2: [Title]

- **Evidence:** [Supporting data/sources]
- **Implications:** [What this means for project/decision]

## Options Analysis

### Option 1: [Name]

- **Pros:** [Benefits and advantages]
- **Cons:** [Drawbacks and limitations]
- **Cost/Effort:** [Implementation requirements]
- **Risk Level:** [High/Medium/Low with explanation]

### Option 2: [Name]

- **Pros:** [Benefits and advantages]
- **Cons:** [Drawbacks and limitations]
- **Cost/Effort:** [Implementation requirements]
- **Risk Level:** [High/Medium/Low with explanation]

## Recommendations

### Primary Recommendation

[Specific recommended course of action with rationale]

### Alternative Approaches

[Secondary options if primary isn't feasible]

### Implementation Considerations

[Key factors to consider when moving forward]

## Risks & Mitigation

- **Risk 1:** [Description] → **Mitigation:** [How to address]
- **Risk 2:** [Description] → **Mitigation:** [How to address]

## Further Research Needed

- [Questions/areas needing additional investigation]

## Sources

- [Source 1 with URL and access date]
- [Source 2 with URL and access date]

## Appendix

[Additional detailed information, raw data, extended quotes]
```

## Best Practices

### Search Strategy
- Start broad, then narrow down
- Use multiple search terms and phrasings
- Look for recent content (last 1-2 years) for evolving topics
- Cross-reference information from multiple sources
- Search for both benefits AND criticisms

### Critical Thinking
- Question assumptions and biases in sources
- Look for evidence, not just opinions
- Consider source credibility and potential conflicts
- Distinguish between correlation and causation
- Identify missing information

### Documentation
- Keep track of sources for all claims
- Note information dates (especially for fast-moving topics)
- Document search process for reproducibility
- Save important quotes with proper attribution

## Common Pitfalls to Avoid

- Confirmation bias (only seeking supporting information)
- Stopping research too early when findings seem obvious
- Not considering implementation challenges
- Ignoring edge cases or limitations
- Failing to consider stakeholder perspectives beyond your own

## Implementation with Windsurf Tools

**File Operations:**
- Use `write_to_file` to create research documents
- Use `view_file` to review existing research
- Use `find_by_name` to locate related files

**Research Tools:**
- Use `search_web` for all web research phases
- Use `codebase_search` for understanding current implementation
- Use memory feature to track research progress and key findings

**Integration:**
- Works with existing `.code-captain/research/` directory structure
- Feeds into Architecture Decision Records (ADRs)
- Supports product planning and feature specification workflows 