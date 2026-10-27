// Opt-in ad mockup only: no external URLs, tracking pixels, inventory claims or auto-approval.
export function isBannerPreview(search){
 if(typeof search!=='string'||search.length>500)return false;
 try{return new URLSearchParams(search.startsWith('?')?search.slice(1):search).get('bannerPreview')==='1';}
 catch{return false;}
}
export function previewBannerHtml(style='brand',published=false){
 if(style==='recruit')return '<aside class="sponsor-preview sponsor-recruit" aria-label="광고주 모집형 배너 디자인 테스트"><div class="sponsor-top"><div class="sponsor-heading"><span class="sponsor-eyebrow">PAW PARTNERS</span><span class="sponsor-disclosure">광고 · 테스트 미리보기</span></div><button class="sponsor-close" type="button" data-dismiss-banner aria-label="브랜드 배너 미리보기 닫기">×</button></div><div class="recruit-layout"><div class="recruit-copy"><span class="recruit-kicker">같이가개 BRAND SPACE</span><strong>강아지와 함께하는 순간,<br>당신의 브랜드도 함께.</strong><p>반려생활에 어울리는 브랜드를 위한 광고 공간 디자인 시안입니다.</p><span class="recruit-cta">광고 파트너 자리 · 준비 중</span></div><div class="recruit-visual" aria-hidden="true"><span class="recruit-stamp">WITH PETS<br>WITH YOU</span><span class="recruit-paw">✳</span><span class="recruit-card">YOUR<br>BRAND<br>HERE <span>♡</span></span></div></div><p class="sponsor-foot">모집형 디자인 비교 테스트 · 실제 광고 모집, 신청, 가격 안내 또는 연락 기능은 운영하지 않습니다. 장소 검색 순위와 무관합니다.</p></aside>';

 const paw='<svg viewBox="0 0 110 110" aria-hidden="true" focusable="false"><ellipse cx="23" cy="37" rx="10" ry="14" transform="rotate(-23 23 37)"/><ellipse cx="46" cy="24" rx="10" ry="14" transform="rotate(-8 46 24)"/><ellipse cx="70" cy="25" rx="10" ry="14" transform="rotate(11 70 25)"/><ellipse cx="90" cy="42" rx="10" ry="14" transform="rotate(28 90 42)"/><path d="M56 49C43 49 39 59 32 67C25 74 22 86 32 92C41 99 49 91 56 91C64 91 70 100 80 93C91 85 83 73 77 65C71 56 66 49 56 49Z"/></svg>';
 return '<aside class="sponsor-preview" aria-label="브랜드 배너 테스트">'+
 '<div class="sponsor-top"><div class="sponsor-heading"><span class="sponsor-eyebrow">PAW PARTNERS</span><span class="sponsor-disclosure">'+(published?'광고 · 브랜드 소개':'광고 · 테스트 미리보기')+'</span></div><button class="sponsor-close" type="button" data-dismiss-banner aria-label="브랜드 배너 닫기">×</button></div>'+
 '<div class="sponsor-brands">'+
 '<section class="sponsor-brand sponsor-brand--mouly" aria-label="MOULY 뮬리 브랜드 안내"><div class="sponsor-copy"><span class="sponsor-kicker">MADE FOR PET DAYS</span><span class="sponsor-mark">MOULY<span class="sponsor-dot">.</span></span><strong class="sponsor-title">우리의 외출이<br>조금 더 즐거워지도록.</strong><span class="sponsor-sub">뮬리 · 반려생활 용품</span><span class="sponsor-chip">PET LIFESTYLE <span aria-hidden="true">✦</span></span></div><span class="sponsor-art sponsor-art--mouly" aria-hidden="true">'+paw+'</span><span class="sponsor-spark sponsor-spark--mouly" aria-hidden="true">✳</span></section>'+
 '<section class="sponsor-brand sponsor-brand--ipetsmom" aria-label="아이펫스맘 브랜드 안내"><div class="sponsor-copy"><span class="sponsor-kicker">WITH OUR LITTLE FRIENDS</span><span class="sponsor-mark sponsor-mark--ipet">아이펫스맘</span><strong class="sponsor-title">함께하는 하루,<br>더 사랑스럽게.</strong><span class="sponsor-sub">브랜드 소개 미리보기 · 내용 확인 전</span><span class="sponsor-chip">BRAND PREVIEW <span aria-hidden="true">♡</span></span></div><span class="sponsor-art sponsor-art--ipetsmom" aria-hidden="true">'+paw+'</span><span class="sponsor-spark sponsor-spark--ipetsmom" aria-hidden="true">✦</span></section>'+
 '</div><p class="sponsor-foot"><span class="sponsor-foot-dot" aria-hidden="true"></span>'+(published?'광고 · 브랜드 소개. 외부 연결 주소는 아직 설정되지 않았으며 장소의 입장 규정이나 검색 순위와 관련이 없습니다.':'광고 시안 · 연결 주소 미설정. 실제 광고 링크는 연결되지 않았으며 장소의 입장 규정이나 검색 순위와 관련이 없습니다.')+'</p></aside>';
}
export function shouldInsertBanner(index,numberOfResults,enabled,dismissed){
 return enabled===true&&dismissed!==true&&Number.isInteger(index)&&Number.isInteger(numberOfResults)&&numberOfResults>0&&index===Math.min(3,numberOfResults-1);
}
