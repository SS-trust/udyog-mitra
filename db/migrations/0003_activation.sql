CREATE TABLE account_activation_tokens(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),token_hash TEXT NOT NULL UNIQUE,expires_at TEXT NOT NULL,used_at TEXT,issued_by TEXT NOT NULL REFERENCES users(id),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX activation_user_idx ON account_activation_tokens(user_id,expires_at);
