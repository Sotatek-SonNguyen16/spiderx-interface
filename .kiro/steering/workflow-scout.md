---
inclusion: manual
---
# Workflow: /scout — Codebase Exploration

Use at the start of any task spanning multiple directories, or when locating files, understanding relationships, or gathering context before changes.

## When to Use
- Beginning work on a feature touching multiple directories
- Need to "find", "locate", or "search for" files
- Starting a debug session requiring file relationship understanding
- Before changes that might affect multiple parts of the codebase

## Process
1. **Analyze** — parse the task for search targets; identify key directories, patterns, file types
2. **Divide** — split codebase into logical segments per agent; no overlap, maximize coverage
3. **Register Tasks** — create Claude Tasks per agent (skip if ≤2 agents)
4. **Spawn Parallel Agents** — each agent covers assigned directories; returns detailed summary
5. **Collect Results** — aggregate findings; timeout 3 min per agent; log unresponsive agents

## Report Format
```markdown
# Scout Report

## Relevant Files
- `path/to/file.ts` - Brief description

## Unresolved Questions
- Any gaps in findings
```

## Key Directories in This Project
```
app/          # Pages and API routes
components/   # Shared UI components
features/     # Feature vertical slices (todos, aiInbox, auth, googleChat)
lib/          # API client, configs, utilities
hooks/        # Global hooks
utils/        # Misc utilities
```

## Rules
- Use wide Grep and Glob patterns to estimate codebase scale first
- Each subagent has <200K token context — scope carefully
- Prompt each subagent with exact directories/files to read
- List unresolved questions at end of report
