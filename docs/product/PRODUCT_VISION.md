# Product vision — SeatFair

## Vision statement

For buyers and event organizers who experience unreliable, opaque flash sales, **SeatFair** is an
event-discovery and ticketing platform that combines fair admission, live venue inventory, safe checkout
and instantly verifiable tickets. Unlike a basic marketplace, SeatFair treats concurrency correctness,
failure recovery and transparency as visible product capabilities—not hidden implementation details.

## Problem and opportunity

Popular events create a short traffic spike many times larger than normal demand. Conventional CRUD
systems oversell seats, fail during payment and reward aggressive retry behavior. Buyers lose trust when
they are charged without a ticket or watch a selected seat disappear without explanation. Organizers
lose revenue and reputation when dashboards lag or inventory is stranded. A platform that guarantees
fairness and explicit recovery can become the trusted operating layer for venues and event brands.

## Personas and outcomes

| Persona | Need | Desired outcome |
|---|---|---|
| Buyer | discover relevant events and purchase without races | clear queue position, accurate live map, ten-minute reservation, one payment and immediate QR ticket |
| Organizer | configure venues/events/prices and follow sales | self-service publishing, real-time sold/remaining/revenue and dependable checkout |
| Venue operator | validate admission quickly and prevent reuse | low-latency QR verification, clear valid/used result and auditable check-in |
| Support administrator | resolve account/payment/ticket incidents | correlated audit trail, safe role tools and reconciliation status |
| Platform operator | absorb flash traffic without losing correctness | bounded admission, autoscaling, actionable telemetry and tested incident playbooks |

## Product principles

1. **Correctness before throughput:** the platform may reject or queue traffic, but never knowingly oversell.
2. **Fairness is explainable:** queue and reservation state are visible; invisible priority is prohibited.
3. **Money and inventory reconcile:** uncertain provider outcomes remain explicit until resolved.
4. **Realtime is helpful, not authoritative:** REST can always rebuild the client state.
5. **Privacy by design:** tickets and events expose the minimum data necessary for the use case.
6. **Operational simplicity:** start modular, automate delivery and extract services only from evidence.

## Scope

### Minimum viable course release

- customer registration/login; organizer/admin RBAC;
- event discovery by text, genre, date, city and availability;
- configurable venue sectors/rows/seats and event pricing;
- event-specific waiting room and expiring admission;
- atomic seat reservation with visible countdown;
- idempotent payment success/failure/timeout compensation;
- QR ticket issuance/verification and transactional notifications;
- organizer dashboard for sales, revenue and capacity;
- portable Compose environment, API documentation, tests and CI evidence.

### Explicitly out of scope

Real card-data storage, a proprietary banking gateway, secondary-market resale, recommendation ML,
native mobile apps, multi-currency accounting and production cloud spend are excluded. Interfaces and
bounded contexts remain extensible for them. Payment and email/SMS use sandbox adapters in demonstrations.

## Success metrics and SLOs

| Measure | Target | Window / guardrail |
|---|---:|---|
| confirmed oversells | **0** | absolute invariant; any occurrence is SEV-1 |
| paid orders without complete tickets | **0 unresolved > 5 min** | continuous reconciliation |
| checkout success excluding user declines | ≥ 98% | rolling 30 days |
| catalog latency | p95 < 500 ms, p99 < 1 s | 5-minute windows |
| reservation command latency after admission | p95 < 750 ms | flash-sale window |
| platform availability | 99.9% | monthly, excluding planned maintenance |
| notification accepted/delivered | ≥ 99% within 2 min | daily |
| queue abandonment | < 35% | per event; segmented by wait band |
| queue-to-purchase conversion | ≥ 20% | per event; diagnostic, not a fairness shortcut |
| organizer dashboard freshness | < 10 s | p95 projection lag |
| QR verification | p95 < 300 ms | event entrance window |

## Roadmap and hypotheses

Release 1 proves a safe walking skeleton and venue/event authoring. Release 2 proves contention-safe
purchase and compensation. Release 3 proves queueing, async notifications, telemetry and delivery.
Future discovery/recommendation, multiple gateways and mobile clients are justified only by measured
conversion, organizer adoption and operational capacity—not by speculative complexity.

## Acceptance of the vision

The Product Owner reviews scope and metrics each sprint. A feature is successful only when its user
outcome and correctness/latency guardrails both pass; higher conversion never justifies an oversell,
privacy breach or unfair queue policy.
