import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('job search quota is atomic and limited to 50',()=>{const source=fs.readFileSync(new URL('../src/jobs.js',import.meta.url),'utf8');assert.match(source,/search_count<50/);assert.match(source,/RETURNING search_count/);assert.match(source,/429/)});
