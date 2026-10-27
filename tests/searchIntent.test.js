import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildIntentPages,intentCards} from '../intentPages.js';
import {keywordHypotheses,keywordHypothesisCsv,SEARCH_INTENTS} from '../keywordResearch.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Four evidence-based guides including two unverified restaurant leads',()=>{
 const pages=buildIntentPages(places);
 assert.deepEqual(Object.keys(pages).sort(),['guides/cafes/index.html','guides/indoor/index.html','guides/restaurants/index.html','guides/weekend/index.html']);
 for(const [path,page] of Object.entries(pages)){
  assert.match(page,/noindex,nofollow/,path);
  assert.match(page,/업체 직접 검증 전/,path);
  assert.ok(page.length>2500,path);
 }
 assert.match(pages['guides/cafes/index.html'],/애견동반 카페/);
 assert.match(pages['guides/weekend/index.html'],/완성된 코스로 추천하지 않습니다/);
 assert.match(pages['guides/indoor/index.html'],/직접 확인한 실내 동반 가능 장소는/);
});
test('Available intent cards link to guides; restaurant is nonclickable research pending',()=>{
 const cards=intentCards(places);
 assert.equal(cards.length,4);assert.equal(cards.find(x=>x.id==='cafes').count,11);
 assert.equal(cards.find(x=>x.id==='restaurants').count,2);
 assert.ok(html.includes('href="./guides/restaurants/"'));
 for(const x of cards.filter(c=>c.href))assert.ok(html.includes('href="'+x.href+'"'),x.href);
});
test('Intent guides remain sourced and do not turn public research into confirmed admission',()=>{
 const pages=buildIntentPages(places),cafe=pages['guides/cafes/index.html'];
 for(const p of places.filter(x=>x.category==='카페'))assert.ok(cafe.includes('../../places/'+p.id+'/'),p.id);
 assert.ok(!cafe.includes('공식 입장 가능'));
 assert.ok(pages['guides/restaurants/index.html'].includes('업체 직접 검증 전'));
});
test('All 90 keyword candidates are unmeasured hypotheses, including restaurants with no landing page',()=>{
 const rows=keywordHypotheses(places);
 assert.equal(rows.length,SEARCH_INTENTS.length*3*5);
 assert.equal(new Set(rows.map(r=>r.keyword)).size,rows.length);
 assert.ok(rows.every(r=>r.measuredMonthlySearchVolume===null && r.measuredCompetition===null && r.measurementStatus==='unmeasured_hypothesis'));
 assert.ok(rows.filter(r=>r.intent==='restaurants'&&r.region==='하남').every(r=>r.landingRoute==='guides/restaurants/' && r.evidencePlaceCount===2));
 assert.ok(rows.filter(r=>r.intent==='cafes').every(r=>r.landingRoute==='guides/cafes/' && r.evidencePlaceCount>0));
 assert.equal(keywordHypothesisCsv(rows).split('\r\n').filter(Boolean).length,rows.length+1);
});
test('No keyword plan or fake source measurements are published directly',()=>{
 assert.ok(!html.includes('월간 검색량 1000'));
 assert.ok(html.includes('noindex,nofollow'));
 assert.ok(html.includes('식당 조사 후보 · 2곳'));
});
