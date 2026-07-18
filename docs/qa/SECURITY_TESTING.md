# Security verification checklist

## Automated

- secret scan full history and current diff; dependency audit fails on unapproved High/Critical findings;
- SAST for injection, unsafe deserialization, weak randomness and authorization omissions;
- container/IaC scan for root user, writable filesystem, exposed services, missing resources and plaintext secrets;
- malformed/oversized payload, rate-limit and CORS/security-header tests;
- event/seat/search inputs exercise SQL injection strings even though parameterized ORM is used.

## Manual abuse cases

- replace JWT role/user and verify signature rejection; test expired token and removed-role session policy;
- enumerate UUIDs and confirm owner isolation across reservations, payments, queue entries and QR endpoints;
- replay gateway callback, admission token and QR scan; verify nonce/idempotency/check-in behavior;
- attempt queue position improvement through rejoin, multiple tabs/accounts and aggressive polling;
- inspect logs, broker payloads, WebSocket rooms and error bodies for JWT, password, QR token, provider secret or PII;
- verify organizer A cannot manage organizer B's event or view its private analytics.

Record scope, commit, tools, payload/evidence and remediation. Do not test third-party or production systems
without authorization. Any credential/PII exposure or cross-user access is SEV-1 and blocks release.
