import React, { useState, useEffect } from 'react';
import { Swords } from 'lucide-react';
import { unitData } from '../assets/unit-data';

const formatName = (key) =>
  key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const calcRow = (unitKey, level, star) => {
  const u = unitData[unitKey];
  const levelCost = level > 0 ? u.level_cost.slice(0, level).reduce((a, b) => a + b, 0) : 0;
  const starCost  = star  > 0 ? u.star_cost.slice(0, star).reduce((a, b) => a + b, 0)   : 0;
  const statIncrease = level > 0 ? u.stat_increase.slice(0, level).reduce((a, b) => a + b, 0) : 0;

  let prot = 0, attack = 0;
  if (star > 0) {
    const total = u.blessing_increase.slice(0, star).reduce((a, b) => a + b, 0);
    if (u.blessing_type === 'protection' || u.blessing_type === 'both') prot = total;
    if (u.blessing_type === 'attack'     || u.blessing_type === 'both') attack = total;
  }

  return { levelCost, starCost, totalCost: levelCost + starCost, statIncrease, prot, attack };
};

const GloryPage = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `
      linear-gradient(to bottom, rgba(8,11,20,0.55) 0%, rgba(8,11,20,0.80) 55%, rgba(8,11,20,0.97) 100%),
      url('/glory_banner.webp')
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

  const keys = Object.keys(unitData);
  const [rows, setRows] = useState(keys.map(k => ({ key: k, level: 0, star: 0 })));
  const [strategy, setStrategy] = useState('attack');
  const [protWeight, setProtWeight] = useState(50);

  const update = (i, field, raw) => {
    let v = parseInt(raw) || 0;
    if (v < 0) v = 0;
    
    const next = [...rows];
    let row = { ...next[i] };
    row[field] = v;
    
    if (row.level > 50) row.level = 50;
    
    let maxStar = 5;
    if (row.level >= 50) maxStar = 10;
    else if (row.level >= 40) maxStar = 9;
    else if (row.level >= 30) maxStar = 7;
    
    if (row.star > maxStar) row.star = maxStar;
    
    next[i] = row;
    setRows(next);
  };

  const clear = () => setRows(keys.map(k => ({ key: k, level: 0, star: 0 })));
  const maximize = () => setRows(rows.map(r => ({ ...r, level: 50 })));

  const autoDistributeStars = () => {
    const totalBudget = rows.reduce((acc, r) => {
      const c = calcRow(r.key, r.level, r.star);
      return acc + c.totalCost;
    }, 0);

    let budget = totalBudget;
    
    const initialRows = rows.map(r => {
      const u = unitData[r.key];
      const levelCost = r.level > 0 ? u.level_cost.slice(0, r.level).reduce((a, b) => a + b, 0) : 0;
      budget -= levelCost;
      return { ...r, star: 0 };
    });

    if (budget <= 0) {
      setRows(initialRows);
      return;
    }

    let currentRows = [...initialRows];
    
    const getMaxStar = (level) => {
      if (level >= 50) return 10;
      if (level >= 40) return 9;
      if (level >= 30) return 7;
      return 5;
    };

    let canAffordAnything = true;

    while (canAffordAnything) {
      let bestUnitIndex = -1;
      let bestScore = -1;
      let fallbackUnitIndex = -1;
      let fallbackScore = -1;

      let totalAtt = 0;
      let totalProt = 0;
      if (strategy === 'custom') {
        currentRows.forEach(r => {
          const c = calcRow(r.key, r.level, r.star);
          totalAtt += c.attack;
          totalProt += c.prot;
        });
      }

      for (let i = 0; i < currentRows.length; i++) {
        const row = currentRows[i];
        const maxStar = getMaxStar(row.level);
        
        if (row.star < maxStar) {
          const u = unitData[row.key];
          const nextStarIndex = row.star; 
          const cost = u.star_cost[nextStarIndex];
          
          if (cost <= budget) {
            const statGain = u.blessing_increase[nextStarIndex];
            const type = u.blessing_type;
            
            let statGainAttack = 0;
            let statGainProt = 0;
            if (type === 'attack') statGainAttack = statGain;
            else if (type === 'protection') statGainProt = statGain;
            else if (type === 'both') {
              statGainAttack = statGain;
              statGainProt = statGain;
            }

            let primaryScore = 0;
            let secondaryScore = 0; // Raw efficiency fallback

            if (strategy === 'attack') {
              primaryScore = statGainAttack / cost;
            } else if (strategy === 'protection') {
              primaryScore = statGainProt / cost;
            } else if (strategy === 'custom') {
              let targetRatio = (100 - protWeight) / 100; // Attack ratio
              let currentRatio = (totalAtt + totalProt) === 0 ? 0.5 : totalAtt / (totalAtt + totalProt);
              
              // Ping-pong greedy algorithm:
              // If we are below the target attack ratio, strictly buy the best Attack upgrade.
              // If we are above, strictly buy the best Protection upgrade.
              if (currentRatio < targetRatio) {
                primaryScore = statGainAttack / cost;
              } else {
                primaryScore = statGainProt / cost;
              }
              
              // Fallback score in case we run out of units that give the stat we need
              secondaryScore = (statGainAttack + statGainProt) / cost;
            }

            if (primaryScore > 0 && primaryScore > bestScore) {
              bestScore = primaryScore;
              bestUnitIndex = i;
            }
            
            if (secondaryScore > 0 && secondaryScore > fallbackScore) {
              fallbackScore = secondaryScore;
              fallbackUnitIndex = i;
            }
          }
        }
      }

      if (bestUnitIndex !== -1) {
        const u = unitData[currentRows[bestUnitIndex].key];
        const nextStarIndex = currentRows[bestUnitIndex].star;
        budget -= u.star_cost[nextStarIndex];
        currentRows[bestUnitIndex].star += 1;
      } else if (strategy === 'custom' && fallbackUnitIndex !== -1) {
        // We ran out of upgrades for the specific stat we needed to fix the ratio, 
        // but we still have budget, so just buy the most efficient upgrade left.
        const u = unitData[currentRows[fallbackUnitIndex].key];
        const nextStarIndex = currentRows[fallbackUnitIndex].star;
        budget -= u.star_cost[nextStarIndex];
        currentRows[fallbackUnitIndex].star += 1;
      } else {
        canAffordAnything = false;
      }
    }

    setRows(currentRows);
  };

  const totals = rows.reduce((acc, r) => {
    const c = calcRow(r.key, r.level, r.star);
    acc.stat   += c.statIncrease;
    acc.cost   += c.totalCost;
    acc.prot   += c.prot;
    acc.attack += c.attack;
    return acc;
  }, { stat: 0, cost: 0, prot: 0, attack: 0 });

  return (
    <div className="calc-page fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <header className="page-header">
          <h1 className="page-title"><Swords size={32} /> Glory Calculator</h1>
        </header>

        <div className="card" style={{ padding: '1.5rem' }}>
          
          {/* Controls - Moved to Top */}
          <div className="glory-controls" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button className="btn-secondary" onClick={clear}>Clear All</button>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Current Total Glory</span>
                <span className="text-gold" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totals.cost.toLocaleString()}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select 
                className="field-select" 
                value={strategy} 
                onChange={(e) => setStrategy(e.target.value)}
                style={{ width: 'auto', padding: '0.6rem 2.5rem 0.6rem 1rem', margin: 0 }}
              >
                <option value="attack">Max Attack</option>
                <option value="protection">Max Protection</option>
                <option value="custom">Custom Split (Approx)</option>
              </select>

              {strategy === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold' }}>{protWeight}% PROT</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={protWeight} 
                    onChange={e => setProtWeight(Number(e.target.value))} 
                    style={{ width: '100px', accentColor: 'var(--cyan)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', fontWeight: 'bold' }}>{100 - protWeight}% ATT</span>
                </div>
              )}
              
              <button className="btn-primary" onClick={autoDistributeStars} style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Auto-Distribute Stars
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Unit Type</th>
                  <th style={{ width: 90 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      Level
                      <button 
                        onClick={maximize} 
                        style={{ 
                          background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', 
                          color: 'var(--cyan)', fontSize: '0.65rem', padding: '0.1rem 0.4rem', 
                          borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s',
                          textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(34,211,238,0.2)'; e.target.style.borderColor = 'var(--cyan)'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(34,211,238,0.1)'; e.target.style.borderColor = 'rgba(34,211,238,0.3)'; }}
                      >
                        Max All
                      </button>
                    </div>
                  </th>
                  <th style={{ width: 90 }}>Stars</th>
                  <th>Stats ↑</th>
                  <th>Glory Cost</th>
                  <th>Protection</th>
                  <th>Attack</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const c = calcRow(r.key, r.level, r.star);
                  return (
                    <tr key={r.key}>
                      <td className="text-muted" style={{ fontSize: '0.8rem' }}>{i + 1}</td>
                      <td className="font-heading" style={{ fontSize: '0.88rem', letterSpacing: '0.5px' }}>
                        {formatName(r.key)}
                      </td>
                      <td>
                        <input
                          type="number" min="0" max="50"
                          className="mini-input"
                          value={r.level || ''}
                          placeholder="0"
                          onChange={e => update(i, 'level', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number" min="0" max="10"
                          className="mini-input"
                          value={r.star || ''}
                          placeholder="0"
                          onChange={e => update(i, 'star', e.target.value)}
                        />
                      </td>
                      <td className="text-green">{c.statIncrease.toFixed(2)}%</td>
                      <td className="text-gold">{c.totalCost.toLocaleString()}</td>
                      <td className="text-muted">{c.prot.toFixed(2)}%</td>
                      <td className="text-muted">{c.attack.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right font-heading" style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    Totals
                  </td>
                  <td className="text-green" style={{ fontWeight: 700 }}>{totals.stat.toFixed(2)}%</td>
                  <td className="text-gold" style={{ fontWeight: 700 }}>{totals.cost.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{totals.prot.toFixed(2)}%</td>
                  <td style={{ fontWeight: 600 }}>{totals.attack.toFixed(2)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GloryPage;
