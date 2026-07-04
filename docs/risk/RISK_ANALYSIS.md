# Risk analysis
| Risk | Likelihood/impact | Control |
|---|---|---|
| Flash traffic | High/High | Waiting room, edge throttling, HPA, cache |
| Double booking | Medium/Critical | Redis NX locks plus DB unique constraint |
| Payment outage | Medium/High | Timeout, idempotency, saga compensation |
| Redis loss | Low/High | Fail closed, managed replication, reconcile DB |
| Broker backlog | Medium/Medium | Durable queue, retry/DLQ, autoscale workers |
| Data divergence | Medium/High | PostgreSQL source of truth, outbox/reconciliation |
| Token theft | Low/High | TLS, short JWT lifetime, hashed QR, RBAC |
