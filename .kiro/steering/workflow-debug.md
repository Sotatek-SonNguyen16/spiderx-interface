---
inclusion: manual
---
# Workflow: /debug — Systematic Debugging

Use for bugs, test failures, unexpected behavior, performance issues, CI/CD failures, log analysis.

## Core Principle
**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

Random fixes waste time and create new bugs. Find root cause → fix at source → validate at every layer → verify before claiming success.

## Process
1. **Root Cause Investigation** — trace backward through call stack to original trigger
2. **Pattern Analysis** — identify what changed, what's different
3. **Hypothesis Testing** — spawn parallel Explore subagents to verify each hypothesis
4. **Implementation** — fix at source, not symptom
5. **Defense-in-Depth** — validate at every layer: entry → business logic → environment → debug instrumentation
6. **Verification** — run command, read output, confirm fix before claiming done

## Verification Gate (Iron Law)
**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

## Specialized Paths
| Issue Type | Approach |
|------------|----------|
| Deep call stack | Trace backward to original trigger |
| CI/CD failure | Collect GitHub Actions logs via `gh` CLI |
| Performance | Identify bottlenecks, query analysis |
| Frontend bug | Screenshot + console errors via chrome-devtools |
| Log analysis | Correlate across sources, structured queries |

## Red Flags — Stop and Return to Process
- "Quick fix for now, investigate later"
- "Just try changing X and see"
- "It's probably X"
- "Should work now" / "Seems fixed"
- "Tests pass, we're done"

## Tools
- `psql` for database diagnostics
- `gh` CLI for CI/CD logs
- `chrome-devtools` skill for frontend visual verification
- `sequential-thinking` skill for complex multi-step analysis
