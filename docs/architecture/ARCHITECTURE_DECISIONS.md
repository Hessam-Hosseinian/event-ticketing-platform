# Architecture decision record

This log captures decisions that are expensive to reverse. Each decision states its context,
trade-off and a measurable consequence; it is not merely a list of selected technologies.

| ID | Decision | Rationale | Consequences / verification |
|---|---|---|---|
| ADR-001 | Start as a modular monolith with independently extractable bounded contexts. | A two-person team cannot safely operate many deployables, while explicit module boundaries retain a microservice extraction path. | One process and database simplify delivery; module ownership and integration contracts must prevent accidental coupling. Extract when scaling or release cadence proves the need. |
| ADR-002 | PostgreSQL is the system of record for reservations, payments and tickets. | Transactions, unique constraints, row locks and point-in-time recovery protect money and allocation. | `UNIQUE(eventId, seatId)` is the durable oversell guard. Backups, restore drills and connection-pool limits are mandatory. |
| ADR-003 | Redis owns only ephemeral coordination state. | Atomic Lua operations and TTLs give low-latency, self-cleaning seat locks and waiting-room counters. | Booking fails closed when Redis is unavailable. PostgreSQL remains authoritative; a reconciler repairs stale or orphaned state. |
| ADR-004 | Multi-seat lock acquisition is one atomic operation. | Sequential `SET NX` exposes partial acquisition and makes network-failure rollback ambiguous. | A Lua script first checks every deterministic key, then sets all keys with one TTL or none. Release verifies owner tokens. |
| ADR-005 | Checkout is an orchestrated saga. | Reservation, an external gateway and ticket issuance cannot share one ACID transaction. | Definitive failure compensates inventory; uncertain outcomes enter reconciliation before compensation. Terminal handlers and gateway calls use idempotency keys. |
| ADR-006 | RabbitMQ carries integration events with at-least-once delivery. | Durable buffering isolates checkout latency from email, SMS and analytics. | Producers use an outbox; consumers use an inbox/event ID, bounded retry and DLX. Ordering is guaranteed only per aggregate key. |
| ADR-007 | REST is authoritative; WebSocket messages are hints. | Mobile networks disconnect and messages can be duplicated or missed. | Event/user rooms limit exposure. Sequence/version fields enable gap detection; clients refetch REST state after reconnect. |
| ADR-008 | Event discovery may be eventually consistent; allocation may not. | Search throughput and seat-allocation correctness have different consistency needs. | Catalog can cache a projected availability count. Reservation validates authoritative state before acquiring locks. |
| ADR-009 | The virtual waiting room gates high-demand reservation traffic. | Rate limiting alone is not fair and can reward aggressive retry behavior. | FIFO admission tokens are bound to event/user and expire. Per-user throttles, signed tokens and load shedding protect the core. |
| ADR-010 | Production changes use immutable images and progressive delivery. | Rebuilding between environments breaks provenance; all-at-once releases amplify failures. | Promote the same digest, start at 5%, evaluate SLO/error-budget gates, and automatically roll back on burn. |
| ADR-011 | QR codes contain opaque random tokens, not personal data. | Tickets may be photographed or logged by scanners. | Store a SHA-256 lookup hash, use high entropy, record one-time check-in, rotate compromised tickets, and never embed PII. |
| ADR-012 | Observability follows RED plus business invariants. | CPU alone does not reveal oversells or stuck payments. | Monitor request Rate/Errors/Duration, queue age, lock conflicts, pending reservations past TTL, gateway uncertainty and issued-vs-paid mismatch. |

## Architecture fitness functions

- A contention test with at least 100 clients targeting one seat must produce exactly one winner.
- No terminal payment callback may create a second ticket or change a terminal reservation.
- Dependency analysis must show no Catalog → Reservation → Catalog cycle.
- A broker outage must not roll back an already committed checkout; outbox backlog must remain observable.
- A WebSocket disconnect must not prevent the client from reconstructing state through REST.
- Production manifests must define readiness/liveness probes, resource requests/limits and rolling-update safety.

Review this record at each sprint boundary. Superseded decisions remain in history with a link to
their replacement so the defense can explain how the architecture evolved.
