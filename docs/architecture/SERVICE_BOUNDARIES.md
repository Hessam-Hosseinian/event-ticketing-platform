# Service boundaries and communication policy

The deployable is a modular monolith for the course environment. Components in the UML diagram are
logical services with code-level boundaries; the same contracts support later physical extraction.

## Synchronous interactions

Use synchronous REST only when the caller cannot proceed without the answer:

- authenticate and authorize a principal;
- query catalog/event details;
- validate admission and atomically reserve inventory;
- create a payment attempt or query its current state;
- verify/check in a ticket.

Every command carries a correlation ID; retryable commands carry an idempotency key. Timeouts are
shorter than the caller's deadline. No synchronous call to Notification or Analytics is permitted on
the checkout path.

## Asynchronous interactions

Reservation, Billing and Ticketing publish facts after state commits. Notification and Analytics consume
these facts independently. Events are past tense, immutable, versioned and contain identifiers rather
than entire mutable aggregates. Consumers tolerate duplicates and unknown additive fields.

## Dependency rules

1. Domain code imports no controller, database driver or message-broker type.
2. A bounded context accesses another context through an application port or versioned event.
3. Read models may join/project cross-context data; command models may not update another context's tables.
4. Circular imports and cross-context repository injection fail architecture checks.
5. External providers sit behind anti-corruption adapters with normalized error categories.

## Failure policy

| Dependency | Timeout behavior | Retry | Circuit / fallback |
|---|---|---|---|
| Redis lock | Fail closed; return 503/409 without DB mutation | Client may retry with jitter while admission valid | Alert and reconcile after recovery |
| Payment gateway | Mark uncertain and reconcile by idempotency key | Bounded exponential retry for safe status calls | Open circuit; pause new checkout when error budget burns |
| RabbitMQ | Commit through outbox; relay retries | Indefinite bounded-backoff relay | Checkout remains available while backlog SLO is met |
| Notification provider | Keep notification pending/failed | Bounded retry then DLX | Switch provider or manual replay |
| WebSocket | No command failure | Reconnect with backoff | REST reconciliation |
