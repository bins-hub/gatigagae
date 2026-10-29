import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildStayPages,stayQuestions} from '../stayPages.js';
import {stayResearchLeads} from '../stayResearch.js';
import {buildIntentPages} from '../intentPages.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url)));
const schema=html=>JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
test('Sourced detail pages have unique self canonicals, visible FAQ matching schema, and no offers or ratings',()=>{
 const pages=buildStayPages(),titles=new Set();assert.equal(Object.keys(pages).length,3);
 for(const lead of stayResearchLeads.filter(s=>s.conditions)){
  const path='stays/'+lead.id+'/',html=pages[path+'index.html'];
  const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
  assert.ok(html.includes('rel="canonical" href="https://bins-hub.github.io/gatigagae/'+path+'"'));
  assert.ok(html.includes('noindex,nofollow'));assert.ok(html.includes(lead.sourceUrl));
  assert.ok(html.includes('datetime="'+lead.reviewedOn+'"'));
  const graph=schema(html)['@graph'],faq=graph.find(x=>x['@type']==='FAQPage');
  assert.equal(faq.mainEntity.length,3);
  stayQuestions(lead).forEach((q,i)=>{assert.equal(faq.mainEntity[i].name,q.question);assert.equal(faq.mainEntity[i].acceptedAnswer.text,q.answer);assert.ok(html.includes(q.answer));});
  assert.ok(!graph.some(x=>x.offers||x.aggregateRating));
  assert.ok(html.includes('../../guides/stays/#stay-'+lead.id));
 }
});
test('Lodging collection links all researched sources and each supported detail; unknown fields stay unknown',()=>{
 const html=buildIntentPages(places)['guides/stays/index.html'];
 const graph=schema(html)['@graph'];assert.equal(graph[0].mainEntity.numberOfItems,5);
 for(const lead of stayResearchLeads){assert.ok(html.includes(lead.sourceUrl));assert.ok(html.includes('id="stay-'+lead.id+'"'));}
 for(const key of Object.keys(buildStayPages()))assert.ok(html.includes('../../'+key.replace('index.html','')));
 assert.ok(html.includes('7kg 이하'));assert.ok(html.includes('5~10kg 15,000원'));assert.ok(html.includes('4kg 이하 소형견'));
 assert.ok(html.includes('스파의 반려견 입수 허용 여부는 미확인'));
});
