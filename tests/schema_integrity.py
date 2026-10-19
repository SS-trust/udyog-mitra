"""Check that UdyogMitra schema provisions from scratch and never references SST DB."""
from pathlib import Path
import sqlite3

root=Path(__file__).resolve().parents[1]
files=sorted((root/"db/migrations").glob("*.sql"))
assert len(files)>=7, f"Missing migrations: {len(files)}"
db=sqlite3.connect(":memory:")
db.execute("PRAGMA foreign_keys=ON")
for f in files:
    text=f.read_text()
    assert "sstseva-" not in text.lower(), f"Cross-product database link: {f}"
    try:
        db.executescript(text)
    except Exception as exc:
        raise AssertionError(f"Migration {f.name} failed: {exc}") from exc
required=["users","app_roles","app_features","role_permissions","user_app_roles","web_user_sessions","approval_requests","jobs","candidates","applications","mentorship_requests","mentor_profiles","candidate_resumes","daily_search_usage","login_throttle","account_activation_tokens"]
existing={r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
assert set(required)<=existing,sorted(set(required)-existing)
for role in ["member","approver","admin"]:
    assert db.execute("SELECT 1 FROM app_roles WHERE code=?",(role,)).fetchone(),role
for feature in ["jobs","applications","approvals","users","roles"]:
    assert db.execute("SELECT 1 FROM app_features WHERE code=?",(feature,)).fetchone(),feature
print(f"PASS: {len(files)} independent migrations; {len(required)} critical tables; roles & permissions seeded")
