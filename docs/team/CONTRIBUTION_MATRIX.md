# Contribution and defense matrix

| Workstream | Responsible | Accountable | Consulted/reviewer | Evidence | Defense owner |
|---|---|---|---|---|---|
| identity/catalog/reservation | Hessam | Hessam | Pourya | backend history, contract/QA review | Hessam |
| payment/ticket/messaging | Hessam | Hessam | Pourya | saga UML, tests/API transcript, postmortem | Hessam |
| buyer/organizer interface | Pourya | Pourya | Hessam | frontend history, responsive/RTL/accessibility walkthrough | Pourya |
| product vision/backlog/Jira | Pourya | Pourya | Hessam | product/Agile docs and CSV validation | Pourya |
| QA/load/mutation/security | Pourya | Pourya | Hessam | QA plan, CI artifacts and invariant query | Pourya |
| architecture/UML | Hessam | Hessam | Pourya | PlantUML sources, vector exports, joint walkthrough | Hessam |
| CI/Kubernetes/Terraform | Hessam | Hessam | Pourya | pipeline/IaC validation and deployment UML | Hessam |
| operations/postmortems | Hessam | Shared | Pourya | alerts/runbooks/tabletop records | one scenario each |
| integration/submission | Shared | Shared | — | traceability, clean-checkout audit, archive checksum | Shared |

Git commit authorship identifies the accountable producer for each focused artifact. Review is recorded in
PR/MR discussions/approval, not by changing author metadata. The matrix is updated from actual history before
final submission; it must never be used to invent work or participation.
