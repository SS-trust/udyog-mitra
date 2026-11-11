# UdyogMitra — UAT scenarios and negative test catalogue

## Test data policy
Use synthetic members, companies, jobs, resumes and candidates. Never use actual mobile numbers, personal resumes or real employment data in UAT. Mark test postings clearly and remove them before production.

## Roles
- Member: approved community member; job search/post, candidate and application actions allowed by member feature grants.
- Approver: membership review permissions.
- Administrator: member administration, roles, bulk import and approvals.

## Core UAT journeys
| ID | Journey | Expected result |
|---|---|---|
| UAT-001 | Register a new member | Pending request created; no access before approval |
| UAT-002 | Login while pending | 403; helpful approval message; no session |
| UAT-003 | Approver approves member | Status changes once; member role assigned |
| UAT-004 | Approved member login | Secure HttpOnly session; workspace loads |
| UAT-005 | Search jobs by title/skill | Relevant community jobs ranked; matched terms shown |
| UAT-006 | Filter by city/category/type/fresher | Results satisfy every selected filter |
| UAT-007 | No matching keyword | Empty state and broader-search guidance |
| UAT-008 | Post a job | New opening appears in search and application selector |
| UAT-009 | Close a job | Closed job disappears from open search |
| UAT-010 | Create candidate with consent | Candidate appears only to creating member |
| UAT-011 | Submit candidate referral | Application created once |
| UAT-012 | Poster advances application | Allowed next status recorded |
| UAT-013 | Candidate representative withdraws | Application moves to withdrawn |
| UAT-014 | Upload PDF/DOCX resume | Private upload succeeds within 2 MB |
| UAT-015 | Download resume as owner | File downloaded with no-store headers |
| UAT-016 | Download as relevant job poster | Access only for candidate applied to poster's job |
| UAT-017 | Candidate opts into anonymized discovery | Only anonymized profile fields are listed |
| UAT-018 | Candidate pauses/hides | Removed from discovery and future applications blocked |
| UAT-019 | Volunteer mentor accepts request | Only active mentor can accept an open request |
| UAT-020 | Complete/cancel guidance | Only assigned mentor/requester can perform action |
| UAT-021 | Admin bulk import | Preview first; invalid rows block commit; maximum 100 |
| UAT-022 | Suspend member | Member sessions revoked |
| UAT-023 | Search quota | 50 keyword searches allowed; 51st returns 429; next UTC day resets |
| UAT-024 | Mobile viewport | No horizontal overflow; forms/buttons remain usable |

## Negative and security tests
| ID | Attack / invalid input | Expected result |
|---|---|---|
| NEG-001 | Login with wrong password | Generic invalid credentials; no session |
| NEG-002 | Five failed attempts | Identifier throttled; 429 while locked |
| NEG-003 | Access API without session | 401 |
| NEG-004 | Member calls admin endpoint | 403; no data mutation |
| NEG-005 | Member changes another user's role | 403 |
| NEG-006 | User reads another candidate's private profile | 404/403; no PII leakage |
| NEG-007 | Resume access by unrelated member | 403 |
| NEG-008 | Upload executable/HTML/renamed file | Rejected |
| NEG-009 | Upload file over 2 MB or empty | Rejected |
| NEG-010 | Upload spoofed MIME/signature | Rejected; verify actual parser/scanner in staging |
| NEG-011 | Apply to closed/expired job | 404; no application |
| NEG-012 | Duplicate candidate/job application | 409 |
| NEG-013 | Poster attempts invalid status jump (submitted → hired) | 409 |
| NEG-014 | Submitter attempts mark hired | 409/403 |
| NEG-015 | Reopen terminal application | 409 |
| NEG-016 | Candidate without consent | 400; no record |
| NEG-017 | Duplicate mobile/email registration | 409 |
| NEG-018 | CSV has duplicate/invalid rows | Preview invalid; commit blocked |
| NEG-019 | CSV batch exceeds 100 rows | 400 |
| NEG-020 | Cross-site mutation with foreign Origin | 403 |
| NEG-021 | Search 51 times in a UTC day | 429; counter remains capped at 50 |
| NEG-022 | Invalid category/type/date/experience | Validation error; no malformed row |
| NEG-023 | SQL injection-like text in search | Treated as literal search text; no SQL execution |
| NEG-024 | Stored HTML/script in job title/description | Rendered as text; never executed |
| NEG-025 | Session after suspension/logout/expiry | 401; access denied |
| NEG-026 | Two mentors accept same request | Only one succeeds; other receives 409 |

## UAT sign-off
Record build SHA, test environment, tester, date, test ID, actual result, evidence link and pass/fail. All critical negative tests must pass. Open defects must have severity, owner and target fix date. UAT approval is separate from production approval.

## Known gaps requiring explicit staging verification
- Full browser automation and real responsive-device testing are not yet configured in CI.
- Resume MIME/signature checks are not equivalent to antivirus or content-disarm scanning. Do not expose uploaded files to broad users until scanning/approval policy is implemented.
- PBKDF2 210,000-iteration CPU cost must be measured on the selected Cloudflare Worker plan.
- No formal password-reset, MFA, email notification or activation-email delivery provider is configured.
- Consent withdrawal, candidate data deletion, resume retention and privacy notice need an approved policy.
