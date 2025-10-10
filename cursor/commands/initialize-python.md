# Initialize Python Subcommand

## Overview

### Purpose

Provide global recommendations for Python project setup using modern tooling.

### When to Use

This subcommand should be executed when:
- Setting up a new Python project
- Adding Code Captain to an existing Python workspace

---

## Global Recommendations

### Package Management

**Recommended:** Use `uv` or `PDM` for modern Python package management instead of pip/venv.

- **uv** - Fast Python package installer and resolver
- **PDM** - Modern Python package and dependency manager

### Code Quality

**Recommended:** Use `RUFF` for fast Python linting and formatting.

- **RUFF** - Extremely fast Python linter and code formatter (replaces flake8, black, isort, etc.)

---

## Implementation Notes

These are global recommendations only. Specific project setup should be handled by the project team based on their requirements and constraints.

---

## Integration with Main Initialize Command

This subcommand should be automatically triggered when:

1. **Python project detected** - Presence of `.py` files or `requirements.txt`
2. **Virtual environment** - Detection of `venv/`, `env/`, or `.venv/` directories
3. **Python package files** - `setup.py`, `pyproject.toml`, or `Pipfile`


---

## Success Criteria

The Python subcommand is successful when:

- [ ] Global recommendations for `uv`/`PDM` and `RUFF` are provided
- [ ] Project team is informed of modern Python tooling options

---

## Integration Notes

This subcommand provides high-level recommendations only. Specific implementation details should be left to the project team based on their specific needs and constraints.