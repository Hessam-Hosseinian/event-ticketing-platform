# Narm parity review

The `/home/hessam/Narm` reference was audited against this NestJS implementation.

| Capability in Narm | Earlier state here | Current state |
|---|---|---|
| Persian RTL product UI | Generic English single component | Rebuilt as routed Narm UI |
| Event detail and live seat inventory | Missing detail endpoint | Venue, rows, prices and live state returned |
| Waiting-room step before reservation | Disconnected demo | Integrated into the UI booking journey |
| Simulated success/failure/timeout checkout | Static buttons | Connected payment orchestration |
| Ticket wallet and QR visualization | Placeholder | Issued tickets loaded and rendered |
| Organizer experience | Placeholder cards | Protected venue creation panel |
| Seeded demo | Stub seed | 4 users, 2 venues, 192 seats, 5 events |
| Reservation expiry worker | Missing | 30-second reconciliation loop |
| Lock ownership safety | Unconditional delete | Atomic owner-checked Lua release |
| Payment idempotency | Duplicate attempts possible | One payment per reservation |
| Reservation ownership checks | Partial | Cancel and payment verify the customer |
| Vector diagram exports | Sources only | 8 SVG and 8 PDF outputs |
| Notification worker | Console fallback | Durable RabbitMQ queue and acknowledgements |

The implementation deliberately remains TypeScript/NestJS rather than copying the reference
Python stack. PostgreSQL entities currently combine live inventory and reservation-seat state;
splitting an explicit `SeatInventory` aggregate is a reasonable future microservice extraction,
not required for the demonstrated invariant.
