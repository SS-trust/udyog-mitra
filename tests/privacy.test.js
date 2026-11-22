import test from 'node:test';
import assert from 'node:assert/strict';
import {resumeApi} from '../src/resumes.js';

function fakeDb(options={}) {
 const candidate=options.candidate??{id:'candidate-1',created_by:'member-1'};
 const resume=options.resume??{r2_key:'private-key'};
 const db={
  statements:[],
  async batch(statements){this.statements.push(...statements);return[]},
  prepare(sql){
   return {
    sql,
    bind(...args){
     return {
      sql,args,
      async first(){
       if(sql.includes('role_permissions'))return{ok:1};
       if(sql.startsWith('SELECT id,created_by FROM candidates'))return candidate;
       if(sql.startsWith('SELECT r2_key FROM candidate_resumes'))return resume;
       return null;
      },
      async run(){return{meta:{changes:1}}}
     };
    }
   };
  }
 };
 return db;
}

test('candidate consent withdrawal anonymizes the profile and deletes its private resume',async()=>{
 const db=fakeDb();let deleted='';
 const env={DB:db,RESUMES:{async delete(key){deleted=key}}};
 const url=new URL('https://example.test/api/candidates/candidate-1/withdraw-consent');
 const response=await resumeApi(new Request(url,{method:'POST'}),env,{id:'member-1'},url);
 assert.equal(response.status,200);
 const payload=await response.json();
 assert.match(payload.message,/anonymized/);
 assert.equal(deleted,'private-key');
 assert.ok(db.statements.some(x=>x.sql.includes("full_name='Withdrawn candidate'")&&x.sql.includes('consent_withdrawn_at')));
 assert.ok(db.statements.some(x=>x.sql.includes('DELETE FROM candidate_resumes')));
 assert.ok(db.statements.some(x=>x.args.includes('candidate.consent.withdrawn')));
});

test('candidate consent withdrawal cannot be performed by a different member',async()=>{
 const db=fakeDb();const env={DB:db,RESUMES:{async delete(){throw new Error('must not delete')}}};
 const url=new URL('https://example.test/api/candidates/candidate-1/withdraw-consent');
 const response=await resumeApi(new Request(url,{method:'POST'}),env,{id:'other-member'},url);
 assert.equal(response.status,403);
 assert.equal(db.statements.length,0);
});
