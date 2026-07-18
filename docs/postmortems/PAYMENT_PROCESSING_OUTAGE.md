# Scenario postmortem — Payment gateway outage

**Status:** completed tabletop/simulation scenario; not a claim of a real production incident

**Scenario window:** 2026-07-10 10:02–10:47 +03:30

**Severity:** SEV-1 | **Authors:** Backend/Operations | **Review due:** 2026-07-17

## Executive summary and impact

The sandbox gateway latency rose above the checkout deadline and intermittently captured payments without
returning responses. The first implementation treated HTTP timeout as failure, so 240 reservations risked
remaining locked or being released before provider truth was known. Admission was paused and the gateway
circuit opened. Reconciliation by merchant idempotency/reference found 17 captured, 203 definitely failed
and 20 never submitted. Captured attempts received tickets; failed attempts were compensated. No duplicate
charge or oversell occurred in the exercise, but 240 buyers saw delayed status for up to 45 minutes.

## Detection

The `payment_uncertain_age_seconds` SLO alarm fired at 10:02. A checkout 5xx alert followed at 10:04.
The funnel panel showed started payments without terminal results; seat lock count alone did not reveal
whether release was safe. Detection took approximately two minutes from injected provider degradation.

## UTC/local timeline

| Time | Event / decision |
|---|---|
| 10:00 | fault injection adds 20s latency and 30% response loss after capture |
| 10:02 | uncertain-age alert pages primary; incident declared SEV-1 |
| 10:05 | IC assigned; new admission reduced to zero for affected event |
| 10:07 | payment circuit opened; blind application retries stopped |
| 10:11 | provider status confirms its API is degraded; existing locks retained to deadline |
| 10:16 | reconciliation dry run groups attempts by reference and provider status |
| 10:21 | peer-reviewed repair applies captured success idempotently and issues missing tickets |
| 10:29 | definitive failures transition to FAILED/CANCELLED and owner locks release |
| 10:35 | invariant queries show zero paid-without-ticket, duplicate ticket or duplicate seat |
| 10:42 | gateway normal; canary checkout succeeds and admission reopens at 10% |
| 10:47 | normal admission restored; incident enters monitoring/resolved |

## Root cause and five whys

The direct cause was gateway response loss after capture. The architectural cause was conflating transport
timeout with business failure and lacking an explicit RECONCILING state in the original design.

1. Why were reservations at risk of being released after charge? Timeout triggered compensation.
2. Why did timeout trigger compensation? The adapter returned only success/failure, not unknown.
3. Why was unknown omitted? Happy-path integration drove the interface before failure modeling.
4. Why was the gap not caught earlier? Tests mocked definitive responses and did not inject post-capture loss.
5. Why could many attempts accumulate? No circuit breaker/burn alert initially bounded new payment starts.

## Contributing factors

- retry and reservation deadlines were not coordinated;
- provider reference was not prominent in the operator query;
- there was no rehearsed dry-run repair procedure;
- user messaging said “failed” instead of “verifying payment,” increasing support pressure.

## Resolution and safe compensation

The repair operates in batches and is repeatable: select old PENDING/RECONCILING rows with row locks and
`SKIP LOCKED`; query provider by immutable merchant reference; if captured, transition payment/reservation,
book seats and create missing unique reservation-seat tickets in one transaction; if definitively not
captured and deadline passed, mark timeout/expired and remove transient inventory; commit, then owner-release
Redis keys and publish outbox events. Unknown rows remain untouched and page after 15 minutes. Every batch
runs paid-ticket and duplicate-seat invariant queries before the next.

## What worked / did not

Worked: idempotency references, fail-closed inventory, admission control, correlation IDs and invariant
queries prevented unsafe guesswork. Did not: outcome vocabulary, user copy, circuit automation and failure
injection were incomplete.

## Corrective actions

| Action | Type | Owner | Due | Verification |
|---|---|---|---|---|
| Add explicit RECONCILING/UNKNOWN outcome and immutable terminal transitions | Prevent | Hessam | 2026-07-22 | state/race tests and saga UML agree |
| Verify signed callback and status query by same idempotency key | Prevent | Hessam | 2026-07-24 | duplicate/lost-response contract test |
| Add uncertain-age circuit-breaker policy and alert | Detect/mitigate | Hessam | 2026-07-25 | fault test stops starts within 2 min |
| Show “verifying payment” client state | Reduce impact | Pourya | 2026-07-24 | E2E copy/state review |
| Automate dry-run reconciliation report with peer-approved apply mode | Recover | Hessam | 2026-07-28 | tabletop rerun; zero manual SQL edits |

The incident closes only after actions pass verification; creating tasks is not closure.
