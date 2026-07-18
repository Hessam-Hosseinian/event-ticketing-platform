# Incident management framework

## Severity and response targets

| Severity | Definition / example | Acknowledge | Update | Leadership/escalation |
|---|---|---:|---:|---|
| SEV-1 | oversell, cross-user access, secret/data loss, systemic checkout outage, paid without ticket >5m | 5 min | every 15 min | page primary+secondary immediately; instructor/product lead informed |
| SEV-2 | material degradation, queue/payment backlog, one critical dependency unavailable with safe fallback | 15 min | every 30 min | secondary if unresolved 30 min |
| SEV-3 | limited impact or workaround, SLO trend without immediate danger | 4 business h | daily | team backlog owner |
| SEV-4 | cosmetic/documentation/question | 2 business d | as needed | normal backlog |

## Roles (one person may hold multiple in a two-person team)

- **Incident Commander (IC):** severity, priorities, role assignment, decision log and closure.
- **Operations lead:** executes diagnosis/mitigation and reports facts; does not manage communications.
- **Communications lead:** stakeholder/status updates using confirmed impact and next update time.
- **Scribe:** UTC timeline, commands/dashboards/changes and hypotheses; preserves evidence.
- **Subject-matter owner:** payment, data, queue or frontend specialist consulted by IC.

## Response lifecycle

1. Detect/declare early, open incident channel/document, assign IC and correlation/time window.
2. Assess customer/business/security scope and choose severity; start regular communications.
3. Stabilize: stop admission, load shed, disable risky feature, open circuit or roll back. Correctness and
   safety precede root-cause analysis and feature availability.
4. Diagnose with one hypothesis/expected observation/change at a time; record every production mutation.
5. Recover gradually, validate technical health and domain invariants, reconcile payments/reservations/tickets.
6. Monitor for at least one normal traffic/error-budget interval; declare resolved with remaining risk.
7. Produce a blameless postmortem within five working days and track actions to closure.

## Communication template

`[SEV-x][Investigating|Identified|Monitoring|Resolved]` — start time UTC; affected journey/region; quantified
impact; what is not affected; mitigation; user action if any; next update time. Do not speculate, expose
personal data or promise a recovery time without evidence.

## Evidence and change safety

Preserve dashboard snapshots, trace/correlation IDs, deploy/config/audit history, provider status and relevant
queries. Do not destroy pods/logs or modify financial state before capture unless safety requires it. Emergency
changes use peer confirmation where possible and a reversible command. Security/data incidents follow access
restriction and disclosure policy in addition to this flow.

## Post-incident completion

A postmortem includes impact, detection, UTC timeline, technical/root organizational causes, contributing
factors, what worked/failed and SMART actions. No individual blame. Actions are prioritized by recurrence or
blast-radius reduction, have owner/due date and are reviewed in sprint planning until verified complete.
