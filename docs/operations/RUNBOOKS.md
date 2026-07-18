# Operational runbook index

## Payment uncertainty / gateway outage

Confirm provider-wide latency and local uncertain age. Open the payment circuit if errors exceed policy;
do not blindly retry captures or immediately release inventory. Query attempts by merchant idempotency/reference,
apply idempotent success/failure, reconcile paid-ticket counts, and page when any item exceeds 15 minutes.

## Waiting-room or reservation overload

Set admission budget to zero or a safe lower value, preserve existing positions/tokens, verify API/DB/Redis
saturation and return honest 429/503 with Retry-After. Scale only after identifying the bottleneck. Reopen in
steps while observing latency and oldest queue age; do not reorder users during recovery.

## Redis coordination failure

Fail new reservations closed and stop admission. Confirm whether the issue is routing, authentication,
replication or memory/eviction. Restore service, query durable PENDING/terminal states, expire stale records,
clear only owner/stale lock namespaces after review, run invariant checks and reopen gradually.

## RabbitMQ backlog / poison message

Check oldest age, redelivery and DLX before adding workers. Identify one poison schema/event by correlation ID,
quarantine it, deploy validation/fix, then replay through an audited command. Verify inbox dedupe and provider
rate limits. Checkout may continue while outbox/backlog remains inside its SLO.

## Network partition

Compare dependency health by pod/zone and recent NetworkPolicy/route changes. Stop admission, fail allocation
closed and roll back the last safe network change. After links recover, reconcile uncertain payments, locks,
outbox and tickets before restoring full traffic.

Every execution records incident ID, operator, UTC commands/queries, before/after evidence and rollback.
