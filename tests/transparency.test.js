import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {researchState,correctionPanelHtml,CORRECTION_SCRIPT,makeSuggestionText} from '../transparency.js';
import {buildStaticPages,escapeHtml} from '../staticPages.js';
const venues=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const main=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('All 13 researched venues expose distinct source-review states and dates',()=>{
 const pages=buildStaticPages(venues);
 assert.equal(venues.length,13);
 for(const venue of venues){
  const html=pages['places/'+venue.id+'/index.html'];
  const state=researchState(venue,{asOf:'2026-10-27'});
  assert.ok(html.includes('id="report-correction"'),venue.id);
  assert.ok(html.includes('aria-label="자료 검증 상태"'),venue.id);
  assert.ok(html.includes(escapeHtml(state.label)),venue.id);
  assert.ok(html.includes(venue.research.reviewedOn),venue.id);
  assert.ok(html.includes('업체 직접 규정 확인 없음'),venue.id);
  assert.ok(html.includes('noindex,nofollow'),venue.id);
 }
});
test('Unverified research labels do not imply live admission or official operator policy',()=>{
 const conflict=researchState(venues.find(p=>p.id==='foraday'),{asOf:'2026-10-27'});
 assert.match(conflict.label,/상충/);
 assert.equal(conflict.verified,false);
 assert.equal(conflict.admissionGuarantee,false);
 const old=researchState(venues.find(p=>p.id==='foraday'),{asOf:'2027-03-01'});
 assert.match(old.ageIssue,/90일 초과/);
 const future=researchState(venues[0],{asOf:'2026-01-01'});
 assert.match(future.ageIssue,/미래/);
});
test('Correction draft text is explicitly unsent and validates type, content, HTTPS evidence',()=>{
 const good={id:'dumon',name:'듀먼카페',region:'양평',type:'admission',detail:'업체에서 실내 동반 범위를 변경했다고 안내받았습니다.',sourceUrl:'https://example.org/announcement'};
 const str=makeSuggestionText(good);
 assert.match(str,/미접수/);
 assert.match(str,/운영자에게 접수되지 않습니다/);
 assert.match(str,/https:\/\/example.org/);
 assert.throws(()=>makeSuggestionText({...good,type:'official_approval'}),/유형/);
 assert.throws(()=>makeSuggestionText({...good,detail:'짧음'}),/10~1200/);
 assert.throws(()=>makeSuggestionText({...good,sourceUrl:'javascript:alert(1)'}),/HTTPS/);
 assert.throws(()=>makeSuggestionText({...good,id:'../secret'}),/ID/);
});
test('Inline copy-only UI does not send/store visitor data and standalone script parses',()=>{
 const body=CORRECTION_SCRIPT.match(/^<script>([\s\S]*)<\/script>$/)?.[1];
 assert.ok(body);
 assert.doesNotThrow(()=>new Function(body));
 for(const dangerous of ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'sendBeacon', 'document.cookie'])assert.ok(!body.includes(dangerous),dangerous);
 const panel=correctionPanelHtml(venues[0],escapeHtml);
 assert.ok(panel.includes('id="correction-copy"'));
 assert.ok(panel.includes('id="correction-reset"'));
 assert.ok(panel.includes('자동 접수·전송되지 않습니다'));
 assert.ok(panel.includes('개인정보를 입력하지 마세요'));
});
test('Venue names remain safely HTML escaped in feedback attributes',()=>{
 const injected={id:'safe',name:'<img src=x onerror=alert(1)>',region:'양평'};
 const rendered=correctionPanelHtml(injected,escapeHtml);
 assert.ok(rendered.includes('data-venue-name="&lt;img'));
 assert.ok(!rendered.includes('data-venue-name="<img'));
});
test('Mobile search results have a source-date clue and direct correction draft link',()=>{
 for(const fragment of ['card-evidence','외부자료 확인일','dataCaution','/#report-correction','자료 버전 0.14.0'])assert.ok(main.includes(fragment),fragment);
});
