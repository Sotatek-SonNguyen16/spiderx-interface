---
inclusion: manual
---
# Workflow: /specs — Business Analysis & FSD

Use for creating and maintaining Functional Specification Documents (FSD) and use case documentation.

## Modes
| Mode | When |
|------|------|
| `init` | Analyze codebase and create initial FSD + use cases |
| `analyze "description"` | Analyze new feature requirements |
| `update` | Sync FSD and use cases with current codebase state |

## Output Structure
```
docs/
├── project-overview-pdr.md    # Input: PRD
├── project-fsd.md             # Output: Functional Spec Document
└── usecases/
    └── {module}/
        └── uc-{module}-{nnn}-{slug}.md   # Use cases per module
```

## FSD Contents
- Module overview and boundaries
- Actors and roles
- Functional requirements
- Use case list with IDs
- Data models and flows
- Non-functional requirements

## Use Case Format
Each UC file covers:
- UC ID, name, actor, trigger
- Preconditions and postconditions
- Main flow (numbered steps)
- Alternative flows
- Business rules

## Process
1. Scout codebase to understand current implementation
2. Read `docs/project-overview-pdr.md` for business context
3. Identify modules and actors
4. Write/update FSD and UC files
5. Ensure consistency between FSD and use cases

## Important
- Do NOT implement code — documentation only
- Use case IDs must be stable (never renumber existing UCs)
- New features: run `analyze` first, then `update` to sync
