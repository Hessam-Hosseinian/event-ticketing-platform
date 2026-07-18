# Risk-based QA strategy

## Quality objectives

Correct allocation and money/ticket reconciliation outrank feature breadth. The primary release invariant
is zero confirmed oversells; other objectives are no unauthorized resource access, no duplicate charge or
ticket, bounded recovery from abandoned/uncertain checkout, portable setup and usable RTL journeys.

## Test model

| Level | Purpose | Examples | Typical frequency |
|---|---|---|---|
| Static | reject defects before execution | ESLint/typecheck, schema/UML syntax, secret/dependency/IaC scan | every commit |
| Unit/property | exhaust state and policy branches cheaply | payment transitions, DTO boundaries, owner release, price totals | every commit |
| Component | verify one context with real dependency or faithful container | Redis Lua contention, repository unique constraint, outbox/inbox | merge request |
| Contract | prevent client/provider drift | OpenAPI response schema, gateway adapter outcomes, event schema compatibility | merge request |
| Integration | verify PostgreSQL/Redis/RabbitMQ transactions | reservation rollback, callback/expiry race, DLX/replay | merge request / nightly |
| End-to-end | prove user value | login → queue → seat → payment → QR → check-in; organizer publish/analytics | release candidate |
| Nonfunctional | expose capacity/resilience/security/accessibility risk | k6 flash sale, mutation, fault injection, OWASP checks, keyboard/RTL | scheduled CI / release |

The pyramid keeps most feedback fast. Resource-heavy mutation, high-volume load and fault suites run in
scheduled CI or a controlled environment—not on a constrained development laptop.

## Environments and test data

- Unit: no network; deterministic clocks/IDs where behavior depends on time.
- Integration: isolated Compose project and fresh database schema per job; fixed seed users/events.
- Preview: immutable MR images, sandbox gateway/provider, synthetic data only.
- Production smoke: read-only health/catalog plus one explicitly designated sandbox event/account.

Tests never use real card data or personal contact information. Unique run IDs isolate users/events and
allow cleanup. Concurrency tests retain winning/losing response IDs and query durable invariants afterward.

## Release gates

- mandatory lint, typecheck, unit/integration, build and high/critical dependency scan pass;
- no open SEV-1/SEV-2 defect; accepted lower defects have owner and release note;
- global statement/branch targets ≥80%, Reservation/Billing critical branch target ≥90%;
- mutation score ≥80% on lock/state policy and no surviving critical mutation;
- load thresholds pass and invariant query reports zero duplicates/stranded expired reservations;
- clean-checkout setup, UML export and submission traceability checks pass.

## Defect severity

SEV-1: oversell, data loss, unauthorized ticket/payment access, secret exposure or systemic outage—stop
release and incident process. SEV-2: checkout/queue unusable without workaround or paid-without-ticket
beyond five minutes—release blocker. SEV-3: degraded noncritical function with workaround. SEV-4: cosmetic,
documentation or minor UX issue. Every defect records environment, steps, expected/actual, correlation ID,
evidence, severity, owner and regression test.
