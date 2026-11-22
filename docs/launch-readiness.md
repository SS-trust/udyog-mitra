# UdyogMitra — launch readiness (updated 2026-11-22)

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
- Deploy the latest main commit to the existing staging Worker; migration `0008_rate_limits_and_consent.sql` must be applied by the deployment workflow.
- Benchmark PBKDF2 on Cloudflare Workers CPU limits and verify R2 billing/storage limits. Staging Worker and separate D1/R2 resources are provisioned; production hostname mapping remains a later step.
- Full authenticated integration and security tests: login, roles/approvals, session expiry, concurrency, search quota, CSRF handling, admin bootstrap and token redemption.
- Add a hard R2 object quota and malware scanning/quarantine before resume downloads. Candidate consent version, timestamp and withdrawal anonymization are implemented; approve retention and deletion policy.
- Activation/reset tokens are administrator-issued, time-limited and hashed at rest; secure private delivery remains an operational manual step until a verified delivery provider is approved.
- Add monitoring and complete browser/mobile layout QA (Kannada translations are not implemented end to end).
- Member-reporting and notification systems are basic; employment outcome counts are member-reported.

## Deployment policy
- Do **not** deploy UdyogMitra using SST Seva D1, R2 or login.
- No paid AI APIs, SMS or analytics services are included.
- Treat GitHub code and tests as a development milestone, **not proof of readiness to collect real resumes**.
- Staging resources exist and the first superadmin has logged in. Deploy the current main branch, complete all migration and end-to-end tests, close release blockers, then seek explicit production approval.
