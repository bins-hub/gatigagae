import test from 'node:test';
import assert from 'node:assert/strict';
import {stayPhotoSources,approvedStayPhotos,stayGalleryHtml} from '../stayPhotos.js';
const photo={src:'https://fixtures.example/room.jpg',sourceUrl:'https://fixtures.example/room',alt:'객실 <테스트>',caption:'객실 안내',width:1200,height:800};
const approved={status:'approved',permissionEvidenceUrl:'https://fixtures.example/permission',attribution:'테스트 사진 제공',photos:[photo]};
test('Photo publication requires explicit permission evidence, credit, HTTPS and dimensions',()=>{
 assert.equal(approvedStayPhotos(approved).length,1);
 for(const item of [{...approved,status:'pending'},{...approved,permissionEvidenceUrl:''},{...approved,attribution:''},{...approved,photos:[{...photo,src:'javascript:alert(1)'}]},{...approved,photos:[{...photo,width:0}]}])assert.equal(approvedStayPhotos(item).length,0);
 assert.equal(approvedStayPhotos({...approved,photos:Array(8).fill(photo)}).length,5);
});
test('Official photo references are not presented as republishing permission or SEO images',()=>{
 assert.equal(Object.keys(stayPhotoSources).length,5);
 for(const [id,record] of Object.entries(stayPhotoSources)){
  assert.equal(approvedStayPhotos(record).length,0);
  const html=stayGalleryHtml({id},record);assert.ok(html.includes(record.pageUrl.replaceAll('&','&amp;')));assert.ok(!html.includes('<img'));
 }
 const html=stayGalleryHtml({id:'test'},approved);assert.ok(html.includes('&lt;테스트&gt;'));assert.ok(html.includes('사진 출처'));assert.ok(html.includes('width="1200" height="800"'));assert.ok(html.includes('role="region"'));assert.ok(html.includes('object-fit')===false);
});
