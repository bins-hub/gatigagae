import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Three-stage mobile-first form preserves existing search IDs',()=>{
 for(const id of ['weight','breed','region','zone','keyword','dogs','day','search-form','results','saved-only','verified-only','exclude-limited'])
  assert.ok(html.includes('id="'+id+'"'),id);
 for(const step of ['01','02','03']) assert.ok(html.includes(step));
});
test('Saved pet preferences must be explicit, removable and device-local',()=>{
 assert.ok(html.includes('id="save-profile"'));
 assert.ok(html.includes('id="clear-profile"'));
 assert.ok(html.includes('localStorage.setItem(PROFILE_KEY'));
 assert.ok(html.includes('localStorage.removeItem(PROFILE_KEY'));
 for(const fn of ['decodePetProfile','normalizePetProfile','encodePetProfile']) assert.ok(html.includes(fn),fn);
 assert.ok(html.includes('서버로 전송하지 않습니다'));
});
test('Bottom nav and sourced detail permalink remain available',()=>{
 for(const marker of ['id="bottom-saved"','href="#search-form"','href="#region-hub-title"','./places/${encodeURIComponent(p.id)}/','data-copy','data-save','map.naver.com'])
  assert.ok(html.includes(marker),marker);
});
test('Research warnings remain in compact cards and no auto admission',()=>{
 assert.ok(html.includes('research.label'));
 assert.ok(html.includes('weightNotice'));
 assert.ok(html.includes('r.warning'));
 assert.ok(html.includes('업체 검증'));
 assert.ok(html.includes('noindex,nofollow'));
});
