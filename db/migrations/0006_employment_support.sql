-- UdyogMitra 2.0: consent-aware candidate discovery, human mentoring and impact.
ALTER TABLE candidates ADD COLUMN visibility TEXT NOT NULL DEFAULT 'private' CHECK(visibility IN ('private','network'));
ALTER TABLE candidates ADD COLUMN job_status TEXT NOT NULL DEFAULT 'seeking' CHECK(job_status IN ('seeking','employed','paused'));
ALTER TABLE candidates ADD COLUMN desired_roles TEXT NOT NULL DEFAULT '';
CREATE INDEX idx_candidates_discovery ON candidates(visibility,job_status);
ALTER TABLE jobs ADD COLUMN category TEXT NOT NULL DEFAULT 'general';
CREATE TABLE mentorship_requests(id TEXT PRIMARY KEY,candidate_id TEXT NOT NULL REFERENCES candidates(id),requested_by TEXT NOT NULL REFERENCES users(id),area TEXT NOT NULL CHECK(area IN ('resume_review','career_guidance','interview_practice')),note TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','accepted','completed','cancelled')),mentor_id TEXT REFERENCES users(id),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_mentor_open ON mentorship_requests(status,area);
CREATE TABLE mentor_profiles(user_id TEXT PRIMARY KEY REFERENCES users(id),areas TEXT NOT NULL DEFAULT '',bio TEXT NOT NULL DEFAULT '',active INTEGER NOT NULL DEFAULT 1);
