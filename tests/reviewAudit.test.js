import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditPlaces,auditCsv} from '../reviewAudit.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
test('All 13 places are in prioritized verification audit',()=>{
 const items=auditPlaces(places,{asOf:'2026-10-27'});
 assert.equal(items.length,places.length);
 assert.equal(items.filter(x=>x.verified).length,0);
 assert.equal(new Set(items.map(x=>x.id)).size,places.length);
});
test('Conflicting address is urgent and operational identity warning remains urgent',()=>{
 const items=auditPlaces(places,{asOf:'2026-10-27'});
 assert.equal(items.find(x=>x.id==='foraday').priority,'긴급');
 assert.equal(items.find(x=>x.id==='namoo').priority,'긴급');
});
test('More than 90 days old becomes high priority even without conflicts',()=>{
 const items=auditPlaces(places,{asOf:'2027-02-10'});
 assert.ok(items.find(x=>x.id==='happymer').reasons.some(r=>r.includes('90일')));
 assert.equal(items.find(x=>x.id==='happymer').priority,'높음');
});
test('Audit CSV is spreadsheet-ready and protects leading formula strings',()=>{
 const output=auditCsv(auditPlaces(places,{asOf:'2026-10-27'}));
 assert.equal(output.split('\r\n').filter(Boolean).length,places.length+1);
 assert.ok(output.includes('foraday'));
 assert.ok(output.includes('공개자료 상충'));
});
test('Future public source review date stays an issue rather than fresh policy',()=>{
 const items=auditPlaces(places,{asOf:'2026-01-01'});
 assert.ok(items.every(x=>x.reasons.some(t=>t.includes('미래 날짜'))));
});
