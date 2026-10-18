# Zero-cost operating policy (October 2026)

Goal: 1,000 approved users and **1,000 total job searches each day** on Cloudflare's Free tier, subject to other activity and any SST Seva resources sharing the same Cloudflare account.

This is a target, **not a guarantee** of zero cost. Never silently upgrade to paid Workers, enable a paid AI API, or attach paid services. Free quotas can change. Any billable account feature needs owner approval.

Verified Cloudflare Free allowances (check current documentation before launch):
- Workers: 100,000 requests/day **across all Workers in the account**; 10ms CPU/request. More than this fails under the Free plan.
- D1: 5,000,000 rows read/day, 100,000 rows written/day, 5GB storage total across the account. Query execution fails when limits are exhausted.
- R2 Standard: 10GB-month storage, 1 million Class A operations/month and 10 million Class B operations/month. R2 overages may be billable if billing is enabled. Do not assume hard stops.
- Avoid paid AI, external SMS/email delivery, Vectorize, paid training APIs, large file/media hosting and background polling.

Search architecture:
- Match on indexed bounded data wherever possible; evaluate D1 rows-read counters on every search, not just request counts.
- Limit output to 100 openings and cap string query length; avoid logging searches as database writes.
- No auto-refresh, no keystroke-triggered search, no repeated matching requests from hidden pages.
- Avoid scanning the full candidate/job table on every action. Consider a D1-compatible full-text/index strategy before the catalog grows.

Storage guardrails:
- Limit resumes to PDF/DOCX; single active resume per candidate, replace old files, cap upload at 2MiB.
- Establish a hard production upload reservation/quota before onboarding; account R2 storage billing is not automatically stopped at the free allowance.
- No public access to stored resumes, no separate thumbnails or AI parsing copies.

Pre-launch checklist:
1. Confirm **Workers Free**, no paid upgrade; check all workloads under the account.
2. Check whether R2 requires a billing method and whether account has any billable entitlements; configure billing alerts, but alerts do not guarantee preventing a bill.
3. Run workload tests representing 1,000 searches/day plus login and application traffic, and measure D1 rows read, CPU time, Worker requests and R2 usage.
4. Set alerts below 50%, 75%, and 90% of quotas where available, and implement application-level quota/circuit breakers where necessary.
5. If user meant **1,000 searches per user/day = 1,000,000/day**, this workload is NOT covered by the Workers Free request quota. Reassess design before promising zero cost.
6. Do not launch until login/password hashing is benchmarked against Workers Free 10ms CPU allowance.

Official references:
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/r2/pricing/
