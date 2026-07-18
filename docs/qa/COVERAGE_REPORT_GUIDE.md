# Coverage measurement and interpretation

```bash
cd backend
npm run test:cov -- --runInBand
```

Open `backend/coverage/lcov-report/index.html`; CI also retains LCOV and Cobertura/JUnit-compatible artifacts.
Targets are ≥80% statements/lines/functions/branches globally and ≥90% branch coverage for reservation,
lock, payment state and ownership policy. New/changed code must not reduce the target or leave a P0
acceptance branch uncovered.

Exclude generated bootstrap/types only with review. Never add meaningless execution or broad ignore comments
to increase the number. Review uncovered red/yellow branches against `TEST_PLAN.md`: failure, authorization,
timeout and rollback paths are higher priority than getter/DTO boilerplate.

Coverage is one signal. Release evidence also needs assertions against domain invariants, mutation score,
real dependency integration, contention/load results and fault recovery. A 100% line score can still miss a
wrong success comparison or race.
