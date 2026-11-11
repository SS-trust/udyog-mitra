# UdyogMitra — maintenance guide and knowledge-transfer demo

## Daily operations
- Review Worker errors and HTTP 4xx/5xx rates.
- Review failed login throttle trends and unexpected account suspensions.
- Check D1 size, query latency, daily search quota usage and Cloudflare Worker CPU.
- Review job postings nearing their apply-by date and reported/incorrect openings.
- Review mentor requests that remain open and application statuses that need follow-up.
- Check R2 storage growth and reconcile candidate_resumes rows against object keys.

## Weekly operations
- Review administrator audit entries and role assignments.
- Review stale/expired jobs and close them with the poster or moderator.
- Review user-submitted job authenticity reports (moderation workflow is a release enhancement if not present).
- Verify backup completion and restore-test evidence.
- Review dependency and Cloudflare platform advisories.

## Backup and recovery
D1 exports and R2 object backups are separate. Export D1 before every migration. Store exports encrypted in an access-controlled location outside GitHub. Back up private R2 objects and retain object-key metadata. Perform a restore rehearsal before production and after significant schema changes.

## Incident response
1. Record time, environment, Worker deployment SHA and affected endpoint.
2. Contain access: suspend affected member or roll back Worker as appropriate.
3. Preserve relevant audit and platform logs; do not copy passwords, tokens or resumes into tickets.
4. Restore from a verified backup if data integrity is affected.
5. Notify the designated project owner and follow the approved privacy/breach response procedure.
6. Document root cause, impact, remediation and follow-up tests.

## Suggested 20-minute KT demonstration
1. Product purpose and closed-community access model (2 min).
2. Register a synthetic member and show pending approval (3 min).
3. Approve member and sign in (2 min).
4. Post two synthetic jobs; demonstrate keyword ranking, city/category/type/fresher filters (4 min).
5. Add synthetic candidate with consent; show explainable matches (3 min).
6. Submit referral and advance through application states (2 min).
7. Demonstrate private resume permissions with synthetic file (2 min).
8. Show mentor request, administration, audit and deployment topology (2 min).

## Operational ownership to assign before UAT
- Product owner: job categories, referral policy, candidate consent and status definitions.
- Community administrator: membership approval, job moderation, role assignment.
- Cloudflare owner: Worker/D1/R2 resources, secrets, backups, DNS and usage limits.
- Release owner: CI checks, migration sequencing, rollback and UAT sign-off.
- Privacy/security owner: retention, candidate consent, resume scanning and incident handling.
