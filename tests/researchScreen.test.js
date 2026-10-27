import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assessPublicInfo} from '../researchScreen.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const get=id=>places.find(p=>p.id===id);
test('영원이: 12kg 이상 공개자료상 제한; 미만은 입장 확약하지 않음',()=>{
 assert.equal(assessPublicInfo(get('youngwon'),12).state,'restricted');
 assert.equal(assessPublicInfo(get('youngwon'),16).state,'restricted');
 assert.equal(assessPublicInfo(get('youngwon'),11.9).state,'unverified');
});
test('애견카페왕: 충돌하는 체중 조건은 확정 거절로 취급하지 않음',()=>{
 assert.equal(assessPublicInfo(get('wang'),16).state,'caution');
});
test('브릭야드: 20kg 경계 주의, 초과는 공개자료상 제한',()=>{
 assert.equal(assessPublicInfo(get('brick'),20).state,'caution');
 assert.equal(assessPublicInfo(get('brick'),20.1).state,'restricted');
});
test('듀먼카페: 관광 자료는 업체 직접 검증으로 승격하지 않음',()=>{
 assert.equal(assessPublicInfo(get('dumon'),16).state,'unverified');
 assert.equal(get('dumon').policy,null);
});
test('운영 미확인 후보와 잘못된 몸무게는 별도 취급',()=>{
 assert.equal(assessPublicInfo(get('namoo'),16).state,'caution');
 assert.equal(assessPublicInfo(get('dumon'),NaN).state,'unknown');
});
test('무게제한 미확인 업소는 추측으로 제외하지 않음',()=>{
 assert.notEqual(assessPublicInfo(get('mokkodang'),80).state,'restricted');
});
