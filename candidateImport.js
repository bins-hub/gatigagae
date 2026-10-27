// Incoming candidate staging: never writes places.json or makes an admission promise.
const isDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const link=s=>typeof s==='string'&&/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(s);
const key=(name,region)=>String(region||'').normalize('NFKC').trim().toLocaleLowerCase('ko')+'|'+String(name||'').normalize('NFKC').trim().toLocaleLowerCase('ko').replace(/\s+/g,'');
export function stagePlaceCandidates(existing,candidates,{supportedRegions=['하남','남양주','양평']}={}){
 if(!Array.isArray(existing)||!Array.isArray(candidates)||candidates.length>300)throw Error('Existing/candidate inputs must be arrays with at most 300 incoming rows');
 const takenIds=new Set(existing.map(p=>p.id));
 const takenNames=new Set(existing.map(p=>key(p.name,p.region)));
 const result=[],errors=[];
 for(const [index,p] of candidates.entries()){
  const issues=[];
  const id=String(p?.id||'').trim(),name=String(p?.name||'').trim(),region=String(p?.region||'').trim(),category=String(p?.category||'').trim();
  if(!/^[a-z0-9-]{2,65}$/.test(id))issues.push('유효한 장소 ID가 필요함');
  if(name.length<2||name.length>120)issues.push('상호명 길이 오류');
  if(!region||region.length>50)issues.push('지역명 오류');
  if(!category||category.length>50)issues.push('종류 오류');
  if(!link(p?.discoveryUrl))issues.push('HTTPS 자료 출처 필요');
  if(!isDate(p?.discoveredOn))issues.push('자료 발견일 확인 필요');
  if(takenIds.has(id))issues.push('기존 또는 신규 장소 ID 중복');
  if(takenNames.has(key(name,region)))issues.push('같은 지역에 동일 상호 후보 중복');
  if(!supportedRegions.includes(region))issues.push('새 지역은 지역 페이지 개발 후 반영 가능');
  takenIds.add(id);takenNames.add(key(name,region));
  // Even a zero-issue candidate stays pending: a URL is not venue verification.
  const row={id,name,region,category,discoveryUrl:p?.discoveryUrl||'',discoveredOn:p?.discoveredOn||'',
   status:'pending_manual_research',policyVerified:false,eligibleForAutoPublish:false,issues};
  result.push(row);
  if(issues.length)errors.push({row:index+1,id,issues});
 }
 return {total:result.length,readyForManualReview:result.filter(x=>!x.issues.length).length,
  automaticallyPublishable:0,staged:result,errors};
}
