# Initialize Cursor/VSCode Subcommand

## Overview

### Purpose

Configure Cursor/VSCode workspace to open markdown files in preview mode by default for optimal Code Captain experience.

### When to Use

This subcommand should be executed when:
- Setting up a new project in Cursor or VSCode
- Adding Code Captain to an existing Cursor/VSCode workspace

---

## Configuration Task

### Workspace Settings Configuration

Create or update `.vscode/settings.json` with markdown preview by default:

```json
{
  "markdown.preview.openMarkdownLinks": "inPreview",
  "files.associations": {
    "*.mdc": "markdown"
  }
}
```

---

## Implementation Steps

### Step 1: Create VSCode Directory

```bash
mkdir -p .vscode
```

### Step 2: Configure Settings

Create `.vscode/settings.json` with the configuration above.

### Step 3: Verify Configuration

- Open a markdown file and verify it opens in preview mode
- Check that `.mdc` files are properly recognized as markdown

---

## Integration with Main Initialize Command

This subcommand should be automatically triggered when:

1. **Cursor/VSCode workspace detected** - Presence of `.vscode/` directory or Cursor-specific files
2. **Code Captain installation** - When Code Captain is being set up in the workspace


---

## Success Criteria

The Cursor/VSCode subcommand is successful when:

- [ ] `.vscode/settings.json` created with markdown preview settings
- [ ] Markdown files open in preview mode by default
- [ ] `.mdc` files are properly recognized as markdown

---

## Integration Notes

This subcommand integrates with the main `initialize` command and should be executed automatically when VSCode/Cursor workspace is detected. It provides a simple, focused configuration for optimal Code Captain markdown experience.