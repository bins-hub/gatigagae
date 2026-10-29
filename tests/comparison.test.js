import test from 'node:test';
import assert from 'node:assert/strict';
import {placesForComparison,comparisonTableHtml} from '../comparison.js';
const places=[{id:'a',name:'<img src=x onerror=alert(1)>',region:'하남',category:'카페',policy:null},{id:'b',name:'B',research:{weight:'10kg 이하라는 공개자료',fee:'추가요금 확인 필요'}},{id:'c',name:'C'},{id:'d',name:'D'}];
test('comparison rejects unknown IDs, deduplicates and caps at three in selection order',()=>{
 assert.deepEqual(placesForComparison(places,['b','missing','b','a','c','d']).map(p=>p.id),['b','a','c']);
});
test('comparison preserves unknowns and research caveats without claiming verification',()=>{
 const html=comparisonTableHtml(places.slice(0,2));
 assert.ok(html.includes('미확인 · 업체 문의 필요'));
 assert.ok(html.includes('아직 직접 확인하지 않음'));
 assert.ok(html.includes('10kg 이하라는 공개자료'));
 assert.ok(html.includes('업체 검증일이 아니며'));
 assert.ok(html.includes('&lt;img'));
 assert.ok(!html.includes('<img'));
 assert.ok(html.includes('scope="row"'));
 assert.equal(comparisonTableHtml([places[0]]),'');
});
