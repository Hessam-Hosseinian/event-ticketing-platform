# QA strategy
The test pyramid combines unit tests for state/locking logic, integration tests against real
PostgreSQL/Redis, API contract tests, a small UI smoke suite, and k6 flash-sale tests. Highest
risk is overselling, so concurrency invariants and payment compensation receive mutation and
fault-injection attention. CI blocks merge on lint, test, coverage, and build.
