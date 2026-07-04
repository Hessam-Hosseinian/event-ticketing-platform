# Load testing
Run `k6 run tests/load/k6-booking-test.js` with `BASE_URL` if needed. The baseline ramps to
100 virtual users; the defense version targets thousands in a controlled environment and
contends on the same seat. Gates: p95 below 500 ms, errors below 2%, and exactly one confirmed
reservation per event/seat. Observe Redis failures, queue depth, DB latency, and CPU.
