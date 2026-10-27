import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCorrectionDraft} from '../correctionDraft.js';
import {decideCorrection,applyCorrection} from '../reviewDecision.js';
const places=JSON.parse(readFileSync(new URL('../data/places.json',import.meta.url),'utf8'));
const propose=()=>makeCorrectionDraft(places,{id:'dumon',field:'hours',value:'재검증된 영업시간(예시)',sourceUrl:'https://example.org/actual-evidence',observedOn:'2026-10-27'});
const approve=draft=>decideCorrection(places,draft,{decision:'approve',reason:'공개된 업체 안내문을 실제로 확인했다는 전제의 테스트',reviewedOn:'2026-10-27',confirmed:true});
test('Proposal stores previous value to reject stale concurrent changes',()=>{
 const d=propose();assert.equal(d.previousValue,places.find(p=>p.id==='dumon').research.hours);
 const changed=structuredClone(places);changed.find(p=>p.id==='dumon').research.hours='OTHER VALUE';
 assert.throws(()=>decideCorrection(changed,d,{decision:'approve',reason:'충분히 길게 쓴 확인 메모',reviewedOn:'2026-10-27',confirmed:true}),/Underlying venue/);
});
test('Approval requires explicit operator acknowledgement and reason',()=>{
 const d=propose();
 assert.throws(()=>decideCorrection(places,d,{decision:'approve',reason:'충분히 긴 내용',reviewedOn:'2026-10-27'}),/confirmation/);
 assert.throws(()=>decideCorrection(places,d,{decision:'approve',reason:'짧음',reviewedOn:'2026-10-27',confirmed:true}),/rationale/);
});
test('Rejection cannot be applied',()=>{
 const reviewed=decideCorrection(places,propose(),{decision:'reject',reason:'상호가 동일한 다른 매장일 가능성 있음',reviewedOn:'2026-10-27',confirmed:true});
 assert.equal(reviewed.status,'rejected');
 assert.throws(()=>applyCorrection(places,reviewed),/Only explicitly approved/);
});
test('Approved corrections modify research only and retain original official policy',()=>{
 const baseline=JSON.stringify(places),updated=applyCorrection(places,approve(propose()));
 const d=updated.find(p=>p.id==='dumon'),before=places.find(p=>p.id==='dumon');
 assert.equal(d.research.hours,'재검증된 영업시간(예시)');
 assert.equal(d.policy,before.policy);
 assert.equal(d.research.reviewedOn,'2026-10-27');
 assert.ok(d.research.sources.some(s=>s.url.includes('actual-evidence')));
 assert.equal(JSON.stringify(places),baseline);
});
test('Tampered official policy, missing original snapshot and bad decisions are rejected',()=>{
 const d=propose();
 assert.throws(()=>decideCorrection(places,{...d,change:{section:'policy',field:'hours',value:'x'}},{decision:'approve',reason:'충분히 긴 실제 확인 메모',reviewedOn:'2026-10-27',confirmed:true}),/tracked original/);
 assert.throws(()=>decideCorrection(places,{...d,previousValue:'fake'},{decision:'approve',reason:'충분히 긴 실제 확인 메모',reviewedOn:'2026-10-27',confirmed:true}),/Underlying venue/);
 assert.throws(()=>decideCorrection(places,d,{decision:'auto',reason:'충분히 긴 실제 확인 메모',reviewedOn:'2026-10-27',confirmed:true}),/Decision/);
});
test('Invalid calendar date and early review date cannot be accepted',()=>{
 const d=propose();
 assert.throws(()=>decideCorrection(places,d,{decision:'approve',reason:'충분히 긴 실제 확인 메모',reviewedOn:'2026-10-26',confirmed:true}),/predate/);
 assert.throws(()=>decideCorrection(places,d,{decision:'approve',reason:'충분히 긴 실제 확인 메모',reviewedOn:'2026-02-30',confirmed:true}),/date/);
});
