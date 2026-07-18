# Postman collection guide

Create a local environment with `baseUrl`, `token`, `eventId`, `seatId`, `reservationId`, `paymentId`
and `ticketToken`. Never export real credentials/tokens. Import the curl requests from `API_DEMO_GUIDE.md`
in order: health/login → event/layout → waiting/admission → reservation → payment terminal paths → ticket verify.

Save the login token in a test script:

```javascript
const body = pm.response.json();
pm.expect(pm.response.code).to.be.oneOf([200, 201]);
pm.environment.set('token', body.accessToken);
```

Each private request uses `Authorization: Bearer {{token}}`. Add response-time/status/schema assertions and
extract returned IDs. Duplicate the checkout folder for success, definitive failure and timeout; use separate
fresh seats so one run does not contaminate another. Add negative requests for missing/expired token, another
user's reservation, duplicate seat/idempotency and unknown QR.

Collection Runner uses a local/sandbox environment and unique email/run suffix. Retain the generated report with
the exact commit/API version. Swagger/OpenAPI is authoritative when the prototype and hardening branch differ;
update the collection in the same merge request as an API contract change.
