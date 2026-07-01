import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Sparkles, Gem, Swords, Droplet, Crown } from 'lucide-react';
import './Home.css';

const TOOLS = [
  {
    title: 'Beauty Manor',
    to: '/beauty',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.8)',
    border: '1px solid rgba(244,114,182,0.4)',
    bgStyle: 'radial-gradient(circle at top right, rgba(244,114,182,0.15) 0%, transparent 60%), linear-gradient(135deg, rgba(10,12,28,0.9) 0%, rgba(20,12,24,0.9) 100%)',
    icon: <Wand2 size={28} />
  },
  {
    title: 'Blessing Analytics',
    to: '/blessing',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.8)',
    border: '1px solid rgba(34,211,238,0.4)',
    bgStyle: 'radial-gradient(circle at center top, rgba(34,211,238,0.15) 0%, transparent 60%), linear-gradient(180deg, rgba(10,12,28,0.9) 0%, rgba(10,16,28,0.9) 100%)',
    icon: <Sparkles size={28} />
  },
  {
    title: 'Gem Calculator',
    to: '/gems',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.8)',
    border: '1px solid rgba(167,139,250,0.4)',
    bgStyle: 'linear-gradient(45deg, rgba(10,12,28,0.9) 0%, rgba(16,12,28,0.9) 100%), repeating-linear-gradient(45deg, rgba(167,139,250,0.03) 0px, rgba(167,139,250,0.03) 10px, transparent 10px, transparent 20px)',
    icon: <Gem size={28} />
  },
  {
    title: 'Glory Calculator',
    to: '/glory',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.8)',
    border: '1px solid rgba(251,191,36,0.4)',
    bgStyle: 'radial-gradient(circle at bottom left, rgba(251,191,36,0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(10,12,28,0.9) 0%, rgba(28,12,12,0.9) 100%)',
    icon: <Swords size={28} />
  },
  {
    title: 'Echo Upgrades',
    to: '/echo',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.8)',
    border: '1px solid rgba(16,185,129,0.4)',
    bgStyle: 'radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(10,12,28,0.9) 0%, rgba(12,28,20,0.9) 100%)',
    icon: <Droplet size={28} />
  },
  {
    title: 'Ceremony Planner',
    to: '/ceremony',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.8)',
    border: '1px solid rgba(249,115,22,0.4)',
    bgStyle: 'radial-gradient(circle at center right, rgba(249,115,22,0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(10,12,28,0.9) 0%, rgba(28,18,12,0.9) 100%)',
    icon: <Crown size={28} />
  },
];

export default function Home() {
  const canvasRef = useRef(null);

  // Animated ember/particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', resize);

    // Ember particles
    const NUM = 80;
    const particles = Array.from({ length: NUM }, () => createParticle(W, H, true));

    function createParticle(W, H, init = false) {
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : H + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.2 + 0.4),
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        hue: Math.random() < 0.6
          ? `${Math.random() * 20 + 0}` // red-orange
          : `${Math.random() * 30 + 40}`, // gold-yellow
        life: Math.random(),
      };
    }

    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x  += p.vx + Math.sin(p.life * 3) * 0.3;
        p.y  += p.vy;
        p.life += 0.005;
        p.alpha -= 0.002;

        if (p.y < -10 || p.alpha <= 0) {
          particles[i] = createParticle(W, H);
          return;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 80%, 1)`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Full-window background */}
      <div className="home-bg" />

      {/* Animated ember canvas */}
      <canvas ref={canvasRef} className="ember-canvas" />

      <div className="home-content-split">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <p className="home-eyebrow">⚔ Last Land Analytics ⚔</p>
            <h1 className="home-title">
              <span className="home-title-dept">LAND OF</span>
              <span className="home-title-regret">REGRET</span>
            </h1>
          </div>
        </section>

        {/* Tool cards */}
        <section className="home-tools">
          <p className="home-section-label">— Choose Your Doom —</p>
          <div className="home-tools-grid">
            {TOOLS.map((t) => (
              <Link 
                key={t.to} 
                to={t.to} 
                className="home-tool-banner" 
                style={{ 
                  '--card-color': t.color, 
                  '--card-glow': t.glow,
                  border: t.border,
                  background: t.bgStyle
                }}
              >
                <div className="htb-content">
                  <div className="htb-icon" style={{ color: t.color }}>
                    {t.icon}
                  </div>
                  <h3 className="htb-title">
                    {t.title}
                  </h3>
                  <span className="htb-arrow">›</span>
                </div>
                <div className="htb-glow" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
