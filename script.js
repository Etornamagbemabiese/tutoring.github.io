// Modern JavaScript for Portfolio Website
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupExperienceCards();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupTypingAnimation();
    }

    // Navigation Setup
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });

        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Mobile Menu Setup
    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // Experience Cards Interaction
    setupExperienceCards() {
        const experienceItems = document.querySelectorAll('.experience-item');
        
        experienceItems.forEach((item, index) => {
            // Add staggered animation delay
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Add click interaction for details
            const details = item.querySelector('.experience-details');
            if (details) {
                const summary = item.querySelector('.experience-summary');
                const icon = item.querySelector('.experience-icon');
                
                // Initially hide details
                details.style.maxHeight = '0';
                details.style.overflow = 'hidden';
                details.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
                details.style.opacity = '0';
                
                // Add click handler
                item.addEventListener('click', () => {
                    const isExpanded = details.style.maxHeight !== '0px';
                    
                    // Close all other items
                    experienceItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherDetails = otherItem.querySelector('.experience-details');
                            if (otherDetails) {
                                otherDetails.style.maxHeight = '0';
                                otherDetails.style.opacity = '0';
                                otherItem.classList.remove('expanded');
                            }
                        }
                    });
                    
                    // Toggle current item
                    if (isExpanded) {
                        details.style.maxHeight = '0';
                        details.style.opacity = '0';
                        item.classList.remove('expanded');
                    } else {
                        details.style.maxHeight = details.scrollHeight + 'px';
                        details.style.opacity = '1';
                        item.classList.add('expanded');
                    }
                });
                
                // Add hover effects
                item.addEventListener('mouseenter', () => {
                    if (!item.classList.contains('expanded')) {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    }
                });
                
                item.addEventListener('mouseleave', () => {
                    if (!item.classList.contains('expanded')) {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    }
                });
            }
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.skill-category, .stat-item, .contact-item, .education-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    }

    // Intersection Observer for various elements
    setupIntersectionObserver() {
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

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe skill tags
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.05}s`;
            observer.observe(tag);
        });
    }

    // Parallax Effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero::before, .image-container');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Typing Animation for Hero
    setupTypingAnimation() {
        const typingElement = document.querySelector('.hero-description p');
        if (!typingElement) return;

        const text = typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                setTimeout(() => {
                    typingElement.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        body.style.opacity = '1';
    }, 100);

    // Add cursor trail effect (optional)
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--primary-color), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.6';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Add click ripple effect
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(75, 156, 211, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX - 10}px;
            top: ${e.clientY - 10}px;
            animation: ripple 0.6s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical images
    const criticalImages = [
        'Headshot 5.jpg',
        'Headshot 1.jpg',
        'Headshot 2.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio App Error:', e.error);
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}