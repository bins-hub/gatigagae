import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCorrectionDraft} from '../correctionDraft.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const valid={id:'dumon',field:'hours',value:'추가 확인 필요',sourceUrl:'https://example.com/evidence',observedOn:'2026-10-27'};
test('Corrections are drafts requiring approval and never official policies',()=>{
 const d=makeCorrectionDraft(places,valid);
 assert.equal(d.status,'pending_review');assert.equal(d.publicPolicyUnchanged,true);
 assert.equal(d.requiresOperatorApproval,true);assert.equal(d.change.section,'research');
 assert.equal(places.find(p=>p.id==='dumon').policy,null);
});
test('Unsupported official policy fields are blocked from proposals',()=>{
 assert.throws(()=>makeCorrectionDraft(places,{...valid,field:'policy'}),/not editable/);
 assert.throws(()=>makeCorrectionDraft(places,{...valid,field:'verifiedOn'}),/not editable/);
});
test('Invalid or unsupported sources and unknown venues are rejected',()=>{
 assert.throws(()=>makeCorrectionDraft(places,{...valid,sourceUrl:'http://example.org'}),/HTTPS/);
 assert.throws(()=>makeCorrectionDraft(places,{...valid,id:'missing'}),/Unknown/);
});
test('Blank evidence values and malformed dates are not accepted',()=>{
 assert.throws(()=>makeCorrectionDraft(places,{...valid,value:'  '}),/empty/);
 assert.throws(()=>makeCorrectionDraft(places,{...valid,observedOn:'tomorrow'}),/date/);
});
test('Public place records are never changed by draft creation',()=>{
 const before=JSON.stringify(places);makeCorrectionDraft(places,valid);assert.equal(JSON.stringify(places),before);
});
