# CI/CD design and implementation

The pipeline follows `docs/diagrams/ci-cd-pipeline.puml`: reproducible install, parallel quality and
security gates, immutable OCI images, manifest validation and an explicitly approved deployment step.

## GitHub CI

`.github/workflows/ci.yml` runs on push, pull request and manual dispatch. It executes backend lint,
serial Jest tests, production build and dependency audit; frontend type checks, production build and
dependency audit; and Terraform format, initialization and validation. Any failed mandatory gate fails
the workflow. Serial backend tests and the 1 GiB Node heap ceiling keep resource use predictable.

## GitHub delivery

After successful CI on `main`, `.github/workflows/cd.yml` validates every Kubernetes manifest and builds
both production Dockerfiles on GitHub-hosted runners. It publishes `sha-<12 characters>` and `latest`
tags to GitHub Container Registry with BuildKit cache, provenance and SBOM. The SHA tag is the deployment
identity; `latest` is only a convenience pointer.

Kubernetes deployment is intentionally manual. Configure a GitHub `production` environment, add a
base64-encoded kubeconfig as its `KUBE_CONFIG_DATA` secret, and pre-provision the `ticketing-secrets`
Kubernetes Secret from a trusted secret manager. Dispatch CD with `deploy=true`; the workflow applies
infrastructure manifests, injects immutable image tags and waits for both rollouts. With no cluster
secret configured, image publishing still runs while deployment remains skipped.

## GitLab pipeline

`.gitlab-ci.yml` provides equivalent application quality, audit, Terraform and container-build gates.
Mutation and k6 load tests are resource-serialized manual/scheduled jobs so they produce evidence without
saturating a developer laptop. Deployment jobs use protected CI variables and environments; secrets are
never stored in repository manifests.
