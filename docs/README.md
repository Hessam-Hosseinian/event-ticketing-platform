# Software-engineering evidence index

Start with the requirements baseline and traceability matrix. The matrix is the authoritative scope/status
record; individual checklists do not override it.

| Area | Primary entry point | Contents |
|---|---|---|
| Requirements | `PROJECT_REQUIREMENTS.md`, `REQUIREMENTS_TRACEABILITY.md` | PDF baseline, design/implementation evidence and acceptance gaps |
| Product and risk | `product/PRODUCT_VISION.md`, `risk/RISK_ANALYSIS.md` | personas, scope, KPIs/SLOs, scored risks and contingencies |
| Architecture | `architecture/ARCHITECTURE_DECISIONS.md` | ADRs, DDD, consistency, saga, messaging, queue, realtime and state |
| UML | `diagrams/EXPORT_DIAGRAMS.md` | 8 mandatory + 4 supplemental editable models and vector exports |
| Agile | `agile/AGILE_SUMMARY.md` | epics, stories, backlog, sprints, Jira CSV and burndown |
| Quality | `qa/QA_STRATEGY.md`, `qa/TEST_PLAN.md` | functional/nonfunctional/security/accessibility gates |
| Operations | `operations/MONITORING_PLAN.md`, `operations/INCIDENT_MANAGEMENT.md` | SLOs, metrics, alerts, canary, on-call and runbooks |
| Incidents | `postmortems` | three explicitly simulated mandatory blameless scenarios |
| Git/delivery | `gitlab/GITLAB_WORKFLOW.md` | branch/commit/review/CI/remote evidence policy |
| Team/defense | `team/TEAM_DEFENSE_PLAN.md` | ownership, timed presentation, cross-training and fallback |
| Submission | `submission/FINAL_SUBMISSION_GUIDE.md` | clean audit, archive/checksum and manifest |

Architecture documents distinguish a production target from the current prototype. Resource-heavy load and
mutation suites belong in controlled CI; local documentation checks and diagram export remain lightweight.
