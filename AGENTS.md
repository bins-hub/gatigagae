# 같이가개 — Codex development instructions

Repository: `bins-hub/gatigagae` | Production: `https://bins-hub.github.io/gatigagae/`

## Source of truth
- Read `docs/DEVELOPMENT_ROADMAP.md` and `README.md` before choosing the next task.
- `main` contains source and tests; `gh-pages` is the published compiled static site. Never assume a push to `main` automatically deploys production.
- Keep work scoped to the next unfinished, independently testable item. Record completed work, blockers, and recovery refs in the roadmap.

## Mandatory release sequence
1. Inspect both current branch heads and relevant GitHub Actions runs.
2. Before changes, create uniquely named backup branches for **both** `main` and `gh-pages` from their verified current commits.
3. Implement on source, keeping unrelated and existing features intact.
4. Run `npm test`, `npm run build`, and `npm run check:build` (Node.js 22+).
5. Stop release if tests fail. Fix tests and source, then rerun.
6. Deploy compiled `dist/` to `gh-pages` only after checks pass, preserving unrelated published files. GitHub Pages currently publishes from `gh-pages`.
7. Confirm Pages Actions success and verify the actual public URL, normal and preview modes, mobile responsiveness, and major search flows. Report the published SHA and recovery branches. Never claim deployment merely because a git commit succeeded.

## Data and trust safeguards
- Current researched dataset: **13 venues** (11 cafés, 2 restaurants), **0 venues verified directly with businesses**. Do not invent verification, hours, pet restrictions, availability, location coordinates, reviews, photographs, or demand metrics.
- Keep `noindex,nofollow` and `robots.txt` disallow-all until specifically approved after source and operations verification.
- Search, detail pages, region pages, saved locations, pet profile, evidence warnings, and copy-only correction notes must continue working.
- Do not automatically change an unverified place's `policy` based on outside posts. Operational corrections require source evidence and approval.
- Never expose private CSV reports, tokens, or personally identifying information in `dist/`.

## Advertising
- The user approved showing the **MOULY and 아이펫스맘** design banner to ordinary visitors, placed after the fourth result (or after the last result if there are fewer). No banner when there are zero results. It must be dismissible and clearly labeled advertising.
- The alternative advertiser-recruitment concept remains test-only at `?bannerPreview=1&bannerStyle=recruit`; do not launch actual recruitment or add a contact form without approval.
- No outbound shop URLs, tracking pixels, unverified brand claims, ad pricing, or automated ad enrollment without explicit approval.
- The brand-only preview remains at `?bannerPreview=1`.

## Working style
- Prefer conservative, reversible, tested changes, especially in navigation, SEO indexing, and public data.
- If a task requires business confirmation, credentials, commercial integrations, or privacy policy decisions, document the blocker and proceed to the next safely independent task.
- Keep documentation accurate: the current venue count is 13. Update version numbers and release notes together when cutting a version.
