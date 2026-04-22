const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(file, 'utf-8');

// 1. Revert colors and reduce maroon/black. Use navy blue and gold.
html = html.replace('--navy:    #3d0d0e;', '--navy:    #0d1b3e;');
html = html.replace('--navy2:   #230607;', '--navy2:   #122352;');
// Replace rgba usages
html = html.replaceAll('rgba(61,13,14', 'rgba(13,27,62'); // 0d1b3e

// 2. Reduce overlay and adjust animation for 5 slides
const oldCSS = `
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
`.trim();

const newCSS = `
    .hero-slideshow .slide::after {
      content: ''; position: absolute; inset: 0;
      /* Reduced opacity gradient overlay, using navy blue */
      background: linear-gradient(90deg, rgba(13,27,62,0.65) 0%, rgba(13,27,62,0.3) 50%, rgba(13,27,62,0.05) 100%);
    }
    .hero-slideshow .slide:nth-child(1) { animation-delay: 0s; }
    .hero-slideshow .slide:nth-child(2) { animation-delay: 6s; }
    .hero-slideshow .slide:nth-child(3) { animation-delay: 12s; }
    .hero-slideshow .slide:nth-child(4) { animation-delay: 18s; }
    .hero-slideshow .slide:nth-child(5) { animation-delay: 24s; }
    
    @keyframes slideshow {
      0% { opacity: 0; transform: scale(1); }
      6% { opacity: 1; }
      20% { opacity: 1; }
      26% { opacity: 0; transform: scale(1.04); }
      100% { opacity: 0; transform: scale(1.04); }
    }
`.trim();

const escapedOldCSS = oldCSS.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
html = html.replace(new RegExp(escapedOldCSS, 'g'), newCSS);
// Oh wait, my oldCSS has `rgba(61,13,14` but I just did replaceAll to `rgba(13,27,62` above.
// So the oldCSS will fail to match if it runs after the replaceAll.

// Let's do a better replace strategy:
html = fs.readFileSync(file, 'utf-8'); // Reset

// Replace the slideshow CSS block directly via searching for @keyframes
const cssStart = html.indexOf('.hero-slideshow .slide::after');
const cssEnd = html.indexOf('}', html.indexOf('@keyframes slideshow')) + 1;
if(cssStart > -1 && cssEnd > -1) {
  html = html.substring(0, cssStart) + newCSS + html.substring(cssEnd);
}

// Now replace colors
html = html.replace('--navy:    #3d0d0e;', '--navy:    #0d1b3e;');
html = html.replace('--navy2:   #230607;', '--navy2:   #122352;');
html = html.replaceAll('rgba(61,13,14', 'rgba(13,27,62'); 

// 3. Update the HTML to use 5 images from 'images/gallery-1.jpg' etc
const oldSlideshow = `
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
`.trim();

const newSlideshow = `
  <div class="hero-slideshow">
    <div class="slide" style="background-image: url('images/gallery-1.jpg')"></div>
    <div class="slide" style="background-image: url('images/gallery-2.jpg')"></div>
    <div class="slide" style="background-image: url('images/gallery-3.jpg')"></div>
    <div class="slide" style="background-image: url('images/gallery-4.jpg')"></div>
    <div class="slide" style="background-image: url('images/gallery-5.jpg')"></div>
  </div>
`.trim();

const ssStart = html.indexOf('<div class="hero-slideshow">');
const ssEnd = html.indexOf('</div>', html.lastIndexOf('<div class="slide"')) + 6;
// Add 6 to grab the final closing div tag
if (ssStart > -1 && ssEnd > -1) {
  html = html.substring(0, ssStart) + newSlideshow + html.substring(ssEnd + 6); 
  // actually let's just use string replace. Since it's a multiline string it might fail, so manual substring is safer.
  // wait, \`<div class="slide" style="background-image: url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"></div>   
  // </div>\` <- the last closing div.
}

// Actually, I can just use a regex
html = html.replace(/<div class="hero-slideshow">[\s\S]*?<\/div>\s*<\/div>/, newSlideshow);
// The regex finds `<div class="hero-slideshow">...</div>` but the inner divs make it greedy or lazy incorrectly.
// Let's rely on substring
const htmlStart = html.split('<div class="hero-slideshow">')[0];
const htmlEndTemp = html.split('<div class="hero-slideshow">')[1];
const htmlEnd = htmlEndTemp.substring(htmlEndTemp.indexOf('</div>   \r\n  </div>') + 21); // trying to be safe
// A much safer way: 
// we know exactly what's after: <div class="hero-content glass-panel"
const safeEnd = html.indexOf('<div class="hero-content glass-panel"');
if(safeEnd > -1) {
   html = html.substring(0, ssStart) + newSlideshow + '\\n  \\n  ' + html.substring(safeEnd);
}

// 4. Update the "more gold" requirement: We already have `--gold: #d4af37`. Let's give some titles a gold class or increase gold emphasis on the Hero sub-text or eyebrows.
html = html.replace('<div class="hero-eyebrow">Open Day 2025</div>', '<div class="hero-eyebrow" style="background: rgba(212,175,55,0.2); border-color: var(--gold); color: var(--gold);">Open Day 2025</div>');

fs.writeFileSync(file, html, 'utf-8');
console.log('Tweak successful');
