# Virtual waiting room and traffic throttling

## Goals and non-goals

The waiting room bounds reservation traffic and gives users a fair, observable order during flash sales.
It does not guarantee a seat or reserve inventory. Catalog browsing stays available from cache while
admission controls consistency-sensitive endpoints.

## Admission algorithm

1. Authenticate the user and rate-limit duplicate joins per account/device/IP.
2. Assign a monotonically increasing event-specific sequence in Redis; persist an auditable entry.
3. A controller calculates permits from reservation latency, DB pool saturation and Redis health.
4. Admit the earliest queued entries and issue a cryptographically signed token bound to event, user,
   queue entry, issued time and expiry (default 15 minutes).
5. Reservation verifies signature/binding/TTL and consumes or rate-limits the token.

FIFO is the default. Accessibility or organizer-presale lanes must be explicit policy with separate
capacity and audit, never an invisible priority. Rejoining does not improve a user's original position.

## Client and overload behavior

Queued clients poll with exponential backoff/jitter or receive WebSocket position updates. Responses
include position, approximate wait band and next-poll time—never a false exact ETA. Per-user excess gets
HTTP 429; system load shedding gets 503 with `Retry-After`. Admission drops to zero when Redis or the
reservation database is unhealthy, preserving correctness.

## Abuse prevention and recovery

Use short JWT sessions, device/IP heuristics, CAPTCHA only when risk signals trigger, maximum active
entries per user/event and signed single-purpose tokens. Monitor join rate, admission rate, abandonment,
oldest wait, invalid-token attempts and downstream p95 latency. Persisted entries allow user support and
approximate queue restoration after Redis loss; sequence gaps are acceptable, reordering is not.
