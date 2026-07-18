# Sprint review records

## Sprint 1 — Walking skeleton

Demonstrated role-based login, persisted venue layout, draft/published event lifecycle and customer
discovery. Stakeholders accepted the baseline but requested visible validation and clearer empty/error
states. Evidence: Swagger walkthrough, UI recording and accepted stories US-01/03. Follow-up: resource
ownership negative tests and combined filter pagination remained in review.

## Sprint 2 — Safe purchase

Demonstrated competing buyers, one reservation winner, countdown, payment success, decline/timeout
compensation and QR verification. Stakeholders requested an explicit uncertain-payment state rather than
showing every timeout as failure. The architecture was updated with reconciliation and idempotency. Evidence:
contention output, saga state diagram and API transcript. Follow-up: expiry-vs-success race and duplicate
callback became mandatory verification cases.

## Sprint 3 — Resilient delivery and evidence

Demonstrated waiting-room admission, real-time status, asynchronous notification topology, organizer
metrics, Compose portability, UML vector exports, CI flow and incident tabletop. Stakeholders prioritized
a reliable defense package over optional cloud deployment. Evidence: clean-checkout checklist, traceability
matrix, diagram catalog, Jira/burndown export and postmortem action review.

## Product Owner acceptance rule

Accepted means acceptance criteria and reproducible evidence pass. Designed/prototype items remain visibly
non-Done in the backlog; the review never converts incomplete work to Done to improve velocity.
