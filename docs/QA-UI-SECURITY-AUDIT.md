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
- Authenticated state-changing requests now require an exact same-origin Origin header; cross-site Fetch Metadata requests are rejected. Admin mutations also have a per-IP rate limit.
- Audit events now cover candidate privacy changes and mentoring request create/accept/complete/cancel actions.
- Candidate consent now records a version and timestamp. A withdrawal action anonymizes profile data, deletes the resume object and preserves application history without identifying profile details.
- Replaced raw JSON member listing with server-side searchable, paginated administration table, including member IDs for activation/role operations.
- Bulk member preview now renders row-level validation feedback and checks duplicate/existing mobile numbers and email addresses before commit.
- Clarified the administrator-issued activation/password-reset token flow in the public UI.
- Corrected application status frontend requests to use PATCH, matching the backend route.

## Page-by-page review

### Public landing and authentication
The public page presents UdyogMitra as a closed community network. Sign-in and registration are separate. Registration creates a pending request and login rejects unapproved accounts. There is no self-service password reset; do not expose one until verified email/SMS delivery and token lifecycle controls exist. Activation tokens are admin-issued and must be delivered privately.

### Member workspace and navigation
Authenticated panels remain hidden until the session endpoint confirms the user. Server-side RBAC is authoritative; hiding controls in the browser is not a security boundary. Initial data loading uses Promise.allSettled, so an individual data panel can fail without breaking login; failures are surfaced in the shared status region. Job, candidate and career-support actions also expose loading and empty states. A more detailed panel-level retry experience remains desirable.

### Job search and posting
Search is limited to internal UdyogMitra postings. A server-side limit of 50 keyword searches per user per UTC day is enforced. Job fields are validated server-side. Search loading feedback and filter reset are implemented. Remaining UX work: make the quota-exhausted state more prominent and ensure incidental data refreshes do not count as deliberate searches.

### Candidates, referrals and applications
Candidate creation requires a consent checkbox. Candidate profile editing and privacy operations are scoped to the creator. Application transitions are validated server-side and the frontend uses the correct PATCH method. Candidate matching endpoints do not return candidate names/contact details. Consent version/time are recorded; withdrawal anonymizes the profile and clears referral/mentoring notes. Define the retention and formal deletion policy.

### Resume upload and access
Resume storage uses a private R2 bucket. Uploads are limited to 2 MB and PDF/DOCX MIME types with basic file-signature checks. Job matching currently uses profile fields; automatic PDF/DOCX text extraction from uploaded resumes is not implemented. Retrieval is authenticated and restricted to the creator or a job poster with an application for that candidate. PRODUCTION BLOCKER: MIME/signature checks are not malware scanning or document sanitization. Add quarantine and malware scanning before accepting real member resumes.

### Career support and mentoring
Candidate discovery exposes opted-in anonymized attributes rather than names/contact details. Match scores are described as indicative. Mentorship actions are permission-checked and constrained by ownership/status. Career-support actions now show loading/error feedback and impact metrics use responsive summary cards.

### Administration
Membership approvals are permission-gated on the server. Bulk import has preview/commit and a 100-row limit. Activation tokens are random, hashed at rest and time-limited. Suspension revokes sessions and protects privileged accounts from the ordinary suspension route. The member directory now supports server-side search and pagination with member IDs. Bulk preview displays row-level validation and checks duplicate/existing mobile and email values.

## Security observations and remaining risks

### Addressed
- Added CSP and standard browser security headers to static assets and JSON/API responses.
- Retained HttpOnly, Secure, SameSite=Lax session cookies and server-side hashed session tokens.
- Retained server-side role/permission checks.
- Retained no-store policy for API JSON and resume downloads.

### Required before production
1. Rate limiting: per-IP limits cover registration, login, activation, bootstrap, resume uploads and admin mutations. Add device-aware controls and tune thresholds. The identifier-based login lock can still be abused for account lockout; monitor and tune it.
2. Resume malware scanning: quarantine and scan files before employers can retrieve them.
3. CSRF testing: test same-site, cross-site, missing-Origin and non-browser requests. SameSite cookies are defense-in-depth, not the only CSRF control.
4. Account recovery/delivery: administrator-issued activation/password-reset tokens are implemented, hashed at rest and time-limited. Verified delivery and self-service recovery remain unavailable until an approved provider is configured.
5. Privacy operations: consent version/time and withdrawal anonymization are implemented. Approve and publish retention, deletion and data-sharing policies; confirm consent covers each employer/referrer.
6. Auditability: audit events now cover job create/update/closure, candidate create/privacy changes, resume access, application status changes, role changes and mentoring lifecycle actions.
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

The follow-up changes above are committed on main. The latest automated workflow passed JavaScript syntax, package/Wrangler JSON validation, unit/negative/UI contract tests, fresh SQLite migration integrity and secret scanning. Added API-level tests for application status actor permissions and candidate consent withdrawal. Staging deployment and real-browser validation are still outstanding.

## Verification boundary
GitHub Actions checks validate JavaScript syntax, unit/negative tests, UI contracts and fresh-schema integrity. This source review did not execute a real browser session against the Cloudflare staging Worker or perform an external penetration test. Do not mark the platform production-ready until manual UAT and the remaining security blockers are closed.
