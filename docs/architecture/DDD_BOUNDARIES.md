# DDD boundaries
Identity owns credentials and roles; Catalog owns descriptive event/venue data; Reservation
owns sellable inventory and live availability; Billing owns payment attempts; Ticketing owns
admission credentials; Notification owns delivery; Waiting Room owns admission fairness.
Catalog never owns locks: doing so couples read-heavy discovery to consistency-critical
inventory. Dependencies point through application interfaces and domain events, preventing
Catalog↔Reservation cycles.
