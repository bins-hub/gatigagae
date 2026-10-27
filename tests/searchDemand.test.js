import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {keywordHypotheses} from '../keywordResearch.js';
import {parseDemandCsv,importDemand,blankDemandTemplate,demandPriorityCsv,demandPriority} from '../searchDemand.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8')),hyp=keywordHypotheses(places);
const base=()=>({keyword:'남양주 애견동반 카페',monthlyPc:'220',monthlyMobile:'1,150',competition:'높음',source:'naver-searchads',sourceUrl:'https://searchad.naver.com/',checkedOn:'2026-10-27'});
test('Build supplies blank data collection template, not fabricated volume',()=>{
 const t=blankDemandTemplate(hyp);assert.equal(t.split('\r\n').filter(Boolean).length,91);
 const parsed=parseDemandCsv(t);assert.equal(parsed.length,90);
 const imported=importDemand([] ,hyp);assert.equal(imported.measuredCount,0);
 assert.equal(imported.unmeasuredCount,90);
 assert.ok(parsed.every(r=>r.monthlyPc===''&&r.monthlyMobile===''&&r.checkedOn===''));
});
test('Parse quoted CSV with escaped quote, commas and CRLF',()=>{
 const csv='\uFEFFkeyword,monthlyPc,monthlyMobile,competition,source,sourceUrl,checkedOn\r\n"남양주 애견동반 카페","1,000",120,"높음",naver-searchads,https://searchad.naver.com/,2026-10-27\r\n';
 const arr=parseDemandCsv(csv);assert.equal(arr.length,1);assert.equal(arr[0].monthlyPc,'1,000');
 assert.throws(()=>parseDemandCsv('wrong,header\nx,y'),/CSV columns/);
 assert.throws(()=>parseDemandCsv('keyword,monthlyPc,monthlyMobile,competition,source,sourceUrl,checkedOn\n"unclosed,12'),/Unclosed/);
});
test('Operator-supplied metrics become review-only rankings, never verified search or public content',()=>{
 const data=importDemand([base()],hyp,{asOf:'2026-10-27'});assert.equal(data.accepted.length,1);
 const row=data.accepted[0];assert.equal(row.monthlySearchLow,1370);assert.equal(row.monthlySearchUpper,1370);
 assert.equal(row.monthlySearchExact,true);
 assert.equal(row.measurementStatus,'operator_supplied_not_independently_verified');
 assert.equal(row.publicPageApproved,false);assert.equal(row.evidencePlaceCount,6);
 assert.ok(demandPriorityCsv(data.accepted).includes('operator_supplied_not_independently_verified'));
});
test('Naver under 10 is censored, not assumed equal to zero or exact 10',()=>{
 const data=importDemand([{...base(),monthlyPc:'< 10',monthlyMobile:'<10'}],hyp).accepted[0];
 assert.equal(data.monthlySearchLow,0);assert.equal(data.monthlySearchUpper,18);
 assert.equal(data.monthlySearchExact,false);
 assert.equal(data.monthlyPc,'<10');
});
test('No data, duplicate rows, unknown keywords or bogus sources are rejected',()=>{
 const bad=[{...base(),keyword:'서울 애견동반 카페'},base(),base(),{...base(),source:'naver-datalab',monthlyPc:'120'}, {...base(),monthlyPc:'abc',monthlyMobile:''},{...base(),monthlyPc:'',monthlyMobile:''}];
 const result=importDemand(bad,hyp);
 assert.equal(result.accepted.length,1);
 assert.equal(result.rejected.length,5);
 assert.ok(result.rejected[0].issues.some(x=>x.includes('후보')));
 assert.ok(result.rejected.some(x=>x.issues.some(t=>t.includes('중복'))));
 assert.ok(result.rejected.some(x=>x.issues.some(t=>t.includes('출처'))));
});
test('Reject missing source, invalid dates, future dates and invented competition categories',()=>{
 for(const item of [
  {...base(),sourceUrl:'http://fake.info'},
  {...base(),checkedOn:'2026-02-30'},
  {...base(),checkedOn:'2027-01-01'},
  {...base(),competition:'strongly competitive'},
  {...base(),monthlyPc:'-100'},
 ]){const result=importDemand([item],hyp);assert.equal(result.accepted.length,0,JSON.stringify(item));}
});
test('Haman restaurant keyword research retains unverified candidates even with supplied demand',()=>{
 const row={...base(),keyword:'하남 애견동반 식당',monthlyMobile:'6000'};
 const result=importDemand([row],hyp).accepted[0];
 assert.equal(result.needsVenueResearch,false);
 assert.equal(result.publicPageApproved,false);
 assert.equal(result.landingRoute,'guides/restaurants/');
});
test('Expired keyword data is marked stale and sorted after newer data',()=>{
 const other={...base(),keyword:'양평 애견동반 카페',monthlyPc:'99999',checkedOn:'2026-01-01'};
 const r=importDemand([other,base()],hyp,{asOf:'2026-10-27'});
 assert.equal(r.rejected.length,0);
 assert.equal(r.accepted[0].freshness,'stale_over_180_days');
 assert.equal(demandPriority(r.accepted)[0].keyword,'남양주 애견동반 카페');
});
