# <Project Name> - Claude Code Context

Project-specific facts. Adapt every section to your codebase, then delete this line.
Tip: run the `/init` command inside the repo to auto-generate a first draft, then prune it.

## Pre-Flight Check (run before any backend/infra work)

<The exact commands to confirm you're pointed at the right environment before
acting — e.g. which cloud project, database, or account is active. This is what
stops an agent from running against production by mistake. Example:>

```bash
# gcloud config get-value project   # must return: my-project-prod
```

## Architecture

| Layer | Stack |
|-------|-------|
| Frontend | ... |
| Backend  | ... |
| Data     | ... |

## How to deploy

<Exact, copy-pasteable commands. Call out any syntax that's easy to get wrong.>

## How to run tests / verify

```bash
node .claude/verify.mjs
```

Never claim "done" without green output from the verifier (or the relevant
package's test/build output) as evidence.

## Important Files

| File | Purpose |
|------|---------|
| ...  | ...     |

## Project Learnings

Accumulated corrections from real sessions. When the user corrects an approach,
append a ONE-LINE rule here, phrased as a principle (the *why*). Keep this section
SHORT — it loads every turn. Deep feature internals belong in docs/, not here.
When it passes ~15 entries, merge overlapping rules and show the diff for approval.

- (example) Editing email templates requires redeploying the mail function too, or
  copy changes ship but the old emails still send.
