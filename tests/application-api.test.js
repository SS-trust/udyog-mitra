import test from 'node:test';
import assert from 'node:assert/strict';
import {jobsApi} from '../src/jobs.js';

function dbForApplication(row){
 const calls=[];
 return {calls,prepare(sql){return{sql,bind(...args){return{sql,args,async first(){if(sql.includes('role_permissions'))return{ok:1};if(sql.startsWith('SELECT a.submitted_by'))return row;return null},async run(){calls.push({sql,args});return{meta:{changes:1}}}}}}}};
}
async function update(db,user,status){
 const url=new URL('https://example.test/api/applications/app-1/status');
 const req=new Request(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
 return jobsApi(req,db,user,url);
}

test('poster can advance an application using the PATCH endpoint',async()=>{
 const db=dbForApplication({submitted_by:'member-1',poster_id:'poster-1',status:'submitted'});
 const response=await update(db,{id:'poster-1'},'acknowledged');
 assert.equal(response.status,200);
 assert.ok(db.calls.some(x=>x.sql.startsWith('UPDATE applications SET status')));
 assert.ok(db.calls.some(x=>x.sql.includes('admin_audit_log')));
});

test('poster cannot withdraw an application and invalid transitions do not write',async()=>{
 const db=dbForApplication({submitted_by:'member-1',poster_id:'poster-1',status:'submitted'});
 const response=await update(db,{id:'poster-1'},'withdrawn');
 assert.equal(response.status,409);
 assert.equal(db.calls.length,0);
});

test('submitter can withdraw but cannot mark an application hired',async()=>{
 const row={submitted_by:'member-1',poster_id:'poster-1',status:'submitted'};
 const db=dbForApplication(row);
 const response=await update(db,{id:'member-1'},'withdrawn');
 assert.equal(response.status,200);
 const second=dbForApplication(row);
 const denied=await update(second,{id:'member-1'},'hired');
 assert.equal(denied.status,409);
 assert.equal(second.calls.length,0);
});
