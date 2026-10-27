import {validatePlaces} from './validation.js';
import path from 'node:path';
import {buildStaticPages,reviewQueueCsv} from './staticPages.js';
import {buildIntentPages} from './intentPages.js';
import {keywordHypotheses,keywordHypothesisCsv} from './keywordResearch.js';
import {blankDemandTemplate} from './searchDemand.js';
import {auditPlaces,auditCsv} from './reviewAudit.js';
import {geoCoverage} from './geo.js';
import fs from 'node:fs';
const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const problems=validatePlaces(places);
if(problems.length)throw Error('Invalid places data:\n'+problems.join('\n'));
const html=fs.readFileSync('index.html','utf8').replace('/* MATCHING_MODULE */',fs.readFileSync('matching.js','utf8').replace('export function','function')).replace('/* RESEARCH_MODULE */',fs.readFileSync('researchScreen.js','utf8').replace('export function','function')).replace('/* PROFILE_MODULE */',fs.readFileSync('petProfile.js','utf8').replaceAll('export function','function')).replace('/* ROUTE_MODULE */',fs.readFileSync('searchRoute.js','utf8').replaceAll('export function','function')).replace('/* QUERY_MODULE */',fs.readFileSync('searchQuery.js','utf8').replaceAll('export function','function')).replace('/* VALIDATION_MODULE */',fs.readFileSync('validation.js','utf8').replace('export function','function')).replace('/* PLACE_DATA */',JSON.stringify(places).replaceAll('<','\\u003c'));
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',html);fs.writeFileSync('dist/robots.txt','User-agent: *\nDisallow: /\n');

const pages={...buildStaticPages(places),...buildIntentPages(places)};
for(const section of ['places','regions','guides'])fs.rmSync(path.join('dist',section),{recursive:true,force:true});
for(const [page,contents] of Object.entries(pages)){
 const dest=path.join('dist',page);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,contents);
}
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/review-queue.csv',reviewQueueCsv(places));
fs.writeFileSync('reports/verification-priority.csv',auditCsv(auditPlaces(places,{asOf:new Date().toISOString().slice(0,10)})));
fs.writeFileSync('reports/geolocation-readiness.json',JSON.stringify(geoCoverage(places),null,2)+'\n');
fs.writeFileSync('reports/keyword-hypotheses.csv',keywordHypothesisCsv(keywordHypotheses(places)));
fs.writeFileSync('reports/search-demand-input-template.csv',blankDemandTemplate(keywordHypotheses(places)));
console.log('Built '+Object.keys(pages).length+' researched pages and guides, plus non-public keyword hypotheses for research.');

console.log(`Built preview: ${places.length} research candidates; ${places.filter(p=>p.policy?.verifiedOn).length} policy-verified places.`);
