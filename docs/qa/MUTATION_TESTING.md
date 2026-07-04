# Mutation testing
Run `npx stryker run` from the repository root after installing the Stryker Jest plugins.
Mutation targets reservation/payment services; required score is 80%. Surviving mutations in
TTL, state transitions, partial rollback, or success comparison become mandatory tests.
Generated HTML is retained as CI evidence, not committed.
