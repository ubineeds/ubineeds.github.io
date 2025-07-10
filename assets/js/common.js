/**
 * 공통 기능 모듈
 * UBINEEDS Inc. 홈페이지 공통 JavaScript 기능
 * - 테마 토글 (라이트/다크모드)
 * - 네비게이션 관리
 * - 모바일 메뉴
 * - 헤더 스크롤 효과
 * - 공통 이벤트 리스너
 */

class CommonUtils {
    constructor() {
        this.lastScrollTop = 0;
        this.initialized = false;
    }

    /**
     * 공통 기능 초기화
     */
    init() {
        if (this.initialized) return;
        
        this.initTheme();
        this.updateActiveNavigation();
        this.initMobileMenu();
        this.initScrollEffects();
        this.initKeyboardAccessibility();
        this.initSmoothScroll();
        this.initExternalClickHandler();
        
        this.initialized = true;
        console.log('Common utilities initialized');
    }

    /**
     * 테마 토글 (라이트/다크모드)
     */
    toggleTheme() {
        const body = document.body;
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (!themeToggle) return;
        
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        if (isDark) {
            body.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        }
        
        localStorage.setItem('theme', newTheme);
        
        // Analytics 추적
        if (window.Analytics) {
            window.Analytics.trackThemeChange(newTheme);
        }
        
        console.log(`Theme changed to: ${newTheme}`);
    }

    /**
     * 저장된 테마 초기화
     */
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (!themeToggle) return;
        
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
        
        // 기존 onclick 속성 제거하고 새로운 이벤트 리스너 추가
        themeToggle.removeAttribute('onclick');
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleTheme();
        });
        
        console.log('Theme toggle initialized');
    }

    /**
     * 현재 페이지 감지
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename === 'index.html' || filename === '' || path === '/') return 'home';
        if (filename === 'dev.html') return 'dev';
        if (filename === 'design.html') return 'design';
        
        return 'home';
    }

    /**
     * 네비게이션 활성 상태 업데이트
     */
    updateActiveNavigation() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.color = '';
            
            const href = link.getAttribute('href');
            const isActive = 
                (currentPage === 'home' && (href === 'index.html' || href === '#home' || href === '/' || href.startsWith('#'))) ||
                (currentPage === 'dev' && href === 'dev.html') ||
                (currentPage === 'design' && href === 'design.html') ||
                (href === 'index.html#about' && currentPage === 'home');
                
            if (isActive) {
                link.classList.add('active');
                link.style.color = 'var(--accent-color)';
            }
        });

        // 홈페이지에서 스크롤 기반 네비게이션 활성화
        if (currentPage === 'home') {
            this.initScrollBasedNavigation();
        }
    }

    /**
     * 홈페이지 스크롤 기반 네비게이션 (섹션별 활성화)
     */
    initScrollBasedNavigation() {
        const updateActiveSection = () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        };

        // 쓰로틀링 적용하여 스크롤 이벤트 최적화
        window.addEventListener('scroll', this.throttle(updateActiveSection, 16));
    }

    /**
     * 모바일 메뉴 초기화
     */
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (!mobileToggle) {
            console.warn('Mobile menu toggle button not found');
            return;
        }
        
        // 기존 onclick 속성 제거
        mobileToggle.removeAttribute('onclick');
        
        // 다중 이벤트 리스너 추가 (모바일 호환성)
        const toggleMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        };
        
        // 데스크톱용 click 이벤트
        mobileToggle.addEventListener('click', toggleMenu);
        
        // 모바일용 touch 이벤트
        mobileToggle.addEventListener('touchstart', toggleMenu, { passive: false });
        
        // 모바일 접근성 속성 추가
        mobileToggle.setAttribute('aria-label', '메뉴 열기');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('role', 'button');
        
        // CSS 스타일 정의 강화 (터치 피드백 및 접근성)
        mobileToggle.style.cursor = 'pointer';
        mobileToggle.style.touchAction = 'manipulation';
        mobileToggle.style.userSelect = 'none';
        mobileToggle.style.webkitUserSelect = 'none';
        mobileToggle.style.webkitTapHighlightColor = 'transparent';
        
        console.log('Mobile menu initialized with enhanced touch support');
    }

    /**
     * 모바일 메뉴 토글
     */
    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!navLinks) {
            console.error('Nav links not found');
            return;
        }
        
        const isActive = navLinks.classList.contains('active');
        
        // 메뉴 상태 토글
        navLinks.classList.toggle('active');
        
        // 모바일 메뉴 버튼 상태 업데이트
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', !isActive);
            mobileToggle.setAttribute('aria-label', !isActive ? '메뉴 닫기' : '메뉴 열기');
            
            // 시각적 피드백 추가
            if (!isActive) {
                mobileToggle.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    mobileToggle.style.transform = 'scale(1)';
                }, 150);
            }
        }
        
        // body 스크롤 제어 (메뉴 열릴 때 스크롤 방지)
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // Analytics 추적
        if (window.Analytics) {
            window.Analytics.trackMobileMenuUsage(isActive ? 'close' : 'open');
        }
        
        console.log(`Mobile menu ${isActive ? 'closed' : 'opened'}`);
    }

    /**
     * 헤더 스크롤 효과 초기화
     */
    initScrollEffects() {
        const header = document.querySelector('header');
        if (!header) return;
        
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > this.lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };

        window.addEventListener('scroll', this.throttle(handleScroll, 16));
    }

    /**
     * 키보드 접근성 초기화
     */
    initKeyboardAccessibility() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * 부드러운 스크롤 초기화
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 모바일 메뉴 닫기
                    this.closeMobileMenu();

                    // Analytics 추적
                    if (window.Analytics) {
                        const currentPage = this.getCurrentPage();
                        window.Analytics.trackNavigation(currentPage, targetId.replace('#', ''), 'smooth_scroll');
                    }
                }
            });
        });
    }

    /**
     * 외부 클릭 이벤트 핸들러 초기화
     */
    initExternalClickHandler() {
        document.addEventListener('click', (e) => {
            const navLinks = document.querySelector('.nav-links');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            
            if (navLinks && mobileToggle && 
                !navLinks.contains(e.target) && 
                !mobileToggle.contains(e.target) &&
                navLinks.classList.contains('active')) {
                
                this.closeMobileMenu();
            }
        });
    }
    
    /**
     * 모바일 메뉴 닫기
     */
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.setAttribute('aria-label', '메뉴 열기');
            }
            
            console.log('Mobile menu closed (external click)');
        }
    }

    /**
     * 연락처 클릭 추적 초기화
     */
    initContactTracking() {
        // 이메일 링크
        document.querySelectorAll('a[href^="mailto:"], [data-contact="email"]').forEach(link => {
            link.addEventListener('click', () => {
                if (window.Analytics) {
                    window.Analytics.trackContactClick('email');
                }
            });
        });

        // 전화 링크
        document.querySelectorAll('a[href^="tel:"], [data-contact="phone"]').forEach(link => {
            link.addEventListener('click', () => {
                if (window.Analytics) {
                    window.Analytics.trackContactClick('phone');
                }
            });
        });

        // 주소 클릭
        document.querySelectorAll('[data-contact="address"]').forEach(element => {
            element.addEventListener('click', () => {
                if (window.Analytics) {
                    window.Analytics.trackContactClick('address');
                }
            });
        });
    }

    /**
     * 네비게이션 클릭 추적 초기화
     */
    initNavigationTracking() {
        const currentPage = this.getCurrentPage();
        
        document.querySelectorAll('.nav-links a, .cta-button').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && window.Analytics) {
                    let toPage = 'external';
                    
                    if (href.includes('index.html') || href === '/') toPage = 'home';
                    else if (href.includes('dev.html')) toPage = 'dev';
                    else if (href.includes('design.html')) toPage = 'design';
                    
                    const navType = link.classList.contains('cta-button') ? 'cta' : 'header';
                    window.Analytics.trackNavigation(currentPage, toPage, navType);
                }
            });
        });
    }

    /**
     * 스크롤 애니메이션 관찰자 초기화
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        // 애니메이션 대상 요소들 관찰
        document.querySelectorAll('.animate-on-scroll, .service-card, .tech-category, .portfolio-item, .feature-item, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * 성능 최적화: 쓰로틀링
     */
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 브라우저 뒤로가기 지원
     */
    initBrowserHistory() {
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                const section = document.getElementById(e.state.section);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    /**
     * 이미지 지연 로딩 최적화
     */
    initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    }

    /**
     * 폼 제출 처리
     */
    initFormHandling() {
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Analytics 추적
            if (window.Analytics) {
                window.Analytics.trackCustomEvent('form_submit', {
                    form_id: e.target.id || 'unknown',
                    page_category: this.getCurrentPage()
                });
            }
            
            alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        });
    }

    /**
     * 페이지 로드 완료 처리
     */
    initPageLoadComplete() {
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            console.log('Page load completed');
        });
    }

    /**
     * 모든 추적 기능 초기화
     */
    initAllTracking() {
        this.initContactTracking();
        this.initNavigationTracking();
        this.initScrollAnimations();
        this.initBrowserHistory();
        this.initLazyLoading();
        this.initFormHandling();
        this.initPageLoadComplete();
    }
}

// 전역 CommonUtils 인스턴스 생성
window.CommonUtils = new CommonUtils();

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.CommonUtils.init();
    window.CommonUtils.initAllTracking();
});

// 전역 함수로 노출 (기존 코드 호환성)
window.toggleTheme = () => window.CommonUtils.toggleTheme();
window.toggleMobileMenu = () => window.CommonUtils.toggleMobileMenu();
