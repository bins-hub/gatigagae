import {REGIONS,shell,escapeHtml} from './staticPages.js';
const esc=escapeHtml;
const notice='<div class="warning"><strong>업체 직접 검증 전</strong><p>아래 장소는 외부 공개자료로 확인한 조사 후보입니다. 현재 영업·실내 동반·체중 및 견종 조건은 보장되지 않습니다. 방문 전에 매장에 직접 확인하세요.</p></div>';
const sections={
 cafes:{slug:'cafes',title:'애견동반 카페 찾기',desc:'지역별 반려견 동반 카페 후보와 공개자료 출처, 체중·실내 이용 확인 사항을 한곳에서 비교합니다.'},
 weekend:{slug:'weekend',title:'강아지랑 갈만한 곳 · 나들이 준비',desc:'반려견과 주말 나들이를 준비할 때 방문 후보, 이동·실내 규정, 운영 확인 사항을 살펴보는 가이드입니다.'},
 indoor:{slug:'indoor',title:'비 오는 날 · 실내 애견동반 장소 확인',desc:'비 오는 날 반려견과 실내에 갈 장소를 찾을 때 알아볼 입장·좌석·이동장 규정 안내입니다.'}
};
function regionLinks(places){
 return '<div class="grid">'+Object.entries(REGIONS).map(([region,slug])=>{
 const n=places.filter(p=>p.region===region).length;
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
function weekendPage(places){
 const intro='<div class="eyebrow">강아지랑 갈만한 곳 / 나들이 준비</div><h1>강아지랑 이번 주말, 어디 갈까요?</h1><p>나들이 목적부터 정하면 검색이 쉬워집니다. 현재 같이가개는 <strong>카페 조사 후보만</strong> 수록하고 있어 산책로·식당·숙박을 실제 동선으로 묶어 추천하지는 않습니다.</p>';
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
export function buildIntentPages(places){
 if(!Array.isArray(places))throw Error('Venue data must be array');
 const cafes=cafesPage(places),outings=weekendPage(places),indoor=indoorPage(places);
 const pages={};
 if(cafes)pages['guides/cafes/index.html']=cafes;
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
  {id:'restaurants',label:'강아지 동반 식당',subtitle:'식당 자료 조사 중',href:null,count:0}
 ];
}