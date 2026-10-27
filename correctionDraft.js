// Internal editorial draft only. This is not a public submission API and never changes published policy.
export const EDITABLE_RESEARCH_FIELDS=Object.freeze(['address','phone','weight','indoor','outdoor','fee','hours','warning','summary']);
export function makeCorrectionDraft(places,{id,field,value,sourceUrl,observedOn='2026-10-27',note=''}={}){
 const venue=places.find(p=>p.id===id);
 if(!venue)throw Error('Unknown venue ID');
 if(!EDITABLE_RESEARCH_FIELDS.includes(field))throw Error('Field not editable through research proposal');
 if(typeof value!=='string'||!value.trim()||value.length>2000)throw Error('Proposed value is empty or too long');
 if(typeof sourceUrl!=='string'||!/^https:\/\/[^/\s]+(?:\/[^\s]*)?$/i.test(sourceUrl))throw Error('An HTTPS evidence URL is required');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(observedOn)||Number.isNaN(Date.parse(observedOn+'T00:00:00Z')))throw Error('Invalid observation date');
 if(typeof note!=='string'||note.length>1000)throw Error('Note exceeds allowed length');
 return {id:venue.id,venueName:venue.name,region:venue.region,status:'pending_review',
  previousValue:venue.research?.[field]??null,
  change:{section:'research',field,value:value.trim()},evidence:{url:sourceUrl,observedOn},
  note:note.trim(),requiresOperatorApproval:true,publicPolicyUnchanged:true};
}
