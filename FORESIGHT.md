# Foresight software preview

Public shared simulator workspace; no sign-in required. No hardware or telecom integration.

- Command Centre and zone evidence: immutable Python engine replay, five development experiments, current and retained peak evidence, unknowns, interactions, register hash and full JSON export.
- WorkerSafe: durable registration, zone moves, checkout, named muster confirmation with a server-generated roster snapshot.
- Inspections: append-only completion/finding/deferral records with original due dates.
- MineShield: incident records and response updates, affected people, category, chronological before/after audit, downloadable report.
- Lite: fictional buddy check-in, expected return, 30-minute demo grace, checkout and a simulated notification outbox. No SMS, USSD or emergency call is sent.
- Writes use an explicitly unverified public demo actor, zone validation, concurrency checks and an atomic audit entry. Anyone can view and edit the shared demo records.

Workflow records are separate from historical risk replay. No workflow entry rescores old evidence, clears a zone or issues an automatic equipment command. The hosted preview requires connectivity; it does not claim offline synchronization. Local offline simulation remains in the parent Python project. Do not enter real workforce or contact information in this demonstration.

The factor register remains professionally unreviewed. The reported simulator scenarios were used during tuning and are not holdout or field validation. The full-input retrospective rainfall experiment produced two unmatched alerts; operational-only experiments must not be generalized to field performance.

## Development

Use the Next.js scripts described in README.md. Vercel records and audit history are persisted together in a private Blob document using conditional ETag writes. Generated replay data comes from the parent project's `scripts/export_preview.py`, which reads evaluated assessments, never private injected truth. Browser workflow checks are in `scripts/preview-qa.cjs` and require Playwright and Edge in the local development environment.

## Delivery limits

This is the requested software demonstration, not a completed production mine deployment. Multi-user workforce permissions, retention policy approved for real personal data, cloud/edge synchronization, external telecom delivery, professional register review and supervised acceptance remain separate release work. QR/NFC identity capture and future learned or conversational layers are not represented as implemented.
