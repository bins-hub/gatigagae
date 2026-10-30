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
  if(id==='ddstarforest'){assert.equal(approvedStayPhotos(record).length,5);continue;}
  assert.equal(approvedStayPhotos(record).length,0);
  const html=stayGalleryHtml({id},record);assert.ok(html.includes(record.pageUrl.replaceAll('&','&amp;')));assert.ok(!html.includes('<img'));
 }
 const html=stayGalleryHtml({id:'test'},approved);assert.ok(html.includes('&lt;테스트&gt;'));assert.ok(html.includes('사진 원문'));assert.ok(html.includes('width="1200" height="800"'));assert.ok(html.includes('role="region"'));assert.ok(html.includes('object-fit')===false);
});

test('Public-licensed original photos are used only for the matching lodging and SEO metadata',async()=>{
 const {buildStayPages}=await import('../stayPages.js');
 const record=stayPhotoSources.ddstarforest,photos=approvedStayPhotos(record);
 assert.equal(record.eligibilityBasis,'public-license');assert.equal(photos.length,5);
 assert.ok(record.permissionEvidenceUrl.startsWith('https://www.data.go.kr/'));
 for(const photo of photos){assert.ok(photo.src.startsWith('https://tong.visitkorea.or.kr/cms/resource/'));assert.equal(photo.width,940);assert.equal(photo.height,627);}
 const pages=buildStayPages(),dd=pages['stays/ddstarforest/index.html'];
 const graph=JSON.parse(dd.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];assert.equal(graph[0].image.length,5);
 for(const [path,page] of Object.entries(pages))if(!path.includes('ddstarforest'))assert.ok(!page.includes('3346812_image2_1.jpg'));
 assert.ok(dd.includes('촬영 시기 미상'));assert.ok(dd.includes('사진 원문'));assert.ok(dd.includes('이용 조건'));
});

test('Gallery instructions do not promise room photos that were not supplied',()=>{
 const html=stayGalleryHtml({id:'ddstarforest'});
 assert.ok(html.includes('사진에 없는 객실·시설은 숙소 공식 안내에서 확인하세요.'));
 assert.ok(!html.includes('객실·마당·외관을 확인하세요.'));
});
