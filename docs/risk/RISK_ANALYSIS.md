# Risk mitigation and analysis

Scoring uses probability (P) and impact (I) from 1–5; exposure is `P × I`. Scores 15–25 are red,
8–14 amber and 1–7 green. The named owner monitors the trigger and executes the contingency.

| ID | Risk / failure mode | P | I | Exposure | Early trigger | Preventive controls | Contingency / recovery | Owner | Residual |
|---|---|---:|---:|---:|---|---|---|---|---:|
| R-01 | Flash traffic exhausts API/DB before autoscaling | 5 | 5 | 25 | p95 > 750 ms; pool > 80%; 503 rise | CDN cache, waiting room, per-user limits, HPA, load tests | stop admission, shed noncritical reads, scale, publish status | DevOps | 10 |
| R-02 | Two buyers confirm the same seat | 3 | 5 | 15 | unique-conflict or invariant metric > 0 | atomic Redis multi-key lock, DB unique constraint, row transactions, contention tests | pause affected event, reconcile/refund, preserve audit trail | Backend | 5 |
| R-03 | Gateway captures funds but response is lost | 3 | 5 | 15 | timeout with provider reference; unmatched settlement | idempotency, uncertain state, signed callbacks, status reconciliation | hold locks to deadline, query provider, issue or refund, page on >15 min | Backend | 6 |
| R-04 | Failed/abandoned checkout strands inventory | 3 | 4 | 12 | PENDING past TTL; lock age > TTL | Redis TTL, conditional expiry sweeper, compensation tests | expire DB record, owner-release locks, rebuild availability projection | Backend | 4 |
| R-05 | Redis outage removes coordination layer | 2 | 5 | 10 | ping failure, replication lag, error spike | HA Redis, persistence appropriate to queue, fail-closed design | admission to zero, reject new reservations, restore, reconcile DB before reopening | DevOps | 6 |
| R-06 | PostgreSQL outage/corruption blocks checkout | 2 | 5 | 10 | failed readiness, replica lag, checksum/IO alert | managed HA, PITR, tested backups, pool limits, migrations | fail closed, promote standby/restore, reconcile gateway and outbox | DevOps | 5 |
| R-07 | Broker/worker failure delays notifications | 3 | 3 | 9 | oldest message > 2 min; DLX growth | quorum queue, durable messages, outbox/inbox, worker autoscale | checkout continues; restart/scale, switch provider, replay audited DLX | Backend | 4 |
| R-08 | Edge-to-service network partition creates partial failure | 3 | 4 | 12 | timeout/error by zone; trace gaps | timeouts, circuit breakers, topology spread, health routing | isolate zone, stop admission, restore route, reconcile uncertain commands | DevOps | 6 |
| R-09 | Stale WebSocket state misleads buyers | 4 | 3 | 12 | version gaps/reconnect surge | advisory events, version fields, scoped rooms, REST refresh | force client reconciliation and disable live hints if broker unstable | Frontend | 4 |
| R-10 | Account/JWT/token compromise | 3 | 5 | 15 | unusual login/role/check-in patterns | TLS, bcrypt, short JWT, least privilege, rate limits, opaque QR | revoke sessions/tickets, rotate secrets, audit access, notify impacted users | Security | 6 |
| R-11 | Secrets or PII leak through repo/log/events | 2 | 5 | 10 | secret scan, DLP or log alert | env/secret manager, masked CI, data-minimal events, structured redaction | revoke/rotate, remove exposure, incident assessment and notification | Security | 4 |
| R-12 | Bad release breaks booking or schema | 3 | 5 | 15 | canary error-budget burn; migration lock | backward-compatible migration, immutable digest, CI gates, 5% canary | halt rollout, app rollback/feature flag, forward-fix schema | DevOps | 5 |
| R-13 | Bot/Sybil behavior defeats fairness | 4 | 4 | 16 | join/user/IP anomaly; low conversion bursts | account/device limits, risk-based CAPTCHA, signed tokens, audit | tighten policy for event, invalidate abusive entries without reordering legitimate queue | Product/Security | 8 |
| R-14 | Team knowledge concentration blocks defense | 3 | 4 | 12 | only one member can demo/explain module | pair review, ADRs, contribution/defense matrix, rehearsal | swap defense topics, record walkthrough, close knowledge gaps before freeze | Team Lead | 4 |
| R-15 | Incomplete or irreproducible submission | 3 | 5 | 15 | clean-checkout setup/checklist failure | traceability matrix, vector exports, scripted package, checksums | stop feature work, fix missing evidence, rebuild archive and rerun audit | QA | 3 |

## Risk governance

- Review red risks at least twice per sprint and all risks during planning/review.
- Any triggered red risk becomes an incident or backlog item with owner, due date and evidence.
- Architecture changes update affected P/I/residual scores and the traceability matrix in the same MR.
- Residual acceptance requires Product Owner and technical lead approval; correctness/security invariants
  cannot be accepted as ordinary business risk.

## Top scenario exercises

Before defense, run tabletop exercises for R-03 payment uncertainty, R-07 queue worker failure and R-08
network partition using the three postmortems. Run a Redis fail-closed drill and a clean restore/setup
drill. Record participants, detection time, decision time, recovery time and resulting backlog actions.
