# Network partition
Summary: application pods lost Redis connectivity. Timeline: 19:01 lock errors, 19:03 booking
failed closed, 19:11 routing restored, 19:25 reconciliation finished. Impact: checkout paused
for ten minutes; no oversells. Root cause: faulty network policy rollout. Detection: lock
errors and synthetic booking. Resolution: rollback policy and verify DB/Redis states.
Prevention: canary policies, multi-zone Redis, chaos test. Lesson: availability may be
sacrificed temporarily to preserve inventory correctness.
