/**
 * 홈페이지 전용 JavaScript
 * index.html 페이지의 고유 기능들
 * - 카운터 애니메이션
 * - 서비스 카드 상호작용
 * - Hero 섹션 애니메이션
 */

class HomePageManager {
    constructor() {
        this.counterAnimated = false;
        this.initialized = false;
    }

    /**
     * 홈페이지 초기화
     */
    init() {
        if (this.initialized) return;
        
        this.initServiceCards();
        this.initCounterAnimations();
        this.initHeroAnimations();
        
        this.initialized = true;
        console.log('Home page initialized');
    }

    /**
     * 서비스 카드 클릭 효과
     */
    initServiceCards() {
        document.querySelectorAll('.service-card').forEach(card => {
            // 클릭 효과
            card.addEventListener('click', function() {
                // 시각적 피드백
                this.style.transform = 'translateY(-10px) scale(1.02)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px) scale(1)';
                }, 200);

                // Analytics 추적
                if (window.Analytics) {
                    const serviceType = this.classList.contains('dev') ? 'development' : 'design';
                    window.Analytics.trackServiceInterest(serviceType, 'card_click');
                }
            });

            // 호버 효과 개선
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // "자세히 보기" 링크 추적
        document.querySelectorAll('.learn-more').forEach(link => {
            link.addEventListener('click', function(e) {
                const serviceCard = this.closest('.service-card');
                if (serviceCard && window.Analytics) {
                    const serviceType = serviceCard.classList.contains('dev') ? 'development' : 'design';
                    window.Analytics.trackServiceInterest(serviceType, 'learn_more_click');
                }
            });
        });
    }

    /**
     * 카운터 애니메이션 초기화
     */
    initCounterAnimations() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.counterAnimated) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        this.animateCounter(stat, target);
                    });
                    this.counterAnimated = true;
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const aboutStats = document.querySelector('.about-stats');
        if (aboutStats) {
            counterObserver.observe(aboutStats);
        }
    }

    /**
     * 카운터 애니메이션 실행
     */
    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 50);
    }

    /**
     * Hero 섹션 애니메이션
     */
    initHeroAnimations() {
        // Hero 요소들에 순차적 애니메이션 적용
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-cta');
        
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 1s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    /**
     * CTA 버튼 추적
     */
    initCTATracking() {
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', function() {
                if (window.Analytics) {
                    const buttonText = this.textContent.trim();
                    const buttonType = this.classList.contains('cta-primary') ? 'primary' : 'secondary';
                    
                    window.Analytics.trackCustomEvent('cta_click', {
                        button_text: buttonText,
                        button_type: buttonType,
                        section: 'hero'
                    });
                }
            });
        });

        // Contact CTA 섹션 버튼들
        document.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('click', function() {
                const contactType = this.querySelector('strong')?.textContent?.trim();
                if (window.Analytics && contactType) {
                    let method = 'other';
                    if (contactType.includes('이메일')) method = 'email';
                    else if (contactType.includes('전화')) method = 'phone';
                    else if (contactType.includes('오시는길')) method = 'address';
                    
                    window.Analytics.trackContactClick(method);
                }
            });
        });
    }

    /**
     * 기술 스택 카드 상호작용
     */
    initTechStackInteraction() {
        document.querySelectorAll('.tech-item').forEach(item => {
            item.addEventListener('click', function() {
                const techName = this.querySelector('h4')?.textContent;
                if (window.Analytics && techName) {
                    window.Analytics.trackCustomEvent('tech_interest', {
                        technology: techName,
                        section: 'tech_stack'
                    });
                }
            });
        });
    }

    /**
     * Features 섹션 상호작용
     */
    initFeaturesInteraction() {
        document.querySelectorAll('.feature-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });

            item.addEventListener('click', function() {
                const featureName = this.querySelector('h4')?.textContent;
                if (window.Analytics && featureName) {
                    window.Analytics.trackCustomEvent('feature_interest', {
                        feature_name: featureName,
                        section: 'features'
                    });
                }
            });
        });
    }

    /**
     * About 섹션 visual 상호작용
     */
    initAboutVisualEffect() {
        const aboutVisual = document.querySelector('.about-visual');
        if (aboutVisual) {
            let rotationDegree = 0;
            
            aboutVisual.addEventListener('click', function() {
                rotationDegree += 360;
                this.style.transform = `rotate(${rotationDegree}deg)`;
                this.style.transition = 'transform 1s ease-out';
                
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('about_visual_click', {
                        section: 'about'
                    });
                }
            });

            // 마우스 움직임에 따른 미묘한 효과
            aboutVisual.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const rotateX = (y / rect.height) * 10;
                const rotateY = (x / rect.width) * -10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            aboutVisual.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        }
    }

    /**
     * 스크롤 진행률 표시
     */
    initScrollProgress() {
        // 스크롤 진행률 바 생성
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        // 스크롤 이벤트
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
        });
    }

    /**
     * 모든 상호작용 초기화
     */
    initAllInteractions() {
        this.initCTATracking();
        this.initTechStackInteraction();
        this.initFeaturesInteraction();
        this.initAboutVisualEffect();
        this.initScrollProgress();
    }
}

// 전역 HomePageManager 인스턴스 생성
window.HomePageManager = new HomePageManager();

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 홈페이지에서만 실행
    if (window.CommonUtils && window.CommonUtils.getCurrentPage() === 'home') {
        window.HomePageManager.init();
        window.HomePageManager.initAllInteractions();
    }
});
