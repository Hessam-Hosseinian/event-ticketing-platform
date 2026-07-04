# Data consistency
PostgreSQL is authoritative. A reservation transaction and unique `(eventId, seatId)`
constraint form the durable safety net; Redis is the fast contention gate. Lock acquisition
is all-or-nothing. Payment commands require idempotency in production. The transactional
outbox pattern is the production evolution for atomic database/event publication, with a
reconciler repairing expired locks and orphan payment states.
