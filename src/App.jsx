import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import Home         from './pages/Home';
import BeautyPage   from './pages/BeautyPage';
import BlessingPage from './pages/BlessingPage';
import GemsPage     from './pages/GemsPage';
import GloryPage    from './pages/GloryPage';
import { Wand2, Sparkles, Gem, Swords } from 'lucide-react';
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
            <Link to="/" className="logo-link">
              <span className="logo-dept">DEPARTMENT OF</span>
              <span className="logo-regret"> REGRET</span>
            </Link>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink to="/beauty" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Wand2 size={16} /> Beauty
              </NavLink>
              <NavLink to="/blessing" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Sparkles size={16} /> Blessing
              </NavLink>
              <NavLink to="/gems" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Gem size={16} /> Gems
              </NavLink>
              <NavLink to="/glory" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <Swords size={16} /> Glory
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
