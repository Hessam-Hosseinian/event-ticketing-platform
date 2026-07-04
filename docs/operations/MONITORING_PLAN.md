# Monitoring plan
| Signal | Alert |
|---|---|
| API p95 latency | >500 ms for 10 min |
| 5xx rate | >2% for 5 min |
| Checkout failure | >5% for 10 min |
| Redis lock errors | >1% for 5 min |
| Waiting queue depth | >10,000 or rising 15 min |
| RabbitMQ ready messages | >5,000 for 10 min |
| DB p95 query | >200 ms for 10 min |
Prometheus scrapes application/infrastructure metrics; Grafana dashboards pair RED signals
with business conversion. Alerts page the on-call only when actionable.
