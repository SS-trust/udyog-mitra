# UdyogMitra UI, workflow and security review

Review date: 22 November 2026  
Repository: SS-trust/udyog-mitra

## Changes made
- Application tracking now offers only state-machine-valid actions for the current application status and actor. Terminal states no longer show invalid controls.
- Added clearer status labels, empty-state guidance and update progress feedback.
- Expanded error-message classification so common failures are not styled as success.
- Membership rejection now requires confirmation and shows progress feedback.
- Added Content-Security-Policy, frame denial, MIME sniffing protection, referrer policy, permissions policy and same-origin resource policy to API responses, session responses, static assets and resume downloads.
- Added atomic hashed-IP throttling for registration, login, activation, first-admin setup and resume uploads.
- Authenticated state-changing requests now require an exact same-origin Origin header; cross-site Fetch Metadata requests are rejected.
- Candidate consent now records a version and timestamp. A withdrawal action anonymizes profile data, deletes the resume object and preserves application history without identifying profile details.
- Replaced raw JSON member listing with server-side searchable, paginated administration table.
- Corrected application status frontend requests to use PATCH, matching the backend route.

## Page-by-page review

### Public landing and authentication
The public page presents UdyogMitra as a closed community network. Sign-in and registration are separate. Registration creates a pending request and login rejects unapproved accounts. There is no self-service password reset; do not expose one until verified email/SMS delivery and token lifecycle controls exist. Activation tokens are admin-issued and must be delivered privately.

### Member workspace and navigation
Authenticated panels remain hidden until the session endpoint confirms the user. Server-side RBAC is authoritative; hiding controls in the browser is not a security boundary. Initial data loading uses Promise.allSettled, so an individual data panel can fail without breaking login, but the current UX can conceal that failure. Add per-panel loading, error and empty states.

### Job search and posting
Search is limited to internal UdyogMitra postings. A server-side limit of 50 keyword searches per user per UTC day is enforced. Job fields are validated server-side. Remaining UX work: explicit loading state, filter reset, clear quota-exhausted message, and ensure incidental data refreshes do not count as deliberate searches.

### Candidates, referrals and applications
Candidate creation requires a consent checkbox. Private candidate operations are scoped to the creator. Application transitions are validated server-side; this review aligned the UI controls with the state machine. Candidate matching endpoints do not return candidate names/contact details. Record consent wording/version and timestamp, and define withdrawal/deletion and retention processes.

### Resume upload and access
Resume storage uses a private R2 bucket. Uploads are limited to 2 MB and PDF/DOCX MIME types with basic file-signature checks. Retrieval is authenticated and restricted to the creator or a job poster with an application for that candidate. PRODUCTION BLOCKER: MIME/signature checks are not malware scanning or document sanitization. Add quarantine and malware scanning before accepting real member resumes.

### Career support and mentoring
Candidate discovery exposes opted-in anonymized attributes rather than names/contact details. Match scores are described as indicative. Mentorship actions are permission-checked and constrained by ownership/status. Add per-panel loading, empty and error states.

### Administration
Membership approvals are permission-gated on the server. Bulk import has preview/commit and a 100-row limit. Activation tokens are random, hashed at rest and time-limited. Suspension revokes sessions and protects privileged accounts from the ordinary suspension route. The member directory currently renders raw JSON rather than a searchable/paginated table; replace this before broad admin onboarding. Add pagination and a deliberate bulk-action summary.

## Security observations and remaining risks

### Addressed
- Added CSP and standard browser security headers to static assets and JSON/API responses.
- Retained HttpOnly, Secure, SameSite=Lax session cookies and server-side hashed session tokens.
- Retained server-side role/permission checks.
- Retained no-store policy for API JSON and resume downloads.

### Required before production
1. Rate limiting: login throttling and job-search quota exist. Add edge/IP-aware rate limiting for registration, activation, resume uploads and sensitive admin endpoints. The current login lock is keyed by identifier; test/tune to reduce account-lockout denial-of-service risk.
2. Resume malware scanning: quarantine and scan files before employers can retrieve them.
3. CSRF testing: test same-site, cross-site, missing-Origin and non-browser requests. SameSite cookies are defense-in-depth, not the only CSRF control.
4. Account recovery/delivery: implement verified email/mobile delivery, password reset, activation delivery, expiry and revocation handling before self-service recovery.
5. Privacy operations: document consent, candidate sharing, retention, deletion and access logging. Confirm consent covers data shared with each employer/referrer.
6. Auditability: add audit events for job updates/closure, candidate consent changes, resume access, application status changes and role changes.
7. Operations: verify D1 backup/restore, R2 lifecycle/backup, error alerting and incident response.
8. Verify CSP in a real browser and confirm headers on HTML, JS, CSS, API and resume responses.

## Required manual staging UAT
- [ ] Desktop/mobile landing, keyboard navigation and visible focus.
- [ ] Registration: valid, duplicate mobile/email, invalid mobile/email, weak password and pending-login message.
- [ ] Admin login, session refresh, logout and access after logout.
- [ ] Approve/reject memberships; approved member can sign in; rejected member cannot.
- [ ] Member role cannot access admin APIs directly.
- [ ] Job create, invalid fields, filters, no results, search quota, close own job and attempt to close another member's job.
- [ ] Candidate creation without consent is rejected; private candidate stays out of discovery.
- [ ] Application submit, poster transitions, submitter withdrawal, invalid transition, duplicate submission and terminal-state display.
- [ ] Resume wrong type, renamed executable, oversized file, unauthorized access, authorized poster access and missing object.
- [ ] Bulk CSV malformed rows, duplicates, existing mobile/email, preview and commit.
- [ ] Activation token valid, expired, reused and private delivery.
- [ ] Career support/mentor ownership, anonymized discovery and impact figures.
- [ ] Verify CSP/security headers in DevTools; inspect console/network for blocked assets and failed API calls.

## Follow-up engineering changes — 22 November 2026

The follow-up changes above are committed on main. The latest automated workflow passed JavaScript syntax, package/Wrangler JSON validation, unit/negative/UI contract tests, fresh SQLite migration integrity and secret scanning. Staging deployment and real-browser validation are still outstanding.

## Verification boundary
GitHub Actions checks validate JavaScript syntax, unit/negative tests, UI contracts and fresh-schema integrity. This source review did not execute a real browser session against the Cloudflare staging Worker or perform an external penetration test. Do not mark the platform production-ready until manual UAT and the remaining security blockers are closed.
