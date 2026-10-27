const days=['mon','tue','wed','thu','fri','sat','sun'];
const iso=s=>typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s+'T00:00:00Z'));
const https=s=>typeof s==='string' && /^https:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(s);
export function validatePlaces(places){
 const issues=[];
 if(!Array.isArray(places)) return ['places: array required'];
 const seen=new Set();
 for(const [i,p] of places.entries()){
  const id=p?.id||'index-'+i;
  if(!/^[a-z0-9-]+$/.test(id))issues.push(id+': invalid id');
  if(seen.has(id))issues.push(id+': duplicate id');seen.add(id);
  if(!p?.name || !p?.region || !p?.category || !https(p?.discoveryUrl))issues.push(id+': required name, region, category or HTTPS discovery source missing');
  const r=p.research;
  if(!r || !iso(r.reviewedOn) || !Array.isArray(r.sources) || r.sources.length===0)issues.push(id+': research date or sources invalid');
  else for(const src of r.sources)if(!src.label || !https(src.url))issues.push(id+': invalid research source');
  if(r?.additionalConditions){
    for(const key of ['breed','dogs','days'])if(typeof r.additionalConditions[key]!=='string' || !r.additionalConditions[key].trim())issues.push(id+': missing additional condition '+key);
  }
  if(p.policy==null)continue;
  const q=p.policy;
  if(!iso(q.verifiedOn)||!https(q.sourceUrl))issues.push(id+': official policy needs dated evidence URL');
  if(q.conflict===true)issues.push(id+': conflicting policy cannot be marked verified');
  for(const key of ['maxKg','minKg'])if(q[key]!=null && (!Number.isFinite(q[key]) || q[key]<0 || q[key]>150))issues.push(id+': invalid '+key);
  if(q.maxKg==null && q.unlimited!==true)issues.push(id+': missing weight upper bound must stay unconfirmed');
  if(q.maxDogs!=null && (!Number.isInteger(q.maxDogs)||q.maxDogs<1||q.maxDogs>20))issues.push(id+': invalid maxDogs');
  if(q.zones==null || !['indoor','outdoor'].some(k=>q.zones[k]===true||q.zones[k]===false))issues.push(id+': verified zones missing');
  if(q.days)for(const key of Object.keys(q.days))if(!days.includes(key)||typeof q.days[key]!=='boolean')issues.push(id+': invalid visit day '+key);
  if(q.breeds)for(const key of ['allowed','blocked'])if(q.breeds[key]!=null && (!Array.isArray(q.breeds[key]) || q.breeds[key].some(v=>typeof v!=='string'||!v.trim())))issues.push(id+': invalid breed list '+key);
 }
 return issues;
}
