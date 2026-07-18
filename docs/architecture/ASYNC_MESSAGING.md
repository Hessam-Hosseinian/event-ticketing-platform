# Asynchronous messaging design

## Topology

`ticketing.events` is a durable topic exchange. Notification binds `payment.#` and `ticket.#`; Analytics
binds reservation/payment/ticket keys. Each bounded context has its own durable queue and dead-letter
route. Quorum queues are used in production; messages are persistent and publishers request confirms.

## Event envelope

```json
{
  "eventId": "01J...",
  "eventType": "payment.succeeded.v1",
  "aggregateId": "payment-uuid",
  "aggregateVersion": 4,
  "occurredAt": "2026-07-18T10:00:00Z",
  "correlationId": "request-uuid",
  "causationId": "command-uuid",
  "payload": { "reservationId": "uuid", "userId": "uuid", "amount": 2500000, "currency": "IRR" }
}
```

Never include passwords, JWTs, raw QR tokens or unnecessary personal data. Schema changes are additive
within a major version; breaking semantics create a new routing-key version and a migration window.

## Delivery semantics

At-least-once delivery means duplicates are expected. A consumer transaction inserts `eventId` into an
inbox table and applies its local state change once; an existing ID is ACKed without replaying the side
effect. Ordering is required only per aggregate and checked with `aggregateVersion`. Gaps pause that
aggregate and trigger reconciliation rather than processing out of order.

Transient failures use exponential backoff with jitter (5s, 30s, 2m, 10m). Permanent validation errors
or exhausted retries route to a DLX with original headers and failure metadata. Operators can inspect,
fix and replay through an audited tool. Alerts use oldest-message age and DLX growth, not queue depth alone.

## Event vocabulary

`reservation.created.v1`, `reservation.cancelled.v1`, `reservation.expired.v1`,
`payment.started.v1`, `payment.succeeded.v1`, `payment.failed.v1`, `payment.timed-out.v1`,
`ticket.issued.v1`, and `ticket.checked-in.v1`.
