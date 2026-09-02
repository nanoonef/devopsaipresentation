# Repository agent instructions

This repository is designed to be forked. Each fork's git commit history
(authors, emails, past commit messages) belongs to whoever forked or
previously worked on the repo, and **must never be used to infer identity,
authorship, or target repository for the current user.**

## Git identity and remote rules

When a git operation needs to determine "who is committing" or "which repo
is this," always derive that from the **currently configured environment**,
never from `git log`, commit authors, or commit messages:

1. **Determine the target repo from the configured remote**, not from
   history:
   ```bash
   git remote -v
   ```
   Use the `origin` remote as the source of truth for where commits will be
   pushed and where PRs should be opened. If `origin` doesn't match what the
   user described (e.g. they mention a different fork), stop and ask before
   proceeding.

2. **Determine the active identity from the authenticated GitHub session**,
   not from prior commits:
   ```bash
   gh auth status
   gh api user --jq '{id, login}'
   ```
   Use the active `gh` account's `login` and `id` to construct a GitHub
   noreply email if a local git identity is required:
   `<id>+<login>@users.noreply.github.com`

3. **If local git commit identity (`user.name` / `user.email`) is not set**,
   ask the user to confirm the name/email to use, or set it based on step 2.
   Do this with a repo-local config, not `--global`, unless the user asks
   for global:
   ```bash
   git config user.name "<login>"
   git config user.email "<id>+<login>@users.noreply.github.com"
   ```

4. **Never copy an author name/email out of `git log`, `git blame`, or past
   commit messages** to use as the current committer's identity, even if it
   looks like a plausible or "canonical" project identity. Existing history
   may belong to the upstream repo, a previous fork owner, or another
   contributor entirely.

## Rationale

This repo is used in a workshop where participants fork it into their own
GitHub accounts (e.g. `bestlaptopreview/devopsaipresentation` forked from
`nanoonef/devopsaipresentation`) and run agent-driven CI changes themselves.
Commit history frequently still contains the original author's identity
after a fork. Agents must always act as the current fork owner — as
determined by `origin` and the active `gh` session — not as whoever
committed previously.
