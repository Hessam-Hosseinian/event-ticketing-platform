# Canary deployment
Deploy 5% traffic, verify errors/latency/checkout invariants for 15 minutes, then progress
25%→50%→100%. Abort automatically if 5xx rises 1%, p95 degrades 20%, or booking invariant
alerts fire. Database changes are expand/migrate/contract and remain backward compatible.
