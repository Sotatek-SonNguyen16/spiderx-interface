---
inclusion: manual
---
# Workflow: /git — Git Operations

Use for staging, committing, pushing, creating PRs, and merging branches.

## Sub-commands
| Command | Description |
|---------|-------------|
| `cm` | Stage files and create commit(s) |
| `cp` | Stage, commit, and push |
| `pr` | Create Pull Request |
| `merge` | Merge branches |

## Commit Process
1. **Stage + Analyze** — `git add -A && git diff --cached --stat`
2. **Security Check** — scan for secrets (API keys, tokens, passwords); STOP if found
3. **Split Decision** — split commits if mixing types (feat+fix), scopes (auth+payments), or >10 unrelated files
4. **Commit** — use Conventional Commits format: `type(scope): description`

## Conventional Commit Types
`feat` | `fix` | `perf` | `refactor` | `docs` | `test` | `chore` | `style`

For files in `.claude/` directory: only use `feat`, `fix`, or `perf` (not `docs`).

## Split Commits When
- Different types mixed (feat + fix)
- Multiple scopes (auth + payments)
- Config/deps + code mixed
- >10 unrelated files

## Single Commit When
- Same type/scope, ≤3 files, ≤50 lines

## PR Rules
- Push to a new branch, never directly to `main`/`master`
- PR title: concise, under 70 characters
- PR description: summary of changes, what was tested, blocked features

## Security
- Block commit if secrets detected; suggest `.gitignore`
- Never use `--no-verify` unless explicitly requested
- Prefer `git pull --rebase` on push rejection

## Output Format
```
✓ staged: N files (+X/-Y lines)
✓ security: passed
✓ commit: HASH type(scope): description
✓ pushed: yes/no
```
