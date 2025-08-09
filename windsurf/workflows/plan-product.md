---
description: "Generate comprehensive product planning documentation using contract-first approach with structured discovery"
---

# Plan Product Workflow

## Overview

Generate comprehensive product planning documentation using contract-first approach. Establishes clear product vision, mission, and roadmap through structured discovery, then creates complete product planning package.

## Usage

```bash
/plan-product "product idea description"
```

## Process

### Phase 1: Product Discovery & Contract (No Files Created)

**Mission:** Transform rough product idea into comprehensive, actionable product plan. Challenge ideas that don't make business or technical sense.

#### Step 1.1: Context Scan
- Scan existing `.code-captain/product/` for product documentation
- Load project context from `.code-captain/docs/` (tech-stack.md if available)
- Review existing product mission or objectives
- **Output:** Product context summary and foundation assessment

#### Step 1.2: Gap Analysis (Internal)
Silently identify missing details across:
- Product vision and core value proposition
- Target market and user personas
- Key features and functionality scope
- Business model and monetization strategy
- Technical feasibility and architecture requirements
- Competitive landscape and differentiation
- Success metrics and validation criteria
- Timeline expectations and resource constraints
- Risk factors and mitigation strategies

#### Step 1.3: Structured Discovery Loop

**Rules:**
- Ask ONE focused question at a time
- After each answer, re-analyze context and technical feasibility
- Continue until reaching 95% confidence on product deliverable
- **Challenge ideas that don't make business or technical sense**
- Never declare "final question" - let conversation flow naturally

**Critical Analysis Examples:**
- "I see a potential issue with [scope] because [business/technical reason]. Would focusing on [core value] first work better?"
- "Based on your existing codebase, [proposed approach] might require significant architecture changes. Are you prepared for that?"
- "The market you're describing sounds very broad. Should we focus on [specific segment] to start?"

**Question Categories:**
- "Who specifically has this problem, and how painful is it for them?"
- "What would make someone switch from their current solution to yours?"
- "How will you measure product success in the first 6 months?"
- "What's your biggest constraint - time, budget, technical expertise, or market access?"

#### Step 1.4: Product Contract Proposal

When confident, present contract proposal:

```
## Product Planning Contract

**Product Vision:** [One clear sentence describing product and primary value]

**Target Market:** [Specific user segment with core problem]

**Unique Value:** [What makes this different/better than alternatives]

**Success Criteria:** [How you'll measure product-market fit and growth]

**MVP Scope:** 
- Core Features: [3-5 essential features for first version]
- Success Metrics: [Key performance indicators]

**Product Architecture:**
- Complexity Level: [Simple/Moderate/Complex based on features]
- Integration Needs: [How this fits with existing business systems]
- Scale Requirements: [Expected user growth and feature expansion]

**⚠️ Product Risks (if any):**
- [Market risk, technical risk, or business model concerns]
- [Suggested validation approach or risk mitigation]

**💡 Recommendations:**
- [Suggestions for improving product-market fit]
- [Ways to validate assumptions early and reduce risk]

**Roadmap Phases:**
- Phase 1 (MVP): [Core value delivery - weeks/months]
- Phase 2 (Growth): [Key expansion features - months]
- Phase 3 (Scale): [Advanced capabilities - quarters]

---
Options:
- Type 'yes' to lock this contract and create the product planning package
- Type 'edit: [your changes]' to modify the contract
- Type 'risks' to explore potential market/technical risks in detail
- Ask more questions if anything needs clarification
```

### Phase 2: Product Planning Package Creation (Post-Agreement Only)

**Triggered only after user confirms contract with 'yes'**

#### Step 2.1: Initialize Tracking
Use memory feature to track creation process:
1. Create product planning folder structure
2. Generate core product mission document
3. Develop product roadmap with phases
4. Create decision log and rationale
5. Generate lite mission for AI context
6. Present package for user review and validation

#### Step 2.2: Create Directory Structure

**Generated folder:**
```
.code-captain/product/
├── mission.md                 # Complete product vision and strategy
├── mission-lite.md           # Condensed version for AI context
├── roadmap.md                # Development phases and timeline
├── decisions.md              # Decision log with rationale
└── research/                 # Supporting research and analysis
```

#### Step 2.3: Generate Core Documents

**mission.md** - Built from locked contract:
```markdown
# Product Mission

> Created: [DATE]
> Status: Planning
> Contract Locked: ✅

## Pitch
[PRODUCT_NAME] is a [PRODUCT_TYPE] that helps [TARGET_USERS] [SOLVE_PROBLEM] by providing [KEY_VALUE_PROPOSITION].

## Users
### Primary Customers
- [CUSTOMER_SEGMENT]: [DESCRIPTION and pain points]

### User Personas
**[PRIMARY_USER_TYPE]** ([AGE_RANGE])
- **Role:** [JOB_TITLE or context]
- **Context:** [Where/when they encounter the problem]
- **Pain Points:** [Specific problems this product solves]
- **Goals:** [What success looks like for them]

## The Problem
### [MAIN_PROBLEM_TITLE]
[Problem description with quantifiable impact where possible]

**Our Solution:** [How the product specifically addresses this problem]

## Differentiators
### [KEY_DIFFERENTIATOR]
Unlike [EXISTING_ALTERNATIVES], we provide [SPECIFIC_ADVANTAGE]. This results in [MEASURABLE_BENEFIT].

## Key Features
### Core Features (MVP)
- **[FEATURE_NAME]:** [User benefit and value]

### Growth Features (Phase 2)
- **[FEATURE_NAME]:** [User benefit and expansion value]

### Scale Features (Phase 3)
- **[FEATURE_NAME]:** [Advanced capabilities]
```

**roadmap.md** - Phased development plan:
```markdown
# Product Roadmap

> Based on Product Contract: [DATE]

## Phase 1: MVP (Minimum Viable Product)
**Timeline:** [Weeks/months]
**Goal:** Validate core value proposition with target users

### Success Criteria
- [Measurable criteria for product-market fit]
- [Key metrics to track]

### Core Features
- [ ] [FEATURE] - [User value] `[Effort: XS/S/M/L/XL]`
- [ ] [FEATURE] - [User value] `[Effort: XS/S/M/L/XL]`

### Technical Foundation
- [ ] [Infrastructure setup]
- [ ] [Core architecture implementation]
- [ ] [Testing and deployment pipeline]

### Validation Targets
- [Number] active users using core feature
- [Metric] user retention rate
- [Feedback] qualitative validation criteria

## Phase 2: Growth (Market Expansion)
**Timeline:** [Months]
**Goal:** Scale user base and expand feature set

### Growth Features
- [ ] [FEATURE] - [Expansion value] `[Effort]`
- [ ] [FEATURE] - [User experience improvement] `[Effort]`

## Phase 3: Scale (Advanced Capabilities)
**Timeline:** [Quarters]
**Goal:** Establish market leadership and advanced functionality

### Advanced Features
- [ ] [FEATURE] - [Competitive advantage] `[Effort]`
- [ ] [FEATURE] - [Enterprise/scale capability] `[Effort]`

## Effort Sizing
- **XS:** 1-2 days
- **S:** 3-5 days  
- **M:** 1-2 weeks
- **L:** 3-4 weeks
- **XL:** 1+ months
```

#### Step 2.4: Generate Decision Log

**decisions.md** - Key product and technical decisions:
```markdown
# Product Decisions Log

> Override Priority: Highest

## [DATE]: Initial Product Planning
**ID:** DEC-001
**Status:** Accepted
**Category:** Product

### Decision
[Summarize: product vision, target market, key features, technical approach]

### Context
[Market opportunity, user problems, strategic rationale]

### Alternatives Considered
1. **[ALTERNATIVE_APPROACH]**
   - Pros: [Benefits]
   - Cons: [Drawbacks]
   - Why rejected: [Reasoning]

### Rationale
[Key factors that drove this product direction]

### Consequences
**Positive:**
- [Expected benefits and advantages]

**Negative:**
- [Known tradeoffs and constraints]

### Success Metrics
- [How we'll measure if this decision was correct]
```

#### Step 2.5: Create Mission-Lite

**mission-lite.md** - Condensed product context for AI:
```markdown
# Product Mission (Lite)

> Source: Complete mission.md
> Purpose: Efficient AI context for development

## Core Value
[1-2 sentences capturing essential product value proposition]

## Target Users
[Primary user segment and core problem]

## Key Differentiator
[What makes this unique in 1 sentence]

## Success Definition
[How we measure product success]

## Current Phase
[MVP/Growth/Scale - what we're building now]
```

#### Step 2.6: Final Package Review

Present complete package:
```
✅ Product planning package created successfully!

📁 .code-captain/product/
├── 📋 mission.md - Complete product vision and strategy
├── 📝 mission-lite.md - AI context summary
├── 🗺️ roadmap.md - Phased development plan
└── 📊 decisions.md - Decision log and rationale

Please review the planning documents and let me know:
- Does this accurately capture your product vision?
- Are there any missing requirements or incorrect assumptions?
- Should any product decisions be reconsidered?
- Does the roadmap timeline align with your expectations?

Once satisfied, you can use:
- `/create-spec` to detail specific features from the roadmap
- `/execute-task` to begin implementing planned features
- `/research` to investigate any market or product unknowns
```

## Implementation with Windsurf Tools

**File Operations:**
- Use `write_to_file` to create product planning documents
- Use `view_file` to review existing product documentation
- Use `find_by_name` to locate related files

**Research Tools:**
- Use `search_web` for market research and competitive analysis
- Use memory feature to track discovery progress and key decisions

**Integration:**
- Works with existing `.code-captain/product/` directory structure
- Feeds into feature specification and development workflows
- Supports cross-command integration with research and ADR workflows 