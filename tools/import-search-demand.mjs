import fs from 'node:fs';
import path from 'node:path';
import {keywordHypotheses} from '../keywordResearch.js';
import {parseDemandCsv,importDemand,demandPriorityCsv} from '../searchDemand.js';

const input=process.argv[2],dateArg=process.argv[3]||new Date().toISOString().slice(0,10);
if(!input){console.error('Usage: node tools/import-search-demand.mjs SOURCE_EXPORT.csv [YYYY-MM-DD]');process.exit(2);}
if(!fs.existsSync(input))throw Error('Search demand input does not exist: '+input);
const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const hypotheses=keywordHypotheses(places);
const rows=parseDemandCsv(fs.readFileSync(input,'utf8'));
const imported=importDemand(rows,hypotheses,{asOf:dateArg});
if(imported.rejected.length){
 console.error('Import blocked; invalid or ambiguous rows:',JSON.stringify(imported.rejected,null,2));
 process.exitCode=2;
}else if(imported.accepted.length){
 fs.mkdirSync('reports',{recursive:true});
 const out=path.join('reports','search-demand-priority.csv');
 fs.writeFileSync(out,demandPriorityCsv(imported.accepted),{flag:'w'});
 console.log('Imported',imported.measuredCount,'operator-supplied keyword rows; no platform verification has been performed.');
 console.log('Internal priority report:',out);
 console.log('Search metrics are NOT uploaded, published or used to create live pages.');
}else{
 console.log('No keyword measurements provided. Import did not invent zero-volume values.');
}
