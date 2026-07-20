// Portfolio - Etornam Agbemabiese
// Clean, focused interactions

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initExperienceCards();
    initBlogControls();
    initScrollAnimations();
    initGallery();
});

// Set active nav link based on current page
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') currentPage = 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.06)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    const setMobileMenu = (open) => {
        navToggle.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setMobileMenu(!navMenu.classList.contains('active'));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            setMobileMenu(false);
        });
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            setMobileMenu(false);
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.skill-category, .achievement-item, .value-item, .contact-item, .education-item, .experience-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
        observer.observe(el);
    });
}

// Experience card flip - global for experience.html
function flipCard(card) {
    if (card && card.classList) {
        const expanded = card.classList.toggle('flipped');
        card.setAttribute('aria-expanded', String(expanded));
    }
}

function initExperienceCards() {
    document.querySelectorAll('.experience-card').forEach(card => {
        const company = card.querySelector('.card-front .card-title')?.textContent.trim();
        const position = card.querySelector('.card-front .card-position')?.textContent.trim();
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-expanded', String(card.classList.contains('flipped')));
        if (company || position) {
            card.setAttribute('aria-label', [position, company].filter(Boolean).join(' at '));
        }

        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                flipCard(card);
            }
        });
    });
}

function initBlogControls() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    });
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
}

// Blog filtering - global for blog.html
function filterBlog(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        const active = button === btn;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('.blog-card').forEach(card => {
        const show = category === 'all' || card.dataset.category === category;
        card.style.display = show ? '' : 'none';
    });
}

// Blog read more/less toggle - global for blog.html
function toggleBlogPost(btn) {
    const card = btn.closest('.blog-card');
    if (!card) return;
    const expanded = card.classList.toggle('expanded');
    btn.textContent = expanded ? 'Read less' : 'Read more';
    btn.setAttribute('aria-expanded', String(expanded));
}

// Gallery lightbox - global for gallery.html
function initGallery() {
    const tiles = Array.from(document.querySelectorAll('.photo-tile'));
    const lightbox = document.querySelector('.gallery-lightbox');
    if (!tiles.length || !lightbox) return;

    const image = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const previousButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const pageRegions = [
        document.querySelector('.navbar'),
        document.querySelector('.gallery-hero'),
        document.querySelector('main'),
        document.querySelector('.footer')
    ].filter(Boolean);
    let activeIndex = 0;
    let lastFocusedTile = null;

    const visibleTiles = () => tiles.filter(tile => !tile.hidden);

    function showPhoto(index) {
        const availableTiles = visibleTiles();
        activeIndex = (index + availableTiles.length) % availableTiles.length;
        const tile = availableTiles[activeIndex];
        const tileImage = tile.querySelector('img');
        image.src = tile.dataset.full || tileImage.dataset.src || tileImage.currentSrc || tileImage.src;
        image.alt = tileImage.alt;

        [activeIndex - 1, activeIndex + 1].forEach(adjacentIndex => {
            const adjacent = availableTiles[(adjacentIndex + availableTiles.length) % availableTiles.length];
            if (adjacent?.dataset.full) {
                const preload = new Image();
                preload.src = adjacent.dataset.full;
            }
        });
    }

    function openLightbox(tile) {
        const availableTiles = visibleTiles();
        lastFocusedTile = tile;
        showPhoto(availableTiles.indexOf(tile));
        lightbox.hidden = false;
        pageRegions.forEach(region => region.setAttribute('inert', ''));
        document.body.style.overflow = 'hidden';
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        image.removeAttribute('src');
        image.alt = '';
        pageRegions.forEach(region => region.removeAttribute('inert'));
        document.body.style.overflow = '';
        if (lastFocusedTile) lastFocusedTile.focus();
    }

    tiles.forEach(tile => tile.addEventListener('click', () => openLightbox(tile)));
    closeButton.addEventListener('click', closeLightbox);
    previousButton.addEventListener('click', () => showPhoto(activeIndex - 1));
    nextButton.addEventListener('click', () => showPhoto(activeIndex + 1));

    document.querySelectorAll('.gallery-more-btn').forEach(button => {
        const section = document.getElementById(button.dataset.galleryLoad);
        if (!section) return;
        const batchSize = Number(button.dataset.batch) || 6;
        const status = button.closest('.gallery-more-control').querySelector('.gallery-load-status');
        const total = section.querySelectorAll('.photo-tile').length;

        button.addEventListener('click', () => {
            const remaining = Array.from(section.querySelectorAll('.gallery-extra[hidden]'));
            remaining.slice(0, batchSize).forEach(tile => {
                const tileImage = tile.querySelector('img[data-src]');
                if (tileImage && !tileImage.src) tileImage.src = tileImage.dataset.src;
                tile.hidden = false;
            });

            const left = section.querySelectorAll('.gallery-extra[hidden]').length;
            const shown = total - left;
            status.textContent = left
                ? `Showing ${shown} of ${total} photos.`
                : `All ${total} photos are now shown.`;
            if (!left) {
                button.innerHTML = 'All photos shown <span aria-hidden="true">✓</span>';
                button.disabled = true;
                status.tabIndex = -1;
                status.focus();
            } else {
                const nextBatch = Math.min(batchSize, left);
                button.innerHTML = `Show ${nextBatch} more photos <span aria-hidden="true">+</span>`;
            }
        });
    });

    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', event => {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeLightbox();
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPhoto(activeIndex - 1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            showPhoto(activeIndex + 1);
        }
        if (event.key === 'Tab') {
            const controls = [closeButton, previousButton, nextButton].filter(button => !button.disabled);
            const firstControl = controls[0];
            const lastControl = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === firstControl) {
                event.preventDefault();
                lastControl.focus();
            } else if (!event.shiftKey && document.activeElement === lastControl) {
                event.preventDefault();
                firstControl.focus();
            }
        }
    });
}
