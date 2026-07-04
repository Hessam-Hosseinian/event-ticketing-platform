# Service boundaries
Synchronous calls are used when the caller needs an immediate answer: authentication,
availability, lock acquisition, and payment initiation. Asynchronous events are used for
notifications, analytics, and downstream ticket delivery. Modules can later become services;
their contracts remain REST commands and versioned integration events.
