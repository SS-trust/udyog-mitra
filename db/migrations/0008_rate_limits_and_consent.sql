-- Operational rate limits and explicit candidate consent lifecycle metadata.
CREATE TABLE request_rate_limits(
  scope TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(scope,key_hash)
);
CREATE INDEX request_rate_limits_updated_idx ON request_rate_limits(updated_at);
ALTER TABLE candidates ADD COLUMN consent_version TEXT NOT NULL DEFAULT 'legacy-unversioned';
ALTER TABLE candidates ADD COLUMN consented_at TEXT;
ALTER TABLE candidates ADD COLUMN consent_withdrawn_at TEXT;
UPDATE candidates SET consented_at=created_at WHERE consented_at IS NULL;
