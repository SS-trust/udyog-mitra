import test from 'node:test';
import assert from 'node:assert/strict';
import {terms,rankJob,searchAndRank} from '../src/job-search.js';

const jobs=[
 {id:'1',title:'Junior Software Developer',skills:'JavaScript React',description:'Build web apps',location:'Bengaluru',company:'DemoSoft',created_at:'2026-01-03'},
 {id:'2',title:'Accountant',skills:'Tally GST bookkeeping',description:'Finance and accounts',location:'Mysuru',company:'Example',created_at:'2026-01-02'},
 {id:'3',title:'Delivery Driver',skills:'License driving',description:'Transport',location:'Davanagere',company:'Example',created_at:'2026-01-04'},
 {id:'4',title:'Primary Teacher',skills:'Classroom education',description:'Teaching',location:'Shivamogga',company:'Example',created_at:'2026-01-05'}
];
test('unrelated job postings are not shown for arbitrary search',()=>assert.deepEqual(searchAndRank(jobs,'astronaut').map(x=>x.id),[]));
test('exact title outranks broad description',()=>assert.equal(searchAndRank(jobs,'developer')[0].id,'1'));
test('synonyms discover relevant roles',()=>assert.equal(searchAndRank(jobs,'programmer')[0].id,'1'));
test('multiple keywords rank the location-matching role',()=>assert.equal(searchAndRank(jobs,'driver davanagere')[0].id,'3'));
test('accounting synonym returns accountant rather than seven static jobs',()=>assert.deepEqual(searchAndRank(jobs,'accounting').map(x=>x.id),['2']));
test('unfiltered catalogue returns all available postings, newest first',()=>assert.deepEqual(searchAndRank(jobs,'').map(x=>x.id),['4','3','1','2']));
test('unicode keyword tokenizer preserves Kannada search tokens',()=>assert.deepEqual(terms('ಕನ್ನಡ job'),['ಕನ್ನಡ','job']));
test('does not match substring in unrelated long token',()=>assert.equal(rankJob(jobs[1],'ant').score,0));

test('location filter excludes otherwise matching jobs in other cities',()=>assert.deepEqual(searchAndRank(jobs,'',100,{location:'Davanagere'}).map(x=>x.id),['3']));
test('category filter respects exact posted category',()=>assert.deepEqual(searchAndRank([{...jobs[0],category:'it'},{...jobs[1],category:'accounting'}],'',100,{category:'accounting'}).map(x=>x.id),['2']));
test('fresher filter excludes vacancies requiring past experience',()=>assert.deepEqual(searchAndRank([{...jobs[0],min_experience:2},{...jobs[1],min_experience:0}],'',100,{fresher:true}).map(x=>x.id),['2']));
test('employment type filter respects full-time and internship jobs',()=>assert.deepEqual(searchAndRank([{...jobs[0],employment_type:'full_time'},{...jobs[1],employment_type:'internship'}],'',100,{type:'internship'}).map(x=>x.id),['2']));
