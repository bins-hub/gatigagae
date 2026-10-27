// Research leads are not published venue records and never imply bookable inventory.
export const stayResearchLeads=Object.freeze([
 {
  id:'ddstarforest',name:'댕댕별숲',region:'양평',area:'용문면',
  evidence:'한국관광공사 숙박 안내에 독채형 애견동반 숙소와 잔디 마당으로 소개됨',
  sourceLabel:'한국관광공사 · 열린관광',
  sourceUrl:'https://access.visitkorea.or.kr/acm/detail.do?cotId=92d56d21-9699-4ddf-826b-a42205b4eea7',
  reviewedOn:'2026-10-27',pending:'객실별 견종·체중·마릿수 제한, 추가요금, 예약 가능 날짜와 현재 운영 조건',
  operatorVerified:false,bookableVerified:false
 },
 {
  id:'seojongpool',name:'양평 서종풀 애견동반 펜션',region:'양평',area:'서종면',
  evidence:'숙소 홈페이지의 객실 안내에 애견동반·독채 객실과 대형견 표기 객실이 있음',
  sourceLabel:'서종풀 · 숙소 공식 객실 안내',
  sourceUrl:'https://seojongpool.kr/room.html?room_id=33741',
  reviewedOn:'2026-10-27',pending:'실제 투숙 객실의 견종·체중·마릿수 기준, 반려견 추가요금, 예약 가능 날짜',
  operatorVerified:false,bookableVerified:false
 }
]);

export function validateStayResearch(leads){
 if(!Array.isArray(leads))return ['숙소 조사 후보는 배열이어야 합니다'];
 const errors=[],seen=new Set();
 for(const item of leads){
  if(!item||typeof item!=='object'){errors.push('잘못된 숙소 후보');continue;}
  if(!/^[a-z0-9-]{2,50}$/.test(item.id||'')||seen.has(item.id))errors.push('숙소 후보 ID 중복 또는 형식 오류');
  seen.add(item.id);
  for(const key of ['name','region','area','evidence','sourceLabel','pending'])if(typeof item[key]!=='string'||!item[key].trim())errors.push(item.id+': '+key+' 누락');
  try{const u=new URL(item.sourceUrl);if(u.protocol!=='https:'||u.username||u.password)throw Error();}catch{errors.push(item.id+': HTTPS 출처 필수');}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(item.reviewedOn||''))errors.push(item.id+': 자료 조사일 필수');
  if(item.operatorVerified!==false||item.bookableVerified!==false)errors.push(item.id+': 승인되지 않은 운영·예약 검증 표시');
 }
 return errors;
}

// Copy-only inquiry draft. No visitor information is collected or transmitted.
export function buildStayInquiry(lead){
 if(!lead||!stayResearchLeads.some(item=>item.id===lead.id))throw Error('등록되지 않은 숙소 조사 후보');
 return `[${lead.name}] 반려동물 동반 숙박 문의드립니다.\n\n`+
  `희망 날짜: (체크인/체크아웃 직접 입력)\n희망 객실: (객실명 직접 입력)\n반려동물: (종류/견종/몸무게/마릿수 직접 입력)\n\n`+
  `1. 해당 날짜와 객실에 반려동물 동반 및 실제 예약이 가능한가요?\n`+
  `2. 견종·몸무게·마릿수별 제한과 추가요금/보증금은 어떻게 되나요?\n`+
  `3. 객실·침구·마당·수영장 등 이용 가능 구역과 필수 준비물은 무엇인가요?\n`+
  `4. 취소·환불 규정과 공식 예약 방법은 무엇인가요?\n\n`+
  `※ 공개자료 조사 후보를 보고 문의드리며, 최신 운영 조건을 확인받고 싶습니다.`;
}
