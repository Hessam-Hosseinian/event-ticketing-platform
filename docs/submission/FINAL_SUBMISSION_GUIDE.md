# Final submission packaging and audit

## Required contents

- `docs/product/PRODUCT_VISION.md` and `docs/risk/RISK_ANALYSIS.md`;
- all PlantUML sources, shared theme and matching vector SVG/PDF exports;
- Jira/backlog/burndown, sprint plan/review/retrospective and team contribution evidence;
- complete tracked frontend/backend/tests, lockfiles, environment examples and API/demo docs;
- GitLab CI configuration, branch/review evidence, Docker/Compose, Kubernetes and Terraform;
- DDD/architecture, QA, monitoring/incident and three mandatory postmortems;
- requirement baseline/traceability, root checklist, README and defense guide.

Exclude secrets, real `.env`, `.git`, `node_modules`, coverage/mutation reports unless explicitly selected as
evidence, local build/cache/database volumes and IDE files. Never package real user/payment/contact data.

## Release audit

From a clean checkout of the release candidate:

```bash
git status --short
git ls-files | sort > tracked-files.txt
plantuml -charset UTF-8 -checkonly docs/diagrams/*.puml
docker compose config --quiet
(cd backend && npm ci && npm run lint && npm test -- --runInBand && npm run build)
(cd frontend && npm ci && npm run lint && npm run build)
terraform -chdir=infra/terraform fmt -check
terraform -chdir=infra/terraform init -backend=false
terraform -chdir=infra/terraform validate
```

Resource-heavy load/mutation evidence comes from CI and is linked by commit; do not rerun it on a constrained
submission laptop. Start Compose only for the clean smoke/demo, then stop it.

## Reproducible archive

After approval/tag (example `v2.0-se-delivery`):

```bash
git archive --format=zip --prefix=event-ticketing-platform/ \
  --output=event-ticketing-platform-v2.0-se-delivery.zip v2.0-se-delivery
sha256sum event-ticketing-platform-v2.0-se-delivery.zip \
  > event-ticketing-platform-v2.0-se-delivery.zip.sha256
```

Extract the ZIP into a new directory, compare the manifest, open every PDF/SVG, run the non-heavy audit and
follow README setup without knowledge of the original workspace. Record tag, commit, archive filename, byte
size, SHA-256, auditor/date and any externally stored CI evidence in `ARTIFACT_MANIFEST.md`.

## Freeze and upload

No feature commit is allowed after final audit; a correction creates a new tag/archive/checksum and repeats the
audit. Upload only the verified pair and retain a copy. Open/download the uploaded file once to verify it was
not truncated. Both members sign off requirement/defense ownership before submission.
