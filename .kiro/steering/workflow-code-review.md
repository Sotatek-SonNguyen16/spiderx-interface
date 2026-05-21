---
inclusion: manual
---
# Workflow: /code-review — Code Quality Analysis

Use before PRs, after implementing features, or when verifying task completion.

## Modes
| Mode | When |
|------|------|
| `(default)` | Review recent changes |
| `codebase` | Full codebase scan |
| `codebase parallel` | Parallel multi-reviewer audit |

## Core Principle
**YAGNI, KISS, DRY.** Technical correctness over social comfort. Evidence before claims.

## Process
1. **Scout edge cases** — run `/scout` with edge-case focus before reviewing
2. **Get SHAs** — `BASE_SHA=$(git rev-parse HEAD~1)` and `HEAD_SHA=$(git rev-parse HEAD)`
3. **Dispatch code-reviewer** subagent with: WHAT, PLAN, BASE_SHA, HEAD_SHA, DESCRIPTION
4. **Fix** Critical issues immediately; Important issues before proceeding

## Verification Gate (Iron Law)
**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**
- Run the verification command → read output → confirm 0 failures → then claim done
- Red flags: "should work", "probably fixed", "seems to pass"

## Receiving Feedback
- No performative agreement ("Great point!", "You're right!")
- Restate → verify → push back with reasoning or implement
- Human partner: trusted, implement after understanding
- External reviewer: verify technically, push back if wrong

## Multi-file Features (3+ files)
Create a task pipeline:
```
Scout edge cases → Review implementation → Fix critical issues → Verify fixes
```
Each step blocks the next. Parallel reviewers allowed for independent scopes.

## Rules
- YAGNI check: grep for usage before implementing "proper" abstractions
- Max 3 fix cycles; escalate to user after
