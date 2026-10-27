import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePetProfile,encodePetProfile,decodePetProfile} from '../petProfile.js';
test('Only minimal allowed pet search attributes are encoded',()=>{
 const encoded=encodePetProfile({weight:16,breed:' 스탠다드 푸들 ',dogs:2,name:'private name',id:'secret'});
 assert.deepEqual(JSON.parse(encoded),{version:1,weight:16,dogs:2,breed:'스탠다드 푸들'});
 assert.deepEqual(decodePetProfile(encoded),{weight:16,dogs:2,breed:'스탠다드 푸들'});
});
test('Zero, negative, overly heavy and invalid dog counts are rejected',()=>{
 for(const pet of [{weight:0,dogs:1},{weight:160,dogs:1},{weight:16,dogs:0},{weight:16,dogs:2.5},{weight:16,dogs:11},{weight:NaN,dogs:1},{weight:16,dogs:2,breed:'x'.repeat(51)}]){
  assert.equal(normalizePetProfile(pet),null);
  assert.throws(()=>encodePetProfile(pet));
 }
});
test('Corrupted, unknown versions and giant strings cannot restore any profile',()=>{
 for(const value of ['',undefined,'oops','{}','{"version":2,"weight":16,"dogs":1}','x'.repeat(501)])
  assert.equal(decodePetProfile(value),null);
});
test('An empty optional breed is allowed and current profile can be restored',()=>{
 const pet={weight:8.5,dogs:1,breed:''};
 assert.deepEqual(decodePetProfile(encodePetProfile(pet)),pet);
});
