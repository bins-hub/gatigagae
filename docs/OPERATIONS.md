# 같이가개 운영·정보 검증 절차

날짜: 2026-10-27. 이 도구는 **비공개 운영 초안 관리**이며, 웹 이용자가 제보하거나 업체 정책을 자동 확정하는 기능이 아닙니다.

## 조사 우선순위
1. `npm test && npm run build && npm run check:build` 실행
2. `reports/review-queue.csv`: 기존 10곳 조사 기록, 공개자료 검증 여부
3. `reports/verification-priority.csv`: 운영 여부 미확인·주소/체중 안내 충돌·90일 이상 지난 자료를 먼저 처리
4. 현재 업체 최신 정책 직접 검증: **0곳**. 웹에 공식 입장 가능이라고 표시하지 않음

GitHub `Check` 워크플로 완료 후 `operator-verification-queue` 아티팩트에서 CSV를 다운로드할 수 있습니다. 7일 보관. `reports/`는 `.gitignore`로 제외하며 실제 GitHub Pages에 포함하지 않습니다.

## 조사 정보 정정 초안 작성
운영자는 원문 출처가 확인된 수정안만 **승인 대기 초안**으로 만들 수 있습니다.

```sh
node tools/propose-correction.mjs dumon hours "업체 확인 후 기록할 정확한 시간" https://example.org/evidence 2026-10-27
```

주의: 위는 **형식 예시**이며 `example.org`는 실제 업체 출처가 아닙니다. 검증되지 않은 내용을 임의로 입력하지 마세요.

가능한 초안 항목은 주소/연락처/체중/실내/실외/요금/시간/경고/요약입니다. 정책 검증일·허용 여부 같은 `policy` 값은 이 도구로 수정할 수 없습니다.

출력 파일은 `reports/correction-drafts/*.json`이고 저장소·배포 폴더에는 포함되지 않습니다. 초안 작성 시 업체로 연락이 가거나 GitHub 사이트가 바뀌지 않습니다.

## 오프라인 승인·반려 절차 (v0.6.0)

**중요:** 이 기능은 사용자 인증된 관리자 웹사이트가 아닙니다. 저장소를 수정할 수 있는 운영자가 로컬에서 실행하는 스크립트입니다. 승인 결과도 공개 사이트에 자동 발행되지 않습니다.

1. 운영자가 실제 근거를 확인한 뒤 조사 정보 수정 초안을 작성합니다. 아래 `example.org`는 동작 형식 예시일 뿐 유효한 매장 근거가 아닙니다.

```sh
node tools/propose-correction.mjs dumon hours "실제 확인된 영업시간" https://example.org/actual-source 2026-10-27
```

2. `reports/correction-drafts/`에서 만들어진 JSON을 검토합니다. `previousValue`에 기존 값이 기록되므로 데이터가 바뀐 경우 오래된 초안은 승인할 수 없습니다.
3. 명시적으로 승인하거나 반려합니다.

```sh
node tools/review-correction.mjs reports/correction-drafts/초안.json approve "원문 주소와 현행 운영 안내를 직접 재검토했음" --confirm
node tools/review-correction.mjs reports/correction-drafts/초안.json reject "근거 자료가 최신 운영 안내를 입증하지 못함" --confirm
```

4. 승인된 검토 기록은 `reports/review-decisions/`에 저장됩니다. 승인 기록을 검토한 후 적용 전 미리보기 명령을 실행합니다.

```sh
node tools/apply-correction.mjs reports/review-decisions/승인.json --preview
```

5. **실제 운영자가 승인한 경우에만** `--write`로 로컬 `data/places.json` 조사 정보를 수정합니다.

```sh
node tools/apply-correction.mjs reports/review-decisions/승인.json --write
npm test && npm run build && npm run check:build
```

**승인 → 적용 → GitHub 반영 → 배포**는 서로 다른 단계입니다. 공개 `policy`는 이 흐름으로도 수정할 수 없고, 업체 현행 입장 허용 사실을 임의로 작성하면 안 됩니다. 기록과 CSV는 `reports/` 아래에 보관되어 Git 저장소·웹 발행본에 포함하지 않습니다.

## 지리 정보 기반 기능 준비 (v0.7 기반)

`geo.js`에 좌표 유효성 검사·거리 계산·거리순 정렬 엔진을 준비했습니다. 현재 10개 장소 모두 확인된 좌표가 없어 **거리순 검색은 아직 실제 사이트에서 제공하지 않습니다.** 검증 좌표가 없으면 0건을 반환합니다.

`reports/geolocation-readiness.json`에서 좌표 확인이 필요한 장소 수를 확인할 수 있습니다. 정확한 위치 출처·날짜를 확보하고 지도 API 사용 조건과 사용자 위치 접근 동의를 검토한 뒤 화면 연결이 가능합니다. 실제 좌표가 없는 상태에서 임의 중심점으로 거리를 표시하지 않습니다.

## 실제 정책 승인 전 확인사항
- 업체 동일성과 주소, 영업 상태를 확인합니다.
- 체중 경계(미만/이하), 견종, 마릿수, 요일, 실내외 좌석 조건을 각각 기록합니다.
- 공식 정보 출처와 확인일을 보관합니다. 비공개 전화 확인 기록에 대해 가짜 URL을 만들어서는 안 됩니다.
- 운영자 승인 후 `data/places.json` 수정, 테스트, 배포, 실제 페이지 검증을 수행합니다.
- 변경·충돌·폐업 등 추가 확인 전까지 `policy:null`을 유지합니다.

## 지역 확장 후보 일괄 조사 (준비 단계)

`candidateImport.js`는 기존 장소와 신규 후보의 **ID·상호·지역 중복**, 출처 URL, 발견 날짜, 지원 지역을 점검합니다. 통과한 후보도 모두 `pending_manual_research` 상태이며 **자동 게시 대상 0곳**입니다.

```sh
node tools/stage-candidates.mjs 후보목록.json
```

입력: UTF-8 JSON 배열이며 각각 `id`, `name`, `region`, `category`, `discoveryUrl`, `discoveredOn`을 담아야 합니다. 위 파일명은 예시이며 실제 장소 조사 파일이 있어야 합니다.

결과: `reports/candidate-staging-*.json`. 기존 `data/places.json`은 수정하지 않습니다. 새 지역은 실제 자료와 지역 페이지 구조를 별도로 검증하기 전까지 오류 표시합니다.

```json
[
  {
    "id": "example-source",
    "name": "가상 조사 후보",
    "region": "남양주",
    "category": "카페",
    "discoveryUrl": "https://example.org/research",
    "discoveredOn": "2026-10-27"
  }
]
```

**위 데이터는 기능 설명용 가상 예시입니다. 실제 매장 등록으로 사용하지 않습니다.**

## 남은 운영 개발
- 인증된 관리자 화면, 업체 확인 기록 저장소, 검증된 제보 접수, 승인/반려 이력 관리
- 공개 연락 채널, 개인정보/운영정책, 사용자 정보 수정·삭제 요청 프로세스
- 지오코딩과 지도로 위치/거리순 검색하려면 신뢰할 만한 좌표 및 지도 API 승인이 필요함
- SEO 색인은 정책 검증 완료 및 운영 안내 준비 후 결정
