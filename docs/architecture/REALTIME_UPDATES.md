# Real-time update contract

Socket.IO improves immediacy but never replaces authoritative REST. Sockets authenticate during the
handshake and join only authorized `user:{id}` and public `event:{id}` rooms. Administrative metrics use
organizer-scoped rooms. Wildcard broadcast of payment or ticket data is prohibited.

| Event | Room | Minimum payload |
|---|---|---|
| `seat.status.changed.v1` | event | eventId, seatIds, state, inventoryVersion |
| `waiting.position.changed.v1` | user | entryId, position band, state, token/expiry only when admitted |
| `reservation.expired.v1` | user | reservationId, eventId, occurredAt |
| `payment.status.changed.v1` | user | paymentId, reservationId, state; no provider secrets |
| `ticket.issued.v1` | user | ticket metadata; QR fetched through authenticated REST |
| `analytics.updated.v1` | organizer | eventId, sold, remaining, revenue, projectionAt |

Each payload has event ID, schema version, occurred time and monotonic aggregate/inventory version.
Clients discard older versions and refetch REST on a version gap, reconnect or focus regain. Reconnect
uses exponential backoff with jitter and a maximum attempt interval. Server ping/pong and connection
counts expose health; disconnect rate and outbound buffer pressure are alerts.

Seat messages may be coalesced in 100–250 ms windows under flash traffic. A client sees a transient
LOCKED state quickly, but only a successful reservation REST response proves ownership.
