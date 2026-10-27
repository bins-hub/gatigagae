// Offline editorial workflow. This module does NOT authenticate users or publish content.
import {makeCorrectionDraft} from './correctionDraft.js';
const exactDate=s=>typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
function checkDraft(places,draft){
 if(!draft||draft.status!=='pending_review'||draft.requiresOperatorApproval!==true||draft.publicPolicyUnchanged!==true)
  throw Error('Pending correction proposal required');
 if(draft.change?.section!=='research'||!Object.prototype.hasOwnProperty.call(draft,'previousValue'))
  throw Error('Proposal lacks a tracked original research value');
 const expected=makeCorrectionDraft(places,{id:draft.id,field:draft.change.field,value:draft.change.value,sourceUrl:draft.evidence?.url,observedOn:draft.evidence?.observedOn,note:draft.note||''});
 for(const key of ['id','venueName','region'])if(expected[key]!==draft[key])throw Error('Proposal identity mismatch');
 if((expected.previousValue??null)!==(draft.previousValue??null))
  throw Error('Underlying venue data changed; create a new draft');
 if(!exactDate(draft.evidence.observedOn))throw Error('Invalid real calendar day');
 return expected;
}
export function decideCorrection(places,draft,{decision,reason,reviewedOn,confirmed=false}={}){
 checkDraft(places,draft);
 if(!['approve','reject'].includes(decision))throw Error('Decision must be approve or reject');
 if(confirmed!==true)throw Error('Explicit offline operator confirmation required');
 if(typeof reason!=='string'||reason.trim().length<10||reason.length>800)throw Error('Detailed review rationale required');
 if(!exactDate(reviewedOn))throw Error('Review date invalid');
 if(Date.parse(reviewedOn)<Date.parse(draft.evidence.observedOn))throw Error('Review cannot predate evidence');
 return {...draft,status:decision==='approve'?'approved':'rejected',review:{
  decision,reason:reason.trim(),reviewedOn,acknowledgedByOperator:true
 },publicPolicyUnchanged:true};
}
export function applyCorrection(places,reviewed){
 if(reviewed?.status!=='approved'||reviewed?.review?.decision!=='approve'||reviewed?.review?.acknowledgedByOperator!==true)
  throw Error('Only explicitly approved research corrections may be applied');
 // Revalidate approval content as a pending draft, including a conflict check against the current data.
 const pending={...reviewed,status:'pending_review',review:undefined};
 checkDraft(places,pending);
 const updated=structuredClone(places);
 const venue=updated.find(p=>p.id===reviewed.id);
 venue.research[reviewed.change.field]=reviewed.change.value;
 venue.research.reviewedOn=reviewed.review.reviewedOn;
 const src={label:'수정 근거 자료 ('+reviewed.review.reviewedOn+')',url:reviewed.evidence.url,kind:'운영자 승인 공개자료'};
 if(!venue.research.sources.some(x=>x.url===src.url))venue.research.sources.push(src);
 // Never mutate official policy, including its verifiedOn, weight and zones.
 return updated;
}
