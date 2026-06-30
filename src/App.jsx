import React, { useState, useEffect } from 'react';
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
        <nav className="navbar">
          <div className="navbar-inner">
            <Link to="/" className="logo-link" onClick={() => setIsMenuOpen(false)}>
              <span className="logo-dept">DEPARTMENT OF</span>
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
