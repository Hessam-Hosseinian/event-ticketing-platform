# Mutation testing protocol

Coverage answers whether a line ran; mutation testing challenges whether assertions detect a meaningful
logic change. Stryker targets small correctness-critical policy/lock modules first so results remain useful.

Critical mutation classes are equality/boolean changes in owner checks, success/failure comparisons,
terminal-state guards, TTL boundary arithmetic, all-or-none lock behavior, compensation deletion and
idempotency branches. A surviving critical mutation is a release blocker even when the aggregate score passes.

```bash
cd backend
npm run test:mutation
```

Because Stryker starts multiple test workers and can consume substantial CPU/RAM, run the full suite in
scheduled CI. For a constrained machine set concurrency to 1 and mutate one file, or skip locally and use
the retained CI artifact. Do not run mutation and Docker load tests simultaneously.

Thresholds: high 80%, low 60%, break 50%; Reservation/Billing target ≥80% with zero surviving critical
mutation. CI retains HTML and machine-readable results. Each survivor is classified as equivalent,
uncovered requirement or weak assertion. Equivalent mutants get a documented reason; real survivors
produce a focused test and backlog/defect link.
