import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {stayBrowseHtml} from '../stayBrowse.js';
import {buildStayPages} from '../stayPages.js';
test('Browse cards stay short while every lead has a reachable detail and private inquiry preparation',()=>{
 const html=stayBrowseHtml(),pages=buildStayPages();
 assert.equal((html.match(/data-stay-region=/g)||[]).length,5);
 assert.ok(!html.includes('class="stay-prep"'));
 for(const id of ['ddstarforest','seojongpool','gapyeong-art','gapyeong-skybridge','yangpyeong-blossom']){
  assert.ok(html.includes('../../stays/'+id+'/'));assert.ok(pages['stays/'+id+'/index.html'].includes('id="stay-inquiry"'));
 }
 assert.ok(html.includes('실제 숙소 사진 아님'));assert.ok(!html.includes('<img'));
 assert.ok(html.includes('id="stay-compare-dock"'));assert.ok(html.includes('data-enhanced hidden'));
 for(const script of html.matchAll(/<script>(.*?)<\/script>/gs))assert.doesNotThrow(()=>new vm.Script(script[1]));
});
