# User stories and acceptance criteria

| ID | Story | Acceptance summary |
|---|---|---|
| US-01 | As a buyer, I want to register/sign in so that my orders are protected. | normalized unique email; strong hashed password; signed expiring token; invalid credentials reveal no account detail |
| US-02 | As an administrator, I want role management so that privileges follow least access. | customer cannot access organizer/admin commands; organizer cannot grant roles; audit captures changes |
| US-03 | As an organizer, I want sector/row/seat layout tools so that physical inventory is modeled. | positive bounded dimensions; unique coordinates; accessible seats; capacity derived correctly |
| US-04 | As an organizer, I want scheduled events and sector pricing so that tickets can be sold. | future non-overlapping schedule; venue exists; each seat resolves a price; draft cannot publish when invalid |
| US-05 | As a buyer, I want search/filtering so that I find relevant available events. | text, genre, date, city and availability combine; pagination stable; unpublished events absent |
| US-06 | As a buyer, I want a fair waiting-room position so that retry bots do not get priority. | monotonic event position; rejoin does not improve it; state/next-poll visible; signed admission expires |
| US-07 | As a buyer, I want selected seats held for ten minutes so that I can pay safely. | 1–10 seats; atomic all-or-none lock; visible deadline; another owner gets 409; owner-only release |
| US-08 | As the business, I want durable oversell protection so that cache failure cannot corrupt inventory. | unique event/seat constraint; transaction rollback; contention invariant returns exactly one winner |
| US-09 | As a buyer, I want idempotent checkout so that retries never double-charge me. | same key/request returns same attempt; conflicting reuse rejected; duplicate success returns same tickets |
| US-10 | As a buyer, I want failed or timed-out payment compensated so that seats return safely. | definitive decline cancels; uncertainty reconciles first; expiry removes transient inventory/locks |
| US-11 | As a buyer, I want one verifiable QR ticket per seat so that admission is trustworthy. | high-entropy opaque token; hash lookup; unknown token invalid; second check-in rejected/audited |
| US-12 | As a buyer, I want instant private status updates so that I understand my order. | user/event rooms; schema/version/time; reconnect refetch; no payment/ticket broadcast to unrelated clients |
| US-13 | As a buyer, I want Email/SMS confirmation so that I retain proof outside the browser. | checkout not blocked; at-least-once message handled once; bounded retry/DLX; delivery status stored |
| US-14 | As an organizer, I want live sales/revenue/capacity so that I can operate the event. | only owner/admin; projection freshness shown; totals reconcile with confirmed orders |
| US-15 | As an operator, I want health/metrics/alerts so that failures are detected before users report them. | readiness covers critical dependencies; RED/business metrics; SLO alerts link to runbooks |
| US-16 | As a developer, I want automated quality gates so that broken changes cannot merge. | lint/type/test/build/security required; coverage/mutation evidence; CODEOWNERS approval |
| US-17 | As on-call, I want incident playbooks so that response is fast and blameless. | severity/roles/comms/timeline; three scenario postmortems; actions have owner/due date |
| US-18 | As an assessor, I want a reproducible evidence package so that every requirement is reviewable. | clean checkout starts; editable UML plus vector PDFs; Jira CSV; traceability; checksummed ZIP |

## Critical executable examples

```gherkin
Scenario: one seat under contention
  Given event E has one available seat S and 100 admitted buyers
  When all buyers attempt to reserve S concurrently
  Then exactly one reservation is pending or confirmed
  And 99 requests receive a conflict
  And at most one durable event-seat row exists
```

```gherkin
Scenario: uncertain payment response
  Given a pending reservation whose gateway capture request timed out
  When the provider status is still unknown
  Then the reservation remains unavailable until its bounded deadline
  And no failure compensation event is published yet
  When reconciliation reports captured
  Then one success transition and one ticket set are produced
```

```gherkin
Scenario: expiration races with success callback
  Given a pending reservation reaches its expiration time
  When the expiry worker and success callback run concurrently
  Then a row lock/conditional update allows one terminal transition
  And the resulting money, inventory and ticket invariants are consistent
```

```gherkin
Scenario: authorization isolation
  Given two customers A and B
  When B requests A's reservation, payment, ticket QR or waiting-room entry
  Then the API returns 403 without disclosing the resource body
```
