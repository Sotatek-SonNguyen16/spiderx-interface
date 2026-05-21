---
inclusion: manual
---
# Workflow: /test — Testing & QA

Use after implementation, for coverage checks, UI verification, or pre-commit quality gates.

## Modes
| Mode | When |
|------|------|
| `(default)` | Run unit/integration/e2e tests |
| `ui [url]` | Run UI/visual tests on a page |
| `coverage` | Check coverage metrics |

## Core Principle
**NEVER IGNORE FAILING TESTS.** Fix root causes, not symptoms. No mocks/cheats to pass builds.

## Process
1. **Identify scope** — from recent changes or explicit target
2. **Typecheck first** — catch syntax errors before running tests
3. **Run test suite** — use project commands (see below)
4. **Analyze failures** — focus on root cause, not workarounds
5. **Coverage report** — verify thresholds met (80%+)
6. **UI tests** — screenshots + console errors via chrome-devtools (if frontend changes)
7. **Report** — structured summary with metrics and recommendations

## Project Test Commands
```bash
pnpm test           # Run all tests (single pass)
pnpm test:watch     # Watch mode
pnpm test:ci        # CI mode (--ci --runInBand)
```

## Test File Conventions
- Location: `features/{feature}/__tests__/`
- Unit/component tests: `*.test.ts` / `*.test.tsx`
- Property-based tests: `*.property.test.ts` (use `fast-check`)
- Test environment: jsdom (configured in `jest.config.js`)
- Path alias: `@/` maps to project root

## Quality Standards
- All critical paths must have coverage
- Test happy path AND error scenarios
- Tests must be deterministic and isolated
- No interdependencies between tests
- Clean up test data after execution

## Tools
- `@testing-library/react` for component tests
- `fast-check` for property-based testing
- `chrome-devtools` skill for UI/visual verification
- `debug` skill when tests reveal bugs needing investigation
