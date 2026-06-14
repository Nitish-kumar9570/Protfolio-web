// --- PRELOADER ---
window.addEventListener('load', () => {
  const p = document.getElementById('preloader');
  setTimeout(() => {
    p.classList.add('hide');
    setTimeout(() => p.remove(), 450);
  }, 600);
});
 
// --- THEME ---
const html = document.documentElement;
const saved = localStorage.getItem('theme');
const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
html.setAttribute('data-theme', saved || (sysDark ? 'dark' : 'light'));
 
document.getElementById('theme-btn').addEventListener('click', () => {
  const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});
 
// --- MOBILE MENU ---
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuBtn.querySelector('i').className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.querySelector('i').className = 'fas fa-bars';
  });
});
 
// --- STARS CANVAS ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, stars = [];
const COLORS = ['#4361ee','#7209b7','#f72585','#4cc9f0'];
 
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
window.addEventListener('resize', resize); resize();
 
class Star {
  constructor() { this.reset(); this.z = Math.random() * W; }
  reset() {
    this.x = Math.random() * W - W/2;
    this.y = Math.random() * H - H/2;
    this.z = W;
    this.speed = Math.random() * 1.5 + 0.3;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  update() { this.z -= this.speed; if (this.z < 1) this.reset(); }
  draw() {
    const s = 350 / this.z;
    const x = this.x * s + W/2, y = this.y * s + H/2;
    const r = Math.max(0.2, s * 0.6);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.min(0.7, s * 0.4);
    ctx.fill();
  }
}
for (let i = 0; i < 160; i++) { const s = new Star(); s.z = Math.random() * W; stars.push(s); }
(function tick() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(tick);
})();
 
// --- SCROLL ANIMATIONS ---
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      if (el.classList.contains('anim-up')) el.classList.add('show-up');
      if (el.classList.contains('anim-scale')) el.classList.add('show-scale');
      el.querySelectorAll('.bar-fill').forEach(b => {
        b.style.width = b.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
 
document.querySelectorAll('.anim-up, .anim-scale, .about-text').forEach(el => obs.observe(el));
 
// --- ACTIVE NAV ---
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
});
 
// --- TILT ---
function tilt(card, maxDeg = 12) {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - .5) * -maxDeg * 2;
    const ry = ((e.clientX - r.left) / r.width - .5) * maxDeg * 2;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
}
const tc = document.getElementById('tilt-card');
if (tc) tilt(tc, 8);

// --- TOAST FUNCTION (SINGLE DEFINITION) ---
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.innerText = text;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(80px)";
  }, 3000);
}

// --- CERTIFICATE MODAL ---
const certModal = document.getElementById('certModal');
const certModalImage = document.getElementById('certModalImage');
const certModalTitle = document.getElementById('certModalTitle');
const certCloseBtn = document.getElementById('certCloseBtn');
const certZoomInBtn = document.getElementById('certZoomInBtn');
const certZoomOutBtn = document.getElementById('certZoomOutBtn');
const certResetBtn = document.getElementById('certResetBtn');
const certDownloadBtn = document.getElementById('certDownloadBtn');
const certZoomIndicator = document.getElementById('certZoomIndicator');

let currentZoom = 1;
const minZoom = 0.5;
const maxZoom = 4;
const zoomStep = 0.25;
let zoomTimeout;

function openCertModal(event, title, imageUrl) {
  event.preventDefault();
  currentZoom = 1;
  certModalTitle.textContent = title;
  certModalImage.src = imageUrl;
  certModalImage.style.transform = `scale(${currentZoom})`;
  updateZoomIndicator();
  certModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  certModal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    currentZoom = 1;
    certModalImage.style.transform = `scale(${currentZoom})`;
  }, 400);
}

function zoomIn() {
  if (currentZoom < maxZoom) {
    currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
    certModalImage.style.transform = `scale(${currentZoom})`;
    updateZoomIndicator();
    showZoomIndicator();
  }
}

function zoomOut() {
  if (currentZoom > minZoom) {
    currentZoom = Math.max(currentZoom - zoomStep, minZoom);
    certModalImage.style.transform = `scale(${currentZoom})`;
    updateZoomIndicator();
    showZoomIndicator();
  }
}

function resetZoom() {
  currentZoom = 1;
  certModalImage.style.transform = `scale(${currentZoom})`;
  updateZoomIndicator();
  showZoomIndicator();
}

function updateZoomIndicator() {
  certZoomIndicator.textContent = `${Math.round(currentZoom * 100)}%`;
}

function showZoomIndicator() {
  certZoomIndicator.classList.add('show');
  clearTimeout(zoomTimeout);
  zoomTimeout = setTimeout(() => {
    certZoomIndicator.classList.remove('show');
  }, 1500);
}

function downloadCertificate() {
  const link = document.createElement('a');
  link.href = certModalImage.src;
  link.download = `certificate-${certModalTitle.textContent.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

certCloseBtn.addEventListener('click', closeCertModal);
certZoomInBtn.addEventListener('click', zoomIn);
certZoomOutBtn.addEventListener('click', zoomOut);
certResetBtn.addEventListener('click', resetZoom);
certDownloadBtn.addEventListener('click', downloadCertificate);

certModal.addEventListener('click', (e) => {
  if (e.target === certModal) closeCertModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal.classList.contains('active')) closeCertModal();
  if (certModal.classList.contains('active')) {
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
    if (e.key === '-') { e.preventDefault(); zoomOut(); }
    if (e.key === '0') { e.preventDefault(); resetZoom(); }
  }
});

let wheelZoomTimeout;
certModalImage.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
  certZoomIndicator.classList.add('show');
  clearTimeout(wheelZoomTimeout);
  wheelZoomTimeout = setTimeout(() => {
    certZoomIndicator.classList.remove('show');
  }, 1000);
}, { passive: false });

certModalImage.addEventListener('dblclick', resetZoom);

// ===== EMAILJS INTEGRATION =====

// ✅ Initialize EmailJS (yaha apna PUBLIC KEY daalo)
(function() {
  emailjs.init("fnWseakJ6gn9yDMwf");
})();

// ✅ Form Submit Handler
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  const btn = document.getElementById("sendBtn");
  const originalText = btn.innerHTML;
  
  // Loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  
  // ✅ Send email (yaha SERVICE_ID aur TEMPLATE_ID daalo)
  emailjs.sendForm("service_odx1ups", "template_tyyx8qh", this)
    .then(() => {
      showToast("✅ Message sent successfully!");
      contactForm.reset();
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      showToast("❌ Failed to send message. Try again!");
    })
    .finally(() => {
      // Reset button
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    });
});