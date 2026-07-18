# Product epics

| Epic | Outcome | Scope | Exit evidence |
|---|---|---|---|
| E1 Identity & Trust | users access only permitted capabilities | registration/login, JWT lifecycle, CUSTOMER/ORGANIZER/ADMIN policy, audit | authorization matrix and negative tests |
| E2 Catalog & Venue Lifecycle | organizers publish valid, searchable inventory definitions | venue sectors/rows/seats, event schedule/tags/location, sector/default pricing | admin workflow demo and search contract |
| E3 Distributed Reservation Engine | one buyer owns a seat during checkout under contention | admission validation, atomic TTL locks, durable reservation, expiry/release | 100-way contention has one winner and no stranded locks |
| E4 Reliable Checkout & Ticketing | money, reservation and ticket always reconcile | idempotent payment attempt, saga/reconciliation, QR issue/verify/check-in | success/decline/timeout/duplicate-callback evidence |
| E5 Buyer & Organizer Experience | core journeys are understandable and accessible | discovery, live map, countdown, checkout/result, venue/event forms, analytics | responsive RTL UI walkthrough and accessibility checklist |
| E6 Messaging & Realtime | slow downstream work cannot block checkout | outbox/broker, idempotent worker, Email/SMS adapter, scoped WebSocket rooms | broker outage/replay and reconnect demonstration |
| E7 Fair Traffic Resilience | flash demand is admitted fairly within safe capacity | FIFO waiting room, signed token, throttling, load shedding, abuse signals | load-test thresholds and queue-failure drill |
| E8 Quality, Delivery & Operations | each change is reviewable, reproducible and operable | CI gates, test strategy, UML/ADRs, IaC, monitoring, incident process, archive | clean pipeline, validated artifacts and submission audit |

Epics describe measurable user or operational outcomes. Implementation tasks remain children of a story;
an epic is never closed merely because its documents or controllers exist.
