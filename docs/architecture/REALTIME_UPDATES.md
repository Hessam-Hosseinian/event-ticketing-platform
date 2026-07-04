# Realtime updates
Socket.IO broadcasts `reservation.created`, `reservation.expired`, `payment.started`,
`payment.succeeded`, `payment.failed`, `ticket.issued`, and `seat.status.changed`. Rooms
should be scoped by user/event in production. Realtime data is advisory: reconnecting clients
fetch REST state, so a missed frame cannot corrupt business state.
