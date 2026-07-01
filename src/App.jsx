import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import Home         from './pages/Home';
import BeautyPage   from './pages/BeautyPage';
import BlessingPage from './pages/BlessingPage';
import GemsPage     from './pages/GemsPage';
import EchoPage    from './pages/EchoPage';
import GloryPage    from './pages/GloryPage';
import CeremonyPage from './pages/CeremonyPage';
import { Wand2, Sparkles, Gem, Swords, Droplet, Crown, Menu, X } from 'lucide-react';
import './index.css';

import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const BackgroundEffects = () => {
  const location = useLocation();
  const path = location.pathname;

  // Pre-generate random properties for each animation type
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      dur: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  const sakura = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 8 + 6}px`,
      dur: `${Math.random() * 8 + 6}s`,
      delay: `${Math.random() * -10}s`, // Negative delay so they start offscreen/midway immediately
      rotate: `${Math.random() * 360}deg`,
      sway: `${Math.random() * 4 + 2}s`,
    }));
  }, []);  const orbs = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 70 + 30}px`,
      dur: `${Math.random() * 12 + 8}s`,
      delay: `${Math.random() * -15}s`,
      opacity: Math.random() * 0.25 + 0.20,
    }));
  }, []);

  const snow = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2.5}px`,
      dur: `${Math.random() * 6 + 4}s`,
      delay: `${Math.random() * -8}s`,
      opacity: Math.random() * 0.4 + 0.4,
    }));
  }, []);

  const embers = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 3}px`,
      dur: `${Math.random() * 5 + 3}s`,
      delay: `${Math.random() * -6}s`,
      opacity: Math.random() * 0.4 + 0.5,
    }));
  }, []);

  const blessingSparkles = useMemo(() => {
    const glyphs = ['✦', '✧', '★', '✸', '✶'];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 85 + 5}%`,
      left: `${Math.random() * 90 + 5}%`,
      glyph: glyphs[i % glyphs.length],
      size: `${Math.random() * 1.5 + 1.2}rem`,
      dur: `${Math.random() * 4 + 3}s`,
      delay: `${Math.random() * -5}s`,
    }));
  }, []);

  const glorySparks = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 5 + 2.5}px`,
      dur: `${Math.random() * 6 + 4}s`,
      delay: `${Math.random() * -8}s`,
      opacity: Math.random() * 0.5 + 0.4,
    }));
  }, []);

  // Render the appropriate effect based on the path
  if (path === '/') {
    // Home: Twinkling Stars
    return (
      <div className="star-field" aria-hidden="true">
        {stars.map(s => (
          <div
            key={s.id}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              '--dur': s.dur,
              '--delay': s.delay,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  if (path === '/beauty') {
    // Beauty Manor: Sakura Blossoms
    return (
      <div className="sakura-field" aria-hidden="true">
        {sakura.map(s => (
          <div
            key={s.id}
            className="sakura-petal"
            style={{
              left: s.left,
              width: s.size,
              height: s.size,
              transform: `rotate(${s.rotate})`,
              animation: `sakuraFall ${s.dur} linear infinite, sakuraSway ${s.sway} ease-in-out infinite`,
              animationDelay: `${s.delay}, 0s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (path === '/blessing') {
    // Blessing Analytics: Glowing Star Sparkles
    return (
      <div className="runes-field" aria-hidden="true">
        {blessingSparkles.map(s => (
          <div
            key={s.id}
            className="magic-rune"
            style={{
              top: s.top,
              left: s.left,
              fontSize: s.size,
              animation: `runePulse ${s.dur} ease-in-out infinite`,
              animationDelay: s.delay,
            }}
          >
            {s.glyph}
          </div>
        ))}
      </div>
    );
  }

  if (path === '/gems') {
    // Gem Calculator: Rising Orbs
    return (
      <div className="orbs-field" aria-hidden="true">
        {orbs.map(o => (
          <div
            key={o.id}
            className="magic-orb"
            style={{
              left: o.left,
              width: o.size,
              height: o.size,
              opacity: o.opacity,
              animation: `orbRise ${o.dur} linear infinite`,
              animationDelay: o.delay,
            }}
          />
        ))}
      </div>
    );
  }

  if (path === '/glory') {
    // Glory Calculator: Golden Sparks
    return (
      <div className="embers-field" aria-hidden="true">
        {glorySparks.map(g => (
          <div
            key={g.id}
            className="glory-spark"
            style={{
              left: g.left,
              width: g.size,
              height: g.size,
              opacity: g.opacity,
              animation: `glorySparkRise ${g.dur} linear infinite`,
              animationDelay: g.delay,
            }}
          />
        ))}
      </div>
    );
  }

  if (path === '/echo') {
    // Echo Upgrades: Glitter / Snow
    return (
      <div className="snow-field" aria-hidden="true">
        {snow.map(s => (
          <div
            key={s.id}
            className="snow-flake"
            style={{
              left: s.left,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `snowFall ${s.dur} linear infinite`,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
    );
  }

  if (path === '/ceremony') {
    // Ceremony Planner: Rising Embers
    return (
      <div className="embers-field" aria-hidden="true">
        {embers.map(e => (
          <div
            key={e.id}
            className="ember"
            style={{
              left: e.left,
              width: e.size,
              height: e.size,
              opacity: e.opacity,
              animation: `emberRise ${e.dur} linear infinite`,
              animationDelay: e.delay,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ambient Cyberpunk Lightning Strikes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const strike = document.createElement('div');
        strike.className = 'ambient-lightning';
        strike.style.left = `${5 + Math.random() * 90}vw`;
        
        // Randomly make it thick or thin
        const thickness = Math.random() > 0.8 ? '4px' : '2px';
        strike.style.width = thickness;
        
        document.body.appendChild(strike);
        
        // Randomly add a screen flash alongside it
        if (Math.random() > 0.7) {
            const flash = document.createElement('div');
            flash.className = 'cyber-lightning';
            document.body.appendChild(flash);
            setTimeout(() => { if (document.body.contains(flash)) document.body.removeChild(flash); }, 150);
        }

        setTimeout(() => {
          if (document.body.contains(strike)) document.body.removeChild(strike);
        }, 150);
      }
    }, 1500 + Math.random() * 3000); // Random interval between 1.5s and 4.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="page-wrapper">
        <BackgroundEffects />
        <nav className="navbar">
          <div className="navbar-inner">
            <Link to="/" className="logo-link" onClick={() => setIsMenuOpen(false)}>
              <span className="logo-dept">LAND OF</span>
              <span className="logo-regret"> REGRET</span>
            </Link>

            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
              <NavLink to="/beauty" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Wand2 size={16} /> Beauty
              </NavLink>
              <NavLink to="/blessing" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Sparkles size={16} /> Blessing
              </NavLink>
              <NavLink to="/gems" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Gem size={16} /> Gems
              </NavLink>
              <NavLink to="/glory" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Swords size={16} /> Glory
              </NavLink>
              <NavLink to="/echo" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Droplet size={16} /> Echo
              </NavLink>
              <NavLink to="/ceremony" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Crown size={16} /> Ceremony
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/beauty"    element={<BeautyPage />} />
            <Route path="/blessing"  element={<BlessingPage />} />
            <Route path="/gems"      element={<GemsPage />} />
            <Route path="/glory"     element={<GloryPage />} />
            <Route path="/echo"      element={<EchoPage />} />
            <Route path="/ceremony"  element={<CeremonyPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>MADE BY <span className="author-name">ARYA</span></p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
