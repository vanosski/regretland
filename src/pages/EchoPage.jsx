import React, { useState, useEffect } from 'react';
import { Droplet } from 'lucide-react';
import { echoData } from '../data/echoData';

const EchoPage = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `
        linear-gradient(to bottom, rgba(8,11,20,0.60) 0%, rgba(8,11,20,0.85) 50%, rgba(8,11,20,0.98) 100%),
        url('/echo_banner.jpg')
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center top';
    document.body.style.backgroundAttachment = 'fixed';
    return () => {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.style.backgroundAttachment = '';
    };
  }, []);

  const equipmentTypes = Object.keys(echoData);
  const [activeTab, setActiveTab] = useState(equipmentTypes[0]);

  const data = echoData[activeTab];

  return (
    <div className="calc-page fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Droplet size={32} color="#22d3ee" /> Echo Upgrades
        </h1>
        <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem', textAlign: 'center' }}>
          Battle Equipment Echo (Resonance) Upgrade Data
        </p>
      </header>

      <div className="card" style={{ 
        padding: '2rem', 
        maxWidth: '1100px', 
        margin: '0 auto', 
        background: 'rgba(0, 0, 0, 0.45)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        
        {/* Dropdown */}
        <div className="glass-select-container">
          <select 
            className="glass-select" 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {data.columns.map((col, idx) => (
                  <th key={idx} style={{ 
                    padding: '1.25rem 1rem', 
                    color: '#22d3ee', 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIdx) => (
                <tr key={rowIdx} style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.05)', 
                  transition: 'background 0.2s' 
                }} className="hover-row">
                  {row.map((cell, cellIdx) => {
                    const isDash = cell.trim() === '-';
                    // We want ALL values (both positive and negative) to be green, as they are buffs.
                    // Dashes can be red like the screenshot, or white. The user said "even negative dmg rec... should be in green too"
                    let color = '#fff';
                    if (cellIdx >= 2) {
                      if (isDash) {
                        color = '#ef4444'; // Red dash matching screenshot
                      } else {
                        color = '#10b981'; // Green for all numbers
                      }
                    }
                    
                    return (
                      <td key={cellIdx} style={{ 
                        padding: '1.25rem 1rem', 
                        color: color, 
                        fontSize: '0.9rem',
                        fontWeight: cellIdx < 2 ? 500 : 400
                      }}>
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default EchoPage;
