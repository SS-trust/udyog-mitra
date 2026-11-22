import test from 'node:test';
import assert from 'node:assert/strict';
import {jobsApi} from '../src/jobs.js';

function fakeDb(owner='member-1'){
 const calls=[];
 return {calls,prepare(sql){return{sql,bind(...args){return{sql,args,async first(){if(sql.includes('role_permissions'))return{ok:1};if(sql.startsWith('SELECT id,created_by FROM candidates'))return{id:'candidate-1',created_by:owner};return null},async run(){calls.push({sql,args});return{meta:{changes:1}}}}}}};
}
const profile={full_name:'Candidate Name',mobile:'9876543210',email:'candidate@example.com',qualification:'Graduate',skills:'Excel, SQL',experience_years:2,preferred_location:'Bengaluru'};
async function patch(db,user,payload=profile){const url=new URL('https://example.test/api/candidates/candidate-1');return jobsApi(new Request(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),db,user,url)}

test('candidate owner can update profile details and the change is audited',async()=>{
 const db=fakeDb();const response=await patch(db,{id:'member-1'});
 assert.equal(response.status,200);
 assert.ok(db.calls.some(x=>x.sql.startsWith('UPDATE candidates SET')));
 assert.ok(db.calls.some(x=>x.sql.includes('admin_audit_log')));
});

test('another member cannot edit a candidate profile',async()=>{
 const db=fakeDb('owner-2');const response=await patch(db,{id:'member-1'});
 assert.equal(response.status,403);
 assert.equal(db.calls.length,0);
});

test('candidate edit validates mobile and email before writing',async()=>{
 const db=fakeDb();const response=await patch(db,{id:'member-1'},{...profile,mobile:'bad'});
 assert.equal(response.status,400);
 assert.equal(db.calls.length,0);
});
