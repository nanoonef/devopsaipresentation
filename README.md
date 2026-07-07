# Sample App for CI Optimisation Workshop

This project is intentionally simple so participants can focus on pipeline improvements.

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
5. Fix the flaky integration test (its root cause is in `scripts/test.js`, and it is fixable).

You push and open the pull request yourself — the agent does not ship its own work.
Compare the result against `.github/workflows/ci.optimized.example.yml` after the lab.
