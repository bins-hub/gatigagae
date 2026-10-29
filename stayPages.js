import {shell,escapeHtml} from './staticPages.js';
import {stayInquiryHtml,stayInquiryScript} from './stayInquiry.js';
import {stayVisualHtml,staySummaryHtml,STAY_VISUAL_STYLE} from './stayVisual.js';
import {stayResearchLeads} from './stayResearch.js';
const esc=escapeHtml;
const base='https://bins-hub.github.io/gatigagae/';
const factLabels={weight:'공식 안내 체중',dogs:'동반 마릿수',fee:'반려견 추가요금',rooms:'객실·종류 조건',facilities:'시설 이용',address:'공식 안내 주소'};
export function stayFactsHtml(lead){
 if(!lead.conditions)return '<p>체중·마릿수·추가요금·객실 조건은 아직 미확인입니다. 아래 출처와 문의 준비를 확인하세요.</p>';
 return '<dl class="facts">'+Object.entries(factLabels).map(([key,label])=>'<dt>'+label+'</dt><dd>'+esc(lead.conditions[key]||'미확인 · 숙소 문의 필요')+'</dd>').join('')+'</dl>';
}
export function stayDetailLink(lead){
 return '<p><a href="../../stays/'+encodeURIComponent(lead.id)+'/">체중·요금·객실 조건 자세히 ↗</a></p>';
}
function enrich(html,{path,title,description,graph}){
 const url=base+path;
 const metadata='<link rel="canonical" href="'+esc(url)+'"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:url" content="'+esc(url)+'"><script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')+'</script>';
 return html.replace('</head>',metadata+'</head>');
}
function breadcrumbs(path,name){
 return {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'같이가개',item:base},{'@type':'ListItem',position:2,name:'애견동반 펜션',item:base+'guides/stays/'},...(path==='guides/stays/'?[]:[{'@type':'ListItem',position:3,name,item:base+path}])]};
}
export function stayGuideMetadata(html){
 const path='guides/stays/';
 return enrich(html,{path,title:'가평·양평 애견동반 펜션 5곳 | 같이가개',description:'공식·공공 출처로 조사한 펜션 5곳의 동반 조건. 업체 직접 검증·실시간 예약 미확인.',graph:[{'@type':'CollectionPage',name:'가평·양평 애견동반 펜션 조사 후보',url:base+path,description:'업체 직접 검증 전 공개자료 조사 후보 5곳. 예약 가능 목록이 아닙니다.',mainEntity:{'@type':'ItemList',numberOfItems:stayResearchLeads.length,itemListElement:[...stayResearchLeads].sort((a,b)=>Number(!!b.conditions)-Number(!!a.conditions)).map((s,i)=>({'@type':'ListItem',position:i+1,name:s.name,url:base+'stays/'+s.id+'/'}))}},breadcrumbs(path,'애견동반 펜션')]});
}
export function stayQuestions(lead){
 const c=lead.conditions||{weight:"체중 조건 미확인",dogs:"마릿수 미확인",fee:"반려견 추가요금 미확인",rooms:"객실별 동반 조건 미확인",facilities:"마당·수영장·스파 이용 조건 미확인"};
 return [
  {question:lead.name+'은 몇 kg, 몇 마리까지 안내하나요?',answer:'공식 이용안내 기준 '+c.weight+' · '+c.dogs+'입니다. 객실·견종별 현행 수락 여부는 숙소에 다시 확인하세요.'},
  {question:'반려견 추가요금과 동반 객실은 어떻게 되나요?',answer:c.fee+'. '+c.rooms+'. 숙박 객실료와 실제 공실은 별도로 확인해야 합니다.'},
  {question:'반려견이 수영장이나 스파도 이용할 수 있나요?',answer:c.facilities+'. 시설 이름만으로 반려견 입수 가능 여부를 판단하지 마세요.'}
 ];
}
export function buildStayPages(){
 const pages={};
 for(const lead of stayResearchLeads){
  const path='stays/'+lead.id+'/',title=lead.name+' · 체중·마릿수·추가요금 확인';
  const c=lead.conditions||{weight:'체중 조건 미확인',dogs:'마릿수 미확인'};
  const description=lead.region+' '+lead.area+' '+lead.name+'의 공식 이용안내를 바탕으로 '+c.weight+', '+c.dogs+', 반려견 추가요금과 객실 제한을 정리했습니다. 예약·업체 직접 검증은 미확인입니다.';
  const questions=stayQuestions(lead);
  const body='<div class="eyebrow"><a href="../../guides/stays/">애견동반 펜션 조사 후보</a> / '+esc(lead.region)+' '+esc(lead.area)+'</div><h1>'+esc(title)+'</h1>'+stayVisualHtml(lead)+staySummaryHtml(lead)+'<div class="actions"><a href="#stay-inquiry">문의 준비하기</a><a href="#stay-evidence">출처 확인하기</a></div><p>'+esc(lead.evidence)+'</p><div class="warning"><strong>업체 직접 검증 전 · 예약 가능 여부 미확인</strong><p>아래는 공식·공공 출처에서 읽은 공개 안내의 요약입니다. 공식 사이트 열람은 업체에 직접 확인한 기록과 다릅니다. 특정 날짜의 투숙·공실·가격을 보장하지 않습니다.</p></div><section class="panel"><h2>예약 전 살펴볼 동반 조건</h2>'+stayFactsHtml(lead)+'<p class="muted">외부자료 확인일 <time datetime="'+esc(lead.reviewedOn)+'">'+esc(lead.reviewedOn)+'</time> · 업체 직접 확인일 없음</p></section><section class="panel"><h2>자주 묻는 질문</h2>'+questions.map(q=>'<h3>'+esc(q.question)+'</h3><p>'+esc(q.answer)+'</p>').join('')+'</section><section class="panel" id="stay-evidence"><h2>출처와 추가 확인 사항</h2><p><a href="'+esc(lead.sourceUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(lead.sourceLabel)+' 원문 확인 ↗</a></p><p>'+esc(lead.pending)+'</p><p>예약 전에는 날짜·객실명·반려견 견종과 체중·마릿수를 숙소에 알려 동반 수락과 최종 요금을 확인하세요. 안내가 바뀌었거나 객실별 예외가 있으면 숙소의 최신 답변을 우선하세요.</p><div class="actions"><a href="#stay-inquiry">문의 문구·준비 체크</a><a href="../../guides/stays/">펜션 5곳 조건 살펴보기</a></div></section>';
  const graph=[{'@type':'Article',headline:title,description,url:base+path,inLanguage:'ko-KR',datePublished:'2026-10-29',dateModified:'2026-10-29',author:{'@type':'Organization',name:'같이가개'},citation:lead.sourceUrl,about:{'@type':'Thing',name:lead.name}},breadcrumbs(path,lead.name),{'@type':'FAQPage',mainEntity:questions.map(q=>({'@type':'Question',name:q.question,acceptedAnswer:{'@type':'Answer',text:q.answer}}))}];
  pages[path+'index.html']=enrich(shell(title,description,body+stayInquiryHtml(lead)+STAY_VISUAL_STYLE+stayInquiryScript(lead)),{path,title,description,graph});
 }
 return pages;
}
