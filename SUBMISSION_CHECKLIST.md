# Submission checklist
| Requirement | Status | File path | Notes |
|---|---|---|---|
| Product vision/risk | Done | `docs/product`, `docs/risk` | Goals, personas, metrics, mitigations |
| JWT/RBAC and users | Done | `backend/src/security.ts`, `app.module.ts` | Customer/organizer/admin model |
| Venue/event/seat data | Done | `backend/src/entities.ts`, `app.module.ts` | Layout generation and filtering |
| TTL concurrency lock | Done | `backend/src/app.module.ts` | NX/EX and partial rollback |
| Payment saga/tickets | Done | `backend/src/app.module.ts` | Success/failure/timeout paths |
| RabbitMQ/WebSocket | Done | `backend/src/app.module.ts` | Durable consumer and live events |
| Waiting room/throttle design | Done | `backend/src/app.module.ts`, `docs/architecture/WAITING_ROOM.md` | Demo FIFO plus production design |
| Frontend flows | Done | `frontend/src/main.tsx` | Login, discovery, seats, checkout, ticket, admin |
| PostgreSQL/Redis/RabbitMQ | Done | `docker-compose.yml` | Local services |
| Swagger/demo | Done | `backend/src/main.ts`, `docs/submission/API_DEMO_GUIDE.md` | `/api/docs` |
| Tests/load/mutation | Done | `backend/src/locking.spec.ts`, `tests/load`, `.stryker.conf.json` | Baseline plus strategy |
| UML | Done | `docs/diagrams` | Eight PlantUML sources |
| DDD/architecture | Done | `docs/architecture` | Boundaries, consistency, failure |
| Agile/Jira artifacts | Done | `docs/agile` | Three sprints and CSVs |
| Git workflow/team | Done | `docs/gitlab`, `docs/team`, `CODEOWNERS` | Honest ownership/review |
| CI/CD | Done | `.gitlab-ci.yml` | Lint, test, coverage, build, scan |
| Kubernetes/Terraform | Done | `infra` | Deployable examples |
| Operations/postmortems | Done | `docs/operations`, `docs/postmortems` | Monitoring and three incidents |
| Defense/submission | Done | `FINAL_DEFENSE_GUIDE.md`, `docs/submission` | Demo and clean archive |
