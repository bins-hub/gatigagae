import {test} from 'node:test';
import assert from 'node:assert/strict';
import {matchPlace} from '../matching.js';
const today='2026-10-27';
const base={policy:{
 verifiedOn:today, sourceUrl:'https://example.org/policy',
 maxKg:25, inclusive:true, zones:{indoor:true,outdoor:false},
 maxDogs:2, days:{mon:true,tue:false,wed:true},
 breeds:{allowed:['푸들','비숑'],blocked:['진돗개'],allAllowed:false}
}};
const run=(changes={},query={})=>matchPlace({policy:{...base.policy,...changes}},{weight:16,zone:'indoor',breed:'푸들',dogs:1,day:'mon',...query},today);
test('조건을 모두 확인한 경우에만 조건부 일치',()=>assert.equal(run().state,'conditional'));
test('확인된 체중 상한과 경계 판정',()=>{assert.equal(run({}, {weight:25}).state,'conditional');assert.equal(run({inclusive:false},{weight:25}).state,'excluded');assert.equal(run({},{weight:25.1}).state,'excluded')});
test('공간과 영업 요일의 명시적 불가',()=>{assert.equal(run({}, {zone:'outdoor'}).state,'excluded');assert.equal(run({}, {day:'tue'}).state,'excluded')});
test('요일 미확인과 미선택의 차이',()=>{assert.equal(run({}, {day:'sun'}).state,'unknown');assert.equal(run({}, {day:'any'}).state,'conditional')});
test('2마리 허용·3마리 제한·다견 미확인',()=>{assert.equal(run({},{dogs:2}).state,'conditional');assert.equal(run({},{dogs:3}).state,'excluded');assert.equal(run({maxDogs:null},{dogs:2}).state,'unknown')});
test('견종 허용·제한·미확인 분리',()=>{assert.equal(run({}, {breed:'진돗개'}).state,'excluded');assert.equal(run({}, {breed:'푸들'}).state,'conditional');assert.equal(run({}, {breed:'시바'}).state,'unknown');assert.equal(run({}, {breed:''}).state,'unknown')});
test('견종 정보 없으면 다른 조건 충족해도 확정 불가',()=>assert.equal(run({breeds:null}, {breed:'푸들'}).state,'unknown'));
test('체중 무제한은 근거가 명시된 경우만 인정',()=>{assert.equal(run({maxKg:null,unlimited:false}).state,'unknown');assert.equal(run({maxKg:null,unlimited:true}).state,'conditional')});
test('정책 미등록·출처 없는 규정·충돌이면 미확인',()=>{assert.equal(matchPlace({policy:null},{weight:16},today).state,'unknown');assert.equal(run({sourceUrl:null}).state,'unknown');assert.equal(run({conflict:true}).state,'unknown')});
test('90일 초과, 미래 규정은 거절 또는 허용으로 추정 금지',()=>{assert.equal(run({verifiedOn:'2026-01-01'}).state,'unknown');assert.equal(run({verifiedOn:'2027-01-01'}).state,'unknown')});
test('잘못된 체중·견수·요일·공간은 안전하게 차단',()=>{for(const args of [{weight:0},{dogs:0},{dogs:2.5},{dogs:11},{day:'holiday'},{zone:'pool'}])assert.equal(run({},args).state,'invalid')});
