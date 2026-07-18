# Domain-driven design boundaries

## Ubiquitous language

- **Seat** is a physical coordinate in a venue; it does not itself carry event availability.
- **Inventory item** is the event/seat allocation state owned by Reservation.
- **Lock** is an ephemeral ownership lease; **Reservation** is the durable business record.
- **Admission token** grants temporary access to attempt a reservation; it never guarantees inventory.
- **Payment attempt** is one idempotent interaction with a gateway; **Ticket** is issued only after confirmed capture.

## Bounded contexts

| Context | Owns | Does not own | Published contract |
|---|---|---|---|
| Identity & Access | credentials, user profile, role policy, token lifecycle | event ownership rules or ticket scans | authenticated principal `{userId, role}` |
| Catalog & Discovery | venues, sectors, seat coordinates, events, classifications, schedules, pricing definitions | live locks or authoritative availability | `EventPublished`, versioned event/venue snapshots |
| Waiting Room | FIFO position, admission policy, token lifecycle | reservations or seats | event/user-bound `AdmissionToken` |
| Reservation & Inventory | availability, price snapshot, transient seat rows, lock ownership, expiry | payment-provider truth | `ReservationCreated`, `Expired`, `Cancelled`, `Confirmed` |
| Billing & Checkout | payment attempts, idempotency, provider references, reconciliation | venue structure | `PaymentStarted`, `Succeeded`, `Failed`, `TimedOut` |
| Ticketing | opaque ticket token, QR hash, check-in state | payment capture | `TicketIssued`, `TicketCheckedIn` |
| Notification | templates, channel choice, delivery attempt, provider result | business state transitions | delivery status and DLX alerts |
| Analytics | denormalized sales/capacity projections | command-side decisions | read-only organizer metrics |

## Critical boundary choice

Live availability belongs to Reservation, not Catalog. Catalog is optimized for read-heavy search and
may show a slightly stale projection. If Catalog owned locks, each discovery request would couple a
high-volume query path to consistency-critical Redis operations and create a Catalog ↔ Reservation
cycle. Instead, Catalog publishes immutable layout/price versions and Reservation validates the
authoritative allocation immediately before lock acquisition.

## Context mapping

Identity is upstream of all authenticated contexts. Catalog is upstream of Reservation through a
published language. Waiting Room is upstream of Reservation only for admission. Reservation is
upstream of Billing, and Billing/Ticketing form a partnership around successful capture. Notification
and Analytics are downstream conformists consuming events and never called synchronously by checkout.
See `docs/diagrams/domain-context-map.puml`.

## Extraction criteria

A module becomes an independent service only when at least one is true: it needs an independent
scaling profile for two consecutive releases, its deployment cadence blocks another team, its failure
must be isolated, or its data sovereignty changes. Extraction requires a versioned API/event contract,
an owned schema, distributed tracing and an explicit consistency model—not merely another container.
