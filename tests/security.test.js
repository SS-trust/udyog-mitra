import test from 'node:test';
import assert from 'node:assert/strict';
import {allowed,sha256,currentUser,validMobile} from '../src/security.js';
function dbReturning(value){return {prepare(sql){return {bind(...args){return {async first(){return value},args,sql}}}}}}
test('authorization denies unknown action and defaults to deny',async()=>{assert.equal(await allowed(dbReturning({ok:1}),'u','jobs','owner'),false);assert.equal(await allowed(dbReturning(null),'u','jobs','view'),false)});
test('authorization allows only a matching active grant',async()=>{assert.equal(await allowed(dbReturning({ok:1}),'u','jobs','view'),true)});
test('session resolver rejects missing cookies',async()=>{assert.equal(await currentUser(new Request('https://example.test/api/me'),dbReturning({id:'u'})),null)});
test('session resolver hashes token and accepts only database-approved principal',async()=>{const token='random-session-token',hash=await sha256(token);const db=dbReturning({id:'u',status:'approved'});const req=new Request('https://example.test/api/me',{headers:{cookie:'other=x; um_session='+token}});assert.equal((await currentUser(req,db)).id,'u');assert.equal(hash.length,64)});
test('mobile validation rejects malformed numbers',()=>{assert.equal(validMobile('9876543210'),true);assert.equal(validMobile('+91 9876543210'),true);assert.equal(validMobile('123'),false);assert.equal(validMobile('987654321x'),false)});
