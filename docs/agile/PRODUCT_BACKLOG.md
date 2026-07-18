# Prioritized product backlog

Priority follows Must/Should/Could; WSJF is `(business value + time criticality + risk reduction) / points`.
Status is evidence-based: **Done** requires the shared Definition of Done, not just code completion.

| Rank | ID | Epic | Item | MoSCoW | Points | WSJF | Owner | Status |
|---:|---|---|---|---|---:|---:|---|---|
| 1 | US-08 | E3 | Durable oversell invariant and contention proof | Must | 8 | 3.0 | Hessam | In Review |
| 2 | US-07 | E3 | Atomic TTL seat reservation and expiry | Must | 13 | 1.8 | Hessam | In Review |
| 3 | US-09 | E4 | Idempotent payment initiation/completion | Must | 8 | 2.6 | Hessam | In Review |
| 4 | US-10 | E4 | Saga decline/timeout/reconciliation compensation | Must | 13 | 1.8 | Hessam | In Review |
| 5 | US-01 | E1 | Secure authentication/token lifecycle | Must | 5 | 4.0 | Hessam | Done |
| 6 | US-02 | E1 | RBAC and resource ownership | Must | 5 | 3.8 | Hessam | In Review |
| 7 | US-03 | E2 | Venue layout builder | Must | 8 | 2.4 | Hessam/Pourya | Done |
| 8 | US-04 | E2 | Event schedule/pricing/publication | Must | 8 | 2.4 | Hessam/Pourya | In Review |
| 9 | US-05 | E2/E5 | Search/filter and discovery experience | Must | 8 | 2.3 | Pourya | In Review |
| 10 | US-11 | E4/E5 | QR issuance/verification/check-in | Must | 8 | 2.5 | Hessam/Pourya | In Review |
| 11 | US-06 | E7 | Fair waiting room and admission token | Must | 8 | 2.6 | Hessam | In Review |
| 12 | US-12 | E6 | Scoped real-time status/reconciliation | Should | 5 | 2.8 | Hessam/Pourya | Prototype |
| 13 | US-13 | E6 | Async notification with retry/DLX | Should | 8 | 2.0 | Hessam | Prototype |
| 14 | US-16 | E8 | CI quality/security gates | Must | 8 | 2.8 | Hessam/Pourya | In Review |
| 15 | US-18 | E8 | Traceable reproducible submission | Must | 8 | 2.6 | Pourya | In Progress |
| 16 | US-15 | E8 | Health, telemetry and SLO alerts | Should | 8 | 2.1 | Hessam | Designed |
| 17 | US-14 | E5 | Organizer analytics projection | Should | 8 | 1.8 | Pourya | Prototype |
| 18 | US-17 | E8 | Incident framework and scenario exercises | Should | 5 | 2.4 | Hessam/Pourya | In Progress |
| 19 | NFR-01 | E8 | Clean restore/backup drill | Should | 5 | 2.2 | Hessam | Planned |
| 20 | NFR-02 | E7 | Bot/risk-based queue protection | Could | 8 | 1.3 | Hessam | Designed |

## Definition of Ready

A story has a persona/outcome, acceptance examples, dependencies, estimate, owner/reviewer, test approach,
security/privacy impact and linked requirement. Unknown external behavior has a spike with a time box.

## Definition of Done

- acceptance criteria and negative/failure paths pass;
- focused commit and peer review/CODEOWNERS approval exist;
- lint, typecheck, unit/integration/build and applicable security gates pass;
- coverage does not regress and critical mutations are killed;
- API/schema/UML/runbook/traceability changes accompany behavior;
- no unresolved Critical/High defect or secret; demo evidence is reproducible from clean checkout.
