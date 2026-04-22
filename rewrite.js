const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf-8');

// 1. Replace CSS Variables
html = html.replace('--navy:    #0d1b3e;', '--navy:    #3d0d0e;');
html = html.replace('--navy2:   #122352;', '--navy2:   #230607;');
html = html.replace('--gold:    #c9a84c;', '--gold:    #d4af37;');
html = html.replace('--gold2:   #e8c96a;', '--gold2:   #f3e5ab;');
html = html.replace('rgba(13,27,62', 'rgba(61,13,14'); // rgba matching #0d1b3e to #3d0d0e
// 23,6,7 for #230607 if needed but likely not there

// Update hero gradient
html = html.replace(
  'background: linear-gradient(160deg, var(--navy) 0%, var(--navy2) 60%, #1a3a6e 100%);',
  'background: var(--navy); /* Overridden by slideshow */'
);

// Add slideshow CSS
const extraCSS = `
    /* ─── CREATIVE HERO SLIDESHOW ─── */
    .hero-slideshow {
      position: absolute; inset: 0; z-index: 0;
    }
    .hero-slideshow .slide {
      position: absolute; inset: 0; background-size: cover; background-position: center;
      opacity: 0; animation: slideshow 72s infinite;
    }
    .hero-slideshow .slide::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(90deg, rgba(61,13,14,0.9) 0%, rgba(61,13,14,0.5) 50%, rgba(61,13,14,0.3) 100%);
    }
    .hero-slideshow .slide:nth-child(1) { animation-delay: 0s; }
    .hero-slideshow .slide:nth-child(2) { animation-delay: 6s; }
    .hero-slideshow .slide:nth-child(3) { animation-delay: 12s; }
    .hero-slideshow .slide:nth-child(4) { animation-delay: 18s; }
    .hero-slideshow .slide:nth-child(5) { animation-delay: 24s; }
    .hero-slideshow .slide:nth-child(6) { animation-delay: 30s; }
    .hero-slideshow .slide:nth-child(7) { animation-delay: 36s; }
    .hero-slideshow .slide:nth-child(8) { animation-delay: 42s; }
    .hero-slideshow .slide:nth-child(9) { animation-delay: 48s; }
    .hero-slideshow .slide:nth-child(10) { animation-delay: 54s; }
    .hero-slideshow .slide:nth-child(11) { animation-delay: 60s; }
    .hero-slideshow .slide:nth-child(12) { animation-delay: 66s; }
    
    @keyframes slideshow {
      0% { opacity: 0; transform: scale(1); }
      3% { opacity: 1; }
      8.33% { opacity: 1; }
      11.33% { opacity: 0; transform: scale(1.04); }
      100% { opacity: 0; transform: scale(1.04); }
    }

    /* ─── GLASSMORPHISM ─── */
    .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }
    
    /* ─── CREATIVE BACKGROUND PARTICLES ─── */
    .particles-bg {
      position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
    }
    .particle {
      position: absolute; background: var(--gold); border-radius: 50%;
      animation: float 15s infinite ease-in-out; opacity: 0.15;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-30px) translateX(20px); }
    }
`;

html = html.replace('</style>', extraCSS + '\n</style>');

// Modify hero section
const heroContentOld = `
<section class="hero">
  <div class="hero-bg-pattern"></div>
  <div class="hero-glow"></div>
  <div class="hero-content">
    <div class="hero-eyebrow">Open Day 2025</div>
    <h1 class="hero-title">
      Experience<br>
      <span class="accent">Engineering</span><br>
      at Ruhuna
    </h1>
    <p class="hero-subtitle">
      We warmly invite all students awaiting A/L results to come and experience real life at the Faculty of Engineering, University of Ruhuna. Discover, connect, and make the right decision for your future.
    </p>
    <div class="hero-actions">
      <a href="#register" class="btn-primary">✨ Register Now</a>
      <a href="#about" class="btn-outline">Learn More →</a>
    </div>
    <div class="hero-stats">
      <div class="stat-item">
        <span class="stat-num" id="stat-registered">—</span>
        <span class="stat-label">Registered</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">5</span>
        <span class="stat-label">Departments</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">1</span>
        <span class="stat-label">Unique Marine Eng. Program in Sri Lanka</span>
      </div>
    </div>
  </div>
  <!-- Photo gallery strip at bottom of hero -->
  <div class="gallery-strip">
    <div class="gallery-img" title="Replace with faculty photo"></div>
    <div class="gallery-img" title="Replace with faculty photo"></div>
    <div class="gallery-img" title="Replace with faculty photo"></div>
    <div class="gallery-img" title="Replace with faculty photo"></div>
    <div class="gallery-img" title="Replace with faculty photo"></div>
  </div>
</section>
`.trim();

const heroContentNew = `
<section class="hero">
  <div class="hero-slideshow">
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1581092335397-9583eb92d232?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>
    <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>   
  </div>
  
  <div class="hero-content glass-panel" style="margin-top: 50px;">
    <div class="hero-eyebrow">Open Day 2025</div>
    <h1 class="hero-title">
      Experience<br>
      <span class="accent">Engineering</span><br>
      at Ruhuna
    </h1>
    <p class="hero-subtitle" style="color: rgba(255,255,255,0.9);">
      We warmly invite all students awaiting A/L results to come and experience real life at the Faculty of Engineering, University of Ruhuna. Discover, connect, and make the right decision for your future.
    </p>
    <div class="hero-actions">
      <a href="#register" class="btn-primary" style="overflow:hidden; position:relative; z-index:1;">
        ✨ Register Now
        <span style="content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0)); animation: shine 3s infinite; z-index:-1;"></span>
      </a>
      <a href="#about" class="btn-outline">Learn More →</a>
    </div>
    <div class="hero-stats">
      <div class="stat-item">
        <span class="stat-num" id="stat-registered">—</span>
        <span class="stat-label" style="color: rgba(255,255,255,0.7);">Registered</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">5</span>
        <span class="stat-label" style="color: rgba(255,255,255,0.7);">Departments</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">1</span>
        <span class="stat-label" style="color: rgba(255,255,255,0.7);">Unique Marine Eng. Program</span>
      </div>
    </div>
  </div>
</section>
`;

html = html.replace(heroContentOld, heroContentNew);
html = html.replace('@keyframes fadeUp {', '@keyframes shine { 0% {left: -100%} 20% {left: 100%} 100% {left: 100%} }\n    @keyframes fadeUp {');

// Add some particle HTML into the #about and #departments sections just to make them more creative
html = html.replace('<section id="about">', '<section id="about" style="position:relative; overflow:hidden;">\n  <div class="particles-bg"><div class="particle" style="width:100px; height:100px; top:10%; left:10%;"></div><div class="particle" style="width:60px; height:60px; top:80%; left:85%; animation-delay:1s;"></div></div>');
html = html.replace('<section id="departments">', '<section id="departments" style="position:relative; overflow:hidden;">\n  <div class="particles-bg"><div class="particle" style="width:120px; height:120px; top:40%; left:80%; opacity:0.05; background:var(--cream);"></div><div class="particle" style="width:70px; height:70px; top:20%; left:5%; animation-delay:2s; background:var(--cream); opacity:0.05;"></div></div>');

// Write back to file
fs.writeFileSync(file, html, 'utf-8');
console.log('Update successful');
