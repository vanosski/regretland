import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <label className={`cyber-switch ${isDark ? 'checked' : 'unchecked'}`} title="Toggle Theme">
      <input type="checkbox" checked={isDark} onChange={toggleTheme} />
      
      <div className="cyber-track">
        <div className="energy-line"></div>
        <div className="cyber-thumb">
            <div className="core">
              <div className="core-inner"></div>
            </div>
            <div className="sparks"></div>
        </div>
      </div>
    </label>
  );
};

export default ThemeToggle;
