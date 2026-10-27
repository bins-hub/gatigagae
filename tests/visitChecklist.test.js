import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISIT_CHECK_ITEMS,visitChecklistHtml,VISIT_CHECK_SCRIPT} from '../visitChecklist.js';
import {buildStaticPages} from '../staticPages.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const homepage=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Five visit preparation steps are generated for every researched venue',()=>{
 assert.equal(VISIT_CHECK_ITEMS.length,5);
 const pages=buildStaticPages(places);
 for(const p of places){
  const html=pages['places/'+p.id+'/index.html'];
  for(const item of VISIT_CHECK_ITEMS)assert.ok(html.includes('name="visit-'+item.id+'"'),p.id+' '+item.id);
  assert.ok(html.includes('id="visit-check"'),p.id);
  assert.ok(html.includes('id="visit-copy"'),p.id);
  assert.ok(html.includes('id="visit-clear"'),p.id);
  assert.ok(html.includes('업체 직접 검증 전'),p.id);
  assert.ok(html.includes('noindex,nofollow'),p.id);
  assert.ok(html.includes('href="#visit-check"'),p.id);
 }
});
test('Checklist explicitly disclaims official confirmation, persistence and automatic messages',()=>{
 const html=visitChecklistHtml();
 assert.ok(html.includes('업체 공식 검증이나 현재 입장 가능 보증이 아닙니다'));
 assert.ok(html.includes('체크 항목은 저장되지 않습니다'));
 assert.ok(html.includes('자동으로 업체에 발송되지 않습니다'));
 assert.ok(!VISIT_CHECK_SCRIPT.includes('localStorage'));
 assert.ok(!VISIT_CHECK_SCRIPT.includes('fetch('));
 assert.ok(!VISIT_CHECK_SCRIPT.includes('XMLHttpRequest'));
});
test('Visit script parses and only requires on-page checkboxes',()=>{
 const extracted=VISIT_CHECK_SCRIPT.match(/^<script>([\s\S]*)<\/script>$/)?.[1];
 assert.ok(extracted);
 assert.doesNotThrow(()=>new Function(extracted));
 assert.ok(extracted.includes('checks.filter'));
});
test('Homepage results link to personal visit checklist, independent from venue policy',()=>{
 assert.ok(homepage.includes('./places/'+'$'+'{encodeURIComponent(p.id)}/#visit-check'));
 assert.ok(homepage.includes('방문 전 체크'));
});
