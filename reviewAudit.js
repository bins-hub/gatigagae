// Operations report only. Never infer an official admission policy from public descriptions.
export function auditPlaces(places,{asOf='2026-10-27'}={}){
 const current=Date.parse(asOf+'T00:00:00Z');
 if(!Number.isFinite(current))throw Error('Invalid audit date');
 return places.map(place=>{
  const r=place.research||{};
  const reasons=[];
  let rank=4;
  const flag=(importance,reason)=>{rank=Math.min(rank,importance);reasons.push(reason);};
  if(r.level==='needs_identity')flag(0,'운영·상호 동일성 미확인');
  if(r.level==='conflict')flag(0,'공개자료 상충');
  if(r.level==='boundary')flag(1,'체중 기준 경계 모호');
  if(!r.address)flag(0,'주소 확정 불가');
  if(!r.phone)flag(2,'연락처 미확인');
  if(!r.sources?.length)flag(0,'자료 출처 없음');
  if(!place.policy?.verifiedOn)flag(2,'업체 직접 규정 검증 필요');
  const reviewed=Date.parse((r.reviewedOn||'')+'T00:00:00Z');
  const days=Number.isFinite(reviewed)?Math.floor((current-reviewed)/86400000):null;
  if(days==null || days<0)flag(0,'조사 날짜 오류·미래 날짜');
  else if(days>90)flag(1,'외부 자료 조사 90일 경과');
  return {id:place.id,name:place.name,region:place.region,priority:rank===0?'긴급':rank===1?'높음':rank===2?'보통':'낮음',
   score:rank,daysSinceResearch:days,verified:!!place.policy?.verifiedOn,sourceCount:r.sources?.length||0,
   reasons:reasons.length?reasons:['현행 규정 재검증 대기']};
 }).sort((a,b)=>a.score-b.score||a.name.localeCompare(b.name,'ko'));
}
export function auditCsv(items){
 const quote=value=>'"'+String(value??'').replaceAll('"','""').replace(/^[=+@-]/,x=>"'"+x)+'"';
 const rows=[['id','name','region','priority','research_age_days','official_policy_verified','source_count','recheck_reasons']];
 for(const a of items)rows.push([a.id,a.name,a.region,a.priority,a.daysSinceResearch,a.verified,a.sourceCount,a.reasons.join(' / ')]);
 return '\uFEFF'+rows.map(row=>row.map(quote).join(',')).join('\r\n')+'\r\n';
}
