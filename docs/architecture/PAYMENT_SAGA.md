# Payment saga
The orchestrator creates a pending attempt and invokes the gateway. Success confirms the
reservation, books seats, generates random ticket tokens/QR hashes, and emits events. Failure,
timeout, or cancellation compensates by changing reservation state and releasing every lock.
Retries use one idempotency key per reservation; uncertain gateway results are reconciled
before compensation to avoid charging without issuing.
