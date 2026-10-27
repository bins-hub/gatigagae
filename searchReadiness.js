// Readiness report is advisory. Nothing in this module can change robots or noindex.
export function searchReadiness(places,{operatorContactPublished=false,correctionChannelAvailable=false,measurementCount=0}={}){
 if(!Array.isArray(places))throw Error('Place dataset required');
 const verified=places.filter(p=>!!p.policy?.verifiedOn).length;
 const categories=[...new Set(places.map(p=>p.category))].sort();
 const regions=[...new Set(places.map(p=>p.region))].sort();
 const blockers=[];
 if(verified===0)blockers.push('업체 직접 검증 장소가 없어 현행 동반 규정을 보장할 수 없음');
 if(!operatorContactPublished)blockers.push('운영자·관리 주체 연락처 미공개');
 if(!correctionChannelAvailable)blockers.push('정보 정정 접수 경로 미제공');
 return {
  checkedFor:'public-search-indexing-quality-review',
  researchCandidates:places.length,
  directlyVerifiedVenueCount:verified,
  regions,categories,
  keywordRowsWithOperatorSuppliedMetrics:measurementCount,
  prerequisitesSatisfied:!blockers.length,
  automaticIndexingAllowed:false,
  manualIndexingDecisionRequired:true,
  blockers,
  notes:['키워드 검색량 미측정은 콘텐츠 실제 이용 가능 여부와 다른 문제입니다.',
  '검색량·광고 경쟁 지표는 장소 동반 규정을 검증하지 않습니다.',
  '색인 차단 해제는 본 검사 결과로 자동 실행하지 않습니다.']
 };
}
