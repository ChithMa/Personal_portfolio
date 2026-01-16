// Script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Animated Background (Particle Network) ---
    const bgContainer = document.querySelector('.background-grid');
    if (bgContainer) {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        bgContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = window.innerWidth < 768 ? 40 : 80; // Fewer on mobile
        const connectionDistance = 150;
        const particleSpeed = 0.5;

        // Mouse interaction
        let mouse = {
            x: null,
            y: null,
            radius: 150 // Interaction radius
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        // Reset mouse when leaving window
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });


        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * particleSpeed;
                this.vy = (Math.random() - 0.5) * particleSpeed;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (Repel or Attract - let's do a subtle attract + connect)
                // Actually, just connection for a "network" feel is cleaner. But let's add slight push/repel to feel interactive.
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * particleSpeed;
                        const directionY = forceDirectionY * force * particleSpeed;

                        // Move away slightly (repel) for a "disrupting the web" feel
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(56, 189, 248, 0.5)'; // Cyan with opacity
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.update();
                p.draw();

                // Draw connections between particles
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 - distance / connectionDistance * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Draw connections to mouse
                if (mouse.x != null) {
                    let dx = mouse.x - p.x;
                    let dy = mouse.y - p.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 - distance / mouse.radius * 0.2})`; // Slightly brighter connection to mouse
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resize);
        resize();
        animateParticles();
    }


    // --- Hero Animations (Sequenced) ---
    const heroElements = [
        document.querySelector('.hi-text'),
        document.querySelector('.hero-section h1'),
        document.querySelector('.role-text'),
        document.querySelector('.hero-desc'),
        document.querySelector('.cta-btn')
    ];

    heroElements.forEach((el, index) => {
        if (el) {
            el.classList.add('hero-animate');
            el.style.animationDelay = `${index * 200 + 300}ms`; // Start after 300ms, stagger by 200ms
        }
    });


    // --- Typing Effect ---
    const roles = ["Cyber Security Enthusiast", "CTF Player"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 100;
    const erasingDelay = 100;
    const newTextDelay = 2000;
    const typingText = document.getElementById('typing-text');

    function type() {
        if (!typingText) return;

        if (charIndex < roles[roleIndex].length && !isDeleting) {
            typingText.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else if (isDeleting && charIndex > 0) {
            typingText.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, erasingDelay);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                roleIndex = (roleIndex + 1) % roles.length;
            }
            setTimeout(type, isDeleting ? 1000 : 500);
        }
    }

    // Start typing after hero animations settle a bit
    if (typingText) setTimeout(type, 2500);


    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Intersection Observer for Sections (Fade In) ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });


    // --- Staggered Observer for Grids (Skills, Projects, CTF) ---
    const staggeredObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all stagger-able children
                const children = entry.target.querySelectorAll('.project-card, .skill-category, .ctf-detail-card');

                children.forEach((child, index) => {
                    // Set delay via inline style
                    child.style.animationDelay = `${index * 150}ms`;
                    child.classList.add('animate');
                });

                staggeredObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe grids
    const grids = document.querySelectorAll('.skills-grid, .projects-grid, .ctf-grid');
    grids.forEach(grid => staggeredObserver.observe(grid));

    // Also Hamburger Menu Logic (Basic Toggle) - Simple version
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Toggle logic can be refined for class based toggling
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '0';
                navLinks.style.flexDirection = 'column';
                navLinks.style.background = 'var(--bg-card)';
                navLinks.style.width = '100%';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid var(--glass-border)';
                navLinks.style.zIndex = '999';
            }
        });
    }

});
