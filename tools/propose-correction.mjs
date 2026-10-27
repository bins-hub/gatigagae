import fs from 'node:fs';
import path from 'node:path';
import {makeCorrectionDraft} from '../correctionDraft.js';
const [id,field,value,sourceUrl,observedOn]=process.argv.slice(2);
if(!id||!field||!value||!sourceUrl){
 console.error('Usage: node tools/propose-correction.mjs VENUE_ID FIELD "VALUE" HTTPS_SOURCE_URL [YYYY-MM-DD]');
 process.exit(2);
}
const data=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const draft=makeCorrectionDraft(data,{id,field,value,sourceUrl,observedOn:observedOn||new Date().toISOString().slice(0,10)});
const folder=path.join('reports','correction-drafts');fs.mkdirSync(folder,{recursive:true});
const filename=path.join(folder,draft.id+'-'+draft.change.field+'-'+Date.now()+'.json');
fs.writeFileSync(filename,JSON.stringify(draft,null,2)+'\n');
console.log('Saved an INTERNAL pending correction draft:',filename);
console.log('Not published. Requires source review and operator approval.');
