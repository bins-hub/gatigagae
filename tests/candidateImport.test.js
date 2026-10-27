import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stagePlaceCandidates} from '../candidateImport.js';
const existing=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const sample={id:'example-new',name:'가상 테스트 장소',region:'남양주',category:'카페',discoveryUrl:'https://example.org/research',discoveredOn:'2026-10-27'};
test('A sourced new candidate remains manually reviewed, never publishable',()=>{
 const result=stagePlaceCandidates(existing,[sample]);
 assert.equal(result.total,1);assert.equal(result.readyForManualReview,1);
 assert.equal(result.automaticallyPublishable,0);
 assert.equal(result.staged[0].status,'pending_manual_research');
 assert.equal(result.staged[0].policyVerified,false);
});
test('Duplicate IDs and equivalent area/venue names are reported',()=>{
 const duplicated=stagePlaceCandidates(existing,[{...sample,id:existing[0].id},sample,{...sample,id:'other-name',name:'가상   테스트장소'}]);
 assert.ok(duplicated.errors[0].issues.some(x=>x.includes('ID 중복')));
 assert.ok(duplicated.errors[1].issues.some(x=>x.includes('상호 후보 중복')));
 assert.ok(duplicated.errors[2].issues.some(x=>x.includes('상호 후보 중복')));
});
test('Unconfirmed new regions must not be silently published',()=>{
 const c=stagePlaceCandidates(existing,[{...sample,region:'수원'}]);
 assert.ok(c.errors[0].issues.some(x=>x.includes('새 지역')));
 assert.equal(c.automaticallyPublishable,0);
});
test('Invalid research source, date, missing name and malformed IDs produce review issues',()=>{
 const c=stagePlaceCandidates(existing,[{...sample,discoveryUrl:'http://not-secure',discoveredOn:'2026-10-98',name:'',id:'../foo'}]);
 assert.ok(c.errors[0].issues.length>=4);
});
test('Staging never mutates existing places',()=>{
 const snapshot=JSON.stringify(existing);stagePlaceCandidates(existing,[sample]);assert.equal(JSON.stringify(existing),snapshot);
});
