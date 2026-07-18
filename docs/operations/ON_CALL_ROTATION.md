# On-call rotation and handoff

| Week | Primary | Secondary | Primary domain focus |
|---|---|---|---|
| A | Hessam Hosseinian | Pourya Fahimi | API, data, payment, Redis/RabbitMQ, Kubernetes |
| B | Pourya Fahimi | Hessam Hosseinian | buyer/organizer journey, client/realtime, product/QA evidence |

The rotation swaps weekly at 10:00 local time after a live handoff. This is a course simulation: it defines
production responsibilities without claiming a staffed 24×7 commercial operation. The primary responds to
SEV-1/2; the secondary joins every SEV-1 and any unresolved SEV-2 after 30 minutes. If the primary is unsafe,
offline or handling another incident, secondary becomes IC and escalates to the course/team lead.

## Handoff checklist

- active incidents and follow-ups; current error-budget/SLO state;
- deploys, schema/config/secret changes and maintenance scheduled in the next seven days;
- payment uncertainty, DLX/outbox backlog, capacity events and degraded dependencies;
- temporary feature flags/manual mitigations with expiry and rollback;
- access to dashboards, alert receiver, provider sandbox and current runbooks verified.

## Shift safety

No production-like change during an active SEV-1 unless directed by IC. Acknowledge SEV-1 within 5 minutes
and SEV-2 within 15. If response capability is unavailable, arrange swap before handoff. After a disruptive
night/weekend event, transfer primary duty; fatigue is an operational risk, not individual failure.

## Escalation

Payment provider/security/data exposure escalates immediately to Hessam and team lead. User messaging/UI
impact escalates to Pourya. Any destructive data repair requires both members to review target, backup and
rollback. User-facing status is owned by communications role, not whichever engineer first sees the alert.
