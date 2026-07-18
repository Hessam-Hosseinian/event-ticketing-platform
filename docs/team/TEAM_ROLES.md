# Team roles and simulated perspectives

| Member | Primary | Secondary | Accountable artifacts | Reviewer role |
|---|---|---|---|---|
| Hessam Hosseinian | Backend and architecture lead | DevOps/SRE and security | API/domain/data, concurrency/saga, architecture/operations, CI/IaC | reviews frontend contracts, QA feasibility and release safety |
| Pourya Fahimi | Frontend and UX lead | Product analyst and QA | buyer/organizer journeys, product/Agile/QA, accessibility and evidence | reviews API usability, acceptance evidence and operational messaging |

Testing, UML walkthrough, integration, incident exercises and defense rehearsal are shared. Ownership means
accountability for correctness and presentation—not exclusive authorship or permission to self-approve.

## Course role simulation

During refinement the team acts as Product Owner/System Analyst to challenge value and acceptance. During
implementation/review it acts as backend/frontend engineers and security reviewer. During verification it
acts as QA/performance engineer. During release/incident exercises it acts as DevOps/SRE, incident commander
and communications lead. Each artifact identifies the perspective so architectural trade-offs are evaluated
from more than the authoring specialty.

## Working agreements

- feature author cannot be sole approver; Critical/High findings block merge;
- one coherent concern per commit and no false authorship or fabricated remote review evidence;
- uncertainty and prototype limitations are recorded rather than marked Done for presentation;
- every member can explain the end-to-end flow, one failure mode outside their primary area and the evidence
  proving the system's key invariant.
