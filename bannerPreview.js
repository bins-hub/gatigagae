// Preview-only placements. No store URLs, personal tracking, affiliate redirects or network requests.
export function isBannerPreview(search){
 if(typeof search!=='string'||search.length>500)return false;
 try{return new URLSearchParams(search.startsWith('?')?search.slice(1):search).get('bannerPreview')==='1';}
 catch{return false;}
}
export function previewBannerHtml(){
 return '<aside class="sponsor-preview" aria-label="브랜드 배너 테스트">'+
 '<div class="sponsor-top"><span>브랜드 안내 · 테스트 미리보기</span><button class="sponsor-close" type="button" data-dismiss-banner aria-label="브랜드 배너 미리보기 닫기">×</button></div>'+
 '<div class="sponsor-brands">'+
 '<div class="sponsor-brand"><span class="sponsor-mark">MOULY</span><strong>반려견과 외출할 때, 필요한 준비</strong><span class="sponsor-sub">뮬리 · 반려생활 용품</span></div>'+
 '<div class="sponsor-brand"><span class="sponsor-mark">아이펫스맘</span><strong>브랜드 소개 미리보기</strong><span class="sponsor-sub">정식 배너 문구·연결 주소 미설정</span></div>'+
 '</div><p class="sponsor-foot">광고 시안입니다. 이 장소의 입장 규정·추천 순위와 관계가 없으며 현재 상품 링크는 연결되지 않았습니다.</p></aside>';
}
export function shouldInsertBanner(index,numberOfResults,enabled,dismissed){
 return enabled===true&&dismissed!==true&&Number.isInteger(index)&&Number.isInteger(numberOfResults)&&numberOfResults>0&&index===Math.min(3,numberOfResults-1);
}
