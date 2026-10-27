// Missing or unverified policies must never turn into an admission promise.
export function matchPlace(place, {weight, zone = 'any'}, today = new Date().toISOString().slice(0,10)) {
  if (!Number.isFinite(weight) || weight <= 0 || weight > 150) return {state:'invalid', label:'몸무게를 확인해 주세요'};
  const p = place.policy;
  if (!p || !p.verifiedOn || !p.sourceUrl || p.conflict) return {state:'unknown', label:'확인 필요'};
  const age = (Date.parse(today) - Date.parse(p.verifiedOn)) / 86400000;
  if (!Number.isFinite(age) || age < 0 || age > 90) return {state:'unknown', label:'최신 규정 확인 필요'};
  if (p.maxKg != null && (weight > p.maxKg || (weight === p.maxKg && p.inclusive === false))) return {state:'excluded', label:'몸무게 조건 초과'};
  if (zone !== 'any' && p.zones?.[zone] === false) return {state:'excluded', label:'선택한 공간 동반 불가'};
  if (zone === 'any' && p.zones?.indoor !== true && p.zones?.outdoor !== true) return {state:'unknown', label:'동반 공간 확인 필요'};
  if ((p.maxKg == null && p.unlimited !== true) || (zone !== 'any' && p.zones?.[zone] !== true)) return {state:'unknown', label:'확인 필요'};
  return {state:'conditional', label:'안내 조건에 맞음 · 추가 규정 확인'};
}
