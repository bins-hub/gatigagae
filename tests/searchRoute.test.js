import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseSearchRoute,regionSearchHref} from '../searchRoute.js';
import {readFileSync} from 'node:fs';
const template=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Region cafe pages can deep link directly to filtered candidates',()=>{
 for(const [slug,region] of Object.entries({hanam:'하남',namyangju:'남양주',yangpyeong:'양평'})){
  const href=regionSearchHref(slug);
  assert.ok(href.startsWith('../../?region='+slug+'&intent=cafes#results-title'));
  assert.deepEqual(parseSearchRoute(href.slice(href.indexOf('?'),href.indexOf('#'))),{region,intent:'cafes'});
 }
});
test('Unrecognized region, intent and malformed huge input do not drive searches',()=>{
 for(const url of ['?region=seo-spam&intent=cafes','?region=hanam&intent=restaurants','?region=../../../&intent=cafes','x'.repeat(513),null])
  assert.equal(parseSearchRoute(url),null);
 assert.throws(()=>regionSearchHref('seoul'),/Unsupported region/);
});
test('Region browsing does not require an arbitrary 16kg dog weight',()=>{
 assert.match(template,/value="all"/);
 assert.match(template,/id="weight"[^>]*placeholder="예: 5"/);
 assert.ok(!template.includes('id="weight" type="number" min="0.1" max="150" step="0.1" value="16"'));
 assert.ok(template.includes('let filter={weight:null'));
 assert.ok(template.includes("filter.weight===null?"));
 assert.ok(template.includes("weightRaw===''?null"));
 assert.ok(template.includes('parseSearchRoute(window.location.search)'));
});
test('Direct region links only filter existing sourced candidates; keep verification warning',()=>{
 assert.ok(template.includes('noindex,nofollow'));
 assert.ok(template.includes('업체 직접 검증 0곳'));
 assert.ok(template.includes('id="save-profile"'));
 assert.ok(template.includes('data-copy'));
});
