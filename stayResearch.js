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
 ,{
  id:'gapyeong-art',name:'가평 아트 애견동반 펜션',region:'가평',area:'청평면',
  evidence:'공식 이용안내는 전 객실에 7kg 이하 반려견 1마리를 동반할 수 있다고 안내합니다. 반려묘는 제외됩니다.',
  sourceLabel:'아트 펜션 · 공식 이용안내',sourceUrl:'https://www.art-petps.kr/reservation.html',
  reviewedOn:'2026-10-29',pending:'예약할 날짜의 객실 운영 여부, 반려견 요금 변경 여부, 마당·침구 이용 범위',
  conditions:{weight:'7kg 이하',dogs:'객실당 1마리',fee:'반려견 1마리 1박 10,000원 · 현장결제 안내',rooms:'전 객실 동반 안내 · 반려견만 가능, 반려묘 불가',facilities:'마당·침구·부대시설의 반려견 이용 범위는 별도 문의',address:'경기 가평군 청평면 고재길 13-30'},
  operatorVerified:false,bookableVerified:false
 },
 {
  id:'gapyeong-skybridge',name:'가평 하늘다리 애견동반 펜션',region:'가평',area:'북면',
  evidence:'공식 이용안내는 지정 객실 4종에서 10kg 이하 반려견을 최대 2마리까지 동반하도록 안내합니다. 반려견의 수영장·히노끼탕 이용은 금지됩니다.',
  sourceLabel:'하늘다리 펜션 · 공식 이용안내',sourceUrl:'https://gpskybridge.co.kr/reservation.html',
  reviewedOn:'2026-10-29',pending:'반려견 동반 지정 객실의 공실, 체중별 추가요금 변경, 견종·비품과 현장 확인 절차',
  conditions:{weight:'10kg 초과 입실 불가 안내',dogs:'최대 2마리',fee:'1마리·1박 기준 5kg 미만 10,000원 / 5~10kg 15,000원 · 현장결제 안내',rooms:'갈리아노·맥칼란·페노드·듀어스만 동반 안내',facilities:'반려견 수영장·히노끼탕 이용 불가 / 바비큐장 동반 안내',address:'경기 가평군 북면 백둔로467번길 2'},
  operatorVerified:false,bookableVerified:false
 },
 {
  id:'yangpyeong-blossom',name:'양평 블러썸 애견동반 스파 펜션',region:'양평',area:'서종면',
  evidence:'공식 이용안내는 전 객실에 4kg 이하 소형견 1마리 동반과 사전 문의·유선 예약을 안내합니다. 객실 스파 안내만으로 반려견 입수를 판단하면 안 됩니다.',
  sourceLabel:'블러썸 펜션 · 공식 이용안내',sourceUrl:'https://blossomps.kr/reservation.html',
  reviewedOn:'2026-10-29',pending:'희망 객실의 동반 수락과 유선 예약, 배변훈련·털빠짐·공격성 조건, 스파의 반려견 이용 여부',
  conditions:{weight:'4kg 이하 소형견',dogs:'객실당 1마리',fee:'반려견 1마리 1박 10,000원 · 현장결제 안내',rooms:'전 객실 동반 안내 · 사전 문의 및 유선 예약 필수',facilities:'스파의 반려견 입수 허용 여부는 미확인 · 별도 문의',address:'경기 양평군 서종면 도장계곡길 33'},
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
