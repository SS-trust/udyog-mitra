-- Independent UdyogMitra identity: never reference SST Seva databases.
CREATE TABLE users(id TEXT PRIMARY KEY,full_name TEXT NOT NULL,mobile TEXT NOT NULL UNIQUE,email TEXT UNIQUE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','suspended')),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,approved_by TEXT REFERENCES users(id),approved_at TEXT);
CREATE TABLE app_roles(id TEXT PRIMARY KEY,code TEXT NOT NULL UNIQUE,name TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE app_features(code TEXT PRIMARY KEY,description TEXT NOT NULL);
CREATE TABLE role_permissions(role_id TEXT NOT NULL REFERENCES app_roles(id),feature_code TEXT NOT NULL REFERENCES app_features(code),can_view INTEGER NOT NULL DEFAULT 0,can_create INTEGER NOT NULL DEFAULT 0,can_modify INTEGER NOT NULL DEFAULT 0,can_delete INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(role_id,feature_code));
CREATE TABLE user_app_roles(user_id TEXT NOT NULL REFERENCES users(id),role_id TEXT NOT NULL REFERENCES app_roles(id),active INTEGER NOT NULL DEFAULT 1,PRIMARY KEY(user_id,role_id));
CREATE TABLE web_user_sessions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),token_hash TEXT NOT NULL UNIQUE,expires_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX session_user_idx ON web_user_sessions(user_id,expires_at);
CREATE TABLE approval_requests(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),reviewed_by TEXT REFERENCES users(id),status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')),review_note TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT);
CREATE TABLE admin_audit_log(id TEXT PRIMARY KEY,actor_id TEXT NOT NULL,action TEXT NOT NULL,target_id TEXT,details TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE bulk_user_jobs(id TEXT PRIMARY KEY,actor_id TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,status TEXT NOT NULL,summary TEXT NOT NULL);
INSERT INTO app_roles(id,code,name) VALUES('member','member','Member'),('approver','approver','Approver'),('admin','admin','Administrator');
INSERT INTO app_features(code,description) VALUES('jobs','Find and post jobs'),('applications','Applications and referrals'),('users','User management'),('approvals','Membership approvals'),('roles','Role assignment'),('bulk_users','Bulk imports and suspension');
INSERT INTO role_permissions(role_id,feature_code,can_view,can_create,can_modify,can_delete) VALUES
('member','jobs',1,1,1,0),('member','applications',1,1,1,0),
('approver','approvals',1,0,1,0),('admin','users',1,1,1,1),('admin','approvals',1,0,1,0),('admin','roles',1,1,1,1),('admin','bulk_users',1,1,1,0),('admin','jobs',1,1,1,1);
-- Bootstrap first administrator with a controlled one-time CLI procedure, not a public API.
