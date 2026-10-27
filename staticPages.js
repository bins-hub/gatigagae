// All public pages are generated from sourced research. They do not imply entry permission.
export const REGIONS=Object.freeze({하남:'hanam',남양주:'namyangju',양평:'yangpyeong'});
export function escapeHtml(value){
 return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
const esc=escapeHtml;
const style='<style>:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f8f7f1;color:#173f39;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.65}a{color:#245c4c;text-underline-offset:3px}a:focus-visible{outline:3px solid #d37735;outline-offset:3px}header{border-bottom:1px solid #d6e0d8;background:white}nav,main,footer{max-width:960px;margin:auto;padding:20px 22px}nav{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}nav a{text-decoration:none;font-weight:700}nav .logo{font-size:24px;color:#173f39}main{padding-top:26px;padding-bottom:40px}h1{font-size:clamp(28px,4.4vw,44px);line-height:1.2;letter-spacing:-1.2px}h2{font-size:21px}.eyebrow{font-size:13px;color:#526862;font-weight:700}.notice,.warning{border-radius:12px;padding:14px 17px;margin:20px 0}.notice{background:#e7efe5}.warning{background:#fff0e4;color:#7b441f}.panel{background:white;border:1px solid #d6e0d8;border-radius:16px;padding:22px;margin:20px 0}.facts{display:grid;grid-template-columns:130px 1fr;gap:10px 14px}.facts dt{color:#526862}.facts dd{margin:0;overflow-wrap:anywhere}.actions{display:flex;gap:12px;flex-wrap:wrap}.actions a{background:#e9efdf;padding:10px 14px;border-radius:9px;text-decoration:none;font-weight:700}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.item{border:1px solid #d6e0d8;background:#fff;border-radius:14px;padding:18px}.item h2{margin:6px 0;font-size:19px}.item p{font-size:14px;color:#526862}.muted{color:#526862}.source li{margin-bottom:8px;overflow-wrap:anywhere}footer{font-size:12px;color:#526862;border-top:1px solid #d6e0d8}@media(max-width:580px){.grid{grid-template-columns:1fr}.facts{grid-template-columns:1fr;gap:2px}.facts dd{margin-bottom:9px}.panel{padding:17px}}</style>';
export function shell(title,description,body){
 return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="'+esc(description)+'"><title>'+esc(title)+' | 같이가개</title>'+style+'</head><body><header><nav><a class="logo" href="../../">같이가개ㆍ</a><a href="../../">전체 장소 검색</a></nav></header><main>'+body+'</main><footer>같이가개 · 외부 공개자료 조사 · 업체 직접 확인 전 방문 규정은 보장되지 않습니다. 조사 후보 자료는 변경될 수 있습니다.</footer></body></html>';
}
function navMap(p){
 const q=(p.research?.address||p.region)+' '+p.name;
 return 'https://map.naver.com/p/search/'+encodeURIComponent(q);
}
function sources(r){
 return '<ul class="source">'+(r.sources||[]).map(s=>'<li><a target="_blank" rel="noopener noreferrer" href="'+esc(s.url)+'">'+esc(s.label)+'</a> <span class="muted">('+esc(s.kind||'참고 자료')+')</span></li>').join('')+'</ul>';
}
function facts(entries){
 return '<dl class="facts">'+entries.map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+esc(v||'미확인')+'</dd>').join('')+'</dl>';
}
function placePage(p){
 const r=p.research||{};const a=r.additionalConditions||{};
 const verified=!!p.policy?.verifiedOn;
 const heading='<div class="eyebrow"><a href="../../regions/'+REGIONS[p.region]+'/">'+esc(p.region)+'</a> / '+esc(p.category||'장소')+' / 조사 후보</div><h1>'+esc(p.name)+'</h1>';
 const announcement='<div class="notice"><strong>'+(verified?'업체 규정 확인 기록이 있습니다':'업체 직접 검증 전 · 입장 가능 여부 미확정')+'</strong><p>자료 확인일 '+esc(r.reviewedOn||'미상')+' · 업체 직접 확인일 '+esc(p.policy?.verifiedOn||'없음')+'<br>공개자료는 오늘의 영업 여부, 체중·견종·마릿수 입장을 보장하지 않습니다.</p></div>';
 const warning=r.warning?'<div class="warning"><strong>방문 전 주의</strong><p>'+esc(r.warning)+'</p></div>':'';
 const data='<section class="panel"><h2>장소 조사 정보</h2>'+facts([['주소',r.address||'주소 검증 중'],['전화',r.phone||'확인 필요'],['체중',r.weight],['실내',r.indoor],['실외',r.outdoor],['요금',r.fee],['영업시간',r.hours],['견종',a.breed],['동반 마릿수',a.dogs],['요일별 안내',a.days]])+'</section>';
 const rules='<section class="panel"><h2>방문 전 확인 사항</h2><ul>'+(r.rules||[]).map(t=>'<li>'+esc(t)+'</li>').join('')+'<li>현재 영업 여부와 방문일의 반려견 동반 조건을 업체에 직접 확인하세요.</li></ul></section>';
 const contact='<section class="panel"><h2>위치·문의</h2><p class="muted">지도 링크는 확정된 장소 좌표가 아닌 검색 결과입니다. 특히 주소가 충돌하는 곳은 업체명을 먼저 확인해 주세요.</p><div class="actions"><a href="'+esc(navMap(p))+'" target="_blank" rel="noopener noreferrer">네이버 지도에서 검색</a>'+(r.phone&&/^[0-9+-]+$/.test(r.phone)?'<a href="tel:'+esc(r.phone)+'">전화 문의</a>':'')+'<a href="../../">조건 검색 돌아가기</a></div></section>';
 const citation='<section class="panel"><h2>자료 출처</h2><p class="muted">외부 기사·플랫폼 소개와 지자체 안내는 업체의 최신 입장 보장과 다릅니다.</p>'+sources(r)+'</section>';
 return shell(p.name+' · '+p.region+' 동반 규정 조사',p.name+' 공개자료 조사: '+(r.summary||p.note||'입장 규정 미확인'),heading+announcement+warning+'<p>'+esc(r.summary||p.note||'')+'</p>'+data+rules+contact+citation);
}
function regionPage(region,subset){
 const title=esc(region)+' 반려견 동반 장소 조사';
 const header='<div class="eyebrow">지역별 장소 조사 / 업체 직접 확인 전</div><h1>'+title+'</h1><p class="muted">공개자료를 바탕으로 '+subset.length+'곳의 후보를 정리했습니다. 최신 영업 여부와 체중·공간 규정은 업체에 문의하세요.</p><div class="warning">현재 지역 내 업체 직접 검증 완료 '+subset.filter(x=>x.policy?.verifiedOn).length+'곳. 목록은 확정 추천이 아닙니다.</div>';
 const cards='<div class="grid">'+subset.map(p=>'<article class="item"><div class="eyebrow">'+esc(p.category||'장소')+' · '+esc(p.research?.level==='needs_identity'?'영업 확인 필요':'공개자료 조사')+'</div><h2><a href="../../places/'+esc(p.id)+'/">'+esc(p.name)+'</a></h2><p>'+esc(p.research?.summary||p.note||'')+'</p><p>'+esc(p.research?.address||'주소 확인 필요')+'</p><a href="../../places/'+esc(p.id)+'/">규정·출처 자세히</a></article>').join('')+'</div>';
 return shell(region+' 반려견 동반 장소 목록',region+' 지역 공개자료 조사 후보 '+subset.length+'곳. 업체 직접 검증 전 정보입니다.',header+cards);
}
export function buildStaticPages(places){
 const result={};
 for(const p of places){
  if(!REGIONS[p.region])throw Error('Unsupported region: '+p.region);
  if(!/^[a-z0-9-]+$/.test(p.id))throw Error('Invalid place path: '+p.id);
  result['places/'+p.id+'/index.html']=placePage(p);
 }
 for(const region of Object.keys(REGIONS)){
  result['regions/'+REGIONS[region]+'/index.html']=regionPage(region,places.filter(p=>p.region===region));
 }
 return result;
}
export function reviewQueueCsv(places){
 const fields=['id','name','region','evidence_reviewed_on','verified_policy','research_level','needs_identity','source_count','missing_phone','missing_address','notes'];
 const csvCell=x=>'"'+String(x??'').replaceAll('"','""').replace(/^[=+@-]/,x=>"'"+x)+'"';
 const lines=[fields.map(csvCell).join(',')];
 for(const p of places){
  const r=p.research||{};
  const row=[p.id,p.name,p.region,r.reviewedOn||'',!!p.policy?.verifiedOn,r.level||'',r.level==='needs_identity',(r.sources||[]).length,!r.phone,!r.address,r.warning||''];
  lines.push(row.map(csvCell).join(','));
 }
 return '\uFEFF'+lines.join('\r\n')+'\r\n';
}
