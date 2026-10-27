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
});
test('Existing sourced-place search retains prominence and handles preview close',()=>{
 assert.ok(source.includes('const bannerPreviewMode=isBannerPreview(window.location.search);'));
 assert.ok(source.includes('let bannerDismissed=false;'));
 assert.ok(source.includes('shouldInsertBanner(i,list.length,bannerPreviewMode,bannerDismissed)'));
 assert.ok(source.includes('bannerDismissed=true;render();return;'));
 assert.ok(source.includes('.sponsor-preview{grid-column:1/-1'));
 assert.ok(source.includes('id="quick-search-form"'));
 assert.ok(source.includes('noindex,nofollow'));
});
