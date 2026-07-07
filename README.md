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
Edit `.github/workflows/ci.yml` to implement one optimisation:
1. Add dependency caching via `actions/setup-node` cache option.
2. Split tests across matrix shards.
3. Reuse build artifacts.
4. Add path-based selective execution.
5. Fix the flaky integration test (its root cause is in `scripts/test.js`, and it is fixable).

Compare your work against `.github/workflows/ci.optimized.example.yml` after the lab.
