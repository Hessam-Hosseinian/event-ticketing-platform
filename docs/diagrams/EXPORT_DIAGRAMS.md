# Diagram catalog and export procedure

All diagrams are editable PlantUML sources and are exported as vector SVG and PDF—not screenshots.
The shared `theme.iuml` establishes consistent typography and colors without a network dependency.

| Diagram | Source | PDF requirement / purpose |
|---|---|---|
| Use cases | `use-case.puml` | Customer booking and administrative capabilities |
| Domain classes | `class-diagram.puml` | Entities, aggregates, states, cardinalities and constraints |
| Booking sequence | `booking-sequence.puml` | Queue, Redis lock, payment and compensation paths |
| Notification sequence | `notification-sequence.puml` | Broker, retry, idempotent consumer and DLX |
| Purchase activity | `purchase-activity.puml` | Success, cancellation, decline and timeout branches |
| Admin activity | `admin-event-activity.puml` | Venue layout, pricing validation and publishing |
| Components | `component-diagram.puml` | Proposed decoupled business boundaries |
| Deployment | `deployment-diagram.puml` | Kubernetes, data stores, broker and telemetry |
| Reservation state | `reservation-state.puml` | Supplemental aggregate lifecycle |
| Payment saga state | `payment-saga-state.puml` | Supplemental orchestration and uncertain outcomes |
| DDD context map | `domain-context-map.puml` | Supplemental upstream/downstream relationships |
| CI/CD pipeline | `ci-cd-pipeline.puml` | Supplemental engineering quality gates |

Run from repository root:

```bash
./scripts/export-diagrams.sh
```

The script fails fast if PlantUML is absent. Review every SVG visually and include both the source
and `docs/diagrams/export/*.{svg,pdf}` in the final archive so assessors can inspect and edit models.
