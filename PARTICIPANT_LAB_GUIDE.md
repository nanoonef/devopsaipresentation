# Participant Lab Guide

## Objective

Use a Copilot agent to design and implement one CI optimisation, then validate measurable
improvement. You approve the design, the agent writes the change, you review and ship it.

## Five-Part Flow (60 Minutes)

1. Setting: kickoff and KPI target
2. Challenge: baseline bottleneck evidence
3. Turning Point: agent produces a design; you approve it
4. Resolution: agent implements the approved design; you validate it
5. Commitment: guardrails and deployment

## Prerequisite (every participant, before the session — allow ~15 minutes)

You will work in **your own copy** of the workshop repository, where you have full admin
rights. Do not fork — forks have Actions disabled by default and their pull requests
target the wrong repository. Create your own copy instead:

if you want to test the guardrails properly you will need a second user to act as a senior reviewer as gitlab doesnt allow reviews from the same person that created the change understandably so create another user in github you will only need to be abkle to log into it and you will need to record the user in CODEOWNERS

1. Create an empty **public** repository named `devopsaipresentation` under your own GitHub
   account (github.com -> New repository -> Public, no README). It must be public so branch
   protection works on a free account.
2. Clone the workshop repository and push it to yours:

```bash

git clone https://github.com/nanoonef/devopsaipresentation.git
cd devopsaipresentation
git remote remove origin
git remote add origin https://github.com/GITHUB-USERNAME/devopsaipresentation.git
git config user.name "GITHUB-USERNAME"
git config user.email "GITHUB-EMAIL"
git push -u origin main

once the repo has been setup change the name in .github/CODEOWNERS 
to @(your guthub user) @(your second github user)  and save the file 

git commit -a -m "change codeowners to owner"
git push
```

	(If you use the `gh` CLI, steps 1-2 are one command from inside the clone:
	`git remote rename origin upstream && gh repo create devopsaipresentation --public --source=. --push`.
	If the push is rejected mentioning "workflow scope", run `gh auth login` and retry.)

3. Open the **Actions** tab on your repository and confirm the `ci-lab` workflow passed on your push.
4. Validate locally from the repo root:
   - `npm ci`
   - `npm run build`
   - `npm test`
5. Open the repo in VS Code with the GitHub Copilot extension signed in, and confirm
   **agent mode** is available (Copilot Chat -> mode selector -> Agent). Run one throwaway
   prompt to prove the seat works. You work solo, so a working Copilot seat is a hard
   requirement — there is no partner to fall back on.

Arrive with: your own repo showing a green (or rerun-green) `ci-lab` run, local commands
passing, and Copilot agent mode verified.

## Lab 0: Setup (done in pre-work; 1 min to confirm)

1. Confirm you can push to your repo. You'll run both roles yourself: driving the agent
   and owning the scorecard and diff review.
2. Open your repo clone and confirm toolchain:

```bash
npm ci
npm test
```

3. Open workflow file: `.github/workflows/ci.yml` (repo root).
4. Open Copilot Chat and switch to **Agent** mode.

Why this stage matters:

- It ensures everyone starts from the same baseline environment and avoids setup drift.

What good looks like:

- Commands run successfully and the workflow file opens.

## Lab 1: Baseline (8 min)

Your prerequisite push already ran the pipeline — read the numbers from the Actions tab
rather than waiting for a fresh run.



- Total pipeline duration
- Slowest job/stage

Rule: no changes allowed before baseline is complete.

Why this stage matters:

- Baseline data is the reference point for proving impact.

Common mistakes to avoid:

1. Estimating values instead of recording measured numbers.
2. Starting optimisation before scorecard completion.
3. Tracking too many KPIs instead of one primary target.

What good looks like:

- You can point to one dominant bottleneck and one clear KPI target.

## Lab 2: Agent Design (6 min including the briefing)

Use **Card 1 — Design** from **Copilot Agent Prompt Cards.docx**  in Copilot agent mode, filled in
with your real baseline numbers. The card instructs the agent to investigate the repo and
produce a **design only** — it must not touch any files yet.

Output:

1. The agent's design: bottlenecks, ranked options, recommended change, planned diff,
   validation steps, rollback plan, risk score inputs
2. Your decision: design approved as-is, approved with changes, or rejected

Why this stage matters:

- The design is the approval artifact. If you cannot say why the planned diff is safe,
  you are not ready to let an agent implement it.

Common mistakes to avoid:

1. Prompting without your measured metrics.
2. Letting the agent start editing files during the design phase.
3. Approving a design whose planned diff you have not actually read.

What good looks like:

- A written design you have read end to end, with one low-risk change chosen and a
  planned diff you could explain to a reviewer.

## Lab 3: Agent Implements (11 min)

paste  **Card 2 — Implement  from* **Copilot Agent Prompt Cards.docx.** The agent
creates a branch and makes the change; your job shifts to **reviewing its diff**. When the
diff matches the approved design, let it commit, then push and open the pull request.

GitHub won't let you approve your own PR — there's no partner to hand it to today, so instead
run a documented self-review: walk the diff against the approved design one more time and
write down what you checked, then merge as the repo admin. Note what a second reviewer on a
real team would additionally catch; that's a real gap solo work has, not something to hide.  Please note any git tasks will have to be oked by the user also to push the branch you will have to type in push after everything has been commited and copilot states something like "Committed on `lab3` (`5a8114e`): 1 file changed, `.github/workflows/ci.yml`, +4 lines. Nothing pushed — that's on you as agreed."

to merge your change go back to your github repo and create a merge request by hitting "compare & pull request"

![1788363061432](image/PARTICIPANT_LAB_GUIDE/1788363061432.png)

then hit "create pull request"

![1788363136567](image/PARTICIPANT_LAB_GUIDE/1788363136567.png)

finally when all checks have been done hit the merge pull request button then "confirm merge"

![1788363261139](image/PARTICIPANT_LAB_GUIDE/1788363261139.png)

Allowed categories:

1. Cache dependencies
2. Parallelise test jobs
3. Reuse artifacts
4. Selective test execution by file path

After change:

- Rerun CI
- Update scorecard with after values
- Calculate percentage improvement

Why this stage matters:

- This stage turns recommendations into real operational change.

Common mistakes to avoid:

1. Letting the agent implement more than the approved design (scope creep is an agent habit —
   reject anything not in the planned diff).
2. Accepting the diff without reading it.
3. Forgetting to re-run and capture after metrics.
4. Breaking quality gates while chasing speed.

What good looks like:

- One focused change with measurable KPI movement and intact quality checks.

## Lab 4: Guardrails (10 min)

Follow `PARTICIPANT_GUARDRAILS_GUIDE.md` for the exact click-by-click steps. Summary: you own
this repo, so you do not just write the policy — you switch it on. Write the plan yourself
first, in `templates/guardrail_policy_worksheet.md` — guardrails exist to constrain the
agent, so do not let the agent draft its own leash. Then implement it:

1. Rollback plan (exact command, owner, time target)
2. Protected-branch policy: create the **branch protection rule** on `main` (Settings ->
   Branches): require a pull request, require the `build` and `test` checks, and tick
   **"Do not allow bypassing the above settings"** — you are this repo's admin, and without
   that box your own pushes silently bypass the rule and the proof below will not work
3. Deployment risk score and go/no-go decision

Prove it: try a direct `git push origin main` — it must be rejected.

Optional, once your own plan is written: use **Card 3 — Guardrail Review** to have the agent
critique your plan for gaps and weak spots. It should not author your policy — you own every
decision, the agent only stress-tests it.

Want your policy as code? See the `risk_assessment` and `deploy_preview_guarded` jobs in
`.github/workflows/ci.optimized.example.yml` — a working implementation of the risk-score
thresholds and approval gate you are defining here.

Why this stage matters:

- It reduces risk and makes optimisation safe to roll into production.

Common mistakes to avoid:

1. No named owner for rollback.
2. Vague approval policy.
3. Missing audit trail for changes.
4. Releasing high-risk changes without a risk threshold.

What good looks like:

- A specific control plan with approver, rollback step, and monitoring owner.
- A numeric risk score with explicit release criteria.

Risk scoring model (quick version):

1. Score each from 1 (low) to 5 (high):
   - Change size
   - Critical path impact
   - Test confidence after change
   - Rollback readiness
2. Add total score and decide:
   - 4-8: normal review path
   - 9-14: senior reviewer required
   - 15-20: block promotion, remediate first

## Share-Out (5 min)

Present in 45 seconds:

1. Baseline metric
2. Optimisation implemented
3. KPI delta
4. Safety guardrail

Why this stage matters:

- Evidence-based summaries improve shared learning and demonstrate repeatable validation.

What good looks like:

- Clear numbers, one key lesson, and measurable KPI improvement with deployed change.
