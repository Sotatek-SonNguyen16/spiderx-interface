---
inclusion: manual
---
# Workflow: /plan — Implementation Planning

Use for planning features, designing architectures, and creating technical roadmaps.

## Flags
| Flag | Behavior |
|------|----------|
| `--auto` | Auto-detect complexity and pick mode (default) |
| `--fast` | Skip research; plan only |
| `--hard` | Deep research with 2 researchers + audit |
| `--two` | Generate 2 competing plans |

## Sub-commands
| Command | Purpose |
|---------|---------|
| `archive` | Write journal entry and archive plans |
| `audit` | Adversarial plan audit with hostile reviewers |
| `validate` | Critical questions interview |

## Process
1. **Pre-Creation Check** — check for active/suggested plan context
2. **Mode Detection** — auto-detect or use explicit flag
3. **Research Phase** — spawn researchers (skip in fast mode)
4. **Codebase Analysis** — read `./docs/`, scout if needed
5. **Plan Documentation** — write via `planner` subagent
6. **Audit** (hard/parallel/two modes) — adversarial review
7. **Validation** (hard/parallel/two modes) — critical questions interview
8. **Hydrate Tasks** — create Claude Tasks from phases (default on; skip with `--no-tasks`)
9. **Context Reminder** — output cook command with absolute plan path (MANDATORY)

## Plan File Structure
Plans live in `./plans/`:
```
plans/{date}-{slug}/
├── plan.md          # Overview, status, phases
└── phase-01-*.md    # Per-phase detail
```

## Task Hydration
- Auto-create Claude Tasks per phase with `addBlockedBy` dependency chains
- Skip if <3 phases
- Tasks are session-scoped; plan files are persistent

## Quality Standards
- Thorough enough for a junior developer to follow
- Address security and performance concerns
- Validate against existing codebase patterns (check `./docs/` and `./features/`)
- Honor YAGNI, KISS, DRY

## Important
- Do NOT implement code — planning only
- Always create plans in the project directory, never in user home
- After creating plan: set it as active plan context
