import React, { useState, useEffect } from 'react';
import { Gem } from 'lucide-react';

const GEM_COSTS = {
  infAttack: 45, cavAttack: 55, archAttack: 55, siegeAttack: 65,
  infHealth: 65, cavHealth: 50, archHealth: 50, siegeHealth: 55,
  infDmg: 55, cavDmg: 65, archDmg: 65, siegeDmg: 75,
  infDmgRcv: 75, cavDmgRcv: 60, archDmgRcv: 60, siegeDmgRcv: 65,
  troopAttack: 75, troopHealth: 75, troopDmg: 85, troopDmgRcv: 85,
};

const GEM_LABELS = {
  infAttack: 'Infantry Attack', cavAttack: 'Cavalry Attack',
  archAttack: 'Archer Attack', siegeAttack: 'Siege Attack',
  infHealth: 'Infantry Health', cavHealth: 'Cavalry Health',
  archHealth: 'Archer Health', siegeHealth: 'Siege Health',
  infDmg: 'Infantry Damage', cavDmg: 'Cavalry Damage',
  archDmg: 'Archer Damage', siegeDmg: 'Siege Damage',
  infDmgRcv: 'Infantry Dmg Received', cavDmgRcv: 'Cavalry Dmg Received',
  archDmgRcv: 'Archer Dmg Received', siegeDmgRcv: 'Siege Dmg Received',
  troopAttack: 'Troop Attack', troopHealth: 'Troop Health',
  troopDmg: 'Troop Damage', troopDmgRcv: 'Troop Dmg Received',
};

const GemsPage = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `
        linear-gradient(to bottom, rgba(8,11,20,0.60) 0%, rgba(8,11,20,0.85) 50%, rgba(8,11,20,0.98) 100%),
        url('/gems_banner.png')
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

  const [gemType, setGemType] = useState('infAttack');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [desiredLevel, setDesiredLevel] = useState(5);
  const [level1Gems, setLevel1Gems] = useState(0);
  const [numGems, setNumGems] = useState(1);
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();

    if (currentLevel < 1 || desiredLevel < 1 || currentLevel > desiredLevel) {
      alert('Current level must be ≥ 1 and ≤ desired level.');
      return;
    }

    const cost1 = GEM_COSTS[gemType] || 0;
    const needed   = Math.pow(3, desiredLevel - 1) - Math.pow(3, currentLevel - 1);
    const totalNeeded = needed * numGems;
    const toBuy   = Math.max(0, totalNeeded - level1Gems);
    const totalCost = toBuy * cost1;

    setResult({ gemType, currentLevel, desiredLevel, numGems, totalNeeded, toBuy, totalCost });
  };

  return (
    <div className="calc-page fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <header className="page-header">
          <h1 className="page-title"><Gem size={32} /> Gem Calculator</h1>
        </header>

        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <form onSubmit={calculate}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="field-group">
                <label className="field-label">Select Gem Type</label>
                <select className="field-select" value={gemType}
                  onChange={e => { setGemType(e.target.value); setResult(null); }}>
                  {Object.entries(GEM_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Current Level of Gem</label>
                <input className="field-input" type="number" value={currentLevel} min="1"
                  onChange={e => { setCurrentLevel(Number(e.target.value)); setResult(null); }} required />
              </div>

              <div className="field-group">
                <label className="field-label">Desired Level</label>
                <input className="field-input" type="number" value={desiredLevel} min="1"
                  onChange={e => { setDesiredLevel(Number(e.target.value)); setResult(null); }} required />
              </div>

              <div className="field-group">
                <label className="field-label">Number of Level 1 Gems Available</label>
                <input className="field-input" type="number" value={level1Gems} min="0"
                  onChange={e => { setLevel1Gems(Number(e.target.value)); setResult(null); }} required />
              </div>

              <div className="field-group">
                <label className="field-label">Number of Gems to Upgrade</label>
                <input className="field-input" type="number" value={numGems} min="1"
                  onChange={e => { setNumGems(Number(e.target.value)); setResult(null); }} required />
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.9rem 2.5rem', width: '100%' }}>
                Calculate Upgrade Cost
              </button>
            </div>
          </form>

          {result && (
            <div className="result-card" style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '1px' }}>
                <Gem size={24} /> {GEM_LABELS[result.gemType]} &nbsp;|&nbsp; Lv {result.currentLevel} → Lv {result.desiredLevel}
              </h3>
              {result.toBuy === 0 ? (
                <p style={{ marginTop: '1rem', color: '#10b981', fontStyle: 'italic', fontWeight: 600 }}>
                  ✓ You have enough gems — no additional cost needed.
                </p>
              ) : (
                <div className="summary-stats" style={{ marginBottom: 0 }}>
                  <div className="stat-card">
                    <div className="stat-value">{result.toBuy.toLocaleString()}</div>
                    <div className="stat-label">Lvl 1 Gems to Buy</div>
                  </div>

                  <div className="stat-card" style={{ borderLeftColor: 'var(--secondary)' }}>
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>{result.totalCost.toLocaleString()}</div>
                    <div className="stat-label">Estimated Cost (Coins)</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GemsPage;
