# Verification test plan

| ID | Risk / scenario | Layer | Expected result | Priority |
|---|---|---|---|---|
| AUTH-01 | register and login with valid strong credentials | API/E2E | normalized user; password not returned; valid expiring JWT | P0 |
| AUTH-02 | invalid login and malformed/expired token | API | generic rejection; no account enumeration; 401 | P0 |
| AUTH-03 | customer calls admin/organizer endpoint | API/security | 403 and no state change | P0 |
| AUTH-04 | customer B reads A reservation/payment/ticket/queue entry | integration | 403 with no resource body | P0 |
| CAT-01 | create venue sectors/rows/seats including accessible row | integration | unique coordinates and exact capacity | P1 |
| CAT-02 | publish invalid/past event or missing price | API | rejected; draft remains unpublished | P1 |
| CAT-03 | combine text/genre/date/city/availability filters | API/contract | only published matches; stable page metadata | P1 |
| RES-01 | 100 admitted users reserve one seat simultaneously | integration/load | exactly one success; one durable active event-seat row | P0 |
| RES-02 | reserve 2 seats when one is locked | Redis component | all-or-none conflict; free seat is not left locked | P0 |
| RES-03 | attacker releases another reservation lock | Redis component | zero deletion; correct owner's lock remains | P0 |
| RES-04 | DB insert fails after Redis acquisition | integration/fault | transaction rolls back and owner locks release | P0 |
| RES-05 | cancel pending reservation | integration | CANCELLED; transient rows/locks gone; availability event | P1 |
| RES-06 | expiry sweep races with success callback | integration/race | exactly one terminal state; invariants hold | P0 |
| PAY-01 | create payment twice with same key/request | integration | same payment returned; one gateway intent | P0 |
| PAY-02 | reuse key for another reservation/user | API/security | conflict; no information/state leak | P0 |
| PAY-03 | successful capture callback repeated 10 times | integration | one SUCCESS, one ticket per seat, stable response | P0 |
| PAY-04 | definitive decline | integration | FAILED/CANCELLED; seats and locks available | P0 |
| PAY-05 | timeout then provider reports captured | integration/fault | reconciliation confirms once; no premature release | P0 |
| PAY-06 | late capture after compensation | integration/fault | quarantined/refund action and critical alert | P0 |
| TKT-01 | QR lookup with valid, unknown and modified token | API/security | valid only for exact token hash; no PII disclosed | P0 |
| TKT-02 | scan same ticket twice | integration | first check-in succeeds; second rejected/audited | P1 |
| QUE-01 | repeated join by same user/event | integration | original active position retained | P1 |
| QUE-02 | wrong user/event/expired admission token | API/security | reservation forbidden | P0 |
| QUE-03 | dependency saturation | load/fault | admission pauses; 429/503 with Retry-After; no oversell | P0 |
| MSG-01 | duplicate integration event | component | inbox deduplicates; one notification side effect | P1 |
| MSG-02 | provider transient failures then success | component | bounded delayed retries then ACK/SENT | P1 |
| MSG-03 | retries exhausted | component | FAILED record and DLX with correlation metadata | P1 |
| RT-01 | unauthorized socket subscribes to another user room | security | denied; no private event received | P0 |
| RT-02 | disconnect/version gap/reconnect | E2E | REST reconciliation restores current state | P1 |
| OPS-01 | PostgreSQL/Redis/Rabbit health permutations | component | readiness fails for DB/Redis; broker reports degraded per policy | P1 |
| PORT-01 | clean machine follows quick start | E2E | healthy services, idempotent seed, UI/API reachable without manual fix | P0 |

## Evidence and exit

CI retains JUnit, coverage, mutation, k6 JSON/HTML, security reports and image digests. The release audit
links failures to a defect and rerun. Exit requires every P0 pass, ≥95% P1 pass with no correctness/security
exception, and the traceability matrix updated to the exact commit under review.
