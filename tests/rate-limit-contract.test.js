import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const worker=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');

test('sensitive public endpoints have per-IP rate-limit policies',()=>{
 for(const scope of ['registration','login-ip','activation','first-admin-setup','resume-upload','job-create','candidate-create','application-submit','mentorship-create','admin-mutations'])assert.ok(worker.includes("'"+scope+"'"),scope);
});
test('authenticated mutations require a same-origin Origin header',()=>{
 assert.match(worker,/cookieSession&&origin!==url\.origin/);
 assert.match(worker,/Sec-Fetch-Site.*cross-site/);
});

test('request payload sizes are bounded before JSON or multipart parsing',()=>{
 assert.match(worker,/length>3\*1024\*1024/);
 assert.match(worker,/length>1024\*1024/);
});
