import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REGIONS,buildStaticPages,reviewQueueCsv,escapeHtml} from '../staticPages.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const result=buildStaticPages(places);
test('Generate one individual page per candidate and three region pages',()=>{
 assert.equal(Object.keys(result).length,places.length+3);
 for(const p of places) assert.ok(result['places/'+p.id+'/index.html'],p.id);
 for(const slug of Object.values(REGIONS)) assert.ok(result['regions/'+slug+'/index.html'],slug);
});
test('Every generated page blocks indexing before verification',()=>{
 for(const [path,html] of Object.entries(result)){
  assert.match(html,/name="robots" content="noindex,nofollow"/,path);
  assert.match(html,/업체 직접/);
 }
});
test('All venue pages link primary evidence and do not claim verified policies',()=>{
 for(const p of places){
  const html=result['places/'+p.id+'/index.html'];
  assert.ok(html.includes(escapeHtml(p.name)));
  assert.ok(html.includes('업체 직접 검증 전'));
  for(const source of p.research.sources) assert.ok(html.includes(escapeHtml(source.url)),p.id);
  assert.ok(html.includes('href="../../"'),p.id);
  assert.ok(html.includes('href="../../regions/'+REGIONS[p.region]+'/'),p.id);
 }
});
test('Region pages contain only their own researched places',()=>{
 for(const [region,slug] of Object.entries(REGIONS)){
  const html=result['regions/'+slug+'/index.html'];
  assert.ok(html.includes(region+' '+(region==='하남'?'반려견 동반 카페·식당':'애견동반 카페')+' 조사 후보'),region);
  assert.ok(html.includes('업체 직접 검증 완료 0곳'),region);
  assert.ok(html.includes('region='+slug+'&amp;intent=cafes#results-title'),region);
  assert.ok(html.includes('반려견 동반 장소 방문 전 확인'),region);
  for(const p of places){
   if(p.region===region) assert.ok(html.includes('places/'+p.id+'/'),p.id);
   else assert.ok(!html.includes('places/'+p.id+'/'),p.id);
  }
 }
});
test('Unsafe research text is escaped',()=>{
 const injected=structuredClone(places[0]);injected.id='safe-id';
 injected.name='<script>alert(1)</script>';
 injected.research.summary='<img src=x onerror=alert(1)>';
 const pages=buildStaticPages([injected]);
 const html=pages['places/safe-id/index.html'];
 assert.ok(html.includes('&lt;script&gt;'));
 assert.ok(!html.includes('<script>alert(1)</script>'));
 assert.ok(html.includes('&lt;img'));
});
test('The verification queue contains 10 items but no simulated confirmations',()=>{
 const csv=reviewQueueCsv(places);
 assert.equal(csv.split('\r\n').filter(Boolean).length,places.length+1);
 for(const p of places)assert.ok(csv.includes(p.id));
 assert.ok(csv.includes('false'));
});
test('Unsupported region and invalid ID fail the build',()=>{
 assert.throws(()=>buildStaticPages([{...places[0],region:'invalid'}]),/Unsupported region/);
 assert.throws(()=>buildStaticPages([{...places[0],id:'../escape'}]),/Invalid place path/);
});
