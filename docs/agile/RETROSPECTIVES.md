# Sprint retrospectives

| Sprint | Keep | Problem / evidence | Experiment for next sprint | Owner | Success measure |
|---|---|---|---|---|---|
| 1 | API-first demos and pair review | schema/API stabilized late; frontend rework followed | write request/response and negative acceptance examples before implementation | Hessam | no contract-breaking change after day 4 |
| 1 | focused feature branches | review queue grew near sprint end | WIP limit 2 and review within one working day | Pourya | median review wait < 1 day |
| 2 | contention-first design | timeout was treated as definitive failure | model state machine and failure table before gateway code | Hessam | all terminal/uncertain transitions tested |
| 2 | end-to-end buyer walkthrough | docs claimed more than tests proved | traceability status separates Complete Design from Prototype | Pourya | zero unsupported “Done” checklist entries |
| 3 | vector-as-code UML | mutation/load tooling overloaded a development laptop | run resource-heavy suites in scheduled CI; use unit/syntax checks locally | Hessam | local baseline < 2 GB additional RAM; CI artifact retained |
| 3 | clean evidence structure | infrastructure breadth diluted depth | freeze optional features and audit mandatory+bonus evidence by matrix | Team | submission audit has no missing mandatory artifact |

Retrospectives are blameless and process-focused. Actions enter the backlog; repeating the same unresolved
action in two retrospectives requires the team to reduce WIP or scope rather than simply carrying it again.
