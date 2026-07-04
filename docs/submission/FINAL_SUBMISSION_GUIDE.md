# Final submission
From the parent directory run:
`git archive --format=zip --output=event-ticketing-platform-v1.0.zip v1.0-final-submission`.
The archive contains source, lockfiles, docs, diagrams, examples, CI and infrastructure, but
not `.env`, `node_modules`, build output, credentials, or database volumes. Before upload,
extract into a clean directory, run both builds/tests and `docker compose config`.
