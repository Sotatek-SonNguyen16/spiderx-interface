---
inclusion: manual
---
# Workflow: /test-cases — Test Case Management

Use for generating, updating, and exporting test case documentation from use cases.

## Modes
| Mode | When |
|------|------|
| `generate [module[/uc]]` | Generate TCs from use cases (all, per module, or per UC) |
| `update` | Sync TCs with use case changes |
| `export csv\|json` | Export all TCs to CSV or JSON |

## File Structure
```
docs/usecases/{module}/uc-{module}-{nnn}-{slug}.md   # Input: use cases
test-cases/
├── test-summary.md                                   # TC summary
├── test-config.md                                    # Config (created once, manually maintained)
├── {module}/
│   └── tc-{module}-{nnn}-{slug}.md                  # Test cases per module
└── export/                                           # CSV/JSON exports
```

## Test Case Format
Each TC file covers:
- TC ID, title, linked UC ID
- Preconditions
- Test steps (numbered)
- Expected results
- Priority (Critical / High / Medium / Low)
- Test type (Functional / Edge Case / Negative / Performance)

## Process
1. Read input use cases from `docs/usecases/`
2. Read FSD from `docs/project-fsd.md` for context
3. Generate TCs covering: happy path, alternative flows, edge cases, negative cases
4. Write TC files following naming convention
5. Update `test-summary.md`

## Rules
- TC IDs must be stable — never renumber existing TCs
- Each UC should have at least: 1 happy path TC + 1 negative TC
- Critical flows (auth, data mutation) require edge case TCs
- Do NOT implement code — documentation only
