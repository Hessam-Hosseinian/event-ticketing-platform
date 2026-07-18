# Team defense plan

## 25-minute presentation

| Time | Presenter | Content / evidence |
|---:|---|---|
| 0–3 min | Pourya | problem, personas, fairness/correctness product goals and success metrics |
| 3–8 min | Hessam | DDD boundaries, component/deployment diagrams and architectural decisions |
| 8–15 min | Shared | live buyer journey: search → queue → competing seat → payment → QR; include one compensation path |
| 15–18 min | Pourya | Agile hierarchy, acceptance criteria, QA pyramid/load/mutation and UI/accessibility choices |
| 18–22 min | Hessam | IaC/CI/canary, telemetry and payment/network failure trade-offs |
| 22–25 min | Shared | traceability, limitations/future work and questions |

## Demonstration script

Use a clean seeded environment and a preflight checklist. Open dashboards/log view before starting. Show two
authenticated buyers targeting one seat: one reservation wins, the other receives a conflict, and the durable
invariant remains one. Complete a sandbox success and verify/check in the QR. Then demonstrate a definitive
failure or timeout/reconciliation using a separate reservation and show locks/inventory restored. Never run a
high-volume load/mutation suite live on the presentation laptop; show retained CI evidence instead.

## Ownership and cross-questions

Hessam answers lock atomicity, DB constraint, saga uncertainty, outbox/idempotency, context boundaries and
deployment recovery. Pourya answers personas/KPIs, discovery/seat accessibility, queue communication, stories,
test evidence and defect gates. Cross-training: Pourya explains why timeout is not failure; Hessam explains
keyboard/RTL seat-map acceptance. Each explains one mandatory postmortem.

## Preflight and fallback

- checkout exact commit/tag; verify no secret/untracked build output in archive;
- run lightweight build/unit/smoke in advance; seed two buyer accounts and two future events;
- verify vector diagrams open offline; cache screenshots/API transcript and short demo recording;
- disable notifications/updates, close resource-heavy tools/containers not needed, connect power/network;
- if live dependency fails, explain detection/decision using the saved transcript and diagrams rather than
  improvising destructive fixes.

Rehearse twice with timekeeping and adversarial questions. Log every unanswered question as a documentation or
verification action before release freeze.
