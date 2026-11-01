/**
 * fitByte Developer Portfolio - Interactive Particle Background
 * Created for Harsh Upadhyay
 */

class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.numParticles = 75; // Balanced performance
    this.connectionDistance = 120;
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => this.updateMouse(e));
    window.addEventListener('mouseout', () => this.clearMouse());
    window.addEventListener('scroll', () => this.handleScroll());
  }

  init() {
    this.resizeCanvas();
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
      baseSize: Math.random() * 2 + 1,
      // Target opacity
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  updateMouse(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  clearMouse() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  handleScroll() {
    // Parallax effect: shift particles slightly based on scroll
    const scrollY = window.scrollY;
    if (this.lastScrollY === undefined) {
      this.lastScrollY = scrollY;
    }
    const diff = scrollY - this.lastScrollY;
    this.particles.forEach(p => {
      p.y -= diff * 0.15; // Slow parallax shift
      // Wrap around screen boundaries
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
    });
    this.lastScrollY = scrollY;
  }

  getThemeColors() {
    // Dynamically retrieve theme colors from CSS variables
    const bodyStyles = getComputedStyle(document.body);
    const primary = bodyStyles.getPropertyValue('--color-primary').trim() || '#3f8948';
    
    // Convert hex to rgb or extract numbers if needed, but a simple fallback works.
    // For particles, we'll draw with the theme color with transparency
    return primary;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const themeColor = this.getThemeColors();
    this.ctx.fillStyle = themeColor;
    this.ctx.strokeStyle = themeColor;
    
    this.particles.forEach((p, idx) => {
      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off screen boundaries
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interaction (repulsion/attraction)
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          // Slowly push particle away
          p.x -= dx / distance * force * 0.8;
          p.y -= dy / distance * force * 0.8;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(156, 163, 175, ${p.alpha})`; // Elegant soft gray fallback for general particles
      this.ctx.fill();

      // Connect particles
      for (let j = idx + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          // Opacity decreases as distance increases
          const opacity = (1 - (distance / this.connectionDistance)) * 0.08;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(156, 163, 175, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Create background canvas container if it doesn't exist
  if (!document.getElementById('particle-canvas')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);
  }
  
  new ParticleBackground('particle-canvas');
});
