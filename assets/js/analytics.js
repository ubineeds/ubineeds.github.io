/**
 * Google Analytics 4 (GA4) 통합 모듈
 * UBINEEDS Inc. 홈페이지 분석 추적
 */

class AnalyticsManager {
    constructor() {
        this.measurementId = 'G-EDT6WYXFVM'; // 실제 GA4 측정 ID로 교체 필요
        this.initialized = false;
    }

    /**
     * GA4 초기화
     */
    init() {
        if (this.initialized) return;
        
        try {
            // GA4 기본 설정
            if (typeof gtag !== 'undefined') {
                gtag('config', this.measurementId, {
                    page_title: document.title,
                    page_location: window.location.href,
                    custom_map: {
                        'custom_parameter_1': 'page_category'
                    }
                });
                this.initialized = true;
                // console.log('GA4 Analytics initialized'); // Removed for production
            }
        } catch (error) {
            console.error('Analytics initialization failed:', error);
        }
    }

    /**
     * 페이지뷰 추적
     */
    trackPageView(page_title = document.title, page_location = window.location.href) {
        if (!this.initialized) return;
        
        try {
            gtag('event', 'page_view', {
                page_title: page_title,
                page_location: page_location,
                page_category: this.getPageCategory()
            });
        } catch (error) {
            console.error('Page view tracking failed:', error);
        }
    }

    /**
     * 비즈니스 목표 이벤트: 연락처 클릭
     */
    trackContactClick(method, value = 1) {
        try {
            gtag('event', 'contact_click', {
                event_category: 'engagement',
                event_label: method, // 'email', 'phone', 'address'
                method: method,
                value: value,
                page_category: this.getPageCategory()
            });
            // console.log(`Contact click tracked: ${method}`); // Removed for production
        } catch (error) {
            console.error('Contact click tracking failed:', error);
        }
    }

    /**
     * 서비스 관심도 추적
     */
    trackServiceInterest(service_type, action = 'click') {
        try {
            gtag('event', 'service_interest', {
                event_category: 'engagement',
                event_label: service_type, // 'dev', 'design'
                service_type: service_type,
                action: action,
                page_category: this.getPageCategory(),
                value: 1
            });
            // console.log(`Service interest tracked: ${service_type}`); // Removed for production
        } catch (error) {
            console.error('Service interest tracking failed:', error);
        }
    }

    /**
     * 네비게이션 클릭 추적
     */
    trackNavigation(from_page, to_page, nav_type = 'header') {
        try {
            gtag('event', 'navigation_click', {
                event_category: 'navigation',
                event_label: `${from_page}_to_${to_page}`,
                from_page: from_page,
                to_page: to_page,
                nav_type: nav_type, // 'header', 'footer', 'cta'
                value: 1
            });
        } catch (error) {
            console.error('Navigation tracking failed:', error);
        }
    }

    /**
     * 테마 변경 추적
     */
    trackThemeChange(theme) {
        try {
            gtag('event', 'theme_change', {
                event_category: 'user_preference',
                event_label: theme, // 'dark', 'light'
                theme: theme,
                page_category: this.getPageCategory()
            });
        } catch (error) {
            console.error('Theme change tracking failed:', error);
        }
    }

    /**
     * 모바일 메뉴 사용 추적
     */
    trackMobileMenuUsage(action) {
        try {
            gtag('event', 'mobile_menu_usage', {
                event_category: 'user_interaction',
                event_label: action, // 'open', 'close'
                action: action,
                device_type: this.getDeviceType()
            });
        } catch (error) {
            console.error('Mobile menu tracking failed:', error);
        }
    }

    /**
     * 스크롤 깊이 추적 (25%, 50%, 75%, 100%)
     */
    trackScrollDepth(percentage) {
        try {
            gtag('event', 'scroll_depth', {
                event_category: 'engagement',
                event_label: `${percentage}%`,
                scroll_percentage: percentage,
                page_category: this.getPageCategory()
            });
        } catch (error) {
            console.error('Scroll depth tracking failed:', error);
        }
    }

    /**
     * 파일 다운로드 추적
     */
    trackDownload(file_name, file_type) {
        try {
            gtag('event', 'file_download', {
                event_category: 'engagement',
                event_label: file_name,
                file_name: file_name,
                file_type: file_type,
                page_category: this.getPageCategory(),
                value: 1
            });
        } catch (error) {
            console.error('Download tracking failed:', error);
        }
    }

    /**
     * 사용자 정의 이벤트 추적
     */
    trackCustomEvent(event_name, parameters = {}) {
        try {
            gtag('event', event_name, {
                ...parameters,
                page_category: this.getPageCategory(),
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Custom event tracking failed:', error);
        }
    }

    /**
     * 현재 페이지 카테고리 반환
     */
    getPageCategory() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename === 'index.html' || filename === '' || path === '/') return 'home';
        if (filename === 'dev.html') return 'development';
        if (filename === 'design.html') return 'design';
        
        return 'other';
    }

    /**
     * 디바이스 타입 감지
     */
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }

    /**
     * 스크롤 깊이 자동 추적 초기화
     */
    initScrollTracking() {
        let scrollTracked = {
            25: false,
            50: false,
            75: false,
            100: false
        };

        const trackScroll = () => {
            const scrollPercentage = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            // 각 깊이별로 한 번만 추적
            [25, 50, 75, 100].forEach(threshold => {
                if (scrollPercentage >= threshold && !scrollTracked[threshold]) {
                    this.trackScrollDepth(threshold);
                    scrollTracked[threshold] = true;
                }
            });
        };

        // 쓰로틀링 적용
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    trackScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * 체류 시간 추적
     */
    initTimeTracking() {
        const startTime = Date.now();
        let timeTracked = {
            30: false,  // 30초
            60: false,  // 1분
            180: false, // 3분
            300: false  // 5분
        };

        const trackTime = () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            Object.keys(timeTracked).forEach(threshold => {
                if (timeSpent >= parseInt(threshold) && !timeTracked[threshold]) {
                    gtag('event', 'time_on_page', {
                        event_category: 'engagement',
                        event_label: `${threshold}s`,
                        time_threshold: parseInt(threshold),
                        page_category: this.getPageCategory()
                    });
                    timeTracked[threshold] = true;
                }
            });
        };

        // 매초마다 체크
        setInterval(trackTime, 1000);

        // 페이지 떠날 때 총 체류 시간 기록
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            gtag('event', 'total_time_on_page', {
                event_category: 'engagement',
                total_time: totalTime,
                page_category: this.getPageCategory()
            });
        });
    }
}

// 전역 Analytics 인스턴스 생성
window.Analytics = new AnalyticsManager();

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.Analytics.init();
    window.Analytics.trackPageView();
    window.Analytics.initScrollTracking();
    window.Analytics.initTimeTracking();
});
