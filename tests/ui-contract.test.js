import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
test('all HTML IDs are unique',()=>{const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);assert.deepEqual([...new Set(duplicates)],[])});
test('every statically selected element exists in HTML',()=>{const refs=[...js.matchAll(/\$\(['"]#([A-Za-z][\w-]*)['"]\)/g)].map(x=>x[1]);const missing=[...new Set(refs)].filter(id=>!ids.includes(id));assert.deepEqual(missing,[])});
test('all workspace tabs target an existing panel',()=>{const panels=new Set([...html.matchAll(/\bid=["']([^"']+)["'][^>]*data-panel/g)].map(x=>x[1]));const targets=[...html.matchAll(/data-tab=["']([^"']+)["']/g)].map(x=>x[1]);assert.ok(targets.length>=3);assert.deepEqual(targets.filter(x=>!panels.has(x)),[])});
test('forms have unique IDs and are accessible by labels',()=>{const forms=[...html.matchAll(/<form\b[^>]*\bid=["']([^"']+)["']/g)].map(x=>x[1]);assert.ok(forms.length>=8);assert.equal(new Set(forms).size,forms.length);assert.ok(!/<input(?![^>]*\b(?:aria-label|id|name)=)[^>]*>/i.test(html))});
test('sensitive member workspace panels start hidden until authenticated',()=>{for(const id of ['dashboard','employmentSupport']){const tag=html.match(new RegExp('<section[^>]*id="'+id+'"[^>]*>'));assert.ok(tag?.[0].includes('hidden'),id)}});
test('external links open safely in a new tab',()=>{for(const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/g))assert.match(m[0],/rel=["'][^"']*noopener[^"']*["']/)});

test('application tracking exposes only workflow-aware status actions',()=>{assert.match(js,/const applicationNext=\{/);assert.match(js,/Application status: /);assert.match(js,/This application is closed/);assert.match(js,/button\.disabled=!select\.value/)});
test('membership rejection is confirmed before the action is sent',()=>{assert.match(js,/status==='rejected'&&!confirm\(/);assert.match(js,/Approving…/);assert.match(js,/Rejecting…/)});

test('application stage updates use PATCH and the frontend supports that method',()=>{assert.match(js,/method:data\?\(method\|\|'POST'\):'GET'/);assert.match(js,/,'PATCH'\)/)});
test('candidate privacy actions and explicit consent copy are present',()=>{assert.match(html,/candidate has authorized this profile/);assert.match(html,/withdrawCandidateConsent/);assert.match(js,/withdraw-consent/)});
test('job search provides loading feedback and a clear-filters action',()=>{assert.match(html,/id="clearJobFilters"/);assert.match(js,/Searching community openings/);assert.match(js,/clearJobFilters/)});
test('member directory is rendered as a searchable table, not raw JSON',()=>{assert.match(js,/member-table/);assert.match(js,/Search member directory/);assert.doesNotMatch(js,/JSON\.stringify\(await api\(path\),null,2\)/)});

test('member directory supports server-side search and pagination',()=>{assert.match(js,/api\('\/api\/admin\/users\?'\+params\)/);assert.match(js,/Showing .* of .* members/);assert.match(js,/previous\.disabled=page<=1/)});
test('approval-only users do not see administrator-only cards',()=>{assert.match(js,/card\.hidden=card\.classList\.contains\('admin-approvals'\)/)});

test('bulk onboarding shows a validated table and explicit import progress',()=>{assert.match(js,/function renderBulkPreview/);assert.match(js,/CSV row/);assert.match(js,/Validating…/);assert.match(js,/Importing…/)});
test('member workspace exposes failed panel loads and candidate empty states',()=>{assert.match(js,/Job openings could not be loaded/);assert.match(js,/No candidates yet/)});

test('bulk preview and commit use structured feedback rather than raw JSON',()=>{assert.match(js,/renderBulkPreview/);assert.match(js,/CSV validation passed/);assert.match(js,/member accounts created/);assert.doesNotMatch(js,/bulkResult'\)\.textContent=JSON\.stringify/)});
test('admin directory exposes member IDs for account operations',()=>{assert.match(js,/Member ID/);assert.match(js,/u\.id,u\.full_name/)});
test('password recovery is clearly described as administrator-issued token flow',()=>{assert.match(html,/password-reset token/);assert.match(html,/activation or password-reset token/)});

test('job owner editing uses PATCH and supports cancelling edit mode',()=>{assert.match(js,/Edit opening/);assert.match(js,/dataset\.editId/);assert.match(js,/api\(editId\?path/);assert.match(html,/id="cancelJobEdit"/)});

test('candidate directory supports owner profile editing and cancel',()=>{assert.match(html,/id="candidateList"/);assert.match(html,/id="cancelCandidateEdit"/);assert.match(js,/Edit profile/);assert.match(js,/candidate\.consent_withdrawn_at/)});
