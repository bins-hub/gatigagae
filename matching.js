// Confirmed policy matching. Third-party research must not imply admission.
const DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
export function matchPlace(place, {weight, zone='any', breed='', dogs=1, day='any'}, today=new Date().toISOString().slice(0,10)) {
  if (!Number.isFinite(weight) || weight<=0 || weight>150 || !Number.isInteger(dogs) || dogs<1 || dogs>10 || !['any',...DAYS].includes(day) || !['any','indoor','outdoor'].includes(zone)) {
    return {state:'invalid',label:'검색 조건을 확인해 주세요'};
  }
  const p=place?.policy;
  if (!p || !p.verifiedOn || !p.sourceUrl || p.conflict) return {state:'unknown',label:'업체 최신 규정 확인 필요'};
  const verifiedAt=Date.parse(p.verifiedOn+'T00:00:00Z');
  const current=Date.parse(today+'T00:00:00Z');
  const age=(current-verifiedAt)/86400000;
  if (!Number.isFinite(age) || age<0 || age>90) return {state:'unknown',label:'업체 재확인 필요'};
  if (p.maxKg!=null && (weight>p.maxKg || (weight===p.maxKg && p.inclusive===false))) return {state:'excluded',label:'공식 체중 제한'};
  if (p.minKg!=null && (weight<p.minKg || (weight===p.minKg && p.minInclusive===false))) return {state:'excluded',label:'공식 최소 체중 제한'};
  if (zone!=='any' && p.zones?.[zone]===false) return {state:'excluded',label:'선택한 공간 이용 불가'};
  if (day!=='any' && p.days?.[day]===false) return {state:'excluded',label:'선택한 요일 이용 불가'};
  if (p.maxDogs!=null && dogs>p.maxDogs) return {state:'excluded',label:'동반 마릿수 초과'};
  const normalized=String(breed||'').trim().toLocaleLowerCase('ko');
  const blocked=(p.breeds?.blocked||[]).map(s=>String(s).trim().toLocaleLowerCase('ko'));
  const allowed=(p.breeds?.allowed||[]).map(s=>String(s).trim().toLocaleLowerCase('ko'));
  if (normalized && blocked.includes(normalized)) return {state:'excluded',label:'해당 견종 제한'};
  if (normalized && allowed.length && !allowed.includes(normalized)) return {state:'unknown',label:'해당 견종 확인 필요'};
  if (zone==='any' && p.zones?.indoor!==true && p.zones?.outdoor!==true) return {state:'unknown',label:'동반 공간 확인 필요'};
  if (zone!=='any' && p.zones?.[zone]!==true) return {state:'unknown',label:'공간 이용 확인 필요'};
  if (p.maxKg==null && p.unlimited!==true) return {state:'unknown',label:'체중 상한 확인 필요'};
  if (day!=='any' && p.days?.[day]!==true) return {state:'unknown',label:'요일별 규정 확인 필요'};
  if (dogs>1 && p.maxDogs==null) return {state:'unknown',label:'다견 동반 규정 확인 필요'};
  if (!normalized && (blocked.length>0 || allowed.length>0)) return {state:'unknown',label:'견종 선택 확인 필요'};
  if (normalized && p.breeds?.allAllowed!==true && allowed.length===0 && blocked.length===0) return {state:'unknown',label:'견종별 규정 확인 필요'};
  return {state:'conditional',label:'확인된 조건과 일치 · 방문 전 재문의'};
}
