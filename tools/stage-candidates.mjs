import fs from 'node:fs';
import path from 'node:path';
import {stagePlaceCandidates} from '../candidateImport.js';
const file=process.argv[2];
if(!file){console.error('Usage: node tools/stage-candidates.mjs candidates.json');process.exit(2);}
const existing=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const incoming=JSON.parse(fs.readFileSync(file,'utf8'));
const staged=stagePlaceCandidates(existing,incoming);
fs.mkdirSync('reports',{recursive:true});
const dest=path.join('reports','candidate-staging-'+Date.now()+'.json');
fs.writeFileSync(dest,JSON.stringify(staged,null,2)+'\n',{flag:'wx'});
console.log('Draft candidate staging report:',dest);
console.log('Rows:',staged.total,'No automatic publication:',staged.automaticallyPublishable);
console.log('Issues:',staged.errors.length,'items. Next step is independent source and admission research.');
