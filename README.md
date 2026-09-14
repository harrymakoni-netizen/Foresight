# WorkerSafe — Foresight software preview

Public software demonstration for workforce registration, zone assignment, muster, inspection and incident response. Includes the Foresight Command Centre and immutable, explained simulator replay.

## Hosted architecture

- Public Next.js software demonstration on Vercel. WorkerSafe opens directly without a sign-in or key.
- Anyone with the link can view and edit the shared fictional demo records. Never enter real worker, contact or incident information.
- Records remain in server-side Vercel Blob storage with uncached reads and conditional ETag writes. Every successful change retains its before/after audit history; conflicts require refresh.
- New audit entries are attributed to "Public demo visitor (unverified)". This is not proof of a person's identity.
- `BLOB_READ_WRITE_TOKEN` is a server-side deployment secret and must never be exposed to clients or Git.

## Local development

Use Node 24 or later, run `npm ci`, supply the storage environment variable above in `.env.local`, then `npm run dev`. `npm run typecheck` and `npm run build` verify the deployment. Browser workflow checks are in `scripts/preview-qa.cjs`; the checked-in local runner uses the development machine's bundled Playwright and Edge.

## Demonstration boundaries

All mine records and risk outputs are simulated. The risk register is provisional and unvalidated, and no hardware is connected. No automatic equipment action, evacuation, restriction or zone clearance exists. The absence of an alert means **no compound risk detected**, never safe.

WorkerSafe records registration, not measured location. New workflow entries do not rewrite or rescore historical engine evidence. The hosted app requires a network connection. Lite notifications remain a software outbox; no SMS, USSD, call or emergency-service message is sent.

This Vercel workspace has separate records from the existing Sites preview. It is intended for shared fictional demonstration data, not a production mine or multi-user deployment. The bounded Blob document is appropriate to this demonstration; migrate to a transactional database before expanding to operational workloads. Records stop accepting changes after 10,000 audit entries rather than silently discarding history.

The Python simulator and professional-review handoff remain in the parent Foresight project. The original Sites preview remains unchanged.
