// Personal visit planning only. A checked box is NOT venue verification.
export const VISIT_CHECK_ITEMS=Object.freeze([
 {id:'open',label:'방문일 영업·휴무와 예약 필요 여부',question:'오늘 방문 가능한지, 예약이 필요한지 확인했나요?'},
 {id:'inside',label:'실내 좌석·테라스·실외 이용 범위',question:'실내 좌석까지 반려견과 들어갈 수 있나요?'},
 {id:'pet',label:'몸무게·견종·동반 마릿수 제한',question:'우리 강아지 크기와 동반 마릿수로 이용할 수 있나요?'},
 {id:'rules',label:'목줄·이동장·매너벨트 등 필수 규정',question:'이동장이나 필수 용품이 따로 있나요?'},
 {id:'cost',label:'입장료·추가 요금·주차 여부',question:'추가 요금과 주차 조건은 어떻게 되나요?'}
]);
export function visitChecklistHtml(){
 const rows=VISIT_CHECK_ITEMS.map(item=>'<label class="visit-check-row"><input type="checkbox" name="visit-'+item.id+'" value="'+item.id+'"><span>'+item.label+'</span></label>').join('');
 return '<section class="panel visit-check-panel" id="visit-check" aria-labelledby="visit-title">'+
 '<h2 id="visit-title">방문 전 확인 체크리스트</h2>'+
 '<p>가게에 직접 물어보고 <strong>내가 확인한 항목만</strong> 체크하세요. 이 체크는 개인 준비용이며, 업체 공식 검증이나 현재 입장 가능 보증이 아닙니다.</p>'+
 '<fieldset><legend>업체에 직접 확인할 5가지</legend>'+rows+'</fieldset>'+
 '<div class="visit-progress"><p id="visit-progress" role="status" aria-live="polite">확인 표시 0 / '+VISIT_CHECK_ITEMS.length+' · 업체 공식 확인과 별개입니다.</p>'+
 '<button type="button" id="visit-clear">체크 초기화</button></div>'+
 '<div class="actions"><button type="button" id="visit-copy">문의할 질문 복사</button></div>'+
 '<p class="muted" id="visit-copy-status" role="status" aria-live="polite">문의 문구는 복사만 하며, 자동으로 업체에 발송되지 않습니다. 체크 항목은 저장되지 않습니다.</p>'+
 '</section>';
}
export const VISIT_CHECK_SCRIPT='<script>'+
'(()=>{'+
'const wrap=document.getElementById("visit-check");if(!wrap)return;'+
'const checks=[...wrap.querySelectorAll("input[type=checkbox]")];'+
'const label=wrap.querySelector("#visit-progress");'+
'const count=()=>{label.textContent="확인 표시 "+checks.filter(x=>x.checked).length+" / "+checks.length+" · 업체 공식 확인과 별개입니다."};'+
'wrap.addEventListener("change",count);'+
'wrap.querySelector("#visit-clear").addEventListener("click",()=>{checks.forEach(x=>{x.checked=false});count();});'+
'wrap.querySelector("#visit-copy").addEventListener("click",()=>{'+
'const name=document.querySelector("main h1")?.textContent||"해당 매장";'+
'const text="안녕하세요. "+name+" 방문 문의드립니다. ① 방문일 영업 및 예약 필요 여부 ② 반려견 실내·테라스 이용 범위 ③ 체중·견종·마릿수 제한 ④ 이동장·목줄·매너벨트 규정 ⑤ 입장료·추가 요금·주차 조건을 확인 부탁드립니다. 감사합니다.";'+
'const status=wrap.querySelector("#visit-copy-status");'+
'const fallback=()=>{window.prompt("아래 질문을 복사하세요",text);status.textContent="문의 질문 창을 열었습니다. 업체에 자동 발송되지 않았습니다."};'+
'if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>status.textContent="문의 질문을 복사했습니다. 업체에 직접 보내세요.").catch(fallback);else fallback();'+
'});'+
'})();'+
'</script>';
