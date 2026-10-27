# 같이가개 장소 데이터 스키마 — v0.4.0

## 원칙
- 현재 10곳은 **업체 최신 규정 직접 검증 0곳**입니다. `research`는 제삼자 소개·지자체 자료 등 공개 정보이며, 반려견 입장 허락으로 해석하지 않습니다.
- `policy`는 **업체의 공식 안내를 확인한 후에만** 채웁니다. 최신 안내 출처·확인일이 없으면 반드시 `null`.
- `research.reviewedOn`은 자료를 읽은 날이며, `policy.verifiedOn`은 공식 규정을 확인한 날입니다. 절대 혼용하지 않습니다.
- 모르는 항목을 무제한 / 모든 견종 허용 / 요일 무제한으로 바꾸지 않습니다.

## 검색 입력
`{weight, zone, breed, dogs, day}`
- `weight`: kg, 0 초과 ~ 150 이하
- `zone`: `any`, `indoor`, `outdoor`
- `breed`: 사용자가 입력한 정확한 견종명; 비우면 견종별 규정 미선택
- `dogs`: 동반 마릿수 정수 1~10
- `day`: `any`, `mon` ~ `sun`

## 정책 데이터 예시 (실제 장소 데이터 아님)
아래 예시는 가상의 정책 모델입니다. **실제 업체 확인 후 실제 근거로 교체해야만** 사용할 수 있습니다.

```json
{
 "verifiedOn": "2026-10-27",
 "sourceUrl": "https://example.org/official-policy",
 "conflict": false,
 "maxKg": 25,
 "inclusive": true,
 "unlimited": false,
 "minKg": null,
 "maxDogs": 2,
 "zones": {"indoor": true, "outdoor": false},
 "days": {"mon": true, "tue": false, "wed": true},
 "breeds": {"allowed": ["푸들"], "blocked": ["진돗개"], "allAllowed": false}
}
```

- `maxKg:null`은 입장 체중 제한 미확인을 뜻합니다. 공식적으로 제한이 없다는 경우에만 `unlimited:true`.
- `inclusive:false`면 해당 상한 *미만*입니다. 경계가 모호하면 공식 `policy`로 승격하지 마세요.
- `days` 값은 명확히 확인된 요일에만 `true`/`false`; 값이 없으면 미확인입니다.
- `maxDogs`는 확인된 마릿수 상한입니다. 입력이 없으면 다견 동반(2마리 이상)을 미확인으로 안내합니다.
- `breeds.allowed`는 공식 허용된 견종 목록, `breeds.blocked`는 공식 제한 견종 목록입니다. 불완전한 목록은 임의 허용에 사용하지 않습니다.
- `zones`의 `true`는 명시적 허용, `false`는 명시적 불가, 값이 없으면 미확인입니다.
- 유효한 `policy`라도 90일이 지나면 검색 결과에서 재확인 필요로 돌아갑니다.

## 조사 자료 세부 항목
`research.additionalConditions`에 `breed`, `dogs`, `days` 메모가 있습니다. 모두 출처에 근거한 텍스트 안내 또는 미확인 표기이며 공식 정책 판정에는 쓰지 않습니다.

## 운영 절차
1. 장소 이름·주소·운영 여부를 교차 확인합니다.
2. 업체 공식 정보와 최신 체중·견종·마릿수·요일·실내외 이용 규정을 확인합니다.
3. 출처 URL과 확인일을 보관합니다. 전화 확인처럼 공개 URL이 없는 경우에는 공식 확인 기록 저장 방식부터 별도로 설계합니다. 가짜 공식 URL을 넣으면 안 됩니다.
4. `npm test` 및 `npm run build`를 통과한 뒤 배포합니다.
5. 모순·정정·폐업 정보가 나오면 정책 승격을 해제하고 재확인합니다.

## 배포
개발 소스: `main`; 공개 정적 파일: `gh-pages`. 코드가 `main`으로 올라가도 현재 Pages 설정에서는 자동으로 배포되지 않습니다. `gh-pages` 발행은 별도 검증과 릴리스가 필요합니다.
