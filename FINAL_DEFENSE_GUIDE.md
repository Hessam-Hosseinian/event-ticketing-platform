# Final defense guide

- **How is double booking prevented?** Redis atomically grants one event/seat key with NX;
  partial multi-seat acquisition rolls back, and the database unique constraint is the
  durable second line.
- **Why Redis and TTL?** It provides low-latency atomic transient ownership. Ten-minute expiry
  recovers abandoned carts without a synchronous cleanup dependency.
- **How does rollback work?** The payment orchestrator moves the reservation to cancelled or
  expired, deletes its transient seat rows, releases every lock, and emits `PaymentFailed`.
- **Why RabbitMQ?** Durable buffering removes email/SMS latency and failure from checkout.
- **Why WebSocket?** It improves immediacy; REST remains authoritative after disconnect.
- **Why a waiting room?** It makes admission fair and keeps offered load within safe capacity.
- **How does it scale?** Stateless API pods scale horizontally; read-heavy catalog, lock-heavy
  reservation, and workers can later be extracted independently.
- **If Redis fails?** Booking fails closed to protect correctness; existing durable state is
  reconciled after recovery.
- **If payment fails?** Bounded retry and reconciliation distinguish known failure from an
  uncertain result before compensation.
- **During partition?** Prefer inventory consistency over booking availability; isolate,
  restore, then reconcile.
- **How do tests prove it?** Integration contention asserts one winner, saga tests cover every
  terminal path, mutation tests challenge guards, and k6 checks invariants under load.
- **Who contributed?** Hessam defends backend/architecture/DevOps; Pourya defends frontend,
  UX, product/QA; integration, diagrams, Agile and rehearsal are shared.

Demo order: start Compose, open Swagger/UI, show discovery, create two competing reservations,
complete one payment, fail one, verify a ticket, then point to metrics and postmortems.
