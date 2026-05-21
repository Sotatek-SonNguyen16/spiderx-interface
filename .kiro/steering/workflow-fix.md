---
inclusion: manual
---
# Workflow: /fix — Bug Fixing

Always activate before fixing ANY bug, error, test failure, type error, lint issue, or UI problem.

## Flags
| Flag | Behavior |
|------|----------|
| `--auto` | Autonomous mode (default) |
| `--review` | Human-in-the-loop at each step |
| `--quick` | Fast cycle for trivial bugs (type errors, lint) |
| `--parallel` | Parallel agents per independent issue |

## Specialized Keywords
| Keyword | Behavior |
|---------|----------|
| `test` | Run tests and fix failures |
| `types` | Fix TypeScript type errors |
| `ui` | Fix UI/visual issues |
| `ci <url>` | Analyze GitHub Actions logs |
| `logs` | Analyze app logs and fix |

## Process
1. **Mode Selection** — determine workflow mode (auto/review/quick/parallel)
2. **Debug** — activate `debug` skill; spawn parallel Explore subagents to verify hypotheses
3. **Complexity Assessment**
   - Simple (single file, clear error) → quick workflow
   - Moderate (multi-file, unclear root cause) → standard workflow with Tasks
   - Complex (system-wide, architecture impact) → deep workflow with research
   - Parallel (2+ independent issues) → parallel fullstack-developer agents
4. **Fix Implementation** — implement at root cause, not symptom
5. **Verification** — spawn Explore subagents to confirm no regressions

## Finalize (MANDATORY — never skip)
1. Report: confidence score, files changed, summary
2. `docs-manager` subagent → update `./docs/` if warranted
3. Mark all Claude Tasks complete
4. Ask user if they want to commit via `git-manager`

## Output Format
```
✓ Step 0: [Mode] selected - [Complexity] detected
✓ Step 1: Root cause identified - [summary]
✓ Step 2: Fix implemented - [N] files changed
✓ Step 3: Tests [X/X passed]
✓ Step 4: Review [score]/10 - [status]
✓ Step 5: Complete - [action taken]
```
