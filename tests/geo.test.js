import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validCoordinates,distanceKm,verifiedPoint,sortByVerifiedDistance,geoCoverage} from '../geo.js';
import {validatePlaces} from '../validation.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
test('Coordinates require valid finite numeric latitude and longitude',()=>{
 assert.equal(validCoordinates({lat:37,lng:127}),true);
 for(const x of [{lat:91,lng:127},{lat:NaN,lng:3},{lat:'37',lng:127},{lat:0,lng:181},{}])assert.equal(validCoordinates(x),false);
});
test('Haversine returns zero at same coordinate and one-degree distance within 111-112 km',()=>{
 assert.equal(distanceKm({lat:0,lng:0},{lat:0,lng:0}),0);
 const d=distanceKm({lat:0,lng:0},{lat:1,lng:0});assert.ok(d>111&&d<112,d);
});
test('No known places have fabricated geolocation coordinates',()=>{
 assert.deepEqual(geoCoverage(places),{candidates:10,ready:0,pending:10,needsSourceVerification:places.map(x=>x.id)});
 assert.equal(sortByVerifiedDistance(places,{lat:37,lng:127}).length,0);
});
test('Only sourced and verified coordinate records can enter sorting',()=>{
 const fake=[{id:'a',geolocation:{lat:37.5,lng:127,sourceUrl:'https://example.org/venue',verifiedOn:'2026-10-27'}},
 {id:'b',geolocation:{lat:37.6,lng:127,sourceUrl:'https://example.org/venue',verifiedOn:'2026-10-27'}},
 {id:'c',geolocation:{lat:37.4,lng:127,sourceUrl:null,verifiedOn:'2026-10-27'}}];
 assert.equal(verifiedPoint(fake[2]),null);
 const sorted=sortByVerifiedDistance(fake,{lat:37.51,lng:127});
 assert.deepEqual(sorted.map(x=>x.place.id),['a','b']);
});
test('User location is never guessed when access is not granted',()=>{
 assert.throws(()=>sortByVerifiedDistance(places,null),/Location permission/);
});

test('Dataset validator rejects unsupported or unproven coordinates',()=>{
 const altered=structuredClone(places);
 altered[0].geolocation={lat:91,lng:126,sourceUrl:'https://example.org/p',verifiedOn:'2026-10-27'};
 assert.ok(validatePlaces(altered).some(x=>x.includes('geolocation')));
 altered[0].geolocation={lat:37.6,lng:127,sourceUrl:'http://example.org',verifiedOn:'2026-10-27'};
 assert.ok(validatePlaces(altered).some(x=>x.includes('geolocation')));
 altered[0].geolocation={lat:37.6,lng:127,sourceUrl:'https://example.org/p',verifiedOn:'2026-10-27'};
 assert.ok(!validatePlaces(altered).some(x=>x.includes('geolocation')));
});
