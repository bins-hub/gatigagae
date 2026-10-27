# 같이가개 검색 수요 실측 자료 가져오기 · v0.9.0

## 현재
검색어 90개는 검증 전 가설이며 실제 월 검색수 **0개 확인**. 검색엔진 색인 차단은 유지합니다.
검색광고 경쟁정도는 광고 지표이며 자연검색 SEO 난이도가 아닙니다.

## 자료 수집
GitHub Actions의 Check 워크플로 성공 후 운영자 아티팩트(operator-verification-queue)에서
search-demand-input-template.csv 파일을 받습니다. 90개 키워드 옆 검색수는 모두 빈칸입니다.

네이버 광고주센터 → 도구 → 키워드 도구에서 직접 조회합니다.
공식 안내: https://ads.naver.com/help/faq/1639

CSV 열 순서:
keyword,monthlyPc,monthlyMobile,competition,source,sourceUrl,checkedOn

- keyword: 기존 90개 조사 문구 중 하나
- monthlyPc / monthlyMobile: 월간 PC/모바일 검색수. 숫자 또는 <10; 모르거나 제공되지 않으면 빈칸
- competition: 낮음 / 중간 / 높음 (광고 경쟁 지표이며 SEO 경쟁도 아님)
- source: naver-searchads 또는 google-keyword-planner
- sourceUrl: 원 자료를 확인한 HTTPS 출처. URL 기입만으로 실제 진위를 확인한 것은 아님
- checkedOn: 실제 조회 날짜 YYYY-MM-DD
- 데이터랩의 상대 검색 관심도 지수를 월간 검색수로 입력하지 않습니다.

## 내부 검증과 우선순위
npm test
npm run build
node tools/import-search-demand.mjs reports/실측검색수.csv 2026-10-27

유효하면 reports/search-demand-priority.csv 생성.
중복, 근거 없음, 미래 날짜, 존재하지 않는 키워드, 잘못된 수치가 있으면 가져오기를 차단합니다.
180일을 넘긴 데이터는 오래된 자료로 표시합니다.
<10을 0 또는 10으로 확정하지 않고 가능한 0~9 구간으로 보관합니다.
결과는 제공된 자료로 만든 **내부 확인 순서**이며 검색량 독립 검증이나 SEO 성공 예측이 아닙니다.

## 색인 공개
업체 직접 규정 확인, 운영 주체·연락처, 정보 정정 절차, 실질적인 콘텐츠가 준비되기 전
noindex/nofollow와 robots 차단을 유지합니다. search-readiness.json은 차단 해제 승인용이 아닙니다.
