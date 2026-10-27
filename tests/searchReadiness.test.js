import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchReadiness} from '../searchReadiness.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
test('Current unverified site cannot automatically become indexable',()=>{
 const r=searchReadiness(places);
 assert.equal(r.researchCandidates,10);
 assert.equal(r.directlyVerifiedVenueCount,0);
 assert.deepEqual(r.categories,['카페']);
 assert.equal(r.prerequisitesSatisfied,false);
 assert.equal(r.automaticIndexingAllowed,false);
 assert.ok(r.blockers.length>=3);
});
test('Supplying metrics never qualifies venue admission or overrides manual indexing decisions',()=>{
 const r=searchReadiness(places,{measurementCount:90,operatorContactPublished:true,correctionChannelAvailable:true});
 assert.equal(r.directlyVerifiedVenueCount,0);
 assert.equal(r.prerequisitesSatisfied,false);
 assert.equal(r.automaticIndexingAllowed,false);
});
test('Even a synthetic fully reviewed site requires explicit manual indexing decision',()=>{
 const fake=structuredClone(places);
 fake[0].policy={verifiedOn:'2026-10-27'};
 const r=searchReadiness(fake,{operatorContactPublished:true,correctionChannelAvailable:true});
 assert.equal(r.prerequisitesSatisfied,true);
 assert.equal(r.manualIndexingDecisionRequired,true);
 assert.equal(r.automaticIndexingAllowed,false);
});
