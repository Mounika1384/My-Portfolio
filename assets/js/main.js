// ===== PORTFOLIO - MAIN SCRIPTS =====

// ===== PAGE LOADER =====
window.addEventListener('load', function () {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 600);
        setTimeout(() => loader.style.display = 'none', 1200);
    }
});

// ===== PARTICLE CANVAS =====
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const count = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3 - 0.15,
            color: ['#e91e8c', '#8b5cf6', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)],
            opacity: Math.random() * 0.4 + 0.1
        };
    }

    for (let i = 0; i < count; i++) particles.push(createParticle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                particles[i] = createParticle();
                particles[i].y = canvas.height + 5;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();

            // Draw connections
            particles.forEach((p2, j) => {
                if (j <= i) return;
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = (1 - dist / 120) * 0.08;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    animate();
})();
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile menu
function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.body.style.overflow = '';
}

// Back to top button
window.addEventListener('scroll', function () {
    const btn = document.getElementById('backToTop');
    if (btn) {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }
});

// Contact form - AJAX submission (stays on page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                this.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(err => {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed! Try again';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
    });
}

// Active nav link on scroll
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Scroll Reveal - Intersection Observer
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // We can unobserve after it's revealed to save resources
            // observer.unobserve(entry.target); 
        }
    });
};

const revealOptions = {
    threshold: 0.15 // Section must be 15% visible
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

document.querySelectorAll('.reveal').forEach(section => {
    revealObserver.observe(section);
});

// Number Count-Up Animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end + (obj.dataset.suffix || "");
        }
    };
    window.requestAnimationFrame(step);
}

// Global Observers
document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio loaded successfully ✨');

    // ===== TYPEWRITER EFFECT =====
    const typewriterEl = document.getElementById('typewriter-text');
    if (typewriterEl) {
        const phrases = [
            'Full-Stack Developer',
            'AI Enthusiast',
            'Python Developer',
            'Web App Builder',
            'Problem Solver'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 40;
        const pauseAfterType = 1800;
        const pauseAfterDelete = 400;

        function typewrite() {
            const current = phrases[phraseIndex];
            if (!isDeleting) {
                typewriterEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(typewrite, pauseAfterType);
                    return;
                }
                setTimeout(typewrite, typeSpeed);
            } else {
                typewriterEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(typewrite, pauseAfterDelete);
                    return;
                }
                setTimeout(typewrite, deleteSpeed);
            }
        }
        typewrite();
    }


    // Observer for Hero Stats and Reveal animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // If it's a statistc, trigger count-up
                if (entry.target.classList.contains('hero-stat')) {
                    const valueDisplay = entry.target.querySelector('.stat-number');
                    const targetValue = parseInt(valueDisplay.dataset.target);
                    if (valueDisplay && !valueDisplay.classList.contains('counted')) {
                        animateValue(valueDisplay, 0, targetValue, 2000);
                        valueDisplay.classList.add('counted');
                    }
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe Hero Stats
    document.querySelectorAll('.hero-stat').forEach(el => {
        revealObserver.observe(el);
    });

    // Existing Card Scroll Reveal
    document.querySelectorAll('.glass-card:not(.about-card), .project-card, .cert-card, .skill-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cardObserver.observe(el);
    });

    // ===== MOUSE-TRACKING 3D TILT EFFECT =====
    const tiltCards = document.querySelectorAll('.project-card, .glass-card, .cert-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within card
            const y = e.clientY - rect.top;  // y position within card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // max 8deg
            const rotateY = ((x - centerX) / centerX) * 8;  // max 8deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        card.addEventListener('mouseenter', function () {
            card.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
        });

        // Neon Ripple Effect on Click
        card.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(233, 30, 140, 0.15) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-burst 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 5;
            `;
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });
});

