# Claude Code starter pack

A ready-to-use [Claude Code](https://claude.com/claude-code) configuration: sensible
engineering standards, two safety hooks, a status line, and templates for setting up
each project. Copy the files into place and you're done — nothing to compile.

## The idea in one minute

Claude Code reads config from two layers:

- **Global** (`~/.claude/`) — *how you work everywhere*: your standards and safety rails.
- **Project** (`<repo>/CLAUDE.md` + `<repo>/.claude/`) — *facts about one codebase*:
  how to deploy it, run its tests, its quirks.

And two kinds of rule:

- **CLAUDE.md is advisory** — instructions Claude usually follows. Good for judgment.
- **Hooks are deterministic** — scripts the tool runs on events; Claude can't skip them.
  **If something must always happen, it's a hook, not a sentence in CLAUDE.md.** That's
  the whole reason the safety pieces here are scripts, not prose.

## What's in here

```
global/                     -> copy the CONTENTS into ~/.claude/
  CLAUDE.md                 your standards (loads in every project)
  settings.json            model, permissions, hooks, plugins
  hooks/
    secret-guard.js        blocks secret leaks + git --no-verify/--no-gpg-sign
    load-lessons.js        surfaces a repo's saved lessons at session start
  statusline.js            shows "folder  model  ctx%" in the status bar

project-template/           -> use once PER REPO you work in
  CLAUDE.md                copy to <repo>/CLAUDE.md and fill in
  verify.mjs               copy to <repo>/.claude/verify.mjs and adapt
  mcp.json.example         optional: Playwright browser MCP (see below)

skills/                     -> optional: copy any folder into ~/.claude/skills/
  qa/                      systematic QA pass over a web app
  review/                  pre-landing diff review (security, structure)
  ship/                    merge main, test, review, version bump, push, open PR
  retro/                   weekly engineering retrospective from git history
  plan-ceo-review/         review a plan at the product/strategy level
  plan-eng-review/         review a plan at the engineering level
```

## Setup (about 5 minutes)

### 1. Global config

Copy everything under `global/` into your home `.claude` folder:

- **macOS / Linux:** `~/.claude/`
- **Windows:** `C:\Users\<you>\.claude\`

So you end up with `~/.claude/CLAUDE.md`, `~/.claude/settings.json`,
`~/.claude/hooks/secret-guard.js`, `~/.claude/hooks/load-lessons.js`, and
`~/.claude/statusline.js`.

Quick way to clone and copy on macOS/Linux:

```bash
git clone https://github.com/CiaranCGit/claude-code-starter-pack.git
cp -R claude-code-starter-pack/global/. ~/.claude/
```

Requires Node.js (the hooks and status line are tiny Node scripts) — check with
`node --version`.

> **Path note:** `~` works on macOS/Linux. On Windows, if the hooks don't fire,
> replace `~` in `settings.json` with the absolute path, e.g.
> `node C:/Users/<you>/.claude/hooks/secret-guard.js` (forward slashes).

### 2. Per project

In each repo you work in:

1. Copy `project-template/CLAUDE.md` to the repo root as `CLAUDE.md` and fill it in
   (or run `/init` inside the repo to auto-draft it, then prune).
2. Copy `project-template/verify.mjs` to `<repo>/.claude/verify.mjs` and edit the
   commands to match the stack (lint/test/build).

That's it.

### 3. Optional: skills

Skills are reusable workflows you trigger with a slash command (e.g. `/ship`,
`/review`). To install one, copy its folder from `skills/` into `~/.claude/skills/`,
then invoke it by name in Claude Code. They're independent — take only the ones you
want. `ship` assumes the repo has a `VERSION` file and `CHANGELOG`; adapt it if yours
doesn't.

## How to actually use it

- **Let it plan.** For anything non-trivial, Claude will propose a plan first — read
  it before saying go.
- **Make it prove things.** When it says "done", expect it to have run the verifier
  and shown the output. If it didn't, ask it to.
- **Correct it once.** When Claude does something wrong, tell it, and tell it to add
  a one-line rule to `CLAUDE.md > Project Learnings`. Next session that rule is loaded
  automatically (via the `load-lessons` hook), so the same mistake doesn't repeat.
  This is the part that makes the setup get better over time.

## Optional: useful MCP servers

MCP servers give Claude extra tools and data sources. Most are tied to a specific
service and account, so only add what's relevant to your own projects.

### Playwright (recommended for any web project)

Lets Claude drive a real browser — open pages, click, fill forms, take screenshots,
and test your own site end to end. Generic and useful regardless of your stack.

Add it globally (works in every project):

```bash
claude mcp add playwright -- npx @playwright/mcp@latest
claude mcp list           # confirm it registered
```

> If that syntax differs on your version, run `claude mcp add --help`. The first run
> downloads a browser engine; Node.js is required.

Or add it to a single repo: rename the included `project-template/mcp.json.example`
to `.mcp.json` at the repo root (same config in file form).

### Others, only if you use the service

- **Sentry** — if your project reports errors to Sentry, its MCP lets Claude read and
  triage issues. Add via `claude mcp add` per their docs.
- **context7** — live, up-to-date library docs. Already enabled as a plugin in this
  pack's `settings.json`, so you don't need it as an MCP.

### Deliberately NOT included

Service-specific data MCPs (Stripe, Google Ads, Firebase, Google Search Console,
analytics) need their own accounts and API keys and won't help a different project —
add those yourself only if you actually use the service.

## Safety notes

- `settings.json` ships with `"defaultMode": "default"` — Claude **asks** before
  running commands or writing files. That's the safe starting point. Only switch to
  `"auto"` once you trust your `deny` list and hooks, and you understand what an agent
  can do on your machine without prompting.
- The `deny` list blocks reading `.env`, `.pem`, and `secrets/` files outright. Keep it.
- `secret-guard.js` is a backstop, not a vault — it catches obvious credential
  patterns and git hook-skips. Don't rely on it to clean up real secrets; keep those
  out of the repo in the first place.

## Customizing

- **Cheaper/faster day-to-day:** set `"model": "sonnet"` in `settings.json`.
- **Plugins:** `enabledPlugins` lists a few official ones (live docs, frontend design,
  code review). Trim or extend to taste.

## License

MIT — do whatever you like with it.
