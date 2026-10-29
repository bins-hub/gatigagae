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
  assert.ok(page.includes('id="stay-manual-'+lead.id+'" readonly rows="12"'));
  assert.ok(page.includes('문의 문구 전체'));
  assert.ok(page.includes('복사가 안 될 때 직접 복사하기'));
  assert.ok(page.includes('문구를 선택해 복사한 뒤'));
  const inquiry=buildStayInquiry(lead);
  assert.ok(page.includes(inquiry.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')));
  assert.ok(inquiry.includes(lead.name));
  assert.match(inquiry,/체크인\/체크아웃 직접 입력/);
  assert.match(inquiry,/추가요금\/보증금/);
  assert.match(inquiry,/취소·환불 규정/);
 }
 assert.match(page,/id="stay-copy-status" role="status" aria-live="polite"/);
 assert.match(page,/navigator.clipboard.writeText\(message\)/);
 assert.match(page,/자동 복사가 지원되지 않습니다\. 해당 숙소 카드의/);
 assert.match(page,/\.stay-manual textarea:focus-visible/);
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


test('Each lodging research lead has an accessible, resettable, non-persistent inquiry preparation checklist',()=>{
 const page=buildIntentPages(places)['guides/stays/index.html'];
 assert.equal((page.match(/class="stay-prep" autocomplete="off"/g)||[]).length,2);
 assert.equal((page.match(/<legend>숙소에 문의할 내용 준비 체크<\/legend>/g)||[]).length,2);
 assert.equal((page.match(/type="checkbox"/g)||[]).length,10);
 assert.equal((page.match(/type="reset"/g)||[]).length,2);
 assert.match(page,/체크해도 숙소의 규정이나 예약 가능 여부가 확인된 것은 아닙니다/);
 assert.match(page,/체크 내용은 같이가개 서버에 전송되거나 저장되지 않습니다/);
 assert.match(page,/\.stay-prep label\{display:flex;align-items:center;gap:10px;min-height:44px/);
 assert.doesNotMatch(page,/<form class="stay-prep"[^>]*\b(?:action|method|onsubmit)=/);
 assert.doesNotMatch(page,/fetch\(|localStorage|XMLHttpRequest/);
});
