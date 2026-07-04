# Payment processing outage
Summary: gateway latency caused uncertain checkouts. Timeline: 10:02 alarm, 10:07 circuit
opened, 10:18 traffic stabilized, 10:42 reconciliation completed. Root cause: retry timeout
exceeded gateway capacity. Business impact: 240 delayed purchases; no double charges.
Detection: timeout and funnel alerts. Resolution: stop retries, query references, resume.
Prevention: idempotency, circuit breaker, bounded retry, provider failover. Lesson: uncertain
outcomes require reconciliation before compensation.
