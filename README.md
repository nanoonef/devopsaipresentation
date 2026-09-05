# Sample App for CI Optimisation Workshop

This project is intentionally simple so participants can focus on pipeline improvements.

## Before the workshop (required prerequisite, ~15 minutes)

You will work in **your own copy** of this repository — you need admin rights on it for the
guardrails lab. Do not fork (forks have Actions disabled by default and their pull requests
target this repo instead of yours). Instead :

1. Create an empty **public** repository named `devopsaipresentation` under your own account
   (public is required for branch protection on a free account).
2. Clone this repo and push it to yours:

```bash
git clone https://github.com/nanoonef/devopsaipresentation.git
cd devopsaipresentation
git remote rename origin upstream
git remote add origin https://github.com/YOUR-USERNAME/devopsaipresentation.git
git push -u origin main
```

3. Open your repo's **Actions** tab and confirm the `ci-lab` workflow passed on your push.
4. Validate locally: `npm ci && npm run build && npm test`.
5. Open the repo in VS Code with GitHub Copilot signed in and confirm **agent mode** works
   (Copilot Chat -> Agent).

## Baseline Workflow
- File: `.github/workflows/ci.yml`
- Characteristics:
  - Real npm dependencies (~90 MB installed) so install cost is measurable
  - Reinstalls dependencies in both jobs
  - No dependency cache
  - No test parallelisation
  - Good candidate for optimisation lab

## Local Validation

```bash
npm ci
npm run build
npm test
```

## Workshop Task
Open this repo in VS Code with GitHub Copilot in **agent mode** and use the workshop prompt
cards. The discipline: the agent designs first (no file edits), your team approves the design,
then the agent implements it on a branch and you review its diff before it commits.

Optimisation categories (pick exactly one):
1. Add dependency caching via `actions/setup-node` cache option.
2. Split tests across matrix shards.
3. Reuse build artifacts.
4. Add path-based selective execution.

You push and open the pull request yourself — the agent does not ship its own work.
Compare the result against `.github/workflows/ci.optimized.example.yml` after the lab.
