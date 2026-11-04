# CLAUDE.md

유비니즈 주식회사(UBINEEDS Inc.) 공식 홈페이지. GitHub Pages로 배포되는 순수 정적 사이트(HTML/CSS/JS, 빌드 도구·프레임워크·npm 없음).

- 라이브: https://ubineeds.com (CNAME → `ubineeds.github.io`)
- 배포: `main` 브랜치에 push하면 GitHub Pages가 자동 배포. 별도 빌드 단계 없음.

## 로컬 실행

`footer.js`가 `components/footer.html`을 `fetch()`로 불러오기 때문에 `file://`로 열면 footer가 폴백으로 뜬다. 반드시 로컬 서버로 확인할 것.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 구조

```
index.html / dev.html / design.html   # 페이지 3개 (홈, IT 개발, 디자인)
components/footer.html                # 공용 footer (스타일 포함, footer.js가 동적 삽입)
assets/css/common.css                 # CSS 변수, 테마, 공통 레이아웃
assets/css/{home,dev,design}.css      # 페이지별 스타일
assets/js/analytics.js                # GA4 이벤트 추적 (window.Analytics)
assets/js/common.js                   # 테마 토글, 네비, 모바일 메뉴 (window.CommonUtils)
assets/js/footer.js                   # footer fetch + 삽입 + 이벤트 바인딩
assets/js/{home,dev,design}.js        # 페이지별 기능
```

### 페이지 규약
- 각 페이지는 `common.css` + 페이지 전용 CSS를 `<head>`에, 스크립트는 `</body>` 직전에 **analytics → common → footer → 페이지 JS** 순서로 로드한다. 순서를 바꾸면 `window.Analytics` / `window.CommonUtils`를 참조하는 코드가 깨진다.
- 새 페이지를 추가하면 같은 패턴으로 CSS/JS 한 쌍을 만들고, GA4 스니펫(`G-EDT6WYXFVM`)을 `<head>`에 복사한다.
- 공용 header/nav는 각 HTML에 중복되어 있다. 메뉴를 바꾸면 세 페이지 모두 수정할 것. footer만 컴포넌트화되어 있다.

### 테마
- 다크 모드는 `<body data-theme="dark">` 속성으로 전환하고 `localStorage`에 저장한다. 색상은 반드시 `common.css`의 CSS 변수(`--primary-bg`, `--text-primary`, `--accent-color` 등)를 쓰고, 하드코딩 색상을 넣지 않는다.

### 분석(GA4)
- 사용자 행동 이벤트는 `window.Analytics`의 메서드(`contact_click`, `service_interest`, `navigation_click`, `theme_change`, `scroll_depth` 등)를 통해 보낸다. `gtag()`를 직접 호출하지 않는다.

## 작업 시 주의
- 회사 정보(이메일 ubineeds@naver.com, 전화 070-8098-8867, 강릉 주소)는 `components/footer.html`과 README에 있다. 변경 시 두 곳을 함께 맞춘다.
- `.DS_Store`는 `.gitignore`에 있지만 과거 커밋에 이미 추적 중인 것이 있다. 정리하려면 `git rm --cached` 후 커밋.
- README의 "업데이트 히스토리" 섹션은 기능 변경 시 함께 갱신한다.

## SEO / 검색엔진 등록
- `robots.txt`, `sitemap.xml`은 루트에 있다. 페이지를 추가·삭제하면 `sitemap.xml`의 `<url>` 목록도 함께 갱신한다.
- 네이버 서치어드바이저 소유 확인용 `<meta name="naver-site-verification">` 태그는 `index.html` `<head>`에 둔다. 삭제하면 소유 확인이 풀리므로 head를 정리할 때 유지할 것.
- 구글 서치 콘솔은 `https://ubineeds.com/` URL 접두어 속성이며 GA4 태그(`G-EDT6WYXFVM`)로 소유 확인되어 있다. GA 스니펫을 `index.html`에서 제거하면 서치 콘솔 소유 확인도 풀린다.
- 모든 페이지 `<head>`에 `canonical` + Open Graph + Twitter 카드 태그 블록이 있다. 새 페이지를 만들면 같은 블록을 복사해 `canonical`/`og:url`/`og:title`/`og:description`만 바꾼다. 공용 OG 이미지는 `assets/images/og-image.png`(1200×630)이다.
