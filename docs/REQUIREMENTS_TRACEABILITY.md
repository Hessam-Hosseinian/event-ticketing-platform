# Requirements traceability matrix

Legend: **Complete** means the requested engineering artifact is present and reviewable. **Prototype**
means executable evidence exists but production hardening/integration verification is tracked separately.
This distinction prevents a document from claiming that an untested design is already production-ready.

| ID | Requirement | Design/document evidence | Executable or data evidence | Status / acceptance |
|---|---|---|---|---|
| F-01 | JWT authentication and buyer/organizer/admin RBAC | `architecture/DDD_BOUNDARIES.md`, use-case/class UML | `backend/src/security.ts`, auth/users endpoints | Prototype; negative authorization cases must pass |
| F-02 | Venue sectors, rows, seats and event lifecycle | admin activity/class UML, `agile/USER_STORIES.md` | venue/event endpoints and seed | Prototype; reject invalid layout/schedule |
| F-03 | Search by genre/date/location/availability | product vision, use-case UML | paginated event discovery API/UI | Implemented; automated filter contract cases remain |
| F-04 | Atomic temporary seat locks | ADR-004, data consistency, booking sequence | Redis lock path, contention test plan | Prototype; 100 contenders must yield one winner |
| F-05 | Payment saga and compensation | `PAYMENT_SAGA.md`, saga/sequence/state UML | payment/reservation/ticket paths | Prototype; success/decline/timeout/duplicate callbacks required |
| F-06 | Real-time updates | `REALTIME_UPDATES.md`, notification sequence | authenticated Socket.IO user/event rooms | Implemented; reconnect contract automation remains |
| F-07 | Message broker and notifications | `ASYNC_MESSAGING.md` | RabbitMQ/notification prototype | Prototype; outbox/inbox/DLX hardening tracked |
| F-08 | Unique QR tickets and verification | class/use-case UML, security notes | persistent wallet, QR/verification/check-in API | Implemented; duplicate check-in and ownership automation remains |
| F-09 | Virtual waiting room/throttling | `WAITING_ROOM.md`, booking sequence | waiting-room endpoints/rate limit | Prototype; fairness/admission load test pending |
| F-10 | Organizer live analytics | product metrics, component UML | ownership-scoped organizer UI/API analytics | Implemented; projection freshness SLO measurement pending |
| D-01 | Product vision | `product/PRODUCT_VISION.md` | KPI targets | Complete when team approves metrics/personas |
| D-02 | Risk analysis and mitigations | `risk/RISK_ANALYSIS.md` | risk owners/triggers/contingencies | Complete; review each sprint |
| U-01 | Use-case diagram | `diagrams/use-case.puml` + export | SVG/PDF | Complete; actors and include/extend paths shown |
| U-02 | Class diagram | `diagrams/class-diagram.puml` + export | SVG/PDF | Complete; entities, aggregates, states, relations and constraint note |
| U-03 | End-to-end booking sequence | `diagrams/booking-sequence.puml` + export | SVG/PDF | Complete; queue, lock, DB, gateway and every terminal branch |
| U-04 | Async notification sequence | `diagrams/notification-sequence.puml` + export | SVG/PDF | Complete; outbox, retry, inbox and DLX |
| U-05 | Purchase activity | `diagrams/purchase-activity.puml` + export | SVG/PDF | Complete; cancellation, decline and uncertainty modeled |
| U-06 | Admin event activity | `diagrams/admin-event-activity.puml` + export | SVG/PDF | Complete; venue, pricing and publication guards |
| U-07 | Component diagram | `diagrams/component-diagram.puml` + export | SVG/PDF | Complete; proposed context boundaries and dependencies |
| U-08 | Deployment diagram | `diagrams/deployment-diagram.puml` + export | SVG/PDF | Complete; Kubernetes, data, broker, canary and telemetry |
| I-01 | Terraform provisioning | deployment UML, `infra/terraform/README.md` | VPC, ALB, ASG, RDS and Redis Terraform | Implemented configuration; CI `terraform validate` is acceptance evidence |
| A-01 | Prioritized backlog | `agile/PRODUCT_BACKLOG.md`, Jira CSV | priorities/story points | Complete when IDs reconcile across artifacts |
| A-02 | Epics and user stories | `agile/EPICS.md`, `USER_STORIES.md` | acceptance criteria | Complete; Product Owner sign-off required |
| A-03 | Sprint plan/review/retro | `agile/SPRINT_PLAN.md`, reviews, retrospectives | three sprint records | Complete; dates/participants/evidence links required |
| A-04 | Jira hierarchy and burndown | Jira/burndown CSVs | spreadsheet-importable data | Complete when CSV validation passes |
| G-01 | Git branches, focused commits and MR reviews | `gitlab/*`, `CODEOWNERS` | remote branches/PR URLs | In progress; URLs added only after actual remote creation |
| Q-01 | Test and QA strategy | `qa/QA_STRATEGY.md`, `TEST_PLAN.md` | unit/integration/E2E plan | Complete design; implementation evidence evolves with code |
| Q-02 | Load/stress testing | `qa/LOAD_TESTING.md` | `tests/load/k6-booking-test.js` | Prototype; invariant query and threshold run required |
| Q-03 | Mutation and coverage | `qa/MUTATION_TESTING.md`, coverage guide | Stryker/Jest config | Prototype; mutation score stored as CI artifact |
| C-01 | GitLab CI on every commit | CI/CD UML and explanation | mandatory quality/audit/Terraform/container jobs | Implemented; extended load/mutation jobs are resource-serialized manual/scheduled jobs |
| O-01 | K8s autoscale/canary mapping | deployment UML, operations docs | `infra/k8s` examples | Complete architecture; deployment validation pending |
| O-02 | Prometheus/Grafana mapping | monitoring/mapping docs | metric/alert catalog | Complete design |
| O-03 | Incident process/on-call | incident and rotation docs | severity/RACI/runbook links | Complete design; rehearsal required |
| O-04 | Three postmortems | `postmortems/*.md` | action items with owners/dates | Complete templates/scenarios |
| S-01 | Portable local environment | README/submission guide | production Dockerfiles, Nginx proxy, Compose, seed/env examples | Implemented; clean-machine smoke test remains release acceptance |
| S-02 | Consolidated ZIP | `submission/FINAL_SUBMISSION_GUIDE.md` | packaging/checksum script or commands | Pending final release freeze |
| S-03 | Team defense | `team/TEAM_DEFENSE_PLAN.md`, defense guide | role matrix and demo script | Complete plan; rehearsal/sign-off pending |

## Change-control rule

Every requirement change updates this matrix, its backlog item and affected acceptance tests in the same
merge request. A requirement is not marked complete solely because a file exists: the acceptance column
must be satisfied and evidence must be reproducible from a clean checkout.
