---
inclusion: manual
---
# Workflow: /docs — Documentation Management

Use to initialize, update, or summarize project documentation.

## Modes
| Mode | When |
|------|------|
| `init` | Analyze codebase and create initial docs |
| `update` | Analyze changes and sync docs with current code |
| `summarize` | Quick codebase summary update |

## Documentation Structure
All docs live in `./docs/`:
```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── design-system/         # Design principles, tokens, catalog, themes
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

## Process
1. Scout the codebase to understand current state
2. Compare with existing docs to identify gaps or stale content
3. Generate or update the relevant doc files
4. Keep docs concise and accurate — sacrifice grammar for brevity

## Important
- Do NOT implement code — documentation only
- `./docs/` is the source of truth for project documentation
- Always update docs after significant code changes (triggered by `cook` finalize step)
