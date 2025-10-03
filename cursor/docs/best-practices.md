# Development Best Practices

## Context

**These principles apply to ALL software projects across any language, framework, or domain** - from Python web APIs to C++ applications, from JavaScript frontends to Bash automation scripts.

## Core Engineering Principles

### Keep It Simple

- **Implement solutions in the fewest lines possible** - Complexity is the enemy of maintainability
- **Avoid over-engineering** - Choose straightforward approaches over clever ones
- **Prefer explicit over implicit** - Make intent clear in code
- **Question every abstraction** - Only abstract when you have concrete duplication

### Optimize for Readability

- **Prioritize code clarity over micro-optimizations** - Code is read far more than written
- **Write self-documenting code** - Clear variable and function names explain intent
- **Add comments for "why" not "what"** - Explain reasoning, not implementation
- **Consistent formatting and style** - Follow language conventions and team standards

### Fail Fast, Don't Be Defensive

- **Validate inputs early** - Check preconditions at function/method entry points
- **Use proper error handling** - Throw exceptions, return error types, or use language-appropriate error mechanisms
- **Avoid silent failures** - Don't swallow errors or return success when operations fail
- **Make errors actionable** - Provide clear error messages that help users/developers fix issues
- **Distinguish error types** - Separate user errors from system errors from programming errors
- **DON'T handle error conditions unless resolution is clear** - If you don't know how to properly handle an error, just crash with a clear message and let humans decide the proper resolution

### DRY (Don't Repeat Yourself)

- **Extract repeated logic into functions/methods** - Identical operations should use shared code
- **Create utility libraries for common operations** - File I/O, validation, formatting, etc.
- **Use configuration files for repeated values** - Don't hardcode the same constants multiple times
- **Template-based generation** - Use code generation for boilerplate patterns

**Language-specific applications:**
- **Python**: Use decorators, context managers, and modules
- **JavaScript**: Extract to functions, modules, and use higher-order functions
- **C++**: Templates, functions, and header files for shared code
- **Bash**: Functions and sourced script libraries
- **CSS**: Variables, mixins, and component classes

### Clean Architecture and Organization

- **Group related functionality together** - Modules, packages, namespaces, directories
- **Separate concerns clearly** - Business logic ≠ presentation ≠ data access ≠ configuration
- **Use consistent naming conventions** - Follow language/framework standards
- **Single responsibility principle** - Classes, functions, modules should have one clear purpose
- **Dependency direction** - High-level modules shouldn't depend on low-level details

### Configuration Management

- **Externalize configuration** - Never hardcode environment-specific values
- **Use configuration files or environment variables** - JSON, YAML, .env files, etc.
- **Validate configuration on startup** - Fail fast if required config is missing
- **Provide sensible defaults** - But require explicit values for critical settings
- **Document all configuration options** - Make it clear what each setting does

### Function-Based Design

- **Single purpose functions** - Each function should do one thing well
- **Clear input/output contracts** - Document parameters, return types, exceptions
- **Avoid side effects when possible** - Pure functions are easier to test and reason about
- **Proper parameter validation** - Check inputs at function boundaries
- **Meaningful names** - Function names should clearly describe what they do

### Error Handling Patterns

**Language-appropriate approaches:**

- **Python**: Exceptions for exceptional conditions, return None/Optional for expected missing values
- **JavaScript**: Throw errors for unexpected conditions, return null/undefined for missing data
- **C++**: Exceptions or error codes, RAII for resource management
- **Rust**: Result types for recoverable errors, panic for programming errors
- **Go**: Multiple return values with error as second return
- **Bash**: Exit codes and proper error output to stderr

## Language-Specific Guidelines

### Script and Automation (Bash, PowerShell, etc.)

- **Use strict mode** - `set -euo pipefail` in Bash, `Set-StrictMode` in PowerShell
- **Validate all inputs** - Check arguments and environment variables exist
- **Use functions for repeated operations** - Don't copy-paste command sequences
- **Proper logging and output** - Structured output, clear error messages
- **Template external files** - Never inline configuration content in scripts

### Application Code (Python, JavaScript, C++, etc.)

- **Use language-appropriate error handling** - Exceptions, error types, return codes
- **Proper resource management** - Close files, connections, free memory appropriately
- **Input validation at boundaries** - API endpoints, function entry points
- **Unit tests for critical functionality** - Test error conditions, not just happy paths
- **Use language idioms** - Follow established patterns and conventions

### Build and Infrastructure

- **Reproducible builds** - Same inputs always produce same outputs
- **Environment isolation** - Use containers, virtual environments, or sandboxes
- **Clear dependency management** - Explicit version pinning, lock files
- **Automated verification** - Tests, linting, security scanning
- **Documentation as code** - Keep docs close to implementation

## Critical Thinking and Decision Making

### Challenge Ideas and Assumptions

- Question the "why" behind every technical decision
- Identify unstated assumptions in requirements and designs
- Ask "What could go wrong?" for proposed solutions
- Consider edge cases and failure scenarios

### Provide Constructive Pushback

- Disagree when you have evidence-based concerns
- Offer alternative approaches with clear reasoning
- Challenge overly complex solutions in favor of simpler ones
- Point out potential security, performance, or maintainability issues

### Focus on Evidence Over Agreement

- Base decisions on data, benchmarks, and measurable outcomes
- Cite specific examples when discussing trade-offs
- Reference industry standards and established patterns
- Avoid "yes, and..." responses when "no, because..." is more appropriate

## Dependencies

### Choose Libraries Wisely

When adding third-party dependencies:

- Select the most popular and actively maintained option
- Check the library's repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation
- Consider the long-term maintenance burden
- Evaluate if the problem can be solved with standard library features
