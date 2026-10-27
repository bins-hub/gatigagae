import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isBannerPreview,previewBannerHtml,shouldInsertBanner} from '../bannerPreview.js';
const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Banner previews are explicitly opt-in via bannerPreview=1 only',()=>{
 for(const q of ['', '?region=hanam', '?bannerPreview=0', '?bannerPreview=true', '?bannerPreview=2', '?bannerPreview', '?bannerPreview=1'.repeat(70)])assert.equal(isBannerPreview(q),false,q);
 assert.equal(isBannerPreview('?bannerPreview=1'),true);
 assert.equal(isBannerPreview('?region=hanam&bannerPreview=1'),true);
});
test('Exactly one subdued banner after fourth result, or at end for shorter lists',()=>{
 for(const n of [1,2,3,4,13]){
  const found=Array.from({length:n},(_,i)=>shouldInsertBanner(i,n,true,false)).filter(Boolean);
  assert.equal(found.length,1,n);
  assert.equal(Array.from({length:n},(_,i)=>shouldInsertBanner(i,n,true,false)).findIndex(Boolean),Math.min(3,n-1),n);
  assert.ok(Array.from({length:n},(_,i)=>!shouldInsertBanner(i,n,false,false)).every(Boolean));
 }
 assert.equal(shouldInsertBanner(0,0,true,false),false);
 assert.equal(shouldInsertBanner(3,13,true,true),false);
});
test('MOULY and 아이펫스맘 are labeled as demo advertising, with no unverified outbound URLs or pixels',()=>{
 const s=previewBannerHtml();
 for(const text of ['MOULY','뮬리','아이펫스맘','테스트 미리보기','광고 시안','연결 주소 미설정','data-dismiss-banner'])assert.ok(s.includes(text),text);
 assert.ok(!s.includes('<a '));
 assert.ok(!s.includes('<img '));
 assert.ok(!s.includes('<script'));
 assert.ok(!s.includes('https://'));
 assert.ok(s.includes('sponsor-brand--mouly')&&s.includes('sponsor-brand--ipetsmom'));
 assert.ok(s.includes('<svg viewBox=')&&s.includes('aria-hidden="true"'));
 assert.ok(s.includes('PAW PARTNERS')&&s.includes('sponsor-title'));
 assert.equal((s.match(/class="sponsor-brand sponsor-brand--/g)||[]).length,2);
 assert.ok(!s.includes('data-track'));
 const publicBanner=previewBannerHtml('brand',true);
 assert.ok(publicBanner.includes('광고 · 브랜드 소개'));
 assert.ok(!publicBanner.includes('광고 · 테스트 미리보기'));
 assert.ok(!publicBanner.includes('<a '));
 const recruit=previewBannerHtml('recruit');
 assert.ok(recruit.includes('광고 파트너 자리 · 준비 중'));
 assert.ok(!recruit.includes('<a '));

});
test('Existing sourced-place search retains prominence and handles preview close',()=>{
 assert.ok(source.includes('const bannerPreviewMode=isBannerPreview(window.location.search);'));
 assert.ok(source.includes('let bannerDismissed=false;'));
 assert.ok(source.includes('const bannerEnabled=true;'));
 assert.ok(source.includes('shouldInsertBanner(i,list.length,bannerEnabled,bannerDismissed)'));
 assert.ok(source.includes('bannerDismissed=true;render();'));
 assert.ok(source.includes('.sponsor-preview{grid-column:1/-1'));
 assert.ok(source.includes('grid-template-columns:1fr;gap:9px'));
 assert.ok(source.includes('.sponsor-art--mouly{color:'));
 assert.ok(source.includes('.sponsor-art--ipetsmom{color:'));
 assert.ok(source.includes('자료 버전 0.12.5'));

 assert.ok(source.includes('id="quick-search-form"'));
 assert.ok(source.includes('noindex,nofollow'));
});

test('Public banner never alters data validity or search indexing',()=>{
 assert.ok(source.includes('13곳 공개자료 조사 · 업체 직접 검증 0곳'));
 assert.ok(source.includes('noindex,nofollow'));
 assert.ok(source.includes('const bannerPreviewStyle=bannerPreviewMode'));
});
