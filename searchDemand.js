// An operator may import keyword tool EXPORTS; imports are NOT independently authenticated.
// Naver Datalab relative index is not absolute monthly search volume.
const SOURCES=new Set(['naver-searchads','google-keyword-planner']);
export const SEARCH_DEMAND_COLUMNS=Object.freeze(['keyword','monthlyPc','monthlyMobile','competition','source','sourceUrl','checkedOn']);
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const https=s=>typeof s==='string'&&/^https:\/\/[a-z0-9.-]+(?:\/|\?|#|$)/i.test(s)&&!s.includes(' ');
function demandNumber(value){
 const raw=String(value??'').trim();
 if(!raw)return null;
 if(/^<\s*10$/.test(raw))return {lower:0,upper:9,censored:true,label:'<10'};
 if(!/^\d{1,3}(?:,\d{3})*$|^\d+$/.test(raw))throw Error('Only integer counts or <10 are supported');
 const n=Number(raw.replaceAll(',',''));
 if(!Number.isSafeInteger(n)||n>100000000)throw Error('Count exceeds valid range');
 return {lower:n,upper:n,censored:false,label:String(n)};
}
export function parseDemandCsv(csv){
 if(typeof csv!=='string'||csv.length>2000000)throw Error('Demand CSV must be valid text under 2 MB');
 const data=csv.replace(/^\uFEFF/,'');
 const records=[],current=[];let field='',quoted=false;
 for(let i=0;i<data.length;i++){
  const ch=data[i];
  if(ch==='"'){
   if(quoted && data[i+1]==='"'){field+='"';i++;} else if(quoted){quoted=false;} else if(field===''){quoted=true;} else throw Error('Invalid CSV quote position');
  }else if(!quoted&&(ch===','||ch==='\n'||ch==='\r')){
   current.push(field);field='';
   if(ch!==','){
    if(current.some(x=>x.trim()))records.push([...current]);
    current.length=0;
    if(ch==='\r'&&data[i+1]==='\n')i++;
   }
  } else field+=ch;
 }
 if(quoted)throw Error('Unclosed CSV quote');
 current.push(field);if(current.some(x=>x.trim()))records.push(current);
 if(!records.length)return [];
 const header=records.shift().map(x=>x.trim());
 if(header.length!==SEARCH_DEMAND_COLUMNS.length || header.some((x,i)=>x!==SEARCH_DEMAND_COLUMNS[i]))
  throw Error('CSV columns must be exactly: '+SEARCH_DEMAND_COLUMNS.join(','));
 if(records.length>500)throw Error('Up to 500 keyword rows per import');
 return records.map((cells,i)=>{
  if(cells.length!==header.length)throw Error('CSV field count differs in row '+(i+2));
  return Object.fromEntries(header.map((key,j)=>[key,cells[j].trim()]));
 });
}
export function importDemand(rows,hypotheses,{asOf='2026-10-27'}={}){
 if(!validDate(asOf))throw Error('A valid evaluation date is required');
 if(!Array.isArray(rows)||!Array.isArray(hypotheses))throw Error('Expected arrays');
 const keys=new Map(hypotheses.map(x=>[x.keyword,x])),seen=new Set(),accepted=[],rejected=[];
 for(const [i,row] of rows.entries()){
  const issues=[],key=String(row?.keyword||'').normalize('NFKC').trim();
  if(!keys.has(key))issues.push('키워드 조사 후보에 없음');
  if(seen.has(key))issues.push('동일 키워드 중복');
  seen.add(key);
  let pc=null,mobile=null;
  try{pc=demandNumber(row?.monthlyPc);mobile=demandNumber(row?.monthlyMobile);}catch(e){issues.push(String(e.message))}
  if(!pc&&!mobile)issues.push('월간 검색수 PC 또는 모바일 수치 필요');
  if(!SOURCES.has(row?.source))issues.push('검색광고 키워드 도구 출처 종류 필요');
  if(!https(row?.sourceUrl))issues.push('확인 가능한 HTTPS 근거 URL 필요');
  if(!validDate(row?.checkedOn)||row.checkedOn>asOf)issues.push('조회 날짜 오류·미래 날짜');
  const rawCompetition=String(row?.competition||'').trim();
  const competition=rawCompetition||null;
  if(competition&&!['low','medium','high','낮음','중간','높음'].includes(competition))issues.push('경쟁 지표 범주 확인 필요');
  if(issues.length){rejected.push({row:i+2,keyword:key,issues});continue;}
  const days=(Date.parse(asOf+'T00:00:00Z')-Date.parse(row.checkedOn+'T00:00:00Z'))/86400000;
  const totalLow=(pc?.lower??0)+(mobile?.lower??0);
  const totalHigh=(pc?.upper??0)+(mobile?.upper??0);
  accepted.push({...keys.get(key),
   source:row.source,sourceUrl:row.sourceUrl,checkedOn:row.checkedOn,competition,
   monthlyPc:pc?.label??null,monthlyMobile:mobile?.label??null,
   monthlySearchLow:totalLow,monthlySearchUpper:totalHigh,
   monthlySearchExact:!!pc&&!pc.censored&&!!mobile&&!mobile.censored,
   freshness:days>180?'stale_over_180_days':'recent',
   measurementStatus:'operator_supplied_not_independently_verified',
   needsVenueResearch:!keys.get(key).evidencePlaceCount,
   publicPageApproved:false,
   caution:'Numbers are operator-imported; verify original platform export before conclusions.'});
 }
 return {accepted,rejected,measuredCount:accepted.length,unmeasuredCount:hypotheses.length-accepted.length};
}
export function demandPriority(rows){
 return [...rows].sort((a,b)=>{
  // This orders an INTERNAL review queue, not SEO success or admission certainty.
  if(a.freshness!==b.freshness)return a.freshness==='recent'?-1:1;
  return b.monthlySearchLow-a.monthlySearchLow || a.keyword.localeCompare(b.keyword,'ko');
 });
}
const safeCell=x=>'"'+String(x??'').replaceAll('"','""').replace(/^[=+@-]/,c=>"'"+c)+'"';
export function demandPriorityCsv(rows){
 const keys=['keyword','intent','region','monthlyPc','monthlyMobile','monthlySearchLow','monthlySearchUpper','monthlySearchExact','competition','source','sourceUrl','checkedOn','freshness','needsVenueResearch','publicPageApproved','measurementStatus'];
 return '\uFEFF'+[keys.join(','),...demandPriority(rows).map(item=>keys.map(k=>safeCell(item[k])).join(','))].join('\r\n')+'\r\n';
}
export function blankDemandTemplate(hypotheses){
 const header=SEARCH_DEMAND_COLUMNS.join(',');
 return '\uFEFF'+header+'\r\n'+hypotheses.map(h=>[safeCell(h.keyword),'','','','','',''].join(',')).join('\r\n')+'\r\n';
}