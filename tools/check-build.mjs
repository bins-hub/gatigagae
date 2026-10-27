import fs from 'node:fs';
import {validatePlaces} from '../validation.js';
import {REGIONS,escapeHtml} from '../staticPages.js';
import {keywordHypotheses} from '../keywordResearch.js';
const html=fs.readFileSync('dist/index.html','utf8');
const robots=fs.readFileSync('dist/robots.txt','utf8');
const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const required=['id="save-profile"','id="clear-profile"','id="bottom-saved"','id="pet-profile-status"','id="breed"','id="dogs"','id="day"','id="weight"','id="zone"','id="region"','id="keyword"','id="results"','data-copy','noindex,nofollow'];
for(const x of required)if(!html.includes(x))throw Error('Missing build component: '+x);
for(const x of ['/* MATCHING_MODULE */','/* RESEARCH_MODULE */','/* PROFILE_MODULE */','/* ROUTE_MODULE */','/* QUERY_MODULE */','/* PLACE_DATA */'])if(html.includes(x))throw Error('Uncompiled placeholder: '+x);
if(!robots.includes('Disallow: /'))throw Error('Unexpected search index setting');
if(validatePlaces(places).length)throw Error('Source data invalid');
for(const p of places)if(!html.includes(p.name))throw Error('Place absent from static bundle: '+p.name);
if(!html.includes('자료 버전 0.9.0'))throw Error('Version mismatch');
for(const venue of places){
 const name='dist/places/'+venue.id+'/index.html';
 if(!fs.existsSync(name))throw Error('Missing venue page '+name);
 const page=fs.readFileSync(name,'utf8');
 if(!page.includes('noindex,nofollow')||!page.includes(escapeHtml(venue.name)))throw Error('Invalid venue detail: '+venue.id);
 if(!html.includes('href="./places/${encodeURIComponent(p.id)}/"'))throw Error('Homepage missing dynamic venue permalinks');
}
for(const slug of Object.values(REGIONS)){
 const filename='dist/regions/'+slug+'/index.html';
 if(!fs.existsSync(filename)||!fs.readFileSync(filename,'utf8').includes('noindex,nofollow'))throw Error('Region page missing or indexable: '+slug);
 if(!fs.readFileSync(filename,'utf8').includes('region='+slug+'&amp;intent=cafes#results-title'))throw Error('Regional cafe landing not connected to matching search: '+slug);
}
if(!fs.existsSync('reports/review-queue.csv'))throw Error('Verification review queue not generated');
if(fs.existsSync('dist/review-queue.csv'))throw Error('Internal review queue is accidentally public');
const expectedGuidePaths=['guides/cafes/index.html','guides/weekend/index.html','guides/indoor/index.html'];
for(const name of expectedGuidePaths){
 if(!fs.existsSync('dist/'+name))throw Error('Missing intent guide: '+name);
 const page=fs.readFileSync('dist/'+name,'utf8');
 if(!page.includes('noindex,nofollow')||!page.includes('업체 직접 검증 전'))throw Error('Guide lacks verified-state caution: '+name);
}
if(fs.existsSync('dist/guides/restaurants/index.html'))throw Error('Do not create empty restaurant doorway page');
if(!html.includes('href="./guides/cafes/"')||!html.includes('id="intent-title"'))throw Error('Intent navigation missing');
if(!html.includes('parseSearchRoute(window.location.search)')||!html.includes('let filter={weight:null'))throw Error('Region-search deep links or optional weight missing');
if(!html.includes('queryMatchesPlace(p,filter.query)'))throw Error('Natural Korean keyword search parser is missing');
for(const token of ['id="quick-search-form"','id="quick-query"','interpretPlaceQuery(q)','카페 조사 후보'])if(!html.includes(token))throw Error('Top-level natural language search missing: '+token);
if(!html.includes('현재 조사된 식당 0곳'))throw Error('Unsupported restaurant inventory not marked');
const expectedKeywords=keywordHypotheses(places);
if(expectedKeywords.length!==90 || expectedKeywords.some(k=>k.measuredMonthlySearchVolume!==null||k.measuredCompetition!==null))throw Error('Invalid measured keyword hypotheses');
if(!fs.existsSync('reports/keyword-hypotheses.csv'))throw Error('Private keyword audit not generated');
if(!fs.existsSync('reports/search-demand-input-template.csv'))throw Error('Keyword demand input template missing');
if(!fs.existsSync('reports/search-readiness.json'))throw Error('Index readiness audit missing');
const readiness=JSON.parse(fs.readFileSync('reports/search-readiness.json','utf8'));
if(readiness.directlyVerifiedVenueCount!==0||readiness.automaticIndexingAllowed!==false)throw Error('Unreviewed search-index readiness');
for(const file of ['search-demand-input-template.csv','search-readiness.json','search-demand-priority.csv'])if(fs.existsSync('dist/'+file))throw Error('Private measurement artifacts leaked into public site');
if(fs.existsSync('dist/keyword-hypotheses.csv'))throw Error('Keyword research report must remain private');
if(!fs.existsSync('reports/verification-priority.csv'))throw Error('Missing operations audit priority list');
if(!fs.existsSync('reports/geolocation-readiness.json'))throw Error('Missing evidence-based geolocation readiness report');
if(fs.existsSync('dist/geolocation-readiness.json'))throw Error('Internal geo report must never be public');
if(fs.existsSync('dist/verification-priority.csv'))throw Error('Operations report is accidentally public');
if(places.some(p=>p.policy?.verifiedOn))throw Error('Unexpected verified policies: confirm authorization before publishing');
console.log('v0.9.0 demand-quality bundle validated:',places.length,'unverified research venues');
