# Payment saga and reconciliation

## Orchestration

Billing owns the state machine and one idempotency key per payment attempt. It first verifies that the
reservation is PENDING and unexpired, persists a PENDING payment with the reservation price snapshot,
then calls the gateway through an anti-corruption adapter.

| Gateway result | Local transition | Inventory action | Event |
|---|---|---|---|
| confirmed capture | Payment SUCCESS; Reservation CONFIRMED | mark seats BOOKED, issue tickets, release transient locks | `payment.succeeded`, `ticket.issued` |
| definitive decline/cancel | Payment FAILED/CANCELLED; Reservation CANCELLED | delete transient rows, owner-release locks | `payment.failed` |
| request timeout/connection loss | Payment remains uncertain/RECONCILING | keep reservation until bounded deadline | no terminal event yet |
| not captured by deadline | Payment TIMEOUT; Reservation EXPIRED | compensate inventory and release locks | `payment.timed-out` |

## Why timeout is not immediate failure

A gateway can capture funds while its HTTP response is lost. Immediately releasing seats would allow a
second buyer to book while the first is charged. The orchestrator queries gateway status using the same
merchant reference/idempotency key. Only a definitive negative result or exhausted reservation deadline
permits compensation. A late success after compensation is quarantined for refund/manual review and
raises a critical invariant alert.

## Idempotency and callbacks

- A repeated payment-start request returns the existing attempt when the key and reservation match.
- Completion acquires a pessimistic row lock and terminal states are immutable.
- Duplicate success callbacks return the originally issued tickets.
- Callback authenticity uses provider signature, timestamp tolerance, replay nonce and IP/rate policy.
- The provider reference and raw normalized outcome are retained for reconciliation, not sensitive card data.

## Reconciliation jobs

Every minute, scan PENDING/RECONCILING attempts older than the normal gateway SLA. Query the provider,
apply an idempotent terminal transition, and page on attempts that exceed 15 minutes. Daily accounting
compares successful local payments with gateway settlement totals and flags amount/currency mismatches.
See `payment-saga-state.puml` and `PAYMENT_PROCESSING_OUTAGE.md`.
