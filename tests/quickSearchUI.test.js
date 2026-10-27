import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('Natural-language search is visible before advanced pet filters',()=>{
 assert.ok(html.indexOf('id="quick-search-form"')<html.indexOf('id="search-form"'));
 assert.ok(html.includes('id="quick-query"') && html.includes('role="search"'));
 assert.ok(html.includes('예: 남양주 애견동반 카페'));
});
test('Quick search reuses proven filters and clears stale restrictions',()=>{
 for(const token of ["interpretPlaceQuery(q)","query:q.toLocaleLowerCase('ko')","$('#region').value=region","$('#keyword').value=q","$('#saved-only').checked=false","$('#verified-only').checked=false","$('#exclude-limited').checked=false"])
  assert.ok(html.includes(token),token);
});
test('Quick examples and source disclaimers never claim current permitted admission',()=>{
 for(const x of ['data-query="남양주 애견동반 카페"','data-query="양평 강아지 동반 카페"','data-query="하남 반려견 동반 카페"','카페·식당 조사 후보','입장 규정은 매장에 직접 확인','식당 조사 후보 · 2곳','noindex,nofollow'])assert.ok(html.includes(x),x);
});
