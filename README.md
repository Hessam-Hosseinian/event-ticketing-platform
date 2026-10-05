# Event Ticketing Platform

An end-to-end **Software Engineering II** project focused on the difficult parts of online ticket sales: concurrent seat booking, temporary locks, payment compensation, traffic control, asynchronous events, and real-time updates.

## Highlights

- Concurrency-safe seat reservations
- Redis-backed temporary seat locks
- Waiting-room / admission flow for traffic control
- Payment success/failure compensation
- RabbitMQ integration events
- Real-time updates with Socket.IO
- Role-based customer, organizer, and admin flows
- Swagger/OpenAPI documentation
- Automated backend and frontend quality checks
- Mutation and k6 load-testing support
- Docker-based local environment

## Team

| Member | Focus |
|---|---|
| Hessam Hosseinian | Backend, architecture, DevOps |
| Pourya Fahimi | Frontend, UX, QA documentation |

## Tech stack

### Backend

- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- Redis / ioredis
- RabbitMQ / amqplib
- Socket.IO
- JWT + bcrypt
- Swagger
- Jest
- Stryker mutation testing

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Socket.IO Client

### Infrastructure

- Docker / Docker Compose
- Nginx
- k6 load tests
- CI configuration for GitHub and GitLab

## Architecture

The deployable is a modular NestJS application organized around bounded contexts that can be extracted independently later.

```text
React client
   |
   | REST + Socket.IO
   v
NestJS application
   |
   +---- PostgreSQL   system of record
   |
   +---- Redis        temporary seat locks / traffic-control state
   |
   +---- RabbitMQ     asynchronous integration events
```

## Booking flow

```text
Waiting room
    ↓
Admission
    ↓
Choose event + seats
    ↓
Atomic Redis seat locks (10-minute TTL)
    ↓
Reservation
   / \
  /   \
payment success    failure / timeout
      |                  |
      v                  v
book seats          compensate + cancel
issue tickets       release locks
```

Partial lock acquisition is rolled back so a reservation does not silently hold only some of the requested seats.

## Quick start

Copy the backend environment template:

```bash
cp backend/.env.example backend/.env
```

Start the stack:

```bash
docker compose up --build
```

Seed demo data:

```bash
docker compose exec backend node dist/seed.js
```

### Local services

- UI: `http://localhost:5173`
- Swagger: `http://localhost:3000/api/docs`
- RabbitMQ management: `http://localhost:15672`

RabbitMQ local default credentials:

```text
guest / guest
```

### Demo accounts

All seeded demo accounts use:

```text
Password123!
```

Accounts:

- `customer@narm.local`
- `organizer@narm.local`
- `admin@narm.local`

These are **local demo credentials**, not production credentials.

## Local development

Backend:

```bash
cd backend
npm install
npm run seed
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Verification

Backend:

```bash
export NODE_OPTIONS=--max-old-space-size=1024
cd backend
npm run lint
npm run build
npm test -- --runInBand
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Mutation and k6 load tests are intentionally kept out of the normal fast local loop and are intended for manual/scheduled runs.

## Engineering documentation

The repository includes extensive supporting evidence:

- [Documentation index](docs/README.md)
- [Requirements traceability](docs/REQUIREMENTS_TRACEABILITY.md)
- [API demo guide](docs/submission/API_DEMO_GUIDE.md)
- [Architecture decisions](docs/architecture/ARCHITECTURE_DECISIONS.md)
- [Diagram export guide](docs/diagrams/EXPORT_DIAGRAMS.md)
- [Final defense guide](FINAL_DEFENSE_GUIDE.md)

Ready-to-submit architecture diagrams are available under `docs/diagrams/export`.

## Production note

This project demonstrates production-oriented engineering patterns, but it is still an academic implementation. Secrets, deployment topology, observability, backups, external payment integration, and production hardening should be reviewed before real-world use.
