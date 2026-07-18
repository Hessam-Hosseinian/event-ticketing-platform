# Reservation state machine

| Current | Trigger / guard | Next | Atomic effects |
|---|---|---|---|
| — | valid admission; all Redis locks and DB inserts succeed | PENDING | price snapshots, expiry, locked inventory |
| PENDING | gateway capture confirmed before expiry | CONFIRMED | payment success, seats BOOKED, tickets issued, locks released |
| PENDING | user cancellation or definitive gateway decline | CANCELLED | transient inventory removed, locks released, failure event |
| PENDING | TTL elapsed or reconciled payment timeout | EXPIRED | transient inventory removed, locks released, expiry event |

CONFIRMED, CANCELLED and EXPIRED are terminal. Duplicate commands return the existing representation;
they never resurrect PENDING or issue another ticket. A success handler locks payment/reservation rows,
checks the current state, commits booking/ticket changes, then releases Redis. A sweeper conditionally
updates only `PENDING AND expiresAt <= now`, so it cannot expire a concurrently confirmed reservation.

## Invariant monitoring

The following queries/metrics are critical: multiple active rows for one event/seat (must be zero),
PENDING records past TTL, CONFIRMED without successful payment, successful payment without expected
tickets, terminal failure with remaining locks, and price total mismatch. Any non-zero correctness
violation pages the on-call engineer and pauses new admission for the affected event.

The executable model is visualized in `docs/diagrams/reservation-state.puml`.
