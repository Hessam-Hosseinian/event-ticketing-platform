# Issue → branch → merge-request workflow

1. Create/refine an issue linked to requirement, epic/story, acceptance and owner/reviewer.
2. Branch from the current authoritative main using the strategy document; keep the scope narrow.
3. Commit coherent increments with accurate author metadata and local light checks.
4. Push topic branch and open a Draft MR/PR early. Fill purpose, requirement links, architecture/data/security
   impact, evidence, screenshots/diagrams, rollback and checklist.
5. CI runs static/test/build/security/artifact gates. Author resolves failures and self-reviews the diff.
6. CODEOWNERS/peer reviews correctness, failure/authorization behavior and evidence; Critical/High findings block.
7. Update branch, rerun gates, obtain approval and merge using repository policy. Record the actual URL/status.
8. Delete/retain branch per strategy, update issue/matrix and create an audited tag only from main.

No local merge, commit message or document is proof that a remote PR/MR or review occurred. URLs are recorded only
after creation and approvals only after an actual reviewer action.
