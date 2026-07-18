# Submission checklist

This checklist covers the current software-engineering evidence pass. Application production hardening remains
tracked as Prototype/In Review in `docs/REQUIREMENTS_TRACEABILITY.md`; this file must not overstate it.

| Requirement | Evidence | Current status | Final verification |
|---|---|---|---|
| Product vision and measurable goals | `docs/product/PRODUCT_VISION.md` | Complete design | team sign-off |
| Comprehensive risk register | `docs/risk/RISK_ANALYSIS.md` | Complete design | sprint/release risk review |
| Eight mandatory UML models | `docs/diagrams/*.puml` and exports | Complete + syntax checked | visual/open every SVG/PDF |
| Supplemental state/context/CI models | reservation, saga, context, pipeline diagrams | Complete | visual review |
| DDD/consistency/messaging/saga decisions | `docs/architecture` | Complete design | joint architecture walkthrough |
| Agile backlog/stories/sprints | `docs/agile/*.md` | Complete design/evidence | IDs/status reconcile |
| Jira board and burndown | `JIRA_BOARD_EXPORT.csv`, `BURNDOWN_CHART_DATA.csv` | Complete structure | CSV import/column check |
| QA/load/mutation/security/accessibility | `docs/qa`, `tests/load` | Complete plan; executable evidence evolving | CI artifacts linked |
| Monitoring/SLO/canary/on-call/runbooks | `docs/operations` | Complete architecture mapping | tabletop review |
| Three mandatory postmortems | `docs/postmortems` | Complete simulated scenarios | actions reviewed |
| Terraform/Kubernetes/CI | `infra`, `.gitlab-ci.yml`, deployment/CI UML | Prototype/examples | fmt/init/validate and pipeline pass |
| Product implementation | `backend`, `frontend`, Compose | Prototype; hardening deferred by current scope | clean E2E smoke later |
| Git authorship/branches/review | `docs/gitlab`, remote PR/MR | In progress | actual URLs and approvals |
| Team roles/defense | `docs/team`, `FINAL_DEFENSE_GUIDE.md` | Complete plan | two timed rehearsals |
| Consolidated ZIP/checksum | `docs/submission` | Pending final tag | clean extraction audit |

## Final sign-off

- [ ] all mandatory matrix rows have reproducible evidence for the release commit;
- [ ] no secrets/local caches/builds/node_modules/database volumes in archive;
- [ ] clean checkout passes light audit and Compose smoke; CI links heavy tests;
- [ ] archive manifest, byte size and SHA-256 filled after the final tag;
- [ ] Hessam and Pourya can each explain one cross-domain failure and approve upload.
