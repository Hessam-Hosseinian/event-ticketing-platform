# Commit and authorship policy

Use Conventional Commits: `type(optional-scope): imperative outcome`. Allowed types are `feat`, `fix`, `docs`,
`test`, `refactor`, `perf`, `build`, `ci`, `chore` and `revert`. A commit is one reviewable concern and includes
its directly affected tests/docs. Do not use a vague “final changes” commit.

Examples for this project: UML models; architecture/traceability; product/risk; Agile; QA; operations;
postmortems; team/submission; actual MR evidence. Hessam authors backend/architecture/DevOps artifacts; Pourya
authors frontend/product/Agile/QA artifacts; shared work still names one actual accountable producer and records
the other member's review in the PR.

Before commit: inspect `git diff`, stage explicit paths, run `git diff --cached --check`, ensure no secret/generated
cache, and run the smallest relevant verification. Commit author metadata represents the person accountable for
producing the work; never rewrite another person's authorship merely to make a contribution graph look balanced.
Do not sign off or fabricate Co-authored-by/review trailers without that person's participation.
