# Data consistency and concurrency model

## Invariants

1. At most one non-cancelled event/seat allocation exists.
2. A confirmed reservation has a successful payment and exactly one ticket per booked seat.
3. Failed, cancelled or expired reservations retain no transient allocation and no owned Redis lock.
4. Payment amount equals the immutable price snapshots captured at reservation time.
5. A waiting-room token is valid for one user, one event and one expiry window.

## Two-layer allocation protection

Redis is the fast contention gate. Keys are deterministic (`event + seat`), values are unguessable
reservation owner IDs, and all selected keys are checked/set in one Lua execution with the same TTL.
The release script deletes a key only when its value matches the owner. PostgreSQL is the durable
backstop: a unique event/seat constraint rejects any race that passes the cache layer.

The booking algorithm is: validate admission and layout → compute price snapshot → atomically acquire
all Redis locks → begin DB transaction → recheck and insert reservation/inventory → commit. On any DB
error, owner-checked lock release compensates. The operation never reports success before commit.

## Isolation and idempotency

- Payment completion locks the payment/reservation rows with `SELECT ... FOR UPDATE`.
- The gateway idempotency key is unique per logical attempt; duplicate create/complete calls return the
  original result and tickets.
- Ticket uniqueness on reservation/seat prevents duplicate issuance.
- Catalog reads may use `READ COMMITTED`; allocation/payment transitions require transactional writes.
- Counters and dashboards are projections and may lag; they are never used to decide allocation.

## Database-to-broker atomicity

State changes and an outbox row commit in one PostgreSQL transaction. A relay claims rows with
`FOR UPDATE SKIP LOCKED`, publishes persistent messages and records publication. Consumers store an
inbox/event ID before side effects. This produces practical at-least-once delivery without dual-write
loss. Reconciliation queries detect unpublished outbox rows, pending reservations past TTL, successful
payments without tickets and tickets without successful payments.

## Recovery objectives

PostgreSQL target RPO is 5 minutes and RTO is 30 minutes with encrypted PITR backups and quarterly
restore drills. Redis lock loss reduces availability but cannot create durable oversells because the DB
constraint remains. After recovery, block new reservations briefly, expire stale PENDING records,
rebuild projections and reopen gradually.
