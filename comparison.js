// Comparison is based on existing sourced research, never inferred admission rules.
export function placesForComparison(places,ids){
 return [...new Set(ids)].map(id=>places.find(p=>p.id===id)).filter(Boolean).slice(0,3);
}
export function comparisonTableHtml(selected){
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const entries=placesForComparison(selected,selected.map(p=>p.id));
 if(entries.length<2)return '';
 const rows=[['지역·업종',p=>`${p.region} · ${p.category}`],['공개자료 체중',p=>p.research?.weight],['실내 동반',p=>p.research?.indoor],['실외·운동장',p=>p.research?.outdoor],['요금 안내',p=>p.research?.fee],['영업 안내',p=>p.research?.hours],['견종 조건',p=>p.research?.additionalConditions?.breed],['마릿수 조건',p=>p.research?.additionalConditions?.dogs],['주소',p=>p.research?.address],['외부자료 확인일',p=>p.research?.reviewedOn],['업체 직접 확인일',p=>p.policy?.verifiedOn||'아직 직접 확인하지 않음'],['주의사항',p=>p.research?.warning||'방문 전 최신 동반 조건·영업 여부를 업체에 확인하세요.']];
 return `<p class="comparison-warning">외부 공개자료 비교입니다. 자료 확인일은 업체 검증일이 아니며, 미확인은 이용 가능을 뜻하지 않습니다. 주차 조건은 각 업체에 별도로 문의하세요.</p><p>표를 좌우로 밀어 다른 장소의 조건을 확인하세요.</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="장소 조건 비교표, 좌우 스크롤"><table><caption>선택한 ${entries.length}곳의 반려견 동반 조건 비교</caption><thead><tr><th scope="col">비교 항목</th>${entries.map(p=>`<th scope="col"><a href="./places/${encodeURIComponent(p.id)}/">${escape(p.name)}</a></th>`).join('')}</tr></thead><tbody>${rows.map(([label,get])=>`<tr><th scope="row">${label}</th>${entries.map(p=>`<td>${escape(get(p)||'미확인 · 업체 문의 필요')}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">근거·방문 준비</th>${entries.map(p=>`<td><a href="./places/${encodeURIComponent(p.id)}/#visit-check">출처·방문 전 체크</a></td>`).join('')}</tr></tbody></table></div>`;
}
