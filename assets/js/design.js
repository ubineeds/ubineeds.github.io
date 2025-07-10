/**
 * 디자인 페이지 전용 JavaScript
 * design.html 페이지의 고유 기능들
 * - 포트폴리오 갤러리 상호작용
 * - 디자인 도구 카테고리 인터랙션
 * - AI 디자인 기능 데모
 * - 디자인 관련 Analytics 추적
 */

class DesignPageManager {
    constructor() {
        this.initialized = false;
        this.currentPortfolioFilter = '전체';
    }

    /**
     * 디자인 페이지 초기화
     */
    init() {
        if (this.initialized) return;
        
        this.initServiceCards();
        this.initPortfolioGallery();
        this.initToolsCategories();
        this.initAIFeatures();
        this.initBreadcrumb();
        this.initContactTracking();
        
        this.initialized = true;
        console.log('Design page initialized');
    }

    /**
     * 디자인 서비스 카드 상호작용
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
                    window.Analytics.trackServiceInterest('design', 'service_card_click');
                    window.Analytics.trackCustomEvent('design_service_click', {
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
                    window.Analytics.trackCustomEvent('design_service_item_click', {
                        service_item: serviceText,
                        section: 'service_details'
                    });
                }
            });
        });
    }

    /**
     * 포트폴리오 갤러리 상호작용
     */
    initPortfolioGallery() {
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
            // 개선된 호버 효과
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = 'var(--shadow-lg)';
                
                // 이미지 부분 추가 효과
                const image = this.querySelector('.portfolio-image');
                if (image) {
                    image.style.transform = 'scale(1.05)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'var(--shadow)';
                
                const image = this.querySelector('.portfolio-image');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });

            // 클릭으로 포트폴리오 상세 보기 (모달 효과)
            item.addEventListener('click', function() {
                const title = this.querySelector('h4')?.textContent || '';
                const description = this.querySelector('p')?.textContent || '';
                
                DesignPageManager.prototype.showPortfolioModal(title, description, index);
                
                // Analytics 추적
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('portfolio_click', {
                        portfolio_title: title,
                        portfolio_index: index,
                        section: 'portfolio'
                    });
                }
            });
        });

        // 포트폴리오 필터 초기화
        this.initPortfolioFilter();
    }

    /**
     * 포트폴리오 모달 표시
     */
    showPortfolioModal(title, description, index) {
        // 모달 배경
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(5px);
        `;

        // 모달 컨텐츠
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--card-bg);
            border-radius: 24px;
            padding: 2rem;
            max-width: 600px;
            max-height: 80vh;
            margin: 2rem;
            transform: scale(0.8);
            transition: transform 0.3s ease;
            border: 1px solid var(--border-color);
            position: relative;
            overflow: auto;
        `;

        // 닫기 버튼
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--text-secondary);
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        `;

        closeButton.addEventListener('mouseenter', function() {
            this.style.background = 'var(--border-color)';
        });

        closeButton.addEventListener('mouseleave', function() {
            this.style.background = 'none';
        });

        // 모달 내용
        modalContent.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.5rem;">${title}</h3>
            <div style="width: 100%; height: 200px; background: ${this.getPortfolioGradient(index)}; border-radius: 16px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                ${this.getPortfolioIcon(index)}
            </div>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${description}</p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <span style="background: var(--accent-color); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">디자인</span>
                <span style="background: var(--secondary-bg); color: var(--text-primary); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">창작</span>
                <span style="background: var(--purple-accent); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">브랜딩</span>
            </div>
        `;

        modalContent.appendChild(closeButton);

        // 이벤트 리스너
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        };

        closeButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // ESC 키로 닫기
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // DOM에 추가 및 애니메이션
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    /**
     * 포트폴리오 아이콘 반환
     */
    getPortfolioIcon(index) {
        const icons = ['📄', '🎭', '📊', '🎪', '🛍️', '🎬'];
        return icons[index] || '🎨';
    }

    /**
     * 포트폴리오 그라디언트 반환
     */
    getPortfolioGradient(index) {
        const gradients = [
            'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(45deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)'
        ];
        return gradients[index] || 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
    }

    /**
     * 포트폴리오 필터 초기화
     */
    initPortfolioFilter() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'portfolio-filter';
        filterContainer.style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            flex-wrap: wrap;
        `;

        const filters = ['전체', '편집디자인', '시각디자인', 'AI디자인'];
        
        filters.forEach(filter => {
            const filterBtn = document.createElement('button');
            filterBtn.textContent = filter;
            filterBtn.className = 'portfolio-filter-btn';
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
                this.setActiveFilter(filterBtn, filter);
                this.filterPortfolio(filter);
            });

            filterContainer.appendChild(filterBtn);
        });

        const portfolioSection = document.querySelector('.portfolio .container');
        if (portfolioSection) {
            const sectionHeader = portfolioSection.querySelector('.section-header') || 
                                 portfolioSection.querySelector('h2').parentElement;
            if (sectionHeader) {
                sectionHeader.appendChild(filterContainer);
            }
        }
    }

    /**
     * 활성 필터 설정
     */
    setActiveFilter(activeBtn, filter) {
        document.querySelectorAll('.portfolio-filter-btn').forEach(btn => {
            btn.style.background = 'var(--card-bg)';
            btn.style.color = 'var(--text-secondary)';
            btn.style.borderColor = 'var(--border-color)';
        });

        activeBtn.style.background = 'var(--accent-color)';
        activeBtn.style.color = 'white';
        activeBtn.style.borderColor = 'var(--accent-color)';

        this.currentPortfolioFilter = filter;
    }

    /**
     * 포트폴리오 필터링 실행
     */
    filterPortfolio(filter) {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach((item, index) => {
            let shouldShow = filter === '전체';
            
            if (!shouldShow) {
                const title = item.querySelector('h4')?.textContent || '';
                if (filter === '편집디자인' && (title.includes('브로슈어') || title.includes('포스터'))) shouldShow = true;
                if (filter === '시각디자인' && (title.includes('캐릭터') || title.includes('프레젠테이션') || title.includes('굿즈'))) shouldShow = true;
                if (filter === 'AI디자인' && title.includes('영상')) shouldShow = true;
            }
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (item.style.opacity === '0') {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Analytics 추적
        if (window.Analytics) {
            window.Analytics.trackCustomEvent('portfolio_filter_change', {
                filter: filter,
                page: 'design'
            });
        }
    }

    /**
     * 디자인 도구 카테고리 상호작용
     */
    initToolsCategories() {
        document.querySelectorAll('.tools-category').forEach(category => {
            // 호버 효과
            category.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = 'var(--shadow)';
            });

            category.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });

            // 클릭 효과
            category.addEventListener('click', function() {
                const toolType = this.querySelector('h4')?.textContent || 'unknown';
                
                // 시각적 피드백
                this.style.transform = 'translateY(-8px) scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-8px) scale(1)';
                }, 200);

                // Analytics 추적
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('design_tool_category_click', {
                        tool_category: toolType,
                        section: 'tools'
                    });
                }
            });
        });

        // 개별 도구 클릭 추적
        document.querySelectorAll('.tools-list li').forEach(tool => {
            tool.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const toolName = this.textContent.trim();
                const category = this.closest('.tools-category')?.querySelector('h4')?.textContent || 'unknown';
                
                // 시각적 피드백
                this.style.transform = 'scale(1.1)';
                this.style.color = 'var(--accent-color)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.color = '';
                }, 300);

                // Analytics 추적
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('design_tool_click', {
                        tool_name: toolName,
                        category: category,
                        section: 'tools'
                    });
                }
            });
        });
    }

    /**
     * AI 디자인 기능 상호작용
     */
    initAIFeatures() {
        document.querySelectorAll('.ai-feature').forEach(feature => {
            // 호버 효과
            feature.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = 'var(--shadow-lg)';
                
                const icon = this.querySelector('.ai-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });

            feature.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                
                const icon = this.querySelector('.ai-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });

            // 클릭으로 AI 데모 실행
            feature.addEventListener('click', function() {
                const featureTitle = this.querySelector('h4')?.textContent || '';
                DesignPageManager.prototype.runAIDemo(featureTitle);

                // Analytics 추적
                if (window.Analytics) {
                    window.Analytics.trackCustomEvent('ai_feature_demo', {
                        feature_name: featureTitle,
                        section: 'ai_features'
                    });
                }
            });
        });
    }

    /**
     * AI 기능 데모 실행
     */
    runAIDemo(featureTitle) {
        const demoSteps = {
            'AI 이미지 생성': [
                '프롬프트 입력 중...',
                'AI 모델 처리 중...',
                '이미지 생성 완료!',
                '고품질 결과물 준비됨'
            ],
            'AI 영상 제작': [
                '영상 스타일 분석 중...',
                '모션 그래픽 생성 중...',
                '영상 렌더링 중...',
                '영상 제작 완료!'
            ]
        };

        const steps = demoSteps[featureTitle] || ['AI 처리 중...', '완료!'];
        let currentStep = 0;

        const demo = this.createProgressDemo(featureTitle, steps);
        
        const progressInterval = setInterval(() => {
            if (currentStep < steps.length) {
                demo.updateProgress(currentStep, steps[currentStep]);
                currentStep++;
            } else {
                clearInterval(progressInterval);
                setTimeout(() => {
                    demo.close();
                }, 2000);
            }
        }, 1500);
    }

    /**
     * 진행률 데모 생성
     */
    createProgressDemo(title, steps) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const demoContent = document.createElement('div');
        demoContent.style.cssText = `
            background: var(--card-bg);
            border-radius: 24px;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            border: 1px solid var(--border-color);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        demoContent.innerHTML = `
            <h3 style="margin-bottom: 2rem; color: var(--text-primary);">${title} 데모</h3>
            <div id="demo-progress" style="width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; margin-bottom: 1rem; overflow: hidden;">
                <div id="progress-bar" style="width: 0%; height: 100%; background: var(--gradient-1); transition: width 1s ease;"></div>
            </div>
            <p id="demo-status" style="color: var(--text-secondary); margin-bottom: 2rem;">시작 중...</p>
            <div style="width: 100px; height: 100px; margin: 0 auto; background: var(--gradient-1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                🤖
            </div>
        `;

        overlay.appendChild(demoContent);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = '1';
            demoContent.style.transform = 'scale(1)';
        }, 10);

        return {
            updateProgress: (step, message) => {
                const progressBar = document.getElementById('progress-bar');
                const statusText = document.getElementById('demo-status');
                
                if (progressBar && statusText) {
                    const progress = ((step + 1) / steps.length) * 100;
                    progressBar.style.width = `${progress}%`;
                    statusText.textContent = message;
                }
            },
            close: () => {
                overlay.style.opacity = '0';
                demoContent.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
            }
        };
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
                        page: 'design'
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
                    window.Analytics.trackCustomEvent('design_contact_click', {
                        contact_method: method,
                        page: 'design'
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
        document.querySelectorAll('.service-card, .portfolio-item, .tools-category, .ai-feature, .hero-content > *').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    /**
     * 컬러 팔레트 생성기 (향후 확장용)
     */
    initColorPaletteGenerator() {
        const paletteButton = document.createElement('button');
        paletteButton.textContent = '컬러 팔레트 생성';
        paletteButton.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            padding: 12px 24px;
            background: var(--gradient-1);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            z-index: 1000;
            display: none;
        `;

        paletteButton.addEventListener('click', () => {
            this.generateColorPalette();
        });

        document.body.appendChild(paletteButton);
        
        // 스크롤 시 버튼 표시
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                paletteButton.style.display = 'block';
            } else {
                paletteButton.style.display = 'none';
            }
        });
    }

    /**
     * 랜덤 컬러 팔레트 생성
     */
    generateColorPalette() {
        const colors = [];
        for (let i = 0; i < 5; i++) {
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 50) + 50;
            const lightness = Math.floor(Math.random() * 40) + 30;
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }

        this.showColorPalette(colors);
    }

    /**
     * 컬러 팔레트 표시
     */
    showColorPalette(colors) {
        const paletteModal = document.createElement('div');
        paletteModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid var(--border-color);
            z-index: 9999;
            box-shadow: var(--shadow-lg);
        `;

        let paletteHTML = '<h4 style="margin-bottom: 1rem; color: var(--text-primary);">생성된 컬러 팔레트</h4><div style="display: flex; gap: 1rem;">';
        
        colors.forEach((color, index) => {
            paletteHTML += `
                <div style="text-align: center;">
                    <div style="width: 60px; height: 60px; background: ${color}; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer;" onclick="navigator.clipboard.writeText('${color}')"></div>
                    <small style="color: var(--text-secondary); font-size: 0.8rem;">${color}</small>
                </div>
            `;
        });

        paletteHTML += '</div><button onclick="this.parentElement.remove()" style="margin-top: 1rem; padding: 8px 16px; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer;">닫기</button>';
        
        paletteModal.innerHTML = paletteHTML;
        document.body.appendChild(paletteModal);

        // 5초 후 자동 제거
        setTimeout(() => {
            if (document.body.contains(paletteModal)) {
                document.body.removeChild(paletteModal);
            }
        }, 5000);

        // Analytics 추적
        if (window.Analytics) {
            window.Analytics.trackCustomEvent('color_palette_generated', {
                colors_count: colors.length,
                page: 'design'
            });
        }
    }

    /**
     * 모든 고급 기능 초기화
     */
    initAdvancedFeatures() {
        this.initScrollAnimations();
        this.initColorPaletteGenerator();
    }
}

// 전역 DesignPageManager 인스턴스 생성
window.DesignPageManager = new DesignPageManager();

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 디자인 페이지에서만 실행
    if (window.CommonUtils && window.CommonUtils.getCurrentPage() === 'design') {
        window.DesignPageManager.init();
        window.DesignPageManager.initAdvancedFeatures();
    }
});
