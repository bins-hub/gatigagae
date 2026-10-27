import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {interpretPlaceQuery,queryMatchesPlace} from '../searchQuery.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const matched=q=>places.filter(p=>queryMatchesPlace(p,q));
test('Natural Korean phrase finds only existing Namyangju cafe leads',()=>{
 const results=matched('남양주 애견동반 카페');
 assert.equal(results.length,6);
 assert.ok(results.every(x=>x.region==='남양주'&&x.category==='카페'));
});
test('Nearby variants such as Yangpyeong pet cafe and Hanam dog cafe remain understood',()=>{
 assert.equal(matched('양평 강아지 동반 카페').length,4);
 assert.equal(matched('하남 반려견 동반 카페').length,1);
 assert.equal(matched('남양주시 애견카페').length,6);
});
test('Restaurant results contain only researched restaurants, never cafes',()=>{
 const restaurants=matched('하남 애견동반 식당');assert.equal(restaurants.length,2);assert.ok(restaurants.every(p=>p.category==='식당'));

 for(const q of ['남양주 애견동반 식당','양평 맛집','하남 펜션','남양주 강아지 운동장','양평 반려견 공원']){
  assert.deepEqual(matched(q),[],q);
 }
});
test('Named venues and addresses continue to be discoverable',()=>{
 assert.ok(matched('듀먼').some(x=>x.id==='dumon'));
 assert.equal(matched('남양주 로이테').length,1);
 assert.ok(matched('양평 서종면').some(x=>x.region==='양평'));
});
test('Unknown terms and conflicting regions yield no misleading results',()=>{
 assert.equal(matched('서울 애견동반 카페').length,0);
 assert.equal(matched('하남 남양주 카페').length,0);
 assert.equal(matched('강남 카페').length,0);
});
test('Empty searches list the research candidates with unverified status',()=>{
 assert.equal(matched('').length,places.length);
 assert.equal(interpretPlaceQuery('양평 애견동반 카페').type,'cafes');
 assert.equal(interpretPlaceQuery('하남 반려견 동반 식당').unsupported,true);
 assert.ok(places.every(p=>p.policy===null));
});
