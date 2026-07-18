# Prometheus metrics, Grafana dashboards and alerts

## Metric contract

| Metric | Type | Labels | Dashboard use |
|---|---|---|---|
| `http_server_requests_total` | counter | service, route, method, status_class, version | request rate/error/canary comparison |
| `http_server_request_duration_seconds` | histogram | service, route, method, version | p50/p95/p99 latency |
| `seat_lock_attempts_total` | counter | result=`acquired|conflict|error` | contention vs infrastructure failure |
| `reservation_transitions_total` | counter | from, to | funnel and unexpected transition |
| `reservation_expiry_lag_seconds` | gauge | service | sweeper correctness |
| `payment_attempts_total` | counter | outcome | checkout funnel |
| `payment_uncertain_age_seconds` | gauge | gateway | reconciliation SLO |
| `ticket_invariant_violations` | gauge | type | hard correctness alert |
| `waiting_room_depth` / `oldest_age_seconds` | gauge | lane | fairness/capacity |
| `integration_event_publish_total` | counter | type, result | outbox/relay health |
| `notification_delivery_seconds` | histogram | channel, provider, result | delivery SLO |
| `websocket_connections` | gauge | service | live capacity |

Example p95 query:

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (rate(http_server_request_duration_seconds_bucket{service="api"}[5m]))
)
```

Example technical 5xx ratio:

```promql
sum(rate(http_server_requests_total{service="api",status_class="5xx"}[5m]))
/
sum(rate(http_server_requests_total{service="api"}[5m]))
```

## Dashboard layout

1. **Executive/SLO:** availability, burn rate, checkout conversion, paid-ticket mismatch, queue wait bands.
2. **API RED:** rate/error/latency by route and stable/canary version; slow traces/log links.
3. **Reservation correctness:** acquired/conflict/error locks, transitions, TTL lag, invariant query.
4. **Payment reconciliation:** funnel, provider latency/outcome, uncertain count/age, settlement mismatch.
5. **Queue and messaging:** joins/admissions/depth/oldest age, publish confirms, ready/unacked/redelivery/DLX.
6. **Data/infrastructure:** DB pool/query/replica, Redis latency/eviction/replication, pod CPU/memory/restart/HPA.

Grafana annotations mark deploy digest, feature-flag change, incident start/end and dependency maintenance.
Dashboard variables use environment/service/version—not user/event IDs. Alert links open the exact dashboard
time range and relevant runbook.

## Scrape and recording policy

Prometheus scrapes APIs/workers every 15s and exporters every 30s with Kubernetes service discovery.
Recording rules precompute SLI ratios and histogram quantiles; Alertmanager groups by incident/service,
deduplicates replicas and routes SEV-1 to primary+secondary. HA replicas and remote storage are production
recommendations; the course deliverable is this architecture mapping as requested by the PDF.
