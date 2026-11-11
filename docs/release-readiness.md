# UdyogMitra — release and UAT readiness

## Current scope
- Closed community, approved-member access.
- Community-posted jobs only. External job board APIs are deferred to a separately approved phase.
- Deterministic keyword ranking, related terms, filters and explainable candidate-to-job matching.
- Candidate consent, application/referral lifecycle, private resume storage, mentoring and member administration.

## Implemented release improvements in this review
- Cohesive responsive styling and workspace tabs separating jobs, candidates/referrals, career support and administration.
- Administration navigation is hidden unless server-computed admin/approver permissions allow it; APIs remain authoritative.
- Server-side feature checks added to job/candidate/application and employment-support routes.
- Application lifecycle transition rules reject skipped/invalid transitions and terminal-state reopening.
- UI contract tests check duplicate IDs, missing JavaScript selectors, tab targets, form IDs, hidden authenticated panels and safe external links.
- UAT/negative test catalogue, architecture, deployment, schema, maintenance and KT documentation added.

## Blocking items before customer UAT
- Run the complete CI suite on the final commit and resolve every failure.
- Deploy to an isolated staging Worker with a new UAT D1 and private R2 bucket; do not use production or SST Seva resources.
- Execute browser/device UAT and all critical negative tests in [UAT scenarios](uat-and-negative-tests.md).
- Fix any route-level permission or ownership defect found by UAT.
- Confirm no broken tabs, null DOM selectors, unhandled JS errors, inaccessible form labels or mobile overflow.
- Test Cloudflare Worker CPU for PBKDF2, rate limits and realistic concurrent search.
- Agree on synthetic UAT test-data cleanup and evidence retention.

## Blocking items before production
- Add malware scanning or a documented quarantine/manual-review gate before resume downloads.
- Approve privacy notice, candidate consent withdrawal, data deletion, resume retention and breach response.
- Add password reset and a secure activation invitation delivery process; consider MFA for administrators.
- Add robust IP/device-aware rate limiting and CSRF defense review.
- Add operational alerts, D1/R2 backup/restore drills and incident owner rota.
- Configure production hostname, secrets and resource IDs only after staging approval.
- Obtain product owner, security owner and UAT sign-off.

## Status
This is a development and UAT preparation milestone. Documentation and source changes do not constitute a successful deployment, full browser test, security certification or production approval.
