# Load, stress and concurrency test plan

Run high-volume scenarios in isolated scheduled CI or a dedicated host. Local smoke uses low VUs to avoid
exhausting a development laptop. Never point the script at production without written approval and a
synthetic event.

## Workloads

| Scenario | Shape | Purpose | Pass criteria |
|---|---|---|---|
| Baseline browsing | 0→100 VU in 2m, hold 5m | catalog cache/API latency | p95 <500 ms, errors <1% |
| Flash arrival | 0→2,000 arrivals/s in 30s | waiting-room admission/load shedding | core stays healthy; correct 429/503; queue order preserved |
| Hot-seat contention | 1,000 admitted users target same seat | double-book invariant | exactly one reservation winner and at most one confirmed owner |
| Distributed seats | 1,000 users across 10,000 seats | throughput/pool/Redis capacity | reservation p95 <750 ms, technical errors <2% |
| Soak | 100 VU for 4h | leaks, timer/reconciler/backlog | stable memory/connections, no expired PENDING or growing queue age |
| Spike/recovery | 10× normal for 2m then normal | autoscale and recovery | no oversell; p95 and queue age recover within 10m |
| Dependency fault | gateway latency/loss, worker stop, Redis replica fail | graceful degradation | policy-consistent status, compensation and alerts |

## Execution

```bash
# Lightweight local smoke
BASE_URL=http://localhost:3000 VUS=20 DURATION=30s k6 run tests/load/k6-booking-test.js

# Scheduled environment; values are examples approved by the operator
BASE_URL=https://preview.example VUS=1000 DURATION=10m k6 run --summary-export=k6-summary.json tests/load/k6-booking-test.js
```

Pre-create an event, seats, test users and admission tokens outside the timed section. Tag requests with
scenario/run ID and export backend, Redis, DB and RabbitMQ telemetry. After every contention run, query:

```sql
SELECT event_id, seat_id, COUNT(*)
FROM reservation_seat
WHERE state IN ('LOCKED', 'BOOKED')
GROUP BY event_id, seat_id
HAVING COUNT(*) > 1;
```

The query must return zero rows. Also assert zero PENDING reservations past TTL, payment/ticket mismatch
and owner locks remaining after terminal failure. HTTP error rate alone cannot prove ticketing correctness.

## Capacity report

Record commit/image digest, environment resources, dataset, k6 version, workload, latency percentiles,
error categories, saturation, queue age, scale events and invariant query. The sustainable limit is the
highest load that passes both SLO and correctness thresholds with 30% headroom.
