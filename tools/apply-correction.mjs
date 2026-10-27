import fs from 'node:fs';
import {applyCorrection} from '../reviewDecision.js';
import {validatePlaces} from '../validation.js';
const [file,flag]=process.argv.slice(2);
if(!file || !['--preview','--write'].includes(flag)){
 console.error('Usage: node tools/apply-correction.mjs REVIEWED.json --preview|--write');
 process.exit(2);
}
const reviewed=JSON.parse(fs.readFileSync(file,'utf8'));
const inputFile='data/places.json';
const original=fs.readFileSync(inputFile,'utf8');
const places=JSON.parse(original);
const next=applyCorrection(places,reviewed);
const issues=validatePlaces(next);
if(issues.length)throw Error('Updated venue data invalid:\n'+issues.join('\n'));
for(let i=0;i<next.length;i++){
 if(JSON.stringify(next[i].policy)!==JSON.stringify(places[i].policy))throw Error('Official policy modification blocked');
}
if(flag==='--preview'){
 console.log('PREVIEW ONLY: would change',reviewed.id,reviewed.change.field,'from',JSON.stringify(reviewed.previousValue),'to',JSON.stringify(reviewed.change.value));
 console.log('Source file NOT changed. Review record and operator approval are still required.');
}else{
 // The explicit --write flag changes research data locally; it never pushes to GitHub.
 fs.writeFileSync(inputFile,JSON.stringify(next,null,2)+'\n');
 console.log('Approved research changes saved LOCALLY. npm test + build + human Git review required before publication.');
}
