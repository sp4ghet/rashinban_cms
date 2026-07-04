// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initLiveToggle();
    initTicketPopup();
    initDeadlineTooltips();
    initRegistrationAutoClose();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
        });

        // Close button inside the drawer
        const navClose = document.querySelector('.nav__close');
        if (navClose) {
            navClose.addEventListener('click', function() {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


// Scroll effects
function initScrollEffects() {
    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}

// Ticket popup close
function initTicketPopup() {
    const popup = document.querySelector('.ticket-popup');
    if (!popup) return;
    const closeBtn = popup.querySelector('.ticket-popup__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.add('ticket-popup--hidden');
        });
    }

    // Remove from DOM after fade-out to avoid tab stops
    popup.addEventListener('transitionend', (ev) => {
        if (ev.propertyName === 'opacity' && popup.classList.contains('ticket-popup--hidden')) {
            popup.style.display = 'none';
        }
    });
}
// Live player toggle (YouTube/Twitch)
function initLiveToggle() {
    const tabs = document.querySelectorAll('.live__tab');
    const panes = document.querySelectorAll('.live__pane');
    if (!tabs.length || !panes.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            if (!target) return;

            // update tab active state
            tabs.forEach(t => {
                const isActive = t === tab;
                t.classList.toggle('is-active', isActive);
                t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // update panes
            panes.forEach(pane => {
                const isMatch = pane.getAttribute('data-pane') === target;
                pane.classList.toggle('is-active', isMatch);
                pane.setAttribute('aria-hidden', isMatch ? 'false' : 'true');
            });
        });
    });
}

// Show remaining time tooltip on qualifier deadlines
function initDeadlineTooltips() {
    const deadlineEls = document.querySelectorAll('.qualifier-card__deadline');
    if (!deadlineEls.length) return;

    // Single tooltip element reused for all deadlines
    const tip = document.createElement('div');
    tip.className = 'tooltip tooltip--deadline';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);

    const formatRemaining = (ms) => {
        if (ms <= 0) return '締切済み';
        const totalMinutes = Math.floor(ms / (60 * 1000));
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;
        const parts = [];
        if (days) parts.push(`${days}日`);
        parts.push(`${hours}時間`);
        parts.push(`${minutes}分`);
        return `締切まで 残り: ${parts.join(' ')}`;
    };

    const parseDeadline = (el) => {
        let iso = el.getAttribute('data-deadline');
        if (!iso) {
            const text = el.textContent || '';
            const m = text.match(/(\d{1,2})\/(\d{1,2}).*?(\d{1,2}):(\d{2})/);
            if (m) {
                const year = new Date().getFullYear();
                const mm = String(parseInt(m[1], 10)).padStart(2, '0');
                const dd = String(parseInt(m[2], 10)).padStart(2, '0');
                const hh = String(parseInt(m[3], 10)).padStart(2, '0');
                const mi = String(parseInt(m[4], 10)).padStart(2, '0');
                iso = `${year}-${mm}-${dd}T${hh}:${mi}:00+09:00`;
            }
        }
        if (!iso) return null;
        const deadline = new Date(iso);
        if (isNaN(deadline.getTime())) return null;
        return deadline;
    };

    const showTip = (el) => {
        const deadline = parseDeadline(el);
        if (!deadline) return;
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        tip.textContent = formatRemaining(diff);

        // Make visible to measure
        tip.style.display = 'block';
        tip.classList.add('tooltip--visible');
        tip.classList.remove('tooltip--below');

        const rect = el.getBoundingClientRect();
        const tipW = tip.offsetWidth;
        const tipH = tip.offsetHeight;

        let left = rect.left + window.scrollX + (rect.width / 2) - (tipW / 2);
        left = Math.max(window.scrollX + 8, Math.min(left, window.scrollX + window.innerWidth - tipW - 8));

        // Prefer above; if not enough space, place below
        let top = rect.top + window.scrollY - tipH - 10;
        if (top < window.scrollY + 8) {
            top = rect.bottom + window.scrollY + 10;
            tip.classList.add('tooltip--below');
        }

        tip.style.left = `${left}px`;
        tip.style.top = `${top}px`;
    };

    const hideTip = () => {
        tip.classList.remove('tooltip--visible');
        tip.style.display = 'none';
    };

    deadlineEls.forEach((el) => {
        el.addEventListener('mouseenter', () => showTip(el));
        el.addEventListener('mouseleave', hideTip);
        el.addEventListener('focus', () => showTip(el));
        el.addEventListener('blur', hideTip);
    });

    window.addEventListener('scroll', hideTip, { passive: true });
    window.addEventListener('resize', hideTip, { passive: true });
}

// Auto-close qualifier registration links after deadline
function initRegistrationAutoClose() {
    const cards = document.querySelectorAll('.qualifier-card');
    if (!cards.length) return;

    const parseDeadlineFromEl = (deadlineEl) => {
        if (!deadlineEl) return null;
        let iso = deadlineEl.getAttribute('data-deadline');
        if (!iso) {
            const text = deadlineEl.textContent || '';
            const m = text.match(/(\d{1,2})\/(\d{1,2}).*?(\d{1,2}):(\d{2})/);
            if (m) {
                const year = new Date().getFullYear();
                const mm = String(parseInt(m[1], 10)).padStart(2, '0');
                const dd = String(parseInt(m[2], 10)).padStart(2, '0');
                const hh = String(parseInt(m[3], 10)).padStart(2, '0');
                const mi = String(parseInt(m[4], 10)).padStart(2, '0');
                // Interpret as JST to match displayed times
                iso = `${year}-${mm}-${dd}T${hh}:${mi}:00+09:00`;
            }
        }
        if (!iso) return null;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? null : d;
    };

    cards.forEach((card) => {
        const link = card.querySelector('.qualifier-card__register');
        const deadlineEl = card.querySelector('.qualifier-card__deadline');
        if (!link || !deadlineEl) return;

        const deadline = parseDeadlineFromEl(deadlineEl);
        if (!deadline) return;

        // Flip to closed right after the displayed minute (e.g., 23:59 -> 00:00)
        const cutoverMs = deadline.getTime() + 60 * 1000; // plus 1 minute
        const now = new Date();
        if (now.getTime() >= cutoverMs) {
            link.href = '#';
            link.textContent = '選手登録終了';
            link.setAttribute('aria-disabled', 'true');
            // Avoid opening a blank tab when disabled
            link.removeAttribute('target');
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }
    });
}
