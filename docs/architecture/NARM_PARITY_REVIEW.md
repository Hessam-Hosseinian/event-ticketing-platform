# Narm prototype parity review

This is a historical prototype comparison, not proof of production readiness. It records the intended
course-demo surface and links remaining hardening to the traceability matrix.

| Capability | Prototype evidence | Production/design gap tracked |
|---|---|---|
| Persian RTL routed product UI | `frontend/src`, demo accounts | accessibility checklist and failure/offline verification |
| Event detail/live inventory | event API and seat-map components | authoritative version/reconnect and filter contract |
| Waiting-room step | endpoint/UI prototype | signed bound token, fairness/rejoin and overload test |
| Success/failure/timeout checkout | payment/reservation prototype | explicit uncertain reconciliation and callback authenticity |
| Ticket wallet/QR visualization | ticket API/UI | authenticated QR fetch, hash lookup and one-time check-in |
| Organizer authoring/metrics | management UI/API prototype | ownership, pricing/publication guards and projection freshness |
| Reservation expiry/locking | TTL/sweeper prototype | atomic multi-seat operation, owner release and expiry race proof |
| Payment idempotency | one payment per reservation prototype | request idempotency key and stable duplicate callback result |
| Messaging/realtime | RabbitMQ/Socket.IO prototype | outbox/inbox/DLX and scoped rooms/version gaps |
| Architecture/UML | 12 PlantUML sources and 12 SVG/PDF pairs | joint visual/traceability review before tag |

The system intentionally remains TypeScript/NestJS rather than copying another stack. The target is a modular
monolith aligned to bounded contexts. `docs/REQUIREMENTS_TRACEABILITY.md` is authoritative for Complete vs
Prototype status; this review must not be used as a blanket “done” claim.
