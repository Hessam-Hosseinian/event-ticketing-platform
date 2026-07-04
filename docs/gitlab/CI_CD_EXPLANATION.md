# CI/CD explanation
The pipeline installs reproducibly, lints both applications, runs Jest and captures coverage,
builds applications/images, audits dependencies, and exposes a manual preview deployment.
Production variables include registry credentials, `KUBE_CONFIG`, database/Redis/RabbitMQ
URLs, and JWT secret. Protected masked variables must never be committed.
