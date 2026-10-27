import {test} from 'node:test';
import assert from 'node:assert/strict';
import {queryCaution} from '../searchQuery.js';
import {readFileSync} from 'node:fs';
const template=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Nearby and open-now phrases warn that there is no live geo or hours',()=>{
 const n=queryCaution('근처 오늘 애견동반 카페');
 assert.ok(n.includes('거리순'));
 assert.ok(n.includes('실시간'));
 assert.ok(!n.includes('입장 가능합니다'));
});
test('Rainy weather, indoor and certified admission phrases warn about current venue policy',()=>{
 const n=queryCaution('비오는날 실내 입장가능 카페');
 assert.ok(n.includes('실내 좌석'));
 assert.ok(n.includes('입장을 확약하지 않으며'));
});
test('Non-time-sensitive ordinary keywords do not add distracting warnings',()=>{
 assert.equal(queryCaution('남양주 애견동반 카페'),'');
 assert.equal(queryCaution(''),'');
});
test('Search results surface warnings with live region and keyword filters',()=>{
 assert.ok(template.includes('id="query-caution"'));
 assert.ok(template.includes('queryCaution(filter.query)'));
 assert.ok(template.includes("$('#query-caution').textContent=caution"));
 assert.ok(template.includes("$('#query-caution').hidden=!caution"));
});
