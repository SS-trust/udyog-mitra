# Identity and role reuse from SST Seva

Source design inspected: `lib/rbac-core.ts`, `lib/access-control.ts`, `lib/web-user-auth.ts`, `lib/bulk-user-sheet.ts`, `lib/bulk-users.ts`, and migrations 0010/0026 in `SS-trust/sstseva-web`.

## Adaptation

- Feature-level RBAC: `app_roles`, `app_features`, `role_permissions`, `user_app_roles` with view/create/modify/delete permissions.
- Identity: separate `users` and `web_user_sessions` tables, with approved status mandatory for sessions.
- Approval: users register as pending and an approver or administrator reviews accounts.
- CSV: preview/validation model drawn from SST's bulk user import, with admin-only access. Commit and idempotency safeguards still to implement.
- Audit: log administrative decisions independently in `admin_audit_log`.

## Separation guarantees

Do not query SST's D1 database; do not use Karyakarta login cookies, Karyakarta ID or hierarchical assignment as UdyogMitra authorization. UdyogMitra members can apply for jobs and post jobs. Admin/approver are access permissions, not job marketplace personas.

## Known incomplete items

- No bootstrap admin, user management edit, suspension or bulk import commit yet.
- Resume storage, jobs, referral workflows and candidate management not yet implemented.
- Do not deploy to production until end-to-end security and integration tests pass.
- Configure a NEW D1 database ID in wrangler.jsonc; do not substitute SST Seva's existing D1 ID.
