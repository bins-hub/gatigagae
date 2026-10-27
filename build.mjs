import {validatePlaces} from './validation.js';
import path from 'node:path';
import {buildStaticPages,reviewQueueCsv} from './staticPages.js';
import fs from 'node:fs';
const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const problems=validatePlaces(places);
if(problems.length)throw Error('Invalid places data:\n'+problems.join('\n'));
const html=fs.readFileSync('index.html','utf8').replace('/* MATCHING_MODULE */',fs.readFileSync('matching.js','utf8').replace('export function','function')).replace('/* RESEARCH_MODULE */',fs.readFileSync('researchScreen.js','utf8').replace('export function','function')).replace('/* VALIDATION_MODULE */',fs.readFileSync('validation.js','utf8').replace('export function','function')).replace('/* PLACE_DATA */',JSON.stringify(places).replaceAll('<','\\u003c'));
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',html);fs.writeFileSync('dist/robots.txt','User-agent: *\nDisallow: /\n');

const pages=buildStaticPages(places);
for(const section of ['places','regions'])fs.rmSync(path.join('dist',section),{recursive:true,force:true});
for(const [page,contents] of Object.entries(pages)){
 const dest=path.join('dist',page);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,contents);
}
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/review-queue.csv',reviewQueueCsv(places));
console.log('Built '+Object.keys(pages).length+' detail and region pages, plus private review queue for '+places.length+' candidates.');

console.log(`Built preview: ${places.length} research candidates; ${places.filter(p=>p.policy?.verifiedOn).length} policy-verified places.`);
