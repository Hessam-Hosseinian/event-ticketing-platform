# Asynchronous messaging
The event vocabulary is `ReservationCreated`, `ReservationExpired`, `PaymentStarted`,
`PaymentSucceeded`, `PaymentFailed`, `TicketIssued`, and `NotificationRequested`. RabbitMQ
uses durable topic exchanges, persistent messages, acknowledgements, bounded retry, and a
dead-letter queue. Consumers are idempotent by event ID. The demo logs delivery; production
adapters call SMS/email providers.
