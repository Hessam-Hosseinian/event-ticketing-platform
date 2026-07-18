# Zero-downtime canary deployment

## Preconditions

- all mandatory CI gates pass; image digest, SBOM and scan report are retained;
- same immutable digest passed preview smoke/contract tests;
- schema is backward compatible using expand → migrate/backfill → contract in a later release;
- rollback command and owner are known; no unresolved SEV-1/2 or exhausted error budget;
- dashboards/alerts distinguish stable and canary version.

## Progression

1. Deploy canary pods with readiness false until startup, DB/Redis connectivity and required consumers pass.
2. Route 5% for at least 15 minutes; run synthetic discovery/reservation sandbox and compare version SLIs.
3. If gates pass, progress 25% → 50% → 100%, one observation window each.
4. Keep the old ReplicaSet healthy through the final observation window, then scale it down.

Automatic abort occurs on any booking invariant, 5xx absolute increase ≥1 percentage point, p95 degradation
≥20%, payment uncertainty/DLX spike, readiness instability or resource saturation. Roll back traffic/image
first; do not reverse a destructive schema migration. Disable the feature through a flag when code rollback
cannot undo data shape safely.

## Kubernetes safety controls

Use rolling update `maxUnavailable: 0`, bounded `maxSurge`, readiness/liveness/startup probes,
PodDisruptionBudget, topology spread and resource requests/limits. Graceful shutdown stops new traffic,
drains HTTP/WebSocket, stops consuming, finishes/returns messages and closes connections within termination
grace. HPA must not scale from noisy CPU alone; include request or queue signals where available.

## Verification and record

Capture release/tag, commit/image digest, migration/flag versions, start/end, approvers, traffic steps,
stable/canary SLI comparison, synthetic result, rollback decision and final status. Annotate Grafana and link
the release record from the MR. A successful rollout includes domain reconciliation, not only healthy pods.
