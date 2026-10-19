# UdyogMitra — launch readiness (2026-10-20)

## Implemented in GitHub, independent from SST Seva
- Approved-member-only account login, pending registration, approvals, role administration, audit and suspensions
- Initial controlled admin bootstrap, one-time activation token flow for imported members
- Bulk member preview and atomic commit (maximum 100 rows per batch, quoted CSV supported)
- Jobs, search (up to 50 keyword searches/member/UTC day), posting, closing and category filters
- Candidate profiles with explicit consent, private/network visibility, opt-out and paused application state
- Two-way matching by saved candidate skills, desired roles, location and experience (no paid AI)
- Application/referral tracking, restricted resume PDF/DOCX upload (2MiB) and scoped download
- Mentors, guidance requests, volunteer acceptance, completion and cancellation
- Job search metrics and service-impact summaries
- Free resume outline, interview preparation guidance and link to NCS
- JavaScript syntax and matching checks plus clean database migration CI

## Must finish before opening to actual users
- Provision NEW, independent Cloudflare D1 ID and private R2 bucket, and set Worker bindings. Current wrangler.jsonc deliberately contains a database ID placeholder. No live UdyogMitra deployment has been performed.
- Apply D1 migrations; benchmark PBKDF2 on Cloudflare Free Workers CPU limits, and verify free R2 billing/storage hard limits.
- Full authenticated integration and security tests: login, roles/approvals, session expiry, concurrency, search quota, CSRF handling, admin bootstrap and token redemption.
- Add server-side enforcement of R2 object quota, anti-malware scanning before anyone downloads an uploaded resume, candidate consent deletion/withdrawal policy and retention schedule.
- Set up secure off-platform delivery of activation invitations; no public plaintext token logs or exports.
- Add monitoring and complete browser/mobile layout QA (Kannada translations are not implemented end to end).
- Member-reporting and notification systems are basic; employment outcome counts are member-reported.

## Deployment policy
- Do **not** deploy UdyogMitra using SST Seva D1, R2 or login.
- No paid AI APIs, SMS or analytics services are included.
- Treat GitHub code and tests as a development milestone, **not proof of readiness to collect real resumes**.
- Once Cloudflare resources are created, use staging, run all migration and end-to-end tests, complete release blockers, then seek explicit production approval.
