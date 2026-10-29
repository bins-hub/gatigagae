import {escapeHtml} from './staticPages.js';
const esc=escapeHtml;
// Official photo pages are outbound references, not a grant of republication rights.
export const stayPhotoSources=Object.freeze({
 ddstarforest:{pageUrl:'https://access.visitkorea.or.kr/acm/detail.do?cotId=92d56d21-9699-4ddf-826b-a42205b4eea7',label:'한국관광공사 사진',status:'pending',photos:[]},
 seojongpool:{pageUrl:'https://seojongpool.kr/room.html?room_id=33741',label:'숙소 공식 객실 사진',status:'pending',photos:[]},
 'gapyeong-art':{pageUrl:'https://art-petps.kr/about.html',label:'숙소 공식 소개·사진',status:'pending',photos:[]},
 'gapyeong-skybridge':{pageUrl:'https://gpskybridge.co.kr/',label:'숙소 공식 객실·전경',status:'pending',photos:[]},
 'yangpyeong-blossom':{pageUrl:'https://blossomps.kr/view.html',label:'숙소 공식 전경 사진',status:'pending',photos:[]}
});
const https=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
export function approvedStayPhotos(record){
 if(record?.status!=='approved'||!https(record.permissionEvidenceUrl)||!record.attribution?.trim())return [];
 return (record.photos||[]).filter(p=>https(p.src)&&https(p.sourceUrl)&&typeof p.alt==='string'&&p.alt.trim()&&typeof p.caption==='string'&&p.caption.trim()&&Number.isInteger(p.width)&&p.width>0&&Number.isInteger(p.height)&&p.height>0).slice(0,5);
}
export function stayPhotoSourceLink(lead){
 const record=stayPhotoSources[lead.id];
 return record?'<a class="official-photos" href="'+esc(record.pageUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(record.label)+' 보기 ↗</a>':'';
}
export function stayPhotoFigure(photo,record,{hero=false}={}){
 return '<figure class="stay-photo"><img src="'+esc(photo.src)+'" alt="'+esc(photo.alt)+'" width="'+photo.width+'" height="'+photo.height+'" loading="'+(hero?'eager':'lazy')+'" decoding="async"><figcaption>'+esc(photo.caption)+'<br><small>'+esc(record.attribution)+' · <a href="'+esc(photo.sourceUrl)+'" target="_blank" rel="noopener noreferrer">사진 출처</a></small></figcaption></figure>';
}
export function stayGalleryHtml(lead,record=stayPhotoSources[lead.id]){
 const photos=approvedStayPhotos(record);
 if(!photos.length)return '<section class="panel stay-photo-reference"><h2>객실·마당 사진 확인하기</h2><p>현재 사진은 원문에서 확인할 수 있어요. 객실명과 반려견 동반 구역을 함께 살펴보세요.</p><div class="actions">'+stayPhotoSourceLink(lead)+'</div><p class="muted">사진에 보이는 수영장·스파·마당이 반려견에게 허용된 공간인지는 숙소의 이용안내에서 별도로 확인하세요.</p></section>';
 return '<section class="panel"><h2>숙소 공간 사진</h2><p>사진을 좌우로 밀어 객실·마당·외관을 확인하세요.</p><div class="stay-photo-gallery" tabindex="0" role="region" aria-label="숙소 사진 갤러리, 좌우 스크롤">'+photos.map(p=>stayPhotoFigure(p,record)).join('')+'</div><p class="muted">사진은 공간을 보여주는 자료이며 현재 시설 상태나 반려견 이용 가능 여부를 보장하지 않습니다.</p></section>';
}
export const STAY_PHOTO_STYLE='<style>.stay-photo{margin:0;min-width:0;background:#fff;border:1px solid #d6e0d8;border-radius:13px;overflow:hidden}.stay-photo img{display:block;width:100%;height:auto;object-fit:contain;background:#f1f3ec}.stay-photo figcaption{padding:10px 13px;font-size:13px;overflow-wrap:anywhere}.stay-photo small{font-size:11px;color:#526862}.stay-photo-gallery{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x proximity;padding-bottom:12px}.stay-photo-gallery .stay-photo{flex:0 0 min(82%,560px);scroll-snap-align:start}.official-photos{display:inline-flex;align-items:center;min-height:44px;font-weight:700;text-underline-offset:4px}.stay-photo-reference p{font-size:14px}.stay-photo-gallery:focus-visible{outline:3px solid #c77537;outline-offset:3px}@media(prefers-reduced-motion:reduce){.stay-photo-gallery{scroll-behavior:auto}}</style>';
