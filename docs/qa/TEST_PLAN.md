# Test plan
| Scenario | Expected |
|---|---|
| Register/login and profile | JWT identifies customer |
| Admin list users | allowed; customer gets 403 |
| Create venue/event/filter | layout persists; published match returned |
| Two clients lock one seat | exactly one succeeds |
| Lock booked seat | rejected |
| Payment success | confirmed, booked, ticket verifies |
| Failure/timeout | cancelled/expired, every lock released |
| Notification event | durable consumer handles once |
| Waiting-room overload | position/token or 429/503 |
Evidence is Jest output, coverage HTML, k6 summary, API transcript, and CI job artifacts.
