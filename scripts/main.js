// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.isVisible = true;
        this.init();
    }

    init() {
        // Monitor page visibility for performance optimization
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });

        // Monitor FPS
        this.monitorFPS();
    }

    monitorFPS() {
        const countFPS = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                // Log FPS for debugging (remove in production)
                if (this.fps < 30) {
                    console.warn(`Low FPS detected: ${this.fps}`);
                }
            }
            
            requestAnimationFrame(countFPS);
        };
        
        requestAnimationFrame(countFPS);
    }

    getFPS() {
        return this.fps;
    }

    isPageVisible() {
        return this.isVisible;
    }
}

// Three.js Scene Manager
class ThreeSceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationId = null;
        this.isInitialized = false;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }

    async init() {
        try {
            // Check WebGL support
            if (!this.checkWebGLSupport()) {
                this.createFallbackScene();
                return;
            }

            // Initialize Three.js scene
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            this.createParticles();
            this.setupEventListeners();
            this.animate();
            
            this.isInitialized = true;
            console.log('Three.js scene initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Three.js scene:', error);
            this.createFallbackScene();
        }
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    createFallbackScene() {
        // Create a CSS-based fallback animation
        this.container.innerHTML = `
            <div class="fallback-animation">
                <div class="floating-element"></div>
                <div class="floating-element"></div>
                <div class="floating-element"></div>
            </div>
        `;
        
        // Add fallback CSS
        const style = document.createElement('style');
        style.textContent = `
            .fallback-animation {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            .floating-element {
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-yellow);
                border-radius: 50%;
                animation: float 6s ease-in-out infinite;
            }
            .floating-element:nth-child(1) {
                top: 20%;
                left: 20%;
                animation-delay: 0s;
            }
            .floating-element:nth-child(2) {
                top: 60%;
                left: 80%;
                animation-delay: 2s;
            }
            .floating-element:nth-child(3) {
                top: 80%;
                left: 40%;
                animation-delay: 4s;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 100);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xFFD700, 0.8);
        directionalLight.position.set(1, 1, 1);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            colors[i] = 1; // R
            colors[i + 1] = 0.84; // G (yellow)
            colors[i + 2] = 0; // B
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupEventListeners() {
        // Mouse movement for interactive particles
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    animate() {
        if (!this.isInitialized || !performanceMonitor.isPageVisible()) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;
            
            // Interactive particle movement
            this.particles.position.x = this.mouseX * 0.5;
            this.particles.position.y = this.mouseY * 0.5;
        }

        // Render scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// GSAP Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize GSAP animations when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Smooth scroll animations
        this.setupSmoothScroll();
        
        // Intersection Observer for scroll-triggered animations
        this.setupScrollAnimations();
        
        // Form animations
        this.setupFormAnimations();
    }

    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.project-card, .skill-category, .contact-form').forEach(el => {
            observer.observe(el);
        });
    }

    setupFormAnimations() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Input focus animations
            form.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
            });
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            const response = await fetch('/.netlify/functions/contact', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.showSuccessMessage();
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Message sent successfully!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.textContent = 'Failed to send message. Please try again.';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Utility functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isMobile() {
        return window.innerWidth <= 768;
    }

    static isLowEndDevice() {
        // Simple heuristic for low-end devices
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        return memory < 4 || cores < 4;
    }
}

// Main application class
class PortfolioApp {
    constructor() {
        this.performanceMonitor = null;
        this.threeScene = null;
        this.animationManager = null;
        this.init();
    }

    async init() {
        try {
            // Initialize performance monitoring
            this.performanceMonitor = new PerformanceMonitor();
            
            // Initialize Three.js scene (deferred for performance)
            this.initThreeScene();
            
            // Initialize animations
            this.animationManager = new AnimationManager();
            
            // Setup loading screen
            this.setupLoadingScreen();
            
            // Setup accessibility features
            this.setupAccessibility();
            
            // Setup performance optimizations
            this.setupPerformanceOptimizations();
            
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize portfolio app:', error);
        }
    }

    initThreeScene() {
        // Defer Three.js initialization for better performance
        if (requestIdleCallback) {
            requestIdleCallback(() => {
                this.threeScene = new ThreeSceneManager('three-container');
            }, { timeout: 2000 });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                this.threeScene = new ThreeSceneManager('three-container');
            }, 1000);
        }
    }

    setupLoadingScreen() {
        const loading = document.getElementById('loading');
        if (loading) {
            // Hide loading screen after a short delay
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    setupAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-yellow);
            color: var(--primary-black);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content landmark
        const mainContent = document.querySelector('.hero');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }
    }

    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup service worker for offline support
        this.setupServiceWorker();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        // Preload critical CSS and JS
        const criticalResources = [
            'styles/main.css',
            'scripts/main.min.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp();
    });
} else {
    window.portfolioApp = new PortfolioApp();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, ThreeSceneManager, PerformanceMonitor };
}