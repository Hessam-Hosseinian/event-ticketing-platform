# CI/CD design and current-state explanation

The desired pipeline is shown in `docs/diagrams/ci-cd-pipeline.puml`: reproducible install; parallel lint/type,
unit/integration/build and security; coverage/mutation/load evidence; immutable OCI build/SBOM/scan; preview smoke;
then tagged canary promotion of the same digest with SLO rollback.

The checked-in `.gitlab-ci.yml` is a **prototype baseline**. It installs, lints, runs Jest/coverage, builds apps
and images, audits dependencies and defines manual preview. Production hardening remains implementation work:
security scans currently tolerate findings, mutation/load/contract/IaC validation are not complete gates, image
registry/SBOM/signing is absent and preview is a placeholder. The traceability matrix therefore does not mark the
pipeline production-complete.

Mandatory target gates must fail the pipeline on lint/type/test/build, High/Critical unapproved dependency or image
finding, secret detection, IaC validation and P0 integration failure. Heavy mutation/load run scheduled or on label
and retain evidence without blocking a developer laptop. Protected/masked variables hold registry/Kubernetes and
dependency URLs/secrets; fork/untrusted pipelines cannot access protected environments. Deploy jobs require protected
tag/environment approval and record digest, migration/flag, canary comparison and rollback.
