// Public third-party descriptions are leads, never confirmed admission permission.
export function assessPublicInfo(place, weight) {
  if (!Number.isFinite(weight) || weight <= 0 || weight > 150) return {state:'unknown',label:'체중 입력 확인'};
  const r = place?.research || {};
  const lim = r.weightLimit;
  if (lim && Number.isFinite(lim.maxKg)) {
    if (lim.type === 'conflicting') return {state:'caution',label:'공개자료 체중 조건 상충'};
    if (weight > lim.maxKg || (weight === lim.maxKg && lim.inclusive === false))
      return {state:'restricted',label:'공개자료상 체중 제한 가능'};
    if (weight === lim.maxKg && lim.inclusive == null)
      return {state:'caution',label:'체중 경계·문의 필요'};
  }
  if (['conflict','boundary','needs_identity'].includes(r.level))
    return {state:'caution',label:'정보 충돌·운영 확인 필요'};
  if (r.level === 'public_info') return {state:'unverified',label:'지자체 정보·매장 확인 전'};
  if (r.level === 'listing') return {state:'unverified',label:'외부 소개·매장 확인 전'};
  return {state:'unknown',label:'추가 정보 필요'};
}
