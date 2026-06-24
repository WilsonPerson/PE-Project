// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked button
    button.classList.add('active');

    // Add active class to corresponding content
    const tabName = button.getAttribute('data-tab');
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
      activeContent.classList.add('active');
    }
  });
});

// Initialize - show overview on page load
window.addEventListener('load', () => {
  const overviewBtn = document.querySelector('[data-tab="overview"]');
  if (overviewBtn) {
    overviewBtn.click();
  }
});

// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  const activeTab = document.querySelector('.tab-btn.active');
  const tabBtnsList = Array.from(document.querySelectorAll('.tab-btn'));
  const currentIndex = tabBtnsList.indexOf(activeTab);

  if (e.key === 'ArrowRight' && currentIndex < tabBtnsList.length - 1) {
    tabBtnsList[currentIndex + 1].click();
  } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
    tabBtnsList[currentIndex - 1].click();
  }
});
// Simple particle system on a canvas background
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticles(count = Math.round((W * H) / 90000)) {
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.8, 3.2),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        hue: Math.floor(rand(180, 280)),
        alpha: rand(0.2, 0.9)
      });
    }
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      // Black particle core with soft fade
      g.addColorStop(0, `rgba(0,0,0,${p.alpha})`);
      g.addColorStop(0.4, `rgba(0,0,0,${(p.alpha * 0.22).toFixed(3)})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  createParticles();
  requestAnimationFrame(draw);
}

// Place images next to each day's content (cycles through available images)
function insertDayImages() {
  const imageFiles = [
    'Images/gym-silhouette.jpg',
    'Images/images.jpeg'
  ];

  const daySections = Array.from(document.querySelectorAll('.tab-content'))
    .filter(s => s.id && s.id.startsWith('week'));

  daySections.forEach((section, idx) => {
    const weekContent = section.querySelector('.week-content');
    if (!weekContent) return;
    // avoid duplicating
    if (weekContent.querySelector('.day-image')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'day-image';
    const img = document.createElement('img');
    const src = imageFiles[idx % imageFiles.length];
    img.src = src;
    img.alt = section.querySelector('h2')?.textContent || 'Day image';
    img.loading = 'lazy';
    wrapper.appendChild(img);

    weekContent.classList.add('with-image');
    weekContent.appendChild(wrapper);
  });
}

window.addEventListener('load', () => {
  initParticles();
  insertDayImages();
  // ensure overview active state still applied
  const overviewBtn = document.querySelector('[data-tab="overview"]');
  if (overviewBtn) overviewBtn.click();
});