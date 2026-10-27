import fs from 'node:fs';
import {validatePlaces} from '../validation.js';
import {REGIONS,escapeHtml} from '../staticPages.js';
const html=fs.readFileSync('dist/index.html','utf8');
const robots=fs.readFileSync('dist/robots.txt','utf8');
const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const required=['id="breed"','id="dogs"','id="day"','id="weight"','id="zone"','id="region"','id="keyword"','id="results"','data-copy','noindex,nofollow'];
for(const x of required)if(!html.includes(x))throw Error('Missing build component: '+x);
for(const x of ['/* MATCHING_MODULE */','/* RESEARCH_MODULE */','/* PLACE_DATA */'])if(html.includes(x))throw Error('Uncompiled placeholder: '+x);
if(!robots.includes('Disallow: /'))throw Error('Unexpected search index setting');
if(validatePlaces(places).length)throw Error('Source data invalid');
for(const p of places)if(!html.includes(p.name))throw Error('Place absent from static bundle: '+p.name);
if(!html.includes('자료 버전 0.5.0'))throw Error('Version mismatch');
for(const venue of places){
 const name='dist/places/'+venue.id+'/index.html';
 if(!fs.existsSync(name))throw Error('Missing venue page '+name);
 const page=fs.readFileSync(name,'utf8');
 if(!page.includes('noindex,nofollow')||!page.includes(escapeHtml(venue.name)))throw Error('Invalid venue detail: '+venue.id);
 if(!html.includes('./places/'+venue.id+'/'))throw Error('Homepage missing link to venue: '+venue.id);
}
for(const slug of Object.values(REGIONS)){
 const filename='dist/regions/'+slug+'/index.html';
 if(!fs.existsSync(filename)||!fs.readFileSync(filename,'utf8').includes('noindex,nofollow'))throw Error('Region page missing or indexable: '+slug);
}
if(!fs.existsSync('reports/review-queue.csv'))throw Error('Verification review queue not generated');
if(fs.existsSync('dist/review-queue.csv'))throw Error('Internal review queue is accidentally public');
if(places.some(p=>p.policy?.verifiedOn))throw Error('Unexpected verified policies: confirm authorization before publishing');
console.log('v0.4 bundle validated:',places.length,'unverified research venues');
