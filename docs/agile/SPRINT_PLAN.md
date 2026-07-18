# Sprint planning and execution record

Cadence is three two-week sprints. Capacity excludes review, course obligations and 15% unplanned risk.

| Sprint | Goal | Committed stories | Planned points | Primary risks | Demonstrable increment |
|---|---|---|---:|---|---|
| 1 — Walking skeleton | secure identity and catalog foundation | US-01, US-02, US-03, US-04, part US-05 | 26 | schema churn, API/UI contract mismatch | login by role; organizer creates venue/event; customer discovers published event |
| 2 — Safe purchase | preserve inventory/money invariants end to end | US-07, US-08, US-09, US-10, US-11 | 42 | race reproduction, gateway uncertainty, scope | 100-way one-seat contention; success/decline/timeout; QR verify |
| 3 — Resilient delivery | handle flash traffic and produce operable evidence | US-06, US-12, US-13, US-14, US-15, US-16, US-17, US-18 | 45 | infrastructure breadth, laptop capacity, evidence drift | queue/realtime/notifications, CI/IaC/monitoring, complete submission rehearsal |

## Sprint ceremonies

- Planning: Product Owner orders backlog; team checks Ready and forecasts from recent capacity.
- Daily sync: yesterday/today/blocker plus invariant/incident risk; blocked items are marked immediately.
- Refinement: 60 minutes mid-sprint for next-sprint stories, API examples and test data.
- Review: run from a clean checkout and capture stakeholder feedback as backlog—not promises in notes.
- Retrospective: choose at most two process experiments with owner and measurable success condition.

## Board policy

Flow is Backlog → Ready → In Progress → Review → Verification → Done. WIP limits are 2 In Progress and
2 Review for the whole two-person team. Any item blocked over one working day is escalated. Review cannot
be performed by the author; shared work records one accountable reviewer.
