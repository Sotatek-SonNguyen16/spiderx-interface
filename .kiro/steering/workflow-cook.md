---
inclusion: manual
---
# Workflow: /cook — Feature Implementation

Use for end-to-end feature implementation. Always activate before implementing any feature, plan, or fix.

## Flags
| Flag | Behavior |
|------|----------|
| `--interactive` | Full workflow with user approval gates (default) |
| `--auto` | Auto-approve all steps (score ≥ 9.5, 0 critical) |
| `--fast` | Skip research; scout → plan → code |
| `--parallel` | Multi-agent execution |
| `--no-test` | Skip testing step |

## Workflow
```
Intent Detection → Research? → Review → Plan → Review → Implement → Review → Test? → Review → Finalize
```

Non-auto mode pauses at each `[Review]` gate for human approval.

## Required Subagents (MANDATORY — delegate, do not self-implement)
| Phase | Subagent |
|-------|----------|
| Research | `researcher` |
| Scout | `scout` |
| Plan | `planner` |
| UI work | `ui-ux-designer` |
| Testing | `tester`, `debugger` |
| Review | `code-reviewer` |
| Finalize | `project-manager`, `docs-manager`, `git-manager` |

## Finalize Step (MANDATORY — never skip)
1. `project-manager` → sync all completed tasks/phases back to `plan.md`
2. `docs-manager` → update `./docs/` if changes warrant
3. Mark all Claude Tasks complete after sync verification
4. Ask user if they want to commit via `git-manager`

## Rules
- Steps for testing, review, and finalization MUST use Task tool to spawn subagents
- If workflow ends with 0 Task tool calls → INCOMPLETE
- 100% test pass required before finalize (unless `--no-test`)
