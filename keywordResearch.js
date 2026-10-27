// Search phrases are hypotheses, NOT measured monthly search volume or observed rankings.
export const SEARCH_INTENTS=Object.freeze([
 {id:'cafes',label:'애견동반 카페',guide:'guides/cafes/',variants:['{region} 애견동반 카페','{region} 반려견 동반 카페','{region} 강아지 동반 카페','{region} 애견카페','{region} 강아지랑 카페']},
 {id:'restaurants',label:'반려견 동반 식당',guide:'guides/restaurants/',variants:['{region} 애견동반 식당','{region} 강아지 동반 식당','{region} 반려견 동반 식당','{region} 애견동반 맛집','{region} 강아지랑 밥먹을곳']},
 {id:'weekend',label:'강아지랑 갈만한 곳',guide:'guides/weekend/',variants:['{region} 강아지랑 갈만한곳','{region} 반려견 동반 나들이','{region} 강아지 데리고 갈곳','{region} 반려견 여행 코스','{region} 강아지랑 주말 나들이']},
 {id:'indoor',label:'실내 애견동반',guide:'guides/indoor/',variants:['{region} 실내 애견동반','{region} 실내 강아지 동반','{region} 비오는날 강아지랑 갈곳','{region} 실내 애견동반 카페','{region} 비오는날 반려견 나들이']},
 {id:'parks',label:'강아지 운동장·공원',guide:null,variants:['{region} 강아지 운동장','{region} 애견 운동장','{region} 소형견 운동장','{region} 대형견 운동장','{region} 강아지 산책 공원']},
 {id:'stays',label:'반려견 동반 숙소',guide:'guides/stays/',variants:['{region} 애견동반 펜션','{region} 반려동물 동반 숙소','{region} 대형견 동반 펜션','{region} 애견동반 독채 펜션','{region} 다견 동반 숙소']}
]);
export function keywordHypotheses(places,regions=['하남','남양주','양평']){
 if(!Array.isArray(places)||!Array.isArray(regions))throw Error('Expected venue and region arrays');
 const rows=[];
 for(const intent of SEARCH_INTENTS)for(const region of regions){
  const placeCount=places.filter(p=>p.region===region&&(intent.id==='cafes'?p.category==='카페':intent.id==='restaurants'?p.category==='식당':false)).length;
  const relatedCafeCount=places.filter(p=>p.region===region&&p.category==='카페').length;
  const guide=intent.guide&&((['cafes','restaurants'].includes(intent.id)&&placeCount>0)||((intent.id==='weekend'||intent.id==='indoor')&&relatedCafeCount>0)||intent.id==='stays')?intent.guide:null;
  for(const v of intent.variants){
   rows.push({keyword:v.replace('{region}',region),intent:intent.id,region,
    landingRoute:guide||'',evidencePlaceCount:['cafes','restaurants'].includes(intent.id)?placeCount:0,
    researchSupport:intent.id==='cafes'&&placeCount?'public_cafe_candidates':intent.id==='restaurants'&&placeCount?'public_restaurant_candidates':(guide?'guide_only_no_verified_matching_venues':'no_research_places'),
    measuredMonthlySearchVolume:null,measuredCompetition:null,measurementStatus:'unmeasured_hypothesis',validatedBySearchConsole:false});
  }
 }
 return rows;
}
export function keywordHypothesisCsv(rows){
 const keys=['keyword','intent','region','landingRoute','evidencePlaceCount','researchSupport','measuredMonthlySearchVolume','measuredCompetition','measurementStatus','validatedBySearchConsole'];
 const cell=x=>'"'+String(x??'').replaceAll('"','""').replace(/^[=+@-]/,c=>"'"+c)+'"';
 return '\uFEFF'+[keys.join(','),...rows.map(row=>keys.map(k=>cell(row[k])).join(','))].join('\r\n')+'\r\n';
}
