// SST Seva-inspired authenticated session and RBAC helpers; independent data only.
const encoder=new TextEncoder();
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
export async function sha256(value){return hex(await crypto.subtle.digest('SHA-256',encoder.encode(value)))}
export async function passwordHash(password,salt){const bits=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:210000,hash:'SHA-256'},bits,256))}
export function response(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}})}
export async function currentUser(req,db){const match=(req.headers.get('cookie')||'').match(/(?:^|;\s*)um_session=([^;]+)/);if(!match)return null;const hash=await sha256(match[1]);return await db.prepare("SELECT u.id,u.full_name,u.mobile,u.email,u.status FROM web_user_sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>strftime('%Y-%m-%dT%H:%M:%fZ','now') AND u.status='approved'").bind(hash).first()}
export async function allowed(db,userId,feature,action='view'){const column={view:'can_view',create:'can_create',modify:'can_modify',delete:'can_delete'}[action];if(!column)return false;return !!(await db.prepare(`SELECT 1 FROM user_app_roles ur JOIN app_roles r ON r.id=ur.role_id AND r.active=1 JOIN role_permissions rp ON rp.role_id=r.id WHERE ur.user_id=? AND ur.active=1 AND rp.feature_code=? AND rp.${column}=1 LIMIT 1`).bind(userId,feature).first())}
export function validMobile(x){return /^\d{10}$/.test(String(x||'').replace(/^(?:\+91|91)/,''))} 
