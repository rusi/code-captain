---
description: Execute specific tasks systematically following Test-Driven Development workflow with comprehensive testing
---

# Execute Task Workflow

## Overview
Execute specific tasks and sub-tasks systematically following a Test-Driven Development (TDD) workflow. Reads task specifications from `.code-captain/specs/` directories and implements features with comprehensive testing, following established code standards and best practices.

## CRITICAL REQUIREMENT: 100% Test Pass Rate

**⚠️ ZERO TOLERANCE FOR FAILING TESTS ⚠️**

This workflow enforces strict test validation:
- **NO story can be marked "COMPLETED" with ANY failing tests**
- **100% test pass rate is MANDATORY before completion**
- **"Edge case" or "minor" test failures are NOT acceptable**
- **Implementation is considered incomplete until all tests pass**

If tests fail, the story remains "IN PROGRESS" until all failures are resolved.

## Command Process

### Step 1: Task Discovery & Selection

**Scan for available specifications:**

- Use `find_by_name` to search `.code-captain/specs/` for dated specification folders
- Use `view_file` to load user stories from `user-stories/` folders in each spec
- Use `view_file` to read `user-stories/README.md` for story overview and progress
- Use `view_file` to parse individual `story-N-{name}.md` files for available tasks
- Present available stories and tasks organized by specification

**Story selection process:**

1. **If multiple specs exist**: Present selection menu with spec dates and story summaries
2. **If single spec exists**: Show available stories and their tasks within that specification
3. **If story/task specified**: Validate story exists and select specific task for execution
4. **If no specs exist**: Guide user to run create-spec workflow first

**Selection format:**
```
Available specifications:
├── 2024-01-15-user-auth/ (3 stories, 12 total tasks)
│   ├── Story 1: User Registration (5 tasks) - Not Started
│   ├── Story 2: User Login (4 tasks) - Not Started
│   └── Story 3: Password Reset (3 tasks) - Not Started
└── 2024-01-20-payment-system/ (2 stories, 8 total tasks)
    ├── Story 1: Payment Processing (5 tasks) - In Progress (2/5)
    └── Story 2: Refund Management (3 tasks) - Not Started
```

### Step 2: Context Gathering & Analysis

**Load specification context:**

- Use `view_file` to read primary spec document: `spec.md`
- Use `view_file` to load user stories overview: `user-stories/README.md`
- Use `view_file` to read selected story file: `user-stories/story-N-{name}.md`
- Use `view_file` to review technical specifications: `sub-specs/technical-spec.md`
- Parse task breakdown from individual story file

**Analyze current codebase:**

Use `codebase_search` to understand:
- Current architecture and patterns
- Related existing functionality
- Integration points for new features
- Testing frameworks and conventions

**Load project standards:**
- Code style guide: `.code-captain/docs/code-style.md`
- Technology stack: `.code-captain/docs/tech-stack.md`
- Best practices: `.code-captain/docs/best-practices.md`

### Step 3: Story & Task Analysis

**Parse selected story structure:**

- Use `view_file` to load complete story file: `user-stories/story-N-{name}.md`
- Extract user story, acceptance criteria, and implementation tasks
- Analyze task dependencies and execution order within the story
- Understand test requirements (first task typically writes tests)
- Plan implementation approach based on story's task breakdown

**Validate TDD approach within story:**

- **First task**: Should write tests for the story functionality
- **Middle tasks**: Implement functionality to pass tests (max 5-7 tasks total)
- **Final task**: Verify all tests pass and acceptance criteria are met
- **Integration considerations**: Update adjacent/related tests as needed

**Story structure:** User story → Acceptance criteria → Implementation tasks (max 5-7 tasks, first task writes tests, final task verifies 100% pass rate)

### Step 4: Pre-Implementation Preparation

**Validate testing setup:**
- Use `codebase_search` to confirm testing framework is configured
- Use `find_by_name` to verify test directories and naming conventions
- Use `view_file` to check existing test patterns and utilities
- Use `run_command` to ensure test runner is functional

### Step 5: Story Task Execution (TDD Workflow)

**Execute story tasks in sequential order:**

#### Task 1: Write Tests (Test-First Approach)

**Actions:**
- Write comprehensive test cases for the entire feature using `write_to_file`
- Include unit tests, integration tests, and edge cases
- Cover happy path, error conditions, and boundary cases
- Ensure tests fail appropriately (red phase)

**Test categories to include:**
- **Unit tests**: Individual function/method testing
- **Integration tests**: Component interaction testing
- **Edge cases**: Boundary conditions and error scenarios
- **Acceptance tests**: User story validation

#### Tasks 2-N: Implementation (Green Phase)

**For each implementation task within the story:**

1. **Focus on specific functionality**: Implement only what's needed for current task
2. **Make tests pass**: Write minimal code to satisfy failing tests using `replace_file_content`
3. **Update related tests**: Modify adjacent tests if behavior changes
4. **Maintain compatibility**: Ensure no regressions in existing functionality
5. **Refactor when green**: Improve code quality while tests remain passing

**Implementation approach:**
- Start with simplest implementation that passes tests
- Add complexity incrementally as required by test cases
- Keep tests passing at each step using `run_command` to verify
- Refactor for clarity and maintainability

#### Final Task: Test & Acceptance Verification

**CRITICAL: 100% Test Pass Rate Required**

**Mandatory Actions (ALL must succeed before story completion):**

1. **Run complete test suite for this story** using `run_command`
2. **Achieve 100% pass rate for ALL tests** - NO EXCEPTIONS
3. **Verify no regressions in existing test suites**
4. **Validate all acceptance criteria are met for the user story**
5. **Confirm story delivers the specified user value**

**⚠️ STORY CANNOT BE MARKED COMPLETE WITH ANY FAILING TESTS ⚠️**

If ANY tests fail:
- **STOP IMMEDIATELY** - Do not mark story as complete
- Debug and fix each failing test
- Re-run test suite until 100% pass rate achieved
- Only then proceed to mark story as complete

### Step 6: Story-Specific Test Validation

**Run targeted test validation:**

Use `run_command` to verify:
- All tests written in first task are passing
- New functionality works as specified in user story
- All acceptance criteria are satisfied
- No regressions introduced to existing features
- Performance requirements are met (if specified)

**Test execution strategy:**
- **First**: Run only tests for current story/feature
- **Then**: Run related test suites to check for regressions
- **Finally**: Consider full test suite if significant changes made
- **Acceptance**: Validate user story acceptance criteria are met

**Failure handling:**

**ZERO TOLERANCE FOR FAILING TESTS:**
- **If ANY tests fail**: Story CANNOT be marked complete
- **Required action**: Debug and fix ALL failing tests before proceeding
- **No exceptions**: "Edge case" or "minor" failing tests are NOT acceptable
- **If performance issues**: Optimize implementation until all tests pass
- **If regressions found**: Fix regressions - story completion is blocked until resolved

**Failure Resolution Process:**
1. Identify root cause of each failing test
2. Fix implementation to make test pass using `replace_file_content`
3. Re-run ALL tests using `run_command` to ensure 100% pass rate
4. Repeat until NO tests fail
5. Only then mark story as complete

### Step 7: Story Completion & Status Updates

**Update story file status:**

Use `replace_file_content` to mark completed tasks in story file:
- Change status from "Not Started" to "Completed ✅"
- Mark all tasks as [x] with ✅
- Mark all acceptance criteria as [x] with ✅
- Update Definition of Done with **ALL tests passing (100% pass rate)** ✅ **MANDATORY**
- Add note: "Story CANNOT be marked complete without 100% test pass rate"

**Update stories overview:**

Use `replace_file_content` to update progress tracking in `user-stories/README.md`:

```markdown
| Story | Title | Status | Tasks | Progress |
|-------|-------|--------|-------|----------|
| 1 | User Authentication | Completed ✅ | 5 | 5/5 ✅ |
| 2 | Password Reset | Not Started | 4 | 0/4 |
| 3 | Profile Management | Not Started | 6 | 0/6 |

**Total Progress:** 5/15 tasks (33%)
```

**Document completion:**
- Update spec status if all stories in the specification are complete
- Note any deviations from original plan in story notes
- Document lessons learned or improvements made
- Identify any follow-up tasks or technical debt

**Present completion summary:**

**If ALL tests pass (100%):** "Story completed successfully: [Story name] - Tasks: X/X ✅ - Tests: X/X (100%) ✅ - Next stories available"

**If ANY tests fail:** "Story INCOMPLETE - Tests failing: [Story name] - Tests: X/Y (Z%) ❌ COMPLETION BLOCKED - Must fix all failing tests before completion"

### Step 8: Create Memory of Completed Story (Optional)
After successful story completion, ask Cascade:
"Please create a memory of this completed story: [story name and key implementation approach, noting 100% test pass achievement]"

## Integration with Code Captain Ecosystem

**Specification dependency:**
- Requires existing spec created by create-spec workflow
- Uses story breakdown from `user-stories/` folder in spec directories
- Loads individual story files: `user-stories/story-N-{name}.md`
- Tracks progress in `user-stories/README.md`
- Follows technical approach from `sub-specs/technical-spec.md`

**Code style compliance:**
- Adheres to patterns in `.code-captain/docs/code-style.md`
- Uses technology stack from `.code-captain/docs/tech-stack.md`
- Follows best practices from `.code-captain/docs/best-practices.md`

## Quality Standards

**TDD:** Tests before implementation, **100% pass rate MANDATORY**, ZERO TOLERANCE for failures, comprehensive coverage, regression testing, failed tests = incomplete implementation.

**Code quality:** Follow project patterns, maintain compatibility, proper error handling, appropriate logging.

## Error Handling & Best Practices

**Common failures:** No specs (→ create-spec), test framework issues (→ setup guidance), implementation conflicts (→ resolution strategies), performance issues (→ optimization)

**Blocking issues:** Document as `⚠️ Blocking issue: [DESCRIPTION]` in story notes. Try alternatives, research solutions, break down tasks. Max 3 attempts before escalating.

**TDD adherence:** Start with failing tests, minimal code to pass, refactor when green. **MANDATORY: 100% test pass rate before completion. NO EXCEPTIONS.**

**Development:** Sequential tasks, verify each step with `run_command`, test early, validate incrementally, update status immediately, document decisions.

## Windsurf Tools Used

- `find_by_name`: Locate specifications, story files, and test directories
- `view_file`: Read specification documents, story files, and existing code
- `write_to_file`: Create test files and new implementation files
- `replace_file_content`: Update existing code and story status files
- `codebase_search`: Understand current architecture and patterns
- `run_command`: Execute tests, verify functionality, and run build processes

## Windsurf Features Used

- **Memories**: After completion, optionally create memory of completed story and implementation approach

---

*🧪 Tests first, code second, success always. No compromises on quality.*