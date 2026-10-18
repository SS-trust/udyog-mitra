# Employment Support 2.0 — scope and operating costs

Implemented: candidate requirements board (anonymous network listings via opt-in), candidate-to-job and job-to-candidate deterministic matching, mentoring and guidance requests, local/trades/apprenticeship job categories, basic service impact counts, and no-cost resume/interview checklists.

Matching does **not** parse uploaded resumes and does not call an AI service. Candidates must fill in skills, preferred location and desired roles in their profiles. Resume upload displays suggested openings based on those fields. When a poster requests matched candidates, only opted-in candidate skills/qualifications/preferences are shown; contact details and names are withheld until an application is made.

Not implemented by request: Employment Sahayak assignment, automated application reminders, employer partner management, employment camps.

Deferred to keep cost low: AI resume generator and AI mock interviews. Members can use free external tools or request human help. Free skill resources link to National Career Service, rather than duplicating a training catalog.

Impact counts are not proof of externally verified employment outcomes.

Before production: integrate tests for login/approvals and private candidate access; implement opt-in consent withdrawal and privacy retention policies, handle sensitive notes in mentor requests, and run full end-to-end deployment testing. No new AI subscription, model hosting, or vector database is required.
