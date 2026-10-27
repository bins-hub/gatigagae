import {REGIONS,shell,escapeHtml} from './staticPages.js';
const esc=escapeHtml;
const notice='<div class="warning"><strong>업체 직접 검증 전</strong><p>아래 장소는 외부 공개자료로 확인한 조사 후보입니다. 현재 영업·실내 동반·체중 및 견종 조건은 보장되지 않습니다. 방문 전에 매장에 직접 확인하세요.</p></div>';
const sections={
 cafes:{slug:'cafes',title:'애견동반 카페 찾기',desc:'지역별 반려견 동반 카페 후보와 공개자료 출처, 체중·실내 이용 확인 사항을 한곳에서 비교합니다.'},
 weekend:{slug:'weekend',title:'강아지랑 갈만한 곳 · 나들이 준비',desc:'반려견과 주말 나들이를 준비할 때 방문 후보, 이동·실내 규정, 운영 확인 사항을 살펴보는 가이드입니다.'},
 indoor:{slug:'indoor',title:'비 오는 날 · 실내 애견동반 장소 확인',desc:'비 오는 날 반려견과 실내에 갈 장소를 찾을 때 알아볼 입장·좌석·이동장 규정 안내입니다.'},
 restaurants:{slug:'restaurants',title:'강아지 동반 식당 찾기',desc:'하남 애견동반 식당 조사 후보와 이동장·견종·몸무게 조건 및 원문 출처를 방문 전에 확인하세요.'},
 stays:{slug:'stays',title:'애견동반 펜션 · 반려동물 동반 숙소 확인 가이드',desc:'애견동반 펜션, 독채, 풀빌라 등 숙소 예약 전 체중·마릿수·추가요금·공간 제한을 확인하는 가이드입니다. 등록 검증 숙소는 아직 없습니다.'}
};
function regionLinks(places){
 return '<div class="grid">'+Object.entries(REGIONS).map(([region,slug])=>{
 const n=places.filter(p=>p.region===region&&p.category==='카페').length;
 return '<article class="item"><h2><a href="../../regions/'+esc(slug)+'/">'+esc(region)+' 카페 후보 '+n+'곳</a></h2><p>확인된 영업 여부가 아닌 공개자료 조사 목록입니다.</p></article>';
 }).join('')+'</div>';
}
function cafesPage(places){
 const cafes=places.filter(p=>p.category==='카페');
 if(cafes.length===0)return null;
 const intro='<div class="eyebrow">애견동반 카페 / 지역별 조사</div><h1>강아지와 갈 카페를 찾고 있나요?</h1><p>소형견부터 중·대형견까지, 가장 먼저 볼 정보는 <strong>매장별 실제 동반 규정</strong>입니다. 같이가개의 장소 목록은 외부 공개자료에서 출발하며 업체의 최신 입장 승인은 아닙니다.</p>';
 const practical='<section class="panel"><h2>카페 선택 전에 확인할 세 가지</h2><ol><li><strong>입장 범위</strong> — 실내 전체, 일부 좌석, 테라스만 이용 가능한지</li><li><strong>반려견 조건</strong> — 몸무게·견종·마릿수, 케이지·목줄·매너벨트 규정</li><li><strong>방문일 운영</strong> — 오늘 휴무·예약·요금·주차 정보</li></ol><p>여기서 \"동반 가능\"이라는 표현은 과거 소개에 등장했을 수 있습니다. 현재 매장 규정 확인 없이 확정할 수 없습니다.</p></section>';
 const cards='<h2>지역별 공개자료 조사 장소</h2>'+regionLinks(cafes);
 const deep='<section class="panel"><h2>장소별 자료·출처 확인하기</h2><ul class="source">'+cafes.map(p=>'<li><a href="../../places/'+esc(p.id)+'/">'+esc(p.name)+'</a> <span class="muted">· '+esc(p.region)+' · '+esc(p.research?.level==='needs_identity'?'운영 여부 확인 필요':'최신 동반 규정 확인 필요')+'</span></li>').join('')+'</ul></section>';
 return shell(sections.cafes.title,sections.cafes.desc,intro+notice+practical+cards+deep);
}
function restaurantsPage(places){
 const restaurants=places.filter(p=>p.category==='식당');
 if(!restaurants.length)return null;
 const opening='<div class="eyebrow">애견동반 식당 / 공개자료 조사</div><h1>강아지와 식사할 곳을 찾고 계신가요?</h1><p>현재 직접 검증되지 않은 식당 '+restaurants.length+'곳의 공개자료를 조사했습니다. 이동장·유모차가 필수인지, 소형견과 중형견 기준이 무엇인지, 동반 가능한 좌석이 실내인지 먼저 확인하세요.</p>';
 const checklist='<section class="panel"><h2>식당을 선택하기 전 4가지 확인</h2><ol><li>실내 착석인지 테라스 한정인지 확인하세요.</li><li>반려견 체중·견종 제한과 이동장·유모차 필수 여부를 확인하세요.</li><li>식사 시간과 웨이팅 중 반려견 동반이 가능한지 물어보세요.</li><li>동반 가능한 마릿수, 매너벨트, 예약·추가요금을 확인하세요.</li></ol><p>아래 자료는 다른 플랫폼에 게시된 업체 안내를 참고한 것으로 현재 운영 조건을 보증하지 않습니다.</p></section>';
 const links='<h2>현재 조사된 식당 후보 '+restaurants.length+'곳</h2><div class="grid">'+restaurants.map(p=>'<article class="item"><div class="eyebrow">'+esc(p.region)+' · 업체 직접 검증 전</div><h2><a href="../../places/'+esc(p.id)+'/">'+esc(p.name)+'</a></h2><p>'+esc(p.research?.summary||'')+'</p><p class="muted">체중: '+esc(p.research?.weight||'미확인')+'</p><a href="../../places/'+esc(p.id)+'/">동반 조건·원문 확인 ↗</a></article>').join('')+'</div>';
 const last='<section class="panel"><h2>다른 조건으로 찾기</h2><div class="actions"><a href="../../?region=hanam&intent=cafes#results-title">하남 전체 조사 후보 보기</a><a href="../cafes/">애견동반 카페 후보</a></div></section>';
 return shell(sections.restaurants.title,sections.restaurants.desc,opening+notice+checklist+links+last);
}
function weekendPage(places){
 const intro='<div class="eyebrow">강아지랑 갈만한 곳 / 나들이 준비</div><h1>강아지랑 이번 주말, 어디 갈까요?</h1><p>나들이 목적부터 정하면 검색이 쉬워집니다. 현재 같이가개에는 카페·식당 조사 후보가 있지만 산책로·숙박 자료와 실제 동선·영업시간 검증이 없어 완성된 코스로 추천하지 않습니다.</p>';
 const checklist='<section class="panel"><h2>반려견 동반 나들이 3단계</h2><ol><li><strong>지역 정하기</strong> — 이동 가능한 하남·남양주·양평 중 원하는 곳 선택</li><li><strong>방문 후보 찾기</strong> — 카페 소개를 확인하고 실내 이용·운동 공간이 실제 제공되는지 확인</li><li><strong>출발 전 확인하기</strong> — 영업일, 입장 조건, 요금·주차·대기 여부를 전화로 점검</li></ol><p>공개자료의 매장별 조건이 상충할 수 있으므로 확정 코스와 이동시간은 제공하지 않습니다.</p></section>';
 const links='<h2>지역부터 살펴보세요</h2>'+regionLinks(places);
 const next='<section class="panel"><h2>함께 확인할 주제</h2><div class="actions"><a href="../cafes/">지역별 애견동반 카페</a><a href="../indoor/">비 오는 날 실내 동반 조건</a><a href="../../#search-form">반려견 조건 검색</a></div></section>';
 return shell(sections.weekend.title,sections.weekend.desc,intro+notice+checklist+links+next);
}
function indoorPage(places){
 const intro='<div class="eyebrow">실내 반려견 동반 / 날씨별 준비</div><h1>비 오는 날 강아지랑 갈 곳을 찾는다면</h1><p>반려견 동반 카페라는 소개만으로는 <strong>실내 좌석 출입이 가능한지</strong> 알 수 없습니다. 일부는 야외 테라스만 동반 가능하고, 좌석·층·견종 조건이 다를 수 있습니다.</p>';
 const checks='<section class="panel"><h2>반드시 구분해서 확인하세요</h2><ol><li><strong>실내 출입</strong> — 출입문을 통과할 수 있다는 의미인지, 실제 실내 좌석을 이용할 수 있는지</li><li><strong>자리와 방식</strong> — 이동장·유모차 필수, 안고 있기, 매너벨트·목줄 착용 여부</li><li><strong>방문일 상황</strong> — 비 오는 날 운영하는 공간과 시간, 실외석 폐쇄 여부</li></ol><p>현재 업체에 직접 확인한 실내 동반 가능 장소는 <strong>0곳</strong>입니다. 아래 링크는 실내가 확인된 추천 목록이 아니라 확인할 후보 자료입니다.</p></section>';
 const links='<h2>실내 조건을 확인할 카페 후보</h2>'+regionLinks(places);
 const explain='<section class="panel"><h2>방문 전에 이렇게 질문해 보세요</h2><p>“강아지를 데리고 방문하려고 합니다. 실내 좌석에 함께 들어갈 수 있나요? 몸무게·마릿수 제한이나 이동장 필수 규정이 있나요?”</p><div class="actions"><a href="../../#search-form">몸무게·지역별 조사 후보 검색</a><a href="../cafes/">애견동반 카페 후보 더 보기</a></div></section>';
 return shell(sections.indoor.title,sections.indoor.desc,intro+notice+checks+links+explain);
}
function staysPage(places){
 const stays=places.filter(p=>['펜션','숙소','호텔','캠핑장'].includes(p.category));
 if(stays.length)throw Error('숙소 실제 등록 시 안내 문구·검색 분기·공식 출처 검토 후 별도 배포 필요');
 const intro='<div class="eyebrow">반려동물 동반 숙소 / 예약 전 확인</div><h1>애견동반 펜션, 무엇부터 확인할까요?</h1><p><strong>애견동반 펜션</strong>과 <strong>반려동물 동반 숙소</strong>는 숙박 검색에 자주 쓰는 표현이지만, 반려동물 종류·체중·마릿수와 이용할 수 있는 공간은 시설마다 다릅니다. 독채나 풀빌라라는 이름만으로 반려견의 마당·수영장 이용을 보장할 수 없습니다.</p>';
 const current='<section class="panel"><h2>현재 등록된 숙소 '+stays.length+'곳</h2><p>업체 직접 검증 전 · 현재 같이가개에서 출처와 운영 조건을 확인해 게시한 숙소는 <strong>0곳</strong>입니다. 아직 예약 가능한 펜션 목록이나 가격·후기를 제공하지 않습니다. 카페·식당을 펜션으로 표시하지 않습니다.</p></section>';
 const details='<section class="panel"><h2>예약 전에 확인할 6가지</h2><ol><li><strong>반려동물 종류</strong> — 강아지 외 고양이 등도 허용하는지, 객실별 조건이 다른지</li><li><strong>몸무게·견종·마릿수</strong> — 소형견·대형견 기준, 맹견 등 제한, 다견 추가 허용 여부</li><li><strong>추가요금</strong> — 한 마리당 숙박 요금, 보증금, 청소비와 취소·환불 기준</li><li><strong>객실·독채·마당</strong> — 실내 출입, 침구 이용, 울타리와 문단속, 다른 투숙객과의 공용 공간</li><li><strong>수영장·편의시설</strong> — 반려견 수영 가능 여부, 계절 운영, 목욕 시설, 배변 처리 규정</li><li><strong>예약 가능한 날짜</strong> — 해당 객실의 실제 공실, 동반 조건 재확인과 예약 채널 원문</li></ol></section>';
 const search='<section class="panel"><h2>이런 검색어로 조건을 좁혀 보세요</h2><p>하남·남양주·양평 애견동반 펜션, 대형견 동반 독채 펜션, 다견 동반 숙소, 애견동반 풀빌라처럼 <strong>지역 + 반려견 조건 + 숙소 유형</strong>으로 확인하면 편리합니다. 이 문구는 검색 수요 실측치나 추천 순위가 아닙니다.</p><div class="actions"><a href="../../#quick-search-form">현재 조사 장소 검색</a><a href="../weekend/">반려견 나들이 준비</a></div><p class="muted">검색창에 펜션을 입력해도 확인된 숙소가 생기기 전에는 다른 업종을 대신 추천하지 않습니다.</p></section>';
 return shell(sections.stays.title,sections.stays.desc,intro+current+details+search);
}
export function buildIntentPages(places){
 if(!Array.isArray(places))throw Error('Venue data must be array');
 const cafes=cafesPage(places),outings=weekendPage(places),indoor=indoorPage(places);
 const restaurants=restaurantsPage(places);
 const pages={};
 if(cafes)pages['guides/cafes/index.html']=cafes;
 if(restaurants)pages['guides/restaurants/index.html']=restaurants;
 pages['guides/stays/index.html']=staysPage(places);
 // General guides have distinct practical content and do not invent business categories.
 if(places.length){pages['guides/weekend/index.html']=outings;pages['guides/indoor/index.html']=indoor;}
 return pages;
}
export function intentCards(places){
 const cafes=places.filter(p=>p.category==='카페').length;
 return [
  {id:'cafes',label:'애견동반 카페',subtitle:'지역별 카페 조사',href:cafes?'./guides/cafes/':null,count:cafes},
  {id:'weekend',label:'강아지랑 갈만한 곳',subtitle:'주말 나들이 준비',href:places.length?'./guides/weekend/':null,count:0},
  {id:'indoor',label:'실내 애견동반',subtitle:'비 오는 날 체크',href:places.length?'./guides/indoor/':null,count:0},
  {id:'restaurants',label:'강아지 동반 식당',subtitle:'공개자료 조사 후보',href:places.some(p=>p.category==='식당')?'./guides/restaurants/':null,count:places.filter(p=>p.category==='식당').length},
  {id:'stays',label:'애견동반 펜션·숙소',subtitle:'예약 전 확인 · 등록 숙소 0곳',href:'./guides/stays/',count:0}
 ];
}
