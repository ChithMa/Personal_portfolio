// ==========================================================================
// CHITHMA PATHIRANA | PORTFOLIO SCRIPT
// Interactive Cyber Interactions, Scroll Animations & Utilities
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive Custom Cursor Dot
    const cursorDot = document.getElementById('cursor-dot');
    if (cursorDot && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .bento-card, .toolkit-card, .ctf-card, .project-card');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.width = '24px';
                cursorDot.style.height = '24px';
                cursorDot.style.backgroundColor = 'rgba(255, 84, 0, 0.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.width = '8px';
                cursorDot.style.height = '8px';
                cursorDot.style.backgroundColor = '#FF5400';
            });
        });
    }

    // 2. Navbar Scroll Style & Active Navigation Highlight
    const siteNav = document.getElementById('site-nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function handleScrollNavbar() {
        if (!siteNav) return;
        if (window.scrollY > 40) {
            siteNav.classList.add('scrolled');
        } else {
            siteNav.classList.remove('scrolled');
        }

        // Active link highlight
        let currentSectionId = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScrollNavbar, { passive: true });
    handleScrollNavbar();

    // 3. Mobile Navigation Drawer
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
        });

        // Close on link click
        mobileDrawer.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !mobileDrawer.contains(e.target)) {
                mobileDrawer.classList.remove('open');
            }
        });
    }

    // 4. Hero Typewriter Role Effect
    const roles = [
        "Ethical Hacker",
        "Network Defense Specialist",
        "CTF Researcher (Team GHOST-X)",
        "Undergraduate Developer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 90;
    const erasingDelay = 60;
    const pauseDelay = 2200;
    const typingText = document.getElementById('typing-text');

    function typeRole() {
        if (!typingText) return;

        const currentRole = roles[roleIndex];
        if (!isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(typeRole, pauseDelay);
                return;
            }
            setTimeout(typeRole, typingDelay);
        } else {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(typeRole, 400);
                return;
            }
            setTimeout(typeRole, erasingDelay);
        }
    }

    if (typingText) {
        setTimeout(typeRole, 600);
    }

    // 5. Experience Timeline Scroll Fill Effect
    const timelineFill = document.getElementById('timeline-fill');
    const experienceSection = document.getElementById('experience');

    function updateTimelineFill() {
        if (!timelineFill || !experienceSection) return;
        const rect = experienceSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top <= windowHeight * 0.7 && rect.bottom >= 0) {
            const total = rect.height;
            const current = (windowHeight * 0.7) - rect.top;
            const progress = Math.min(Math.max(current / total, 0.15), 1);
            timelineFill.style.transform = `scaleY(${progress})`;
        } else if (rect.top > windowHeight * 0.7) {
            timelineFill.style.transform = `scaleY(0.1)`;
        }
    }

    window.addEventListener('scroll', updateTimelineFill, { passive: true });
    updateTimelineFill();

    // 6. Contact Form & WhatsApp / Email Launcher
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('user-name')?.value.trim() || 'A Visitor';
            const email = document.getElementById('user-email')?.value.trim() || '';
            const message = document.getElementById('user-msg')?.value.trim() || '';

            const submitBtn = document.getElementById('submit-btn');
            const originalContent = submitBtn ? submitBtn.innerHTML : '';

            // Construct message
            const formattedMessage = `Hi Chithma! My name is ${name} (${email}).\n\n${message}`;

            // Provide immediate feedback
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Opening WhatsApp...</span>`;
            }

            // WhatsApp link fallback or direct open
            const waNumber = '94743090367'; // From reference or user's phone
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(formattedMessage)}`;
            const mailUrl = `mailto:manangapathirana@gmail.com?subject=Contact%20from%20Portfolio%20(${encodeURIComponent(name)})&body=${encodeURIComponent(formattedMessage)}`;

            // Open WhatsApp in new tab
            window.open(waUrl, '_blank', 'noopener,noreferrer');

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Message Prepared!</span>`;
                }
                setTimeout(() => {
                    if (submitBtn) submitBtn.innerHTML = originalContent;
                    contactForm.reset();
                }, 2500);
            }, 800);
        });
    }

    // 7. Floating Scroll-to-Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Certificate Viewer & Modal Interactions (For certifications.html)
    const certificateThumbs = document.querySelectorAll('.cert-thumb');
    const activeCertificate = document.getElementById('active-certificate');

    if (activeCertificate) {
        activeCertificate.addEventListener('error', () => {
            if (!activeCertificate.dataset.fallbackUsed) {
                activeCertificate.dataset.fallbackUsed = 'true';
                activeCertificate.src = 'images/HCCS.png';
                activeCertificate.alt = 'Certificate preview unavailable';
            }
        });
    }

    certificateThumbs.forEach((thumb) => {
        const img = thumb.querySelector('img');

        thumb.addEventListener('click', () => {
            certificateThumbs.forEach((item) => item.classList.remove('active'));
            thumb.classList.add('active');

            if (activeCertificate) {
                activeCertificate.dataset.fallbackUsed = 'false';
                activeCertificate.src = thumb.dataset.src;
                activeCertificate.alt = thumb.dataset.alt;
                activeCertificate.style.opacity = '1';
            }
        });

        // Hover swap preview
        const hoverSrc = thumb.dataset.hover;
        if (hoverSrc && img) {
            thumb.addEventListener('mouseenter', () => {
                if (!img.dataset._orig) img.dataset._orig = img.src;
                img.src = hoverSrc;
            });

            thumb.addEventListener('mouseleave', () => {
                if (img.dataset._orig) {
                    img.src = img.dataset._orig;
                    delete img.dataset._orig;
                }
            });
        }
    });

    // 9. Re-initialize Lucide icons if available
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
});
