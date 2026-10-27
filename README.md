# 같이가개

버전: 0.5.0 (장소별 상세 페이지 10개·지역별 3개·검증 대기 목록 생성)

중대형견의 체중과 이용 공간으로 장소를 살펴보는 정적 웹 MVP. 하남·남양주·양평부터 시작합니다.

## 실행

Node.js 22 이상, 설치할 의존성 없음.

```sh
npm test
npm run build
npm run check:build
python3 -m http.server 8080 --directory dist
```

`dist/index.html`은 단독 파일로 열어도 작동합니다. 원본 `index.html`은 빌드용 템플릿입니다.

## 현재 상태

- 장소 ID 기준으로 `places/<id>/` 상세 페이지 10개와 `regions/{hanam,namyangju,yangpyeong}/` 지역별 페이지 3개를 빌드 때 자동 생성합니다. 별도 사이트가 아니고 기존 같이가개 GitHub Pages의 하위 주소입니다.
- 모든 상세/지역 페이지는 외부 공개자료의 출처·주의 문구를 표시하며 검증 전 `noindex,nofollow`입니다. 지도는 네이버 지도 **검색 링크**이지 검증 좌표가 아닙니다.
- `reports/review-queue.csv`는 빌드에서 자동 생성하는 **비공개 개발용 조사 목록**입니다. `dist`에 넣지 않으며 `.gitignore`로 원본 저장소 제출도 제외합니다.
- `docs/DEVELOPMENT_ROADMAP.md`를 진행 상태의 유일한 기준 문서로 관리합니다.
- `reviewAudit.js`: 운영불명·주소 충돌·90일 경과 우선순위 보고서 `reports/verification-priority.csv`를 생성합니다. `correctionDraft.js`와 `tools/propose-correction.mjs`는 출처 포함 **승인 대기 초안만** 작성하며 실제 공개 규정에 자동 반영하지 않습니다.
- `.github/workflows/deploy-pages.yml`: 운영자가 Pages 설정을 GitHub Actions로 전환하면 자동 발행할 수 있도록 **비활성 상태로 준비**되어 있습니다. 기존 Pages는 수동 `gh-pages` 게시를 유지합니다.

- 체중·지역·실내외·장소명/주소 검색에 **견종·동반 마릿수·방문 요일** 입력을 추가했습니다. 체중 제한 후보 제외(해제 가능), 자료 충돌 경고, 상담 문구 복사, 즐겨찾기, 상세 팝업, 외부 지도 검색도 유지됩니다.
- 정확한 입장 판정은 **업체 직접 검증 정책**이 있는 경우에만 가능합니다. 확인되지 않은 견종·다견·요일 조건은 미확인으로 표시됩니다.
- 장소마다 `research.additionalConditions`를 두어 견종·마릿수·요일별 공개자료를 관리합니다. 이는 실시간 운영 규정이 아닙니다.
- `validation.js`가 중복 장소, 출처, 정책 값 오류를 검사하고 `tools/check-build.mjs`가 빌드 결과를 점검합니다.
- 공개자료에서 체중 초과가 명시된 장소만 기본 후보에서 제외합니다. 출처끼리 충돌하거나 규정이 미확인인 장소는 임의로 제외하거나 입장 가능하다고 확정하지 않습니다. **전화는 사용자가 직접 걸어야 하며, 문의 복사는 실제 발송이 아닙니다.**
- 실제 장소 조사 후보 10곳을 공개자료·매장 소개·지자체 관광 정보로 보강했습니다. **업체 최신 정책 직접 검증 완료 0곳**. 후보의 존재/영업/입장 조건을 보증하지 않습니다.
- 각 장소에 `research` 객체(자료 조사일, 주소, 전화, 요금, 체중·실내외 조건, 충돌 경고, 원문 링크)를 기입했습니다. `research.reviewedOn`은 사이트 담당자가 외부 공개자료를 확인한 날짜이며 업체 확인일이 아닙니다. `policy`는 여전히 `null`입니다.
- 정책 미확인/충돌/90일 초과/미래 날짜는 확인 필요. 체중 상한의 미만/이하 구분.
- 외부 지도는 검색 링크이며 개별 매장의 정확한 위치/길찾기 확정 링크가 아닙니다.
- 제보 접수·전화 발신·예약·광고·MOULY 상품 연결·통계는 미연결. 전화 링크는 휴대전화의 전화 앱만 열고, 문의 문구는 직접 복사·전송합니다.
- noindex 및 robots 차단: 공식 검증과 운영 안내를 갖춘 뒤 공개 검색 허용 여부를 결정합니다.

## 정책 데이터

`data/places.json`의 `policy`를 공식 자료 확인 후 아래 형태로 입력합니다. 예시 URL은 테스트 전용이며 실제 데이터에 넣지 마세요.

```json
{"verifiedOn":"실제 확인한 YYYY-MM-DD","sourceUrl":"https://업체-공식-안내","maxKg":20,"inclusive":true,"unlimited":false,"zones":{"indoor":true,"outdoor":null},"conflict":false}
```

무게 미수집은 `maxKg:null, unlimited:false`입니다. 무제한을 명시한 자료가 있을 때만 `unlimited:true`를 사용합니다. `zones`의 `null`은 미확인입니다. 정책 원문과 구역·견종·필수 용품·요금 조건을 추가 기록한 후 공개 데이터로 승격하세요. 체중 조건 일치는 입장 확약이 아닙니다.

후보 발견 출처는 각 레코드에 있습니다. 제3자 소개는 정책 확정 근거로 사용하지 않았습니다. 사진·리뷰·소개문을 복제하지 않았습니다. 일러스트는 프로젝트 내 SVG입니다.

## GitHub

GitHub 저장소: https://github.com/bins-hub/gatigagae (다른 프로젝트와 독립).

GitHub Pages 공개 주소: https://bins-hub.github.io/gatigagae/ . 실제 사이트는 `gh-pages` 브랜치 루트의 빌드 파일로 제공되며, `main`은 개발 코드입니다. 수정 전 복구용 브랜치는 `backup/pre-v0.3-20261027`과 `backup/pages-pre-v0.3-20261027`입니다. GitHub Actions는 테스트·빌드·배포 전 정적 검사까지 수행합니다. **현재 `main` 변경이 공개 사이트에 자동 반영되지는 않습니다.** 별도 `gh-pages` 업데이트 후 Pages 배포 상태를 확인해야 합니다.

## v0.4 데이터 검증 문서

- [`docs/data-policy-schema.md`](docs/data-policy-schema.md): 공식 정책/외부 소개 구분, 검색 입력과 정책 모델, 입력 검증, 운영 절차.
- 정책 검증 0곳은 그대로 유지하며, 검증 없는 장소를 입장 확약처럼 표기하지 않습니다.
- 수정 전 소스 및 사이트 백업 브랜치: `backup/main-before-v0.5-20261027`, `backup/pages-before-v0.5-20261027`.

## 운영 문서와 배포 자동화

- [내부 검증·정보 수정 초안 절차](docs/OPERATIONS.md)
- [GitHub Pages 자동 발행 전환 방법](docs/AUTO_DEPLOY.md)
- [지속 개발 로드맵](docs/DEVELOPMENT_ROADMAP.md)

## 다음 작업

최신 진행 상태와 보류 작업은 [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md)를 먼저 확인합니다. 아래는 외부 검증을 포함한 장기 작업입니다.


1. 공개자료 조사 후보 10곳의 최신 영업/체중/실내외/견종 규정을 업체에 직접 문의하고 상담 일자, 안내자 및 원문 링크 기록. 특히 포러데이 위치 충돌·애견카페왕 체중 상충·브릭야드 20kg 경계를 해결할 것.
2. 실내 구역·견종·마릿수·요일별 조건 데이터 확장 및 폼 입력.
3. 정보 수정 접수처와 운영자/개인정보 안내 확정.
4. 검증된 장소 중심 상세 페이지 및 지역 소개 페이지 작성.
5. 공개 배포, 도메인, Search Console 연결.

## 2026-10-27 조사 노트

- 상세 조사 기록과 출처: `docs/research-2026-10-27.md`
- 외부 매장 등록 프로필, 관광정보, 방문기, 공공데이터의 의미가 다르므로 **자료에 언급됨 != 업체 현재 입장 보증** 입니다.
- 자료 조사만으로 `policy.verifiedOn`을 채우지 않았습니다. 조건 확인 필터는 여전히 0곳으로 표시됩니다.
- 운영 중인지 미확인되는 하남 나무 후보, 서로 다른 주소가 섞인 포러데이는 방문 전 확인 우선입니다.