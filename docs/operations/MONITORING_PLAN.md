# Production telemetry and monitoring plan

## Service-level objectives

| Service indicator | SLO | Error-budget interpretation |
|---|---:|---|
| API successful availability | 99.9% monthly | 43.8 min/month; correctness rejections (409/429) are not server errors |
| catalog latency | 95% <500 ms; 99% <1 s | burn if good responses fall below objective |
| admitted reservation latency | 95% <750 ms | measured after waiting-room admission |
| payment terminal result | 99% <30 s; uncertain resolved <5 min | user declines excluded; stuck attempts count bad |
| notification delivery | 99% <2 min | provider-accepted or explicitly failed/DLX within policy |
| QR verification | 95% <300 ms | entrance-window objective |
| organizer projection freshness | 95% <10 s | show projection timestamp to user |

Oversells, unauthorized cross-user access and successful payment without complete tickets beyond five
minutes are hard invariants, not budgeted availability. One occurrence pages SEV-1 and can stop admission.

## Signal catalog

Use RED for request services, USE for resources and domain invariants for correctness:

- rate/errors/duration by route template, method, status class and deployment version;
- DB pool active/wait, query duration, locks, replica lag and transaction rollback;
- Redis operation duration/error, memory/eviction, replication and seat-lock result (acquired/conflict/error);
- waiting join/admit/abandon rate, depth, oldest age, invalid tokens and downstream admission budget;
- payment started/succeeded/declined/uncertain/reconciled and age of oldest uncertain attempt;
- reservation state transitions, expired-past-TTL and event/seat uniqueness violations;
- RabbitMQ publish confirm, ready/unacked, oldest age, redelivery, DLX and consumer throughput;
- notification delivery latency/outcome/provider, WebSocket connections/disconnect/version gaps;
- Kubernetes pod readiness/restart, CPU throttling, memory working set and HPA desired/current.

Labels are bounded: route templates and outcome enums are safe; user, reservation, seat, event and raw URL
are forbidden high-cardinality labels. Those identifiers belong in structured logs/traces.

## Alert policy

| Alert | Condition | Severity | First action |
|---|---|---|---|
| BookingInvariantViolation | duplicate active event/seat or paid-ticket mismatch >0 | SEV-1 | stop admission for affected event; preserve evidence |
| FastErrorBudgetBurn | 14.4× burn for 5m and 1h | SEV-1 | page; inspect deploy/dependency; rollback/load shed |
| SlowErrorBudgetBurn | 2× burn for 6h | SEV-2 | investigate during on-call shift |
| PaymentUncertainOld | oldest uncertain >5m or count rapidly rising | SEV-1/2 | open circuit; run reconciliation |
| ReservationExpiryLag | PENDING past TTL >0 for 2 sweeps | SEV-2 | stop/slow admission; run expiry safely |
| RedisCoordinationUnavailable | lock errors >1% for 2m or readiness failed | SEV-1 | fail closed; set admission to zero |
| BrokerBacklogAge | oldest notification >2m for 10m | SEV-2 | inspect poison/redelivery; scale or replay |
| DBPoolSaturation | waiters >0 and utilization >85% for 10m | SEV-2 | reduce admission, find slow query/leak |
| CanaryRegression | errors +1% or latency +20% vs stable for 5m | SEV-2 | automatic rollback |

Alerts require owner, severity, runbook and dashboard link. Avoid paging on raw CPU/depth without user or
SLO impact. Every page is reviewed monthly for actionability and noise.

## Logs, traces and retention

JSON logs contain timestamp, level, service/version, environment, trace/correlation/causation ID, route,
result and safe aggregate IDs. Redact passwords, JWTs, admission/QR tokens, provider secrets and personal
destinations. Trace sampling is 5% normal, 100% errors/uncertain payments, with propagation across HTTP,
outbox and message headers. Proposed retention: metrics 30d high-resolution/13m downsampled, logs 30d,
traces 7d (30d incidents), financial audit per policy.
