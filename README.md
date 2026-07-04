# Event Ticketing Platform

End-to-end Software Engineering II project demonstrating concurrency-safe ticket booking,
payment compensation, asynchronous notifications, real-time updates, and traffic control.

## Team

| Member | Focus |
|---|---|
| Hessam Hosseinian | Backend, architecture, DevOps |
| Pourya Fahimi | Frontend, UX, QA documentation |

## Architecture

The deployable is a modular NestJS application whose modules are aligned to independently
extractable bounded contexts. PostgreSQL is the system of record, Redis owns transient seat
locks, and RabbitMQ carries integration events. The React client consumes REST and Socket.IO.

## Quick start

```bash
cp backend/.env.example backend/.env
docker compose up --build
docker compose exec backend node dist/seed.js
```

- UI: http://localhost:5173
- Swagger: http://localhost:3000/api/docs
- RabbitMQ: http://localhost:15672 (`guest` / `guest`)

Demo accounts all use `Password123!`:

- `customer@narm.local`
- `organizer@narm.local`
- `admin@narm.local`

Local development:

```bash
cd backend && npm install && npm run seed && npm run start:dev
cd frontend && npm install && npm run dev
```

Tests: `cd backend && npm test`; load: `k6 run tests/load/k6-booking-test.js`.

## Booking flow

Join the waiting room, obtain admission, choose an event and seats, and create a reservation.
Redis acquires every seat lock atomically with a 10-minute TTL; partial acquisition is rolled
back. Successful payment books seats and creates cryptographically random ticket tokens.
Failure or timeout compensates by cancelling the reservation and releasing all locks.

See [API demo](docs/submission/API_DEMO_GUIDE.md), [architecture decisions](docs/architecture/ARCHITECTURE_DECISIONS.md),
[diagrams](docs/diagrams/EXPORT_DIAGRAMS.md), and [defense guide](FINAL_DEFENSE_GUIDE.md).

The ready-to-submit diagrams are in `docs/diagrams/export` as vector SVG and PDF files.
