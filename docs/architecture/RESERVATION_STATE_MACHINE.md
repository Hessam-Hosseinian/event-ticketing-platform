# Reservation state machine
`PENDING → CONFIRMED` on payment success. `PENDING → CANCELLED` on cancellation/failure.
`PENDING → EXPIRED` after the ten-minute deadline or gateway timeout. Terminal states never
return to pending. Every non-success transition releases all Redis locks and transient seat
rows; success marks durable seats booked before releasing locks. NX acquisition plus rollback
of partially acquired keys prevents two owners from holding the same seat.
