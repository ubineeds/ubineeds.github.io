/**
 * Footer 컴포넌트 로더
 * GitHub Pages 정적 환경에서 footer.html 동적 로딩
 */

class FooterLoader {
    constructor() {
        this.footerPath = 'components/footer.html';
        this.loaded = false;
    }

    /**
     * Footer 로드 및 삽입
     */
    async load() {
        if (this.loaded) return;

        try {
            // 1. Footer HTML 파일 fetch
            const response = await fetch(this.footerPath);
            if (!response.ok) {
                throw new Error(`Footer 로드 실패: ${response.status}`);
            }

            const footerHTML = await response.text();
            
            // 2. 현재 연도 자동 업데이트
            const processedHTML = this.processFooterHTML(footerHTML);
            
            // 3. Footer 삽입
            this.insertFooter(processedHTML);
            
            // 4. 이벤트 리스너 초기화
            this.initEventListeners();
            
            this.loaded = true;
            console.log('✅ Footer 로드 완료');
            
        } catch (error) {
            console.error('❌ Footer 로드 실패:', error);
            this.loadFallbackFooter();
        }
    }

    /**
     * Footer HTML 전처리
     */
    processFooterHTML(html) {
        const currentYear = new Date().getFullYear();
        
        // 연도 자동 업데이트
        return html.replace(
            /<span id="footer-year">\d*<\/span>/g,
            `<span id="footer-year">${currentYear}</span>`
        ).replace(
            /&copy; \d+/g,
            `&copy; ${currentYear}`
        );
    }

    /**
     * Footer를 DOM에 삽입
     */
    insertFooter(footerHTML) {
        // 기존 footer 제거
        const existingFooter = document.querySelector('footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // footer-placeholder가 있다면 그 위치에 삽입
        const placeholder = document.getElementById('footer-placeholder');
        if (placeholder) {
            placeholder.outerHTML = footerHTML;
            return;
        }

        // main 태그 다음에 삽입
        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('afterend', footerHTML);
            return;
        }

        // body 끝에 삽입 (최후의 수단)
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    /**
     * Footer 이벤트 리스너 초기화
     */
    initEventListeners() {
        // 연락처 클릭 추적
        const contactItems = document.querySelectorAll('footer .contact-item');
        contactItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // 클릭된 요소에서 연락 방법 감지
                const text = item.textContent || item.innerText;
                let method = 'unknown';
                
                if (text.includes('이메일') || text.includes('email')) method = 'email';
                else if (text.includes('전화') || text.includes('phone')) method = 'phone';
                else if (text.includes('주소') || text.includes('address')) method = 'address';

                // Analytics 이벤트 전송
                if (window.Analytics) {
                    window.Analytics.trackContactClick(method);
                }

                console.log(`📞 연락처 클릭: ${method}`);
            });
        });

        // Footer 내 네비게이션 링크 추적
        const footerLinks = document.querySelectorAll('footer a[href*=".html"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const targetPage = href.split('/').pop();

                if (window.Analytics) {
                    window.Analytics.trackNavigation(currentPage, targetPage, 'footer');
                }
            });
        });
    }

    /**
     * 폴백 Footer (fetch 실패 시)
     */
    loadFallbackFooter() {
        const fallbackHTML = `
            <footer id="ubineeds-footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h4>유비니즈 주식회사</h4>
                            <p>혁신적인 IT 솔루션과 창의적인 디자인으로 디지털 미래를 만들어갑니다.</p>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; ${new Date().getFullYear()} UBINEEDS Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;

        this.insertFooter(fallbackHTML);
        this.initEventListeners();
        
        console.log('⚠️ 폴백 Footer 로드됨');
    }
}

// 전역 인스턴스 생성
window.FooterLoader = new FooterLoader();

// DOM 로드 완료 후 자동 실행
document.addEventListener('DOMContentLoaded', function() {
    window.FooterLoader.load();
});

// 수동 재로드 함수 (디버깅용)
window.reloadFooter = function() {
    window.FooterLoader.loaded = false;
    window.FooterLoader.load();
};
