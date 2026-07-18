# Code and artifact review checklist

## Correctness and data

- requirement/acceptance and invariant are clear; success, failure, timeout, retry and concurrency paths align;
- transaction/lock boundaries and compensation are safe; commands/callbacks/consumers are idempotent;
- schema change is backward compatible, indexed and has rollback/forward-fix; no dangerous synchronization;
- external calls have timeout/error normalization/reconciliation; observability has bounded labels and no secrets.

## Security and product

- authentication, role and resource ownership are enforced on every private object/socket; input/output minimized;
- no password/JWT/admission/QR/provider secret or PII in code, logs, events, screenshot or archive;
- error messages, queue/payment uncertainty, accessibility and RTL journey are understandable;
- rate/abuse policy cannot silently violate fairness.

## Verification and delivery

- focused tests assert domain outcomes, not implementation strings; relevant mutation/load/fault evidence exists;
- lint/type/test/build and security gates pass without `allow_failure`/`|| true` for mandatory findings;
- UML/ADR/API/runbook/traceability/backlog/status change with behavior; diagrams export and CSV columns validate;
- deployment has health, resources, graceful shutdown, canary/rollback; archive excludes local/generated data.

The reviewer reproduces one happy and one highest-risk failure path, labels findings Blocker/Major/Minor/Nit and
does not approve their own authored change. Resolved comments link the commit/evidence, not only “fixed.”
