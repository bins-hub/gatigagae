import fs from 'node:fs';
import path from 'node:path';
import {decideCorrection} from '../reviewDecision.js';
const [file,decision,reason,confirm]=process.argv.slice(2);
if(!file||!decision||!reason||confirm!=='--confirm'){
 console.error('Usage: node tools/review-correction.mjs DRAFT.json approve|reject "Detailed reason" --confirm');
 process.exit(2);
}
const draft=JSON.parse(fs.readFileSync(file,'utf8'));
const places=JSON.parse(fs.readFileSync('data/places.json','utf8'));
const decisionDoc=decideCorrection(places,draft,{decision,reason,reviewedOn:new Date().toISOString().slice(0,10),confirmed:true});
const folder=path.join('reports','review-decisions');fs.mkdirSync(folder,{recursive:true});
const filename=path.join(folder,draft.id+'-'+draft.change.field+'-'+Date.now()+'.json');
fs.writeFileSync(filename,JSON.stringify(decisionDoc,null,2)+'\n',{flag:'wx'});
console.log('Offline review record:',filename);
console.log('Source data NOT modified. Public website NOT published.');
