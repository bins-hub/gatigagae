import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stayResearchLeads,validateStayResearch,buildStayInquiry} from '../stayResearch.js';
import {buildIntentPages} from '../intentPages.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));

test('Two sourced lodging leads have no invented operational verification or bookings',()=>{
 assert.equal(stayResearchLeads.length,2);
 assert.deepEqual(validateStayResearch(stayResearchLeads),[]);
 const page=buildIntentPages(places)['guides/stays/index.html'];
 assert.match(page,/외부자료 조사 후보 2곳/);
 assert.match(page,/현재 등록된 숙소 0곳/);
 for(const lead of stayResearchLeads){
  assert.equal(lead.operatorVerified,false);
  assert.equal(lead.bookableVerified,false);
  assert.ok(page.includes(lead.sourceUrl));
  assert.ok(page.includes(lead.pending));
  assert.ok(page.includes('data-stay-inquiry="'+lead.id+'"'));
  assert.ok(page.includes(lead.name));
  const inquiry=buildStayInquiry(lead);
  assert.ok(inquiry.includes(lead.name));
  assert.match(inquiry,/체크인\/체크아웃 직접 입력/);
  assert.match(inquiry,/추가요금\/보증금/);
  assert.match(inquiry,/취소·환불 규정/);
 }
 assert.match(page,/id="stay-copy-status" role="status" aria-live="polite"/);
 assert.match(page,/navigator.clipboard.writeText\(message\)/);
 assert.doesNotMatch(page,/fetch\(|localStorage|XMLHttpRequest/);
 assert.match(page,/noindex,nofollow/);
});
test('Lodging leads require unique IDs, HTTPS source and explicit unverified status',()=>{
 const x=structuredClone(stayResearchLeads[0]);
 assert.ok(validateStayResearch([x,{...x}]).length);
 assert.ok(validateStayResearch([{...x,sourceUrl:'javascript:alert(1)'}]).length);
 assert.ok(validateStayResearch([{...x,operatorVerified:true}]).length);
 assert.ok(validateStayResearch([{...x,bookableVerified:true}]).length);
 assert.throws(()=>buildStayInquiry({...x,id:'not-in-research'}));
});
