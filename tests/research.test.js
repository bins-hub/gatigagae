import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
test('조사 대상 13곳 모두 조사 날짜·원문 출처 기록',()=>{
  assert.equal(places.length,13);
  for(const p of places){
    assert.equal(p.research?.reviewedOn,'2026-10-27');
    assert.ok(p.research?.summary);
    assert.ok(p.research?.address || p.id==='foraday');
    assert.ok(p.research?.sources?.length>=1);
    for(const src of p.research.sources) assert.match(src.url,/^https:\/\//);
  }
});
test('직접 검증 전 자료는 공식 정책으로 승격하지 않는다',()=>{
  for(const p of places) assert.equal(p.policy,null,p.id);
});
test('주의 후보에 사유가 기입된다',()=>{
  for(const id of ['namoo','wang','mokkodang','foraday','brick']){
    const p=places.find(p=>p.id===id);
    assert.ok(p.research.warning.length>25,id);
  }
});
test('영원이 12kg 미만 체중 경계가 정확히 남는다',()=>{
  const x=places.find(p=>p.id==='youngwon').research.weightLimit;
  assert.equal(x.maxKg,12);assert.equal(x.inclusive,false);
});
test('포러데이 상충 주소는 임의 확정하지 않는다',()=>{
  assert.equal(places.find(p=>p.id==='foraday').research.address,null);
});
