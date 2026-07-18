# Branch and release strategy

`main` is protected and must remain releasable. New work starts from the latest authoritative `github/main`
until GitLab/GitHub main are synchronized. Short-lived topic branches target `main` through a PR/MR; the old
`develop` branch is retained as academic history but is not silently treated as current integration.

| Prefix | Purpose | Example | Owner |
|---|---|---|---|
| `feature/` | executable product capability | `feature/backend-production-hardening-v2` | domain lead |
| `docs/` | architecture/process/evidence | `docs/software-engineering-deliverables-v2` | document owner + technical reviewer |
| `fix/` | scoped defect correction | `fix/payment-idempotency-race` | defect owner |
| `release/` | stabilization only, no new scope | `release/v2.0-se-delivery` | shared |

Rules: fetch/prune before branch; rebase/merge latest main before final approval; no direct/force push to main;
one concern per PR where possible; delete merged remote topic branches unless academic evidence requires them;
tag only an audited merge commit. Stacked PRs declare their base/dependency and are merged bottom-up.

## Current delivery branches

- `docs/software-engineering-deliverables-v2`: diagram and software-engineering evidence; intended PR to main.
- `feature/backend-production-hardening-v2`: implementation hardening preserved separately and intentionally
  deferred from the current documentation scope.

This separation keeps the documentation PR reviewable and prevents unrequested application work from being
mixed into it.
