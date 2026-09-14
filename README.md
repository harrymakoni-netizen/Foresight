# WorkerSafe — Foresight software preview

Private software demonstration for workforce registration, zone assignment, muster, inspection and incident response. Includes the Foresight Command Centre and immutable, explained simulator replay.

## Hosted architecture

- Next.js on Vercel. WorkerSafe is the first screen after sign-in.
- Private Vercel Blob storage for a small preview workspace, with uncached reads and conditional ETag writes. Each successful write atomically retains both records and their before/after audit history; conflicting writes require refresh.
- Owner access-key sign-in, HMAC-signed eight-hour HttpOnly sessions and origin checks. No trusted identity is taken from client-supplied headers.
- `WORKSAFE_ACCESS_KEY`, `WORKSAFE_SESSION_SECRET`, `WORKSAFE_OWNER_NAME`, and `BLOB_READ_WRITE_TOKEN` are server-side environment variables. None belong in Git.
- The sign-in key is in the local, Git-ignored `ACCESS.txt` delivery file. Rotate it and the session secret through Vercel environment settings, then redeploy to revoke old sessions.

## Local development

Use Node 24 or later, run `npm ci`, supply the environment variables above in `.env.local`, then `npm run dev`. `npm run typecheck` and `npm run build` verify the deployment. Browser workflow checks are in `scripts/preview-qa.cjs`; the checked-in local runner uses the development machine's bundled Playwright and Edge.

## Demonstration boundaries

All mine records and risk outputs are simulated. The risk register is provisional and unvalidated, and no hardware is connected. No automatic equipment action, evacuation, restriction or zone clearance exists. The absence of an alert means **no compound risk detected**, never safe.

WorkerSafe records registration, not measured location. New workflow entries do not rewrite or rescore historical engine evidence. The hosted app requires a network connection. Lite notifications remain a software outbox; no SMS, USSD, call or emergency-service message is sent.

This Vercel workspace has separate private records from the existing Sites preview. It is intended for one owner and fictional demonstration data, not a production mine or multi-user deployment. The bounded Blob document is appropriate to this demonstration; migrate to a transactional database before expanding to operational workloads. Records stop accepting changes after 10,000 audit entries rather than silently discarding history.

The Python simulator and professional-review handoff remain in the parent Foresight project. The original Sites preview remains unchanged.
