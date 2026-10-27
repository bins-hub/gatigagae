// Conservative keyword interpretation: discover research candidates, never certify admission.
const REGION_NAMES=['하남','남양주','양평'];
// Known out-of-coverage city/district names must not match incidental street-name substrings.
const OUTSIDE_LOCATION_TERMS=new Set(['서울','강남','강북','송파','강동','서초','마포','수원','성남','구리','인천','부산','대전','대구','고양','일산','용인','가평','광명','과천','동탄','안양','의정부']);
const common=new Set(['애견동반','반려견동반','강아지동반','애견','반려견','강아지','댕댕이','강아지랑','반려견과','강아지와','갈만한곳','갈곳','가볼만한곳','동반','가능','추천','근처','오늘','주말','나들이','갈만한','비오는날','비','실내','야외','테라스','소형견','중형견','대형견','반려동물','함께','경기도','경기']);
const cafe=new Set(['카페','애견카페','커피숍','커피']);
const unsupported={
 restaurants:new Set(['식당','맛집','음식점','레스토랑','밥집']),
 stays:new Set(['펜션','숙소','숙박','호텔','캠핑장']),
 parks:new Set(['공원','운동장','산책로'])
};
function tokens(query){return String(query||'').normalize('NFKC').trim().toLowerCase().split(/[\s,/.!?·()[\]{}]+/u).filter(Boolean);}
export function interpretPlaceQuery(query){
 const terms=tokens(query);
 if(!terms.length)return {region:null,type:null,rest:[],unsupported:false,raw:''};
 const regions=REGION_NAMES.filter(x=>terms.some(t=>t===x||t===x+'시'||t===x+'군'));
 const region=regions.length===1?regions[0]:null;
 const conflictingRegion=regions.length>1;
 let type=null;
 for(const [k,names] of Object.entries(unsupported))if(terms.some(t=>names.has(t)))type=k;
 if(!type&&terms.some(t=>cafe.has(t)))type='cafes';
 const rest=terms.filter(t=>{
  if(REGION_NAMES.some(x=>t===x||t===x+'시'||t===x+'군'))return false;
  if(common.has(t)||cafe.has(t)||Object.values(unsupported).some(group=>group.has(t)))return false;
  return true;
 });
 return {region,type,rest,unsupported:type!==null&&type!=='cafes',conflictingRegion,raw:terms.join(' ')};
}
export function queryMatchesPlace(place,query){
 const parsed=interpretPlaceQuery(query);
 if(!parsed.raw)return true;
 if(parsed.conflictingRegion||(parsed.unsupported&&parsed.type!=='restaurants'))return false;
 if(!parsed.region&&parsed.rest.some(t=>OUTSIDE_LOCATION_TERMS.has(t)))return false;
 if(parsed.region&&place.region!==parsed.region)return false;
 if(parsed.type==='cafes'&&place.category!=='카페')return false;
 if(parsed.type==='restaurants'&&place.category!=='식당')return false;
 const address=String(place.research?.address||'');
 const hay=[place.name,place.region,place.category,address].join(' ').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
 return parsed.rest.every(t=>hay.includes(t.replace(/\s+/g,'')));
}

export function queryCaution(query){
 const terms=String(query||'').normalize('NFKC').trim().toLowerCase().split(/[\s,/.!?·()[\]{}]+/u).filter(Boolean);
 if(!terms.length)return '';
 const notices=[];
 if(terms.some(t=>['근처','가까운','내주변','내주위','주변','여기서','내근처'].includes(t)))
  notices.push('현재 위치 권한과 실제 좌표가 연결되지 않아 거리순·가까운 순서가 아닙니다.');
 if(terms.some(t=>['오늘','지금','현재','영업중','오픈','영업','오늘영업','오늘문연'].includes(t)))
  notices.push('현재 영업 여부와 휴무일은 실시간으로 확인되지 않았습니다.');
 if(terms.some(t=>['실내','비오는날','우천','비','눈오는날','장마'].includes(t)))
  notices.push('실내 좌석 동반 가능 여부는 업체의 최신 규정으로 확인되지 않았습니다.');
 if(terms.some(t=>['입장가능','동반가능','확실히','가능한'].includes(t)))
  notices.push('이 목록은 입장을 확약하지 않으며 방문 전 매장 확인이 필요합니다.');
 return notices.join(' ');
}
