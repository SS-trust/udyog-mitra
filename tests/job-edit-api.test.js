import test from 'node:test';
import assert from 'node:assert/strict';
import {jobsApi} from '../src/jobs.js';

function fakeDb(owner='member-1') {
 const calls=[];
 const db={
  calls,
  prepare(sql){
   return {
    sql,
    bind(...args){
     return {
      sql,args,
      async first(){
       if(sql.includes('role_permissions')&&sql.includes('can_modify=1'))return{ok:1};if(sql.includes('role_permissions')&&sql.includes('can_delete=1'))return null;
       if(sql.startsWith('SELECT poster_id FROM jobs'))return{poster_id:owner};
       return null;
      },
      async run(){calls.push({sql,args});return{meta:{changes:1}}}
     };
    }
   };
  }
 };
 return db;
}
const job={title:'Engineer',company:'Community Co',location:'Bengaluru',description:'Role details',skills:'JavaScript',employment_type:'full_time',min_experience:1,max_experience:3,salary_text:'Competitive',source_type:'referral',apply_by:'2026-12-15',category:'it'};
async function patch(db,user,payload=job){
 const url=new URL('https://example.test/api/jobs/job-1');
 const req=new Request(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 return jobsApi(req,db,user,url);
}

test('job owner can edit an opening and the change is audited',async()=>{
 const db=fakeDb();const response=await patch(db,{id:'member-1'});
 assert.equal(response.status,200);
 assert.ok(db.calls.some(x=>x.sql.startsWith('UPDATE jobs SET')));
 assert.ok(db.calls.some(x=>x.sql.includes('admin_audit_log')));
});

test('another member cannot edit an opening',async()=>{
 const db=fakeDb('owner-2');const response=await patch(db,{id:'member-1'});
 assert.equal(response.status,403);
 assert.equal(db.calls.length,0);
});

test('job edit validates the complete payload before writing',async()=>{
 const db=fakeDb();const response=await patch(db,{id:'member-1'},{...job,title:''});
 assert.equal(response.status,400);
 assert.equal(db.calls.length,0);
});
