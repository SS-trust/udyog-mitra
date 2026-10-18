# UdyogMitra

Closed-community employment and referral portal. Source lives directly in this repository.

## Independence from SST Seva
This application reuses SST Seva's patterns for user roles, permissions, sessions, approvals and bulk administration, but has its **own** users, D1 database, R2 storage and sessions. It does not access SST Seva production users or database.

## Features implemented in source
- Self-registration with pending approval, approved-only login, first-admin bootstrap
- Role-based feature permissions, administrator/approver assignment, admin suspension
- Admin bulk member preview and atomic creation (up to 100 per commit)
- Member activation using private one-day tokens for imported accounts
- Job listing, search, posting and closing
- Candidate profiles, assisted applications and referral status APIs
- Private R2 PDF/DOCX resume upload and restricted retrieval
- Responsive web dashboard and registration/administration screens

## First deployment — separate Cloudflare resources
1. `npm install`
2. `npx wrangler d1 create udyog-mitra-db` — **create a NEW database, not SST Seva's D1**.
3. Put its new ID in `wrangler.jsonc` replacing the placeholder.
4. `npx wrangler r2 bucket create udyog-mitra-resumes` — leave public access **disabled**.
5. `npm run db:local` and `npm run dev` for local development.
6. For remote setup, `npm run db:remote` and `npm run deploy`.
7. For the first admin, set a long one-time secret with `npx wrangler secret put FIRST_ADMIN_SETUP_KEY`. POST `/api/setup/first-admin` with `setup_key`, `full_name`, `mobile` and a password of at least 16 characters. Then **immediately delete** the secret with `npx wrangler secret delete FIRST_ADMIN_SETUP_KEY`.
8. Assign the approver role from the admin dashboard. All self-registrations start pending.
9. For CSV-imported accounts, issue private activation tokens from the admin dashboard; imported users set their own passwords.

## Important production gaps
Cloudflare resources are not yet created, and deployment has not been performed. End-to-end browser, authorization and integration testing remain necessary. Add rate limiting, CSRF hardening, secure delivery of activation tokens, resume malware scanning, candidate consent withdrawal and retention policies, and complete production-grade notifications and application workflow testing before inviting real candidates. The CSV uploader supports quoted fields and is limited to 100 users per batch.

Do not store production secrets or personal resumes in this Git repository.

See `docs/identity-reuse.md` and the SQL migrations for technical details.
