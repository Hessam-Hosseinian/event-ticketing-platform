# SE Project requirements baseline

Source: `SE_Project.pdf`, Software Engineering II, Spring 2026, Dr. Gohari; project designers
Hamed Ghoreyshi and Hossein Zareinejad. The supplied PDF was reviewed on 2026-07-18 and contains
11 pages (cover plus pages 1–10). This document is a structured paraphrase used for scope control.

## Mandatory product capabilities

- JWT/OAuth-style authentication and RBAC for customer, organizer and administrator.
- Venue/hall layout management with sectors, rows and numbered seats; event scheduling and pricing.
- Search/filter by classification, date, location and current availability.
- temporary high-performance seat locking that prevents races and double booking.
- Saga/compensation across reservation and external payment processing.
- live status delivery through WebSocket/message broker and unique QR ticket issuance.
- virtual waiting room and traffic throttling for high-profile releases.
- organizer dashboard for live sales, revenue and remaining capacity.
- transactional email/SMS status notifications.

## Mandatory documentation and modeling

- product vision with goals, personas and metrics;
- risk analysis for flash traffic, gateway outage, synchronization and architectural failures;
- use-case, class, two sequence, two activity, component and deployment UML models;
- editable professional sources plus high-quality vector PDF exports;
- declarative Terraform for instances, load balancers and managed database;
- DDD/service-boundary analysis, messaging topology and practical extensibility decisions.

## Agile and quality evidence

- prioritized product backlog, epics, granular user stories and acceptance criteria;
- sprint planning, reviews and retrospectives;
- Jira-style Epic → Story/Task hierarchy, export and burndown/velocity evidence;
- Git feature branches, focused commits, merge-request review loop and CODEOWNERS;
- automated GitLab CI on each commit;
- unit/integration/contract, load/stress, mutation and explicit coverage strategy.

## Bonus production/operations evidence

- Kubernetes autoscaling and zero-downtime canary architecture mapping;
- Prometheus/Grafana metrics for errors, latency and health;
- incident workflow, severity/response matrix and on-call rotation;
- blameless postmortems for payment outage, waiting-room worker failure and network partition.

## Submission and defense

The final ZIP must consolidate the two baseline documents, UML sources/exports, Jira exports,
complete repository code and automated setup/configuration. Every member attends the defense and can
explain trade-offs, their work and the end-to-end demo. Sections 1–4 are mandatory; Section 5 is bonus.
