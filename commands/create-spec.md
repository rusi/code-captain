# Enhanced Create Spec Command (cc: create-spec)

## Overview

Generate comprehensive feature specifications using a contract-first approach that ensures complete alignment between developer and AI before creating any supporting files. This command eliminates presumptuous file creation by establishing a clear "contract" through structured clarification rounds.

## Usage

```bash
cc: create-spec "rough feature description"
```

## Command Process

### Phase 1: Contract Establishment (No File Creation)

**Mission Statement:**
> Your goal is to turn my rough feature idea into a very clear work specification. You will deliver the complete spec package only after we both agree on the requirements contract. **Important: Challenge ideas that don't make technical or business sense - it's better to surface concerns early than build the wrong thing.**

#### Step 1.1: Initial Context Scan
- Scan existing `.code-captain/specs/` for related specifications
- Analyze current codebase architecture and patterns using `codebase_search`
- Load project context files (`tech-stack.md`, `code-style.md`, `objective.md`)
- **Output:** Context summary (no files created yet)

#### Step 1.2: Gap Analysis & Silent Enumeration
**Internal Process (not shown to user):**
- Silently list every missing fact, constraint, or requirement
- Identify ambiguities in the initial description
- Note potential integration points and dependencies
- Catalog unknowns across these domains:
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
- After each answer, re-scan codebase for new context if relevant
- Continue until reaching 95% confidence on deliverable
- Each question should target the highest-impact unknown
- **Never declare "final question"** - let the conversation flow naturally
- Let the user signal when they're ready to lock the contract
- **Challenge ideas that don't make technical or business sense** - better to surface concerns early than build the wrong thing

**Critical Analysis Responsibility:**
- If requirements seem technically infeasible with current architecture, explain why and suggest alternatives
- If scope seems too large for a single feature, recommend breaking it down
- If user requests conflict with existing patterns found in codebase, point out the inconsistency
- If business logic doesn't align with stated user value, ask clarifying questions
- If performance/security/scalability concerns arise, surface them proactively

**Pushback Phrasing Examples:**
- "I see a potential issue with [requirement] because [technical reason]. Would [alternative approach] work better?"
- "Based on your existing codebase, [proposed approach] might conflict with [existing pattern]. How should we handle this?"
- "The scope you're describing sounds like it might be 3-4 separate features. Should we focus on [core piece] first?"
- "I'm concerned that [requirement] could create [specific problem]. Have you considered [alternative]?"

**Question Categories (examples):**
- "What specific user problem does this solve, and who experiences it?"
- "Should this integrate with [existing system found in codebase], or remain separate?"  
- "What does 'success' look like - how will we measure if this works?"
- "Are there performance requirements (response time, throughput, scale)?"
- "What UI/UX constraints exist - web only, mobile responsive, accessibility needs?"
- "What's your risk tolerance - prefer stable/proven approaches or cutting-edge solutions?"

**Transition to Contract:**
- When confidence is high, present contract without declaring it "final"
- Use phrases like "I think I have enough to create a solid contract" or "Based on our discussion, here's what I understand"
- Always leave room for more questions if needed

#### Step 1.4: Echo Check (Contract Proposal)
When confident, present a contract proposal with any concerns surfaced:

**Format:**
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

#### Step 2.1: Initialize Tracking
```bash
# Use todo_write to track creation process
1. Create spec folder structure
2. Generate core specification document  
3. Create user stories with acceptance criteria
4. Generate technical sub-specifications
5. Create implementation task breakdown
6. Present package for user review and validation
```

#### Step 2.2: Create Directory Structure
**Generated folder:**
```
.code-captain/specs/YYYY-MM-DD-{feature-name}/
├── spec.md                    # Main specification (from contract)
├── spec-lite.md              # Condensed version for AI context  
├── tasks.md                  # User stories + implementation tasks (integrated)
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

**tasks.md** - User stories integrated with implementation tasks:
```markdown
# User Stories & Implementation Tasks

## Story 1: [Title from contract deliverable]
**As a** [user type from clarification]
**I want to** [action from contract]  
**So that** [value from contract must-include]

### Acceptance Criteria
- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

### Implementation Tasks
- [ ] 1.1 Write tests for [user story component]
- [ ] 1.2 [Technical implementation step]
- [ ] 1.3 [Technical implementation step] 
- [ ] 1.4 Verify acceptance criteria are met
- [ ] 1.5 Verify all tests pass

---

## Story 2: [Next user story title]
**As a** [user type]
**I want to** [action]
**So that** [value]

### Acceptance Criteria  
- [ ] Given [context], when [action], then [outcome]

### Implementation Tasks
- [ ] 2.1 Write tests for [story component]
- [ ] 2.2 [Implementation step]
- [ ] 2.3 [Implementation step]
- [ ] 2.4 Verify acceptance criteria are met
- [ ] 2.5 Verify all tests pass
```

#### Step 2.4: Generate Technical Sub-Specs

**Only create relevant sub-specs based on contract requirements:**

- **technical-spec.md**: Always created - architecture, patterns, dependencies
- **database-schema.md**: Only if database changes needed (determined during clarification)
- **api-spec.md**: Only if new API endpoints required
- **ui-wireframes.md**: Only if UI/UX requirements were discussed

**Cross-reference integration**: Each sub-spec references relevant user stories from tasks.md to maintain traceability between technical details and user value.

#### Step 2.5: Create Integrated User Stories & Tasks

**tasks.md** - User stories with directly mapped implementation tasks:

**Structure Philosophy:**
- Each user story becomes a major task group
- Implementation tasks directly serve the user story
- Acceptance criteria become verification checkpoints
- Tasks are ordered to deliver user value incrementally
- Each story group follows TDD: test → implement → verify acceptance criteria

**Benefits of Integration:**
- **Traceability**: Every technical task traces to user value
- **Focus**: Developers see the "why" behind each technical step  
- **Validation**: Acceptance criteria become natural test cases
- **Prioritization**: User value drives implementation order
- **Completion**: Story is done when acceptance criteria are met

**Task Numbering:**
- Major tasks = User Stories (1, 2, 3...)
- Subtasks = Implementation steps (1.1, 1.2, 1.3...)
- Always start with tests (1.1 Write tests...)
- Always end with verification (1.X Verify acceptance criteria met)

#### Step 2.6: Final Package Review & User Validation

Present complete package with file references:
```
✅ Specification package created successfully!

📁 .code-captain/specs/YYYY-MM-DD-feature-name/
├── 📋 spec.md - Main specification document
├── 📝 spec-lite.md - AI context summary  
├── 👥✅ tasks.md - User stories & implementation tasks (integrated)
└── 📂 sub-specs/
    ├── 🔧 technical-spec.md - Technical requirements
    [Additional specs as created]

Please take a moment to review the specification documents. The spec captures everything we discussed, including:
- [Brief summary of key features/requirements]
- [Notable technical approach or constraint]
- [Implementation approach or user story highlights]

Please read through the files and let me know:
- Does this accurately capture your vision?
- Are there any missing requirements or incorrect assumptions?
- Should any part be modified or expanded?

Once you're satisfied with the specification, I can help you start implementation with the first task, or we can make any needed adjustments.
```

## Key Improvements Over Original

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

## Example Usage Flow

```
Developer: cc: create-spec "real-time multiplayer chat with blockchain integration"

Agent: I'm ready to help you create a comprehensive specification.

Let me first scan your codebase to understand the current architecture...

[Scans existing code, finds a simple React app with basic authentication]

I found your existing React application with basic user authentication, but I'm seeing some potential concerns with your request.

First question: You mentioned "real-time multiplayer chat with blockchain integration" - I see technical challenges with this combination. Real-time chat typically requires sub-100ms latency, but blockchain transactions can take seconds or minutes to confirm. What specific problem are you trying to solve with blockchain in a chat context?

Developer: I want messages to be permanently stored and verifiable, plus users should pay crypto to send messages to prevent spam

Agent: I understand the anti-spam goal, but I'm concerned about the user experience. If users have to wait 30+ seconds for transaction confirmation before each message appears, that breaks the "real-time" chat experience. 

Would a hybrid approach work better - immediate message delivery with blockchain settlement in the background? Or are you thinking of a different model where users pre-purchase message credits?

Developer: Oh, that's a good point. Let's do the hybrid approach with background settlement

Agent: [Continues with more informed questions about the hybrid architecture...]

## Specification Contract

**Deliverable:** Hybrid real-time chat with immediate message delivery and background blockchain verification for anti-spam

**Must Include:** Sub-second message delivery while maintaining blockchain verification for spam prevention

**Hardest Constraint:** Balancing real-time UX with blockchain settlement delays and gas cost management

**⚠️ Technical Concerns:**
- Gas costs could make casual chat expensive ($1-5 per message during network congestion)
- Background settlement failures need graceful handling and user notification
- Wallet integration adds authentication complexity to existing simple auth system

**💡 Recommendations:**
- Consider Layer 2 solution (Polygon) to reduce gas costs to $0.01-0.10 per message
- Implement message batching to settle multiple messages in single transaction
- Add fallback mode for when blockchain settlement fails

**Success Criteria:** Messages appear instantly, spam is prevented via crypto payments, blockchain verification happens within 5 minutes

**Scope Boundaries:**
- In Scope: Real-time chat, wallet integration, background blockchain settlement
- Out of Scope: Advanced chat features (file sharing, voice), custom token creation

---
Options: [yes/edit/risks/blueprint]

Developer: yes

Agent: ✅ Contract locked! Creating specification package...

[Creates files that account for the technical concerns and hybrid architecture discussed]
```

This approach ensures that every specification is built on solid understanding rather than assumptions, while respecting the developer's time and maintaining control over the process.
