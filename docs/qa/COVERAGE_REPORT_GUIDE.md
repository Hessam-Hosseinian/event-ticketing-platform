# Coverage guide
Run `cd backend && npm run test:cov`, then open `backend/coverage/lcov-report/index.html`.
Targets: 80% statements/branches globally and 90% branches for reservation/payment logic.
Coverage locates untested paths; assertions, mutation score, and concurrency tests establish
behavioral quality.
