# API demo
```bash
curl -X POST localhost:3000/api/auth/register -H 'content-type: application/json' -d '{"email":"buyer@example.com","password":"Passw0rd!"}'
curl -X POST localhost:3000/api/auth/login -H 'content-type: application/json' -d '{"email":"buyer@example.com","password":"Passw0rd!"}'
curl localhost:3000/api/events?q=music
curl -X POST localhost:3000/api/waiting-room/EVENT_ID/join -H 'content-type: application/json' -d '{"userId":"USER_ID"}'
curl -X POST localhost:3000/api/reservations -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' -d '{"eventId":"EVENT_ID","seatIds":["SEAT_ID"]}'
curl -X POST localhost:3000/api/payments -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' -d '{"reservationId":"RESERVATION_ID"}'
curl -X POST localhost:3000/api/payments/PAYMENT_ID/simulate/success -H "Authorization: Bearer $TOKEN"
curl localhost:3000/api/tickets/verify/TICKET_TOKEN
```
Venue/event creation uses `POST /api/venues`, `POST /api/venues/:id/sectors`, `POST
/api/events`, and `POST /api/events/:id/publish`. Swagger provides editable request schemas.
