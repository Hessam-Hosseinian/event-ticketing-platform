# Scenario postmortem — Edge-to-reservation network partition

**Status:** completed tabletop/chaos scenario; not a real production incident

**Scenario window:** 2026-07-12 19:01–19:31 +03:30

**Severity:** SEV-1 | **Authors:** Architecture/Operations

## Executive summary and impact

A NetworkPolicy rollout allowed health probes but denied API-pod traffic to Redis and intermittently denied
RabbitMQ. The ingress/API remained “ready” and accepted reservation requests that timed out internally.
Allocation failed closed, so no durable oversell occurred, but 1,420 admitted buyers received 503 for ten
minutes and 36 payment results entered uncertainty while broker publication lagged. The policy was rolled
back, outbox events replayed and payment/inventory invariants reconciled before traffic reopened.

## Detection and timeline

| Time | Event / decision |
|---|---|
| 19:00 | new egress NetworkPolicy reaches 100% without a policy canary |
| 19:01 | Redis lock errors and trace dependency gaps appear |
| 19:03 | synthetic reservation fails; API 5xx alert; SEV-1 declared |
| 19:04 | admission set to zero; existing checkout status marked “verifying” |
| 19:06 | zone/pod comparison links failures to policy rollout, not Redis server health |
| 19:08 | policy rollback approved by peer and applied |
| 19:11 | Redis/Rabbit connectivity restored; readiness dependency checks pass |
| 19:14 | reconciliation starts for PENDING reservations, uncertain payments and outbox rows |
| 19:22 | invariant queries and provider status show no oversell/duplicate charge/missing ticket |
| 19:25 | canary admission 10%; reservation and event publication healthy |
| 19:31 | normal admission restored; monitoring continues |

## Root cause and contributors

The policy selector omitted the Redis/RabbitMQ namespace labels. Readiness checked only process/database,
so unhealthy pods continued receiving traffic. The rollout used normal application canary gates but not a
dedicated network-policy connectivity probe. Broad success metrics obscured the split: catalog/health were
green while reservation dependencies failed.

Five whys: requests failed because pods could not reach coordination/broker; egress was denied because a
selector changed; review missed it because manifests lacked connectivity tests; rollout did not isolate a
policy canary; readiness and dashboard were not dependency/journey specific.

## Consistency decision

The system deliberately sacrificed booking availability. Without Redis atomic ownership, API pods did not
attempt database-only allocation. Existing durable state stayed authoritative. Broker loss did not roll back
committed state because outbox rows remained for replay. Uncertain payment results were reconciled by gateway
reference before any lock/inventory compensation.

## What worked / did not

Worked: dependency traces, recent-change annotation, fail-closed reservation, outbox and progressive reopen.
Did not: policy validation/canary, readiness coverage and journey-specific alert correlation.

## Corrective actions

| Action | Owner | Due | Verification |
|---|---|---|---|
| Add NetworkPolicy lint and ephemeral connectivity tests in CI | Hessam | 2026-07-23 | API pod reaches only declared DB/Redis/Rabbit/provider endpoints |
| Canary policy on one labelled pod/namespace before broad apply | Hessam | 2026-07-25 | fault is isolated and auto-rollback triggers |
| Include Redis critical check and broker degraded check in readiness | Hessam | 2026-07-22 | dependency matrix test passes |
| Add synthetic queue→reserve→sandbox-pay journey per zone | Pourya | 2026-07-26 | alert within 2 minutes of injected partition |
| Document outbox/payment/inventory reconciliation as one audited command | Team | 2026-07-28 | tabletop rerun completes without ad-hoc SQL |
