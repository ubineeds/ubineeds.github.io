/**
 * 개발 페이지 전용 JavaScript
 * dev.html 페이지의 고유 기능들
 * - 개발 서비스 카드 상호작용
 * - 기술 스택 카테고리 인터랙션
 * - 개발 관련 Analytics 추적
 */

class DevPageManager {
    constructor() {
        this.initialized = false;
    }

    /**
     * 개발 페이지 초기화
     */
    init() {
        if (this.initialized) return;
        
        this.initServiceCards();
        this.initTechCategories();
        this.initBreadcrumb();
        this.initContactTracking();
        
        this.initialized = true;
        console.log('Development page initialized');
    }

    /**
     * 개발 서비스 카드 상호작용
     */
    initServiceCards() {
        document.querySelectorAll('.service-card').forEach(card => {
            // 호버 효과
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow)';
            });

            // 클릭 효과
            card.addEventListener('click', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px) scale(1)';
                }, 200);

                // Analytics 추적
                if (window.Analytics) {
                    const serviceTitle = this.querySelector('h3')?.textContent || 'unknown';
                    window.Analytics.trackServiceInterest('development', 'service_card_click');
                    window.Analytics.trackCustomEvent('dev_service_click', {
                        service_type: serviceTitle,
                        section: 'services'
                    });
                }
            });
        });

        // 서비스 아이템 클릭 추적
        document.querySelectorAll('.service-items li').forEach(item => {
            item.addEventListener('click', function() {
                const serviceText = this.textContent.trim();
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('dev_service_item_click', {
                        service_item: serviceText,
                        section: 'service_details'
                    });
                }
            });
        });
    }

    /**
     * 기술 스택 카테고리 상호작용
     */
    initTechCategories() {
        document.querySelectorAll('.tech-category').forEach(category => {
            // 호버 효과
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = 'var(--shadow)';
            });

            category.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });

            // 클릭 효과
            category.addEventListener('click', function() {
                const techType = this.querySelector('h4')?.textContent || 'unknown';
                
                // 시각적 피드백
                this.style.transform = 'translateY(-5px) scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-5px) scale(1)';
                }, 200);

                // Analytics 추적
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('tech_category_click', {
                        tech_category: techType,
                        section: 'tech_stack'
                    });
                }
            });
        });

        // 개별 기술 태그 클릭 추적
        document.querySelectorAll('.tech-tag').forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.stopPropagation(); // 부모 카테고리 클릭 이벤트 방지
                
                const techName = this.textContent.trim();
                const category = this.closest('.tech-category')?.querySelector('h4')?.textContent || 'unknown';
                
                // 시각적 피드백
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);

                // Analytics 추적
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('tech_tag_click', {
                        technology: techName,
                        category: category,
                        section: 'tech_stack'
                    });
                }
            });
        });
    }

    /**
     * Breadcrumb 네비게이션 초기화
     */
    initBreadcrumb() {
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb span, .breadcrumb a');
        
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', function() {
                const breadcrumbText = this.textContent.trim();
                
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('breadcrumb_click', {
                        breadcrumb_item: breadcrumbText,
                        page: 'development'
                    });
                }
            });
        });
    }

    /**
     * CTA 섹션 연락처 추적
     */
    initContactTracking() {
        document.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('click', function() {
                const contactType = this.querySelector('strong')?.textContent?.trim();
                
                // 시각적 피드백
                this.style.transform = 'translateY(-2px) scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-2px) scale(1)';
                }, 200);

                if (window.Analytics && contactType) {
                    let method = 'other';
                    if (contactType.includes('이메일')) method = 'email';
                    else if (contactType.includes('전화')) method = 'phone';
                    else if (contactType.includes('오시는길')) method = 'address';
                    
                    window.Analytics.trackContactClick(method);
                    window.Analytics.trackCustomEvent('dev_contact_click', {
                        contact_method: method,
                        page: 'development'
                    });
                }
            });
        });
    }

    /**
     * 스크롤 기반 애니메이션 초기화
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        // 애니메이션 대상 요소들
        document.querySelectorAll('.service-card, .tech-category, .hero-content > *').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    /**
     * 개발 프로세스 시뮬레이션 (향후 확장용)
     */
    initDevProcessDemo() {
        const processSteps = [
            '요구사항 분석',
            '기술 스택 선정',
            '아키텍처 설계',
            '개발 및 구현',
            '테스트 및 검증',
            '배포 및 런칭',
            '유지보수 및 업데이트'
        ];

        let currentStep = 0;
        const demoButton = document.createElement('button');
        demoButton.textContent = '개발 프로세스 데모';
        demoButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            z-index: 1000;
            display: none;
        `;

        demoButton.addEventListener('click', () => {
            const stepText = processSteps[currentStep];
            
            // 토스트 메시지 표시
            this.showToast(`단계 ${currentStep + 1}: ${stepText}`);
            
            currentStep = (currentStep + 1) % processSteps.length;
            
            // Analytics 추적
            if (window.Analytics) {
                window.Analytics.trackCustomEvent('dev_process_demo', {
                    step: currentStep,
                    step_name: stepText
                });
            }
        });

        document.body.appendChild(demoButton);
        
        // 스크롤 시 버튼 표시
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                demoButton.style.display = 'block';
            } else {
                demoButton.style.display = 'none';
            }
        });
    }

    /**
     * 토스트 메시지 표시
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-primary);
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;

        document.body.appendChild(toast);

        // 애니메이션
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 자동 제거
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    /**
     * 기술 스택 필터링 기능 (향후 확장용)
     */
    initTechStackFilter() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'tech-filter';
        filterContainer.style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            flex-wrap: wrap;
        `;

        const filters = ['전체', 'Frontend', 'Backend', 'Mobile', 'Database & Cloud'];
        
        filters.forEach(filter => {
            const filterBtn = document.createElement('button');
            filterBtn.textContent = filter;
            filterBtn.className = 'filter-btn';
            filterBtn.style.cssText = `
                padding: 8px 16px;
                border: 2px solid var(--border-color);
                background: var(--card-bg);
                color: var(--text-secondary);
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            `;
            
            if (filter === '전체') {
                filterBtn.style.background = 'var(--accent-color)';
                filterBtn.style.color = 'white';
                filterBtn.style.borderColor = 'var(--accent-color)';
            }

            filterBtn.addEventListener('click', () => {
                // 모든 버튼 리셋
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.style.background = 'var(--card-bg)';
                    btn.style.color = 'var(--text-secondary)';
                    btn.style.borderColor = 'var(--border-color)';
                });

                // 선택된 버튼 활성화
                filterBtn.style.background = 'var(--accent-color)';
                filterBtn.style.color = 'white';
                filterBtn.style.borderColor = 'var(--accent-color)';

                this.filterTechStack(filter);
            });

            filterContainer.appendChild(filterBtn);
        });

        const techStackSection = document.querySelector('.tech-stack .container');
        if (techStackSection) {
            const sectionHeader = techStackSection.querySelector('.section-header');
            if (sectionHeader) {
                sectionHeader.appendChild(filterContainer);
            }
        }
    }

    /**
     * 기술 스택 필터링 실행
     */
    filterTechStack(filter) {
        const techCategories = document.querySelectorAll('.tech-category');
        
        techCategories.forEach(category => {
            const categoryTitle = category.querySelector('h4')?.textContent || '';
            
            if (filter === '전체' || categoryTitle === filter) {
                category.style.display = 'block';
                category.style.opacity = '1';
            } else {
                category.style.opacity = '0.3';
            }
        });

        // Analytics 추적
        if (window.Analytics) {
            window.Analytics.trackCustomEvent('tech_filter_change', {
                filter: filter,
                page: 'development'
            });
        }
    }

    /**
     * 모든 고급 기능 초기화
     */
    initAdvancedFeatures() {
        this.initScrollAnimations();
        this.initDevProcessDemo();
        this.initTechStackFilter();
    }
}

// 전역 DevPageManager 인스턴스 생성
window.DevPageManager = new DevPageManager();

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 개발 페이지에서만 실행
    if (window.CommonUtils && window.CommonUtils.getCurrentPage() === 'dev') {
        window.DevPageManager.init();
        window.DevPageManager.initAdvancedFeatures();
    }
});
