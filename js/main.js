// ── Typed text ───────────────────────────────────────────
const messages = [
    'building teams','helping engineers grow','strong engineering cultures',
    'mentoring future leaders','scalable systems','resilient architectures',
    'reliable infrastructure','learning','curiosity','continuous improvement',
    'solving real customer problems',
];
let msgIdx = 0, charIdx = 0, deleting = false;
function typeLoop() {
    const el = document.getElementById('heroTyped');
    if (!el) return;
    const msg = messages[msgIdx];
    if (!deleting) {
        el.textContent = msg.slice(0, ++charIdx);
        if (charIdx === msg.length) { deleting = true; setTimeout(typeLoop, 1200); return; }
        setTimeout(typeLoop, 85);
    } else {
        el.textContent = msg.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            msgIdx = (msgIdx + 1) % messages.length;
            setTimeout(typeLoop, 300);
            return;
        }
        setTimeout(typeLoop, 40);
    }
}
typeLoop();

// ── Nav scroll + active section highlight ────────────────
const navHeight = 70;
const sections = Array.from(document.querySelectorAll('section[id]'));
const navAnchors = document.querySelectorAll('.nav-links a');

function updateNav() {
    // Shrink navbar on scroll
    document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);

    // Find the section whose top is closest to (but not past) the nav bottom
    const scrollMid = window.scrollY + navHeight + 80;
    let active = sections[0];
    for (const section of sections) {
        if (section.offsetTop <= scrollMid) active = section;
    }

    navAnchors.forEach(a => {
        const isActive = a.getAttribute('href') === `#${active.id}`;
        a.classList.toggle('nav-active', isActive);
    });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Mobile nav ───────────────────────────────────────────
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ── Scroll animations ────────────────────────────────────
const fadeEls = document.querySelectorAll('.wow-fade');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), 100);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// ── Skill bars ───────────────────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skillbar-fill').forEach(fill => {
                fill.style.width = fill.dataset.pct;
            });
            barObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.2 });
const barsContainer = document.getElementById('skillbarsContainer');
if (barsContainer) barObserver.observe(barsContainer);

// ── Modals ───────────────────────────────────────────────
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
function closeModalOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
}
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
            m.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// ── Particles ────────────────────────────────────────────
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 14000);
    for (let i = 0; i < Math.min(count, 80); i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 200, 255, 0.35)';
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// Hero canvas
initParticles(document.getElementById('particles-hero'));

// Section canvases
document.querySelectorAll('canvas[data-particle-id]').forEach(canvas => {
    initParticles(canvas);
});