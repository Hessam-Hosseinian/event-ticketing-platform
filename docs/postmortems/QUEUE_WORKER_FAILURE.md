# Queue worker failure
Summary: malformed notification caused worker crash-loop. Timeline: 14:10 backlog alert,
14:16 payload isolated, 14:23 DLQ routing deployed, 14:40 drained. Impact: 1,800 messages
delayed; purchases unaffected. Root cause: missing schema validation. Detection: queue depth
and pod restarts. Resolution: quarantine poison message and scale fixed workers. Prevention:
schema versioning, per-message rejection, DLQ alarms. Lesson: one payload must not block a queue.
