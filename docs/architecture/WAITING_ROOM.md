# Waiting room
Customers join an event-specific FIFO queue. Capacity-eligible entries receive a signed,
short-lived admission token; others poll their position with jitter. The edge limits joins
and booking endpoints, returning 429 for individual excess and 503 with `Retry-After` during
load shedding. Redis sorted sets and Lua scripts are the production implementation.
