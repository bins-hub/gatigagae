# 같이가개 자동 배포 전환 안내

현재 사이트는 **Deploy from a branch → gh-pages → /(root)** 방식으로 정상 발행됩니다.
프로젝트 자동 검사 파일은 `.github/workflows/check.yml`이고, 자동 배포 준비 파일은 `.github/workflows/deploy-pages.yml`입니다.

GitHub 공식 안내에 따르면 **GITHUB_TOKEN을 사용해 gh-pages 브랜치에 푸시한 커밋은 Pages 자동 빌드를 트리거하지 않습니다.**
따라서 브랜치 방식으로 자동 커밋만 추가하는 것은 피합니다.

## 한 번만 변경하면 되는 운영자 설정 (현재 미실행)

1. 저장소 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions** 선택
2. **Settings → Secrets and variables → Actions → Variables → New repository variable**
3. Name: `PAGES_ACTIONS_ENABLED`, Value: `true`
4. **Actions → Publish GitHub Pages (opt-in) → Run workflow**를 선택해 최초 배포
5. 새로운 사이트 주소에서 장소 페이지·지역 페이지·noindex 및 기존 검색 기능 확인

그다음부터 `main`에 코드가 푸시되면 워크플로가 테스트 → 빌드 → 배포 전 검증 → Pages 발행까지 수행하도록 준비돼 있습니다.
**설정 전에는 새 워크플로가 스킵**되므로 기존 `gh-pages` 사이트를 변경하지 않습니다.

## 자동 배포 중단/복구
- 변수 `PAGES_ACTIONS_ENABLED`를 `false`로 설정하면 새 자동 배포가 스킵됩니다.
- 기존 발행 버전 백업: `backup/pages-before-v0.5-20261027`
- Pages 설정을 `Deploy from a branch → gh-pages → /(root)`로 되돌리면 브랜치 기반 운영으로 복구할 수 있습니다.
- 수동 GitHub 업데이트나 승인 없이 ChatGPT가 채팅 종료 후 계속 개발하는 방식은 아닙니다. 자동화되는 것은 **GitHub에 새 소스가 푸시된 뒤의 테스트·배포 과정**입니다.

공식 문서: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
