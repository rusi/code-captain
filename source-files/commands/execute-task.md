# Execute Task Command (cc: execute-task)

## Overview

Execute a specific task and its sub-tasks systematically following a Test-Driven Development (TDD) workflow. This command reads task specifications from `.code-captain/specs/` directories and implements features with comprehensive testing, following established code standards and best practices.

## Usage

```bash
cc: execute-task
```

**Note:** This command automatically detects and lists available task specifications for selection, or executes a specific task if context is clear.

## Command Process

### Step 1: Task Discovery & Selection

**Scan for available specifications:**

- Search `.code-captain/specs/` for dated specification folders
- List available tasks from `tasks.md` files in each spec folder
- Present available tasks organized by specification

**Create execution todo tracking:**

Use `todo_write` to track the execution process:

```json
{
  "todos": [
    {
      "id": "task-discovery",
      "content": "Discover and select task from available specifications",
      "status": "in_progress"
    },
    {
      "id": "context-gathering",
      "content": "Gather context from spec documents and codebase analysis",
      "status": "pending"
    },
    {
      "id": "subtask-execution",
      "content": "Execute all subtasks in TDD order",
      "status": "pending"
    },
    {
      "id": "test-verification",
      "content": "Verify all task-specific tests pass",
      "status": "pending"
    },
    {
      "id": "task-completion",
      "content": "Update task status and mark complete",
      "status": "pending"
    }
  ]
}
```

**Task selection process:**

1. **If multiple specs exist**: Present selection menu with spec dates and task summaries
2. **If single spec exists**: Show available tasks within that specification
3. **If task specified**: Validate task exists and proceed with execution
4. **If no specs exist**: Guide user to run `cc: create-spec` first

### Step 2: Context Gathering & Analysis

**Load specification context:**

- Read primary spec document: `spec.md`
- Load user stories: `user-stories.md`
- Review technical specifications: `sub-specs/technical-spec.md`
- Parse task breakdown: `tasks.md`

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

### Step 3: Task Breakdown Analysis

**Parse selected task structure:**

- Identify parent task and all subtasks
- Analyze task dependencies and execution order
- Understand test requirements (first subtask typically writes tests)
- Plan implementation approach based on subtask breakdown

**Validate TDD approach:**

- **First subtask**: Should write tests for the feature
- **Middle subtasks**: Implement functionality to pass tests
- **Final subtask**: Verify all tests pass and feature completion
- **Integration considerations**: Update adjacent/related tests as needed

**Example task structure verification:**

```markdown
- [ ] 1. User Authentication System
  - [ ] 1.1 Write tests for authentication middleware
  - [ ] 1.2 Implement JWT token generation
  - [ ] 1.3 Create password hashing utilities
  - [ ] 1.4 Build login/logout endpoints
  - [ ] 1.5 Verify all tests pass
```

### Step 4: Pre-Implementation Preparation

**Create execution tracking:**

Update todos to reflect specific subtasks:

```json
{
  "todos": [
    {
      "id": "subtask-1-1",
      "content": "Write tests for authentication middleware",
      "status": "in_progress"
    },
    {
      "id": "subtask-1-2",
      "content": "Implement JWT token generation",
      "status": "pending"
    },
    {
      "id": "subtask-1-3",
      "content": "Create password hashing utilities",
      "status": "pending"
    },
    {
      "id": "subtask-1-4",
      "content": "Build login/logout endpoints",
      "status": "pending"
    },
    {
      "id": "subtask-1-5",
      "content": "Verify all tests pass",
      "status": "pending"
    }
  ]
}
```

**Validate testing setup:**

- Confirm testing framework is configured
- Verify test directories and naming conventions
- Check existing test patterns and utilities
- Ensure test runner is functional

### Step 5: Subtask Execution (TDD Workflow)

**Execute subtasks in sequential order:**

#### Subtask 1: Write Tests (Test-First Approach)

**Actions:**

- Write comprehensive test cases for the entire feature
- Include unit tests, integration tests, and edge cases
- Cover happy path, error conditions, and boundary cases
- Ensure tests fail appropriately (red phase)

**Test categories to include:**

- **Unit tests**: Individual function/method testing
- **Integration tests**: Component interaction testing
- **Edge cases**: Boundary conditions and error scenarios
- **Acceptance tests**: User story validation

#### Subtasks 2-N: Implementation (Green Phase)

**For each implementation subtask:**

1. **Focus on specific functionality**: Implement only what's needed for current subtask
2. **Make tests pass**: Write minimal code to satisfy failing tests
3. **Update related tests**: Modify adjacent tests if behavior changes
4. **Maintain compatibility**: Ensure no regressions in existing functionality
5. **Refactor when green**: Improve code quality while tests remain passing

**Implementation approach:**

- Start with simplest implementation that passes tests
- Add complexity incrementally as required by test cases
- Keep tests passing at each step
- Refactor for clarity and maintainability

#### Final Subtask: Test Verification

**Actions:**

- Run complete test suite for this feature
- Verify 100% pass rate for new functionality
- Check no regressions in existing tests
- Validate all acceptance criteria are met

### Step 6: Task-Specific Test Validation

**Run targeted test validation:**

Use available testing tools to verify:

- All tests written in first subtask are passing
- New functionality works as specified
- No regressions introduced to existing features
- Performance requirements are met (if specified)

**Test execution strategy:**

- **First**: Run only tests for current task/feature
- **Then**: Run related test suites to check for regressions
- **Finally**: Consider full test suite if significant changes made

**Failure handling:**

- **If tests fail**: Debug and fix specific issues
- **If performance issues**: Optimize implementation
- **If regressions found**: Update code to maintain compatibility

### Step 7: Task Completion & Status Updates

**Update specification status:**

Mark completed tasks in the original `tasks.md` file:

```markdown
- [x] 1. User Authentication System
  - [x] 1.1 Write tests for authentication middleware
  - [x] 1.2 Implement JWT token generation
  - [x] 1.3 Create password hashing utilities
  - [x] 1.4 Build login/logout endpoints
  - [x] 1.5 Verify all tests pass
```

**Document completion:**

- Update spec status if all tasks in parent feature are complete
- Note any deviations from original plan
- Document lessons learned or improvements made
- Identify any follow-up tasks or technical debt

**Present completion summary:**

```
Task completed successfully:

**Feature:** User Authentication System
**Subtasks completed:** 5/5
**Tests written:** 12 test cases
**Tests passing:** 12/12 (100%)
**Files modified:** 6 files
**New functionality:** JWT authentication, password hashing, login endpoints

Next available tasks:
- Task 2: User Profile Management (5 subtasks)
- Task 3: Session Management (3 subtasks)

Would you like to proceed with the next task?
```

## Tool Integration

**Primary Code Captain tools:**

- `todo_write` - Progress tracking throughout execution
- `codebase_search` - Understanding existing architecture and patterns
- `file_search` - Locating relevant specifications and test files
- `read_file` - Loading spec documents and existing code
- `search_replace` / `MultiEdit` - Implementing code changes
- `run_terminal_cmd` - Executing tests and build processes

**Parallel execution opportunities:**

- Context gathering (multiple spec files, codebase analysis)
- Test file analysis (existing patterns, framework configuration)
- Implementation validation (running tests, checking integration)

## Integration with Code Captain Ecosystem

**Specification dependency:**

- Requires existing spec created by `cc: create-spec`
- Uses task breakdown from `tasks.md` in spec directories
- Follows technical approach from `sub-specs/technical-spec.md`

**Code style compliance:**

- Adheres to patterns in `.code-captain/docs/code-style.md`
- Uses technology stack from `.code-captain/docs/tech-stack.md`
- Follows best practices from `.code-captain/docs/best-practices.md`

**Cross-command integration:**

- Complements `cc: create-spec` for complete development workflow
- Can trigger `cc: research` if unknown technologies encountered
- Integrates with testing and validation workflows

## Quality Standards

**Test-Driven Development:**

- Tests written before implementation
- All tests must pass before task completion
- Comprehensive coverage including edge cases
- Regression testing for existing functionality

**Code quality requirements:**

- Follows established project patterns and conventions
- Maintains backward compatibility unless specified otherwise
- Implements proper error handling and validation
- Includes appropriate logging and monitoring

**Documentation standards:**

- Code changes include appropriate comments
- Complex logic is documented inline
- API changes are reflected in technical specifications
- Task completion updates specification status

## Error Handling & Recovery

**Common failure scenarios:**

- **No specifications found**: Guide to `cc: create-spec`
- **Test framework issues**: Provide setup guidance
- **Implementation conflicts**: Suggest conflict resolution
- **Performance issues**: Recommend optimization approaches

**Blocking issue management:**

If blocked by technical issues:

```markdown
- [ ] Task description ⚠️ Blocking issue: [DESCRIPTION]
```

**Resolution strategies:**

1. Try alternative implementation approach
2. Research solution using `cc: research`
3. Break down task into smaller components
4. Maximum 3 attempts before escalating or documenting as blocked

## Best Practices

**TDD adherence:**

- Always start with failing tests
- Implement minimal code to pass tests
- Refactor only when tests are green
- Maintain test coverage above 90%

**Incremental development:**

- Complete subtasks sequentially
- Verify functionality at each step
- Commit working code frequently
- Test integration points early

**Communication:**

- Update task status immediately after completion
- Document any deviations from specification
- Note technical decisions and rationale
- Highlight areas requiring future attention
