# Architecture decisions
1. A modular monolith minimizes two-person operational cost while preserving bounded
contexts and an extraction path. 2. PostgreSQL is authoritative because booking and money
need constraints and transactions. 3. Redis owns ephemeral locks because atomic `SET NX EX`
is fast and naturally expiring. 4. RabbitMQ decouples user latency from notifications.
5. Socket.IO supplies best-effort UI updates; clients always reconcile through REST.
