import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('지역 선택 항목이 모두 완성된 option으로 등록된다', () => {
  const region = html.match(/<select id="region">([\s\S]*?)<\/select>/)?.[1];
  assert.ok(region, '지역 선택 입력이 있어야 합니다');
  const options = [...region.matchAll(/<option(?:\s+[^>]*)?>([^<]*)<\/option>/g)].map((match) => match[1]);
  assert.deepEqual(options, ['지역 전체', '하남', '남양주', '양평']);
  assert.equal(region.replace(/<option(?:\s+[^>]*)?>[^<]*<\/option>/g, '').trim(), '');
});

test('실내·실외 상관없음은 한 구역만 허용해도 조회한다는 의미로 안내한다', () => {
  assert.match(html, /<option value="any">실내 · 실외 상관없음<\/option>/);
});
