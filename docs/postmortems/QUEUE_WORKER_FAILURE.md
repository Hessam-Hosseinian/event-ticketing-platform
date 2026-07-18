# Scenario postmortem — Virtual waiting-room worker failure under flash load

**Status:** completed tabletop/load-simulation scenario; not a real production incident

**Scenario window:** 2026-07-11 14:00–14:38 +03:30

**Severity:** SEV-1 | **Authors:** Backend/QA/Operations

## Executive summary and impact

At event on-sale, 12,000 synthetic users joined within two minutes. Waiting-room admission workers became
CPU-throttled while a retrying poll pattern multiplied load. Health routing marked the queue service
unavailable and the gateway returned HTTP 503 with `Retry-After`. Core reservation and payment remained
healthy because admission failed closed. Approximately 8,600 clients saw intermittent queue status for
18 minutes; 2,100 abandoned. No position reordering or oversell occurred.

## Detection and timeline

| Time | Event / decision |
|---|---|
| 14:00 | flash scenario begins; join rate reaches 1,500/s |
| 14:03 | admission latency p95 >2s; CPU throttling and oldest queue age alert |
| 14:05 | worker readiness fails; edge begins controlled 503 responses |
| 14:07 | SEV-1 declared; join rate limited, admission set to zero to preserve order |
| 14:10 | retry storm identified: clients ignored next-poll hint after 503 |
| 14:13 | CDN/gateway enforces minimum polling interval and jitter response |
| 14:16 | worker resources corrected and replicas increased from 2 to 8 |
| 14:22 | persisted queue/Redis sequence audit shows monotonically ordered positions |
| 14:26 | admission reopens at 10%, then 25%; downstream reservation latency stays healthy |
| 14:34 | full calculated admission budget restored |
| 14:38 | incident resolved; abandonment impact recorded |

## Root cause

The worker deployment had a low CPU limit and scaled only on average CPU, which reacted slowly to queue
age. Polling clients retried immediately on 503 instead of honoring a server-specified delay. This feedback
loop consumed worker/gateway capacity. The design protected core booking but the user-facing queue became
unavailable and abandonment increased.

### Five whys

1. Why did queue status fail? Workers were throttled and failed readiness.
2. Why were they throttled? Flash joins plus synchronized polling exceeded the fixed CPU/replicas.
3. Why did polling synchronize? Client retry ignored jitter/next-poll on the 503 path.
4. Why did scaling lag? HPA used average CPU rather than oldest queue age/admission latency.
5. Why did the test not catch it? Load tests stressed reservation but not join+poll feedback together.

## Recovery and fairness controls

Admission stopped before worker restart so nobody could jump the queue. Persistent entry sequence and Redis
counters were compared; active user/event entries kept their earliest position. Clients received honest
503/Retry-After while the edge enforced a minimum interval. Capacity reopened in stages based on reservation
p95 and DB/Redis saturation—not queue pressure alone.

## What worked / did not

Worked: isolation and fail-closed admission kept checkout correct; position persistence enabled fairness
audit; rate control stabilized the system. Did not: HPA signal, resource sizing, client retry behavior and
queue-specific load coverage.

## Corrective actions

| Action | Owner | Due | Verification |
|---|---|---|---|
| Add arrival-rate join+poll+disconnect k6 scenario | Pourya | 2026-07-23 | 2,000 arrivals/s with bounded retry passes |
| Scale worker on oldest queue age/admission lag and set realistic resources | Hessam | 2026-07-25 | spike recovers within 10m without throttling |
| Enforce server/edge poll token bucket and exponential jitter | Hessam | 2026-07-24 | abusive poll gets 429; legitimate order unchanged |
| Respect next-poll/Retry-After in every client state | Pourya | 2026-07-24 | browser/network E2E test |
| Add queue sequence monotonicity and duplicate active-entry alarm | Hessam | 2026-07-26 | fault run yields zero order violations |
