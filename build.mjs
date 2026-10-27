import fs from 'node:fs';
const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
if(new Set(places.map(p=>p.id)).size!==places.length)throw Error('Duplicate place id');
for(const p of places){if(!p.id||!p.name||!p.region||!p.discoveryUrl?.startsWith('https://'))throw Error('Invalid place');if(p.policy&&!p.policy.sourceUrl)throw Error('Policy needs evidence');}
const html=fs.readFileSync('index.html','utf8').replace('/* MATCHING_MODULE */',fs.readFileSync('matching.js','utf8').replace('export function','function')).replace('/* RESEARCH_MODULE */',fs.readFileSync('researchScreen.js','utf8').replace('export function','function')).replace('/* PLACE_DATA */',JSON.stringify(places).replaceAll('<','\\u003c'));
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',html);fs.writeFileSync('dist/robots.txt','User-agent: *\nDisallow: /\n');
console.log(`Built preview: ${places.length} research candidates; ${places.filter(p=>p.policy?.verifiedOn).length} policy-verified places.`);
