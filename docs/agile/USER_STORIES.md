# User stories
- As a customer, I want a seat locked for ten minutes so that I can pay safely. Acceptance:
  given an available seat, one lock succeeds; a concurrent lock fails; expiry releases it.
- As a customer, I want failure to release seats so that inventory is not stranded.
  Acceptance: failed/timeout payment ends the reservation and makes all seats available.
- As an organizer, I want to configure venues/events/prices so that I can sell inventory.
  Acceptance: authorized users create layouts and publish searchable events.
- As a customer, I want a verifiable ticket so that venue admission is trustworthy.
  Acceptance: success creates a unique token and verification rejects unknown tokens.
- As an operator, I want a waiting room so that flash traffic cannot overwhelm checkout.
  Acceptance: position/admission are visible and excess requests receive 429/503.
