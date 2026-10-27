// Explain the evidence state of public RESEARCH, not approval or current admission.
export const RESEARCH_LABELS=Object.freeze({
 needs_identity:{label:'운영·상호 동일성 확인 필요',warning:'영업 여부·같은 매장인지부터 확인해야 합니다.'},
 conflict:{label:'공개자료 간 조건 상충',warning:'자료마다 주소·체중·영업 규정 등이 다릅니다.'},
 boundary:{label:'체중 경계·조건 모호',warning:'제한 기준의 미만·이하 등 경계가 분명하지 않습니다.'},
 public_info:{label:'공공 관광자료 조사',warning:'공공기관 소개가 업체 현재 입장 허용을 뜻하지 않습니다.'},
 listing:{label:'외부 플랫폼 자료 조사',warning:'외부 소개 자료는 업체의 최신 운영 안내가 아닙니다.'}
});
export function researchState(place,{asOf}={}){
 const r=place?.research||{},model=RESEARCH_LABELS[r.level]||{label:'자료 검토 필요',warning:'정확한 정보 출처를 확인해야 합니다.'};
 const now=asOf||new Date().toISOString().slice(0,10);
 const day=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
 const date=day(r.reviewedOn)?r.reviewedOn:null,valid=day(now);
 const days=date&&valid?Math.round((Date.parse(now+'T00:00:00Z')-Date.parse(date+'T00:00:00Z'))/86400000):null;
 const ageIssue=days===null?'확인일 오류·누락':days<0?'조사 날짜가 미래로 표시됨':days>90?'외부자료 조사 후 90일 초과':'';
 return {label:model.label,warning:model.warning,verified:!!place?.policy?.verifiedOn,
  reviewedOn:date,daysSinceReview:days,ageIssue,sourceCount:Array.isArray(r.sources)?r.sources.length:0,
  admissionGuarantee:false};
}
export const SUGGESTION_TYPES=Object.freeze({
 opening:'영업·휴무·폐업',
 location:'주소·연락처',
 admission:'반려견 입장·체중·실내 규정',
 cost:'요금·예약·주차',
 other:'기타 정보 오류'
});
export function makeSuggestionText({id,name,region,type,detail,sourceUrl}){
 if(!/^[a-z0-9-]{2,65}$/.test(String(id||'')))throw Error('장소 ID가 잘못됐습니다.');
 if(typeof name!=='string'||!name.trim()||name.length>140||typeof region!=='string'||!region.trim()||region.length>50)throw Error('장소 정보를 확인하세요.');
 if(!Object.hasOwn(SUGGESTION_TYPES,type))throw Error('제보 유형을 선택하세요.');
 if(typeof detail!=='string'||detail.trim().length<10||detail.trim().length>1200)throw Error('변경된 내용은 10~1200자로 작성해 주세요.');
 const url=String(sourceUrl||'').trim();
 if(url&&(!/^https:\/\/[^/\s]+(?:\/[^\s]*)?$/i.test(url)||url.length>500))throw Error('근거 URL은 HTTPS 링크만 입력하세요.');
 return ['[같이가개 정보 정정 메모 · 미접수]','장소: '+name.trim()+' ('+region.trim()+')','장소 ID: '+id,
  '오류 유형: '+SUGGESTION_TYPES[type],'정정 제안: '+detail.trim(),'근거 링크: '+(url||'제공하지 않음'),
  '주의: 이 메모를 복사하는 것만으로 운영자에게 접수되지 않습니다. 업체 규정 변경은 운영자 확인 후 반영해야 합니다.'].join('\n');
}
export function correctionPanelHtml(place,escape){
 const options=Object.entries(SUGGESTION_TYPES).map(([type,label])=>'<option value="'+type+'">'+escape(label)+'</option>').join('');
 return '<section class="panel correction-panel" id="report-correction" aria-labelledby="correction-title" data-venue-id="'+escape(place.id)+'" data-venue-name="'+escape(place.name)+'" data-venue-region="'+escape(place.region)+'">'+
 '<h2 id="correction-title">이 장소 정보가 달라졌나요?</h2>'+
 '<p>실제 영업·입장 규정이 다르다면 <strong>정정 메모를 작성해 복사</strong>할 수 있습니다. 아직 운영자 접수 창구가 마련되지 않아 <strong>자동 접수·전송되지 않습니다.</strong> 이름·전화번호 같은 개인정보를 입력하지 마세요.</p>'+
 '<label for="correction-type">어떤 정보가 다른가요?</label><select id="correction-type">'+options+'</select>'+
 '<label for="correction-detail">어떤 내용을 바꾸어야 하나요? (10자 이상)</label><textarea id="correction-detail" maxlength="1200" rows="4" placeholder="예: 실내 동반이 중단됐다고 안내받았습니다. 최신 여부를 다시 확인해 주세요."></textarea>'+
 '<label for="correction-source">근거 링크 (선택·HTTPS)</label><input id="correction-source" type="url" inputmode="url" maxlength="500" placeholder="https://">'+
 '<div class="actions"><button type="button" id="correction-copy">정정 메모 복사</button><button type="button" id="correction-reset">내용 지우기</button></div>'+
 '<p id="correction-status" role="status" aria-live="polite">메모를 복사해 직접 전달할 때 사용할 수 있습니다. 현재 공식 접수처는 준비 중입니다.</p>'+
 '</section>';
}
// Inline browser script is static; venue values are read from safely escaped data-* attributes.
export const CORRECTION_SCRIPT='<script>const SUGGESTION_TYPES='+JSON.stringify(SUGGESTION_TYPES)+';'+makeSuggestionText.toString()+';'+
'(()=>{const root=document.querySelector("#report-correction");if(!root)return;'+
'const output=root.querySelector("#correction-status"),field=root.querySelector("#correction-detail"),url=root.querySelector("#correction-source");'+
'root.querySelector("#correction-reset").addEventListener("click",()=>{field.value="";url.value="";output.textContent="입력 내용을 지웠습니다. 전송되거나 저장된 기록은 없습니다.";});'+
'root.querySelector("#correction-copy").addEventListener("click",()=>{'+
'const id=root.dataset.venueId,name=root.dataset.venueName,region=root.dataset.venueRegion,type=root.querySelector("#correction-type").value;'+
'let message;try{message=makeSuggestionText({id,name,region,type,detail:field.value,sourceUrl:url.value})}catch(e){output.textContent=e.message;return;}'+
'const fallback=()=>{window.prompt("아래 내용을 직접 복사하세요",message);output.textContent="메모 창을 열었습니다. 운영자에게 접수되지는 않았습니다.";};'+
'if(navigator.clipboard?.writeText)navigator.clipboard.writeText(message).then(()=>output.textContent="메모를 복사했습니다. 운영자에게 전달된 것은 아닙니다.").catch(fallback);else fallback();'+
'});})();</script>';
