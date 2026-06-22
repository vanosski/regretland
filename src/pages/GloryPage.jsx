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
        linear-gradient(to bottom, rgba(8,11,20,0.40) 0%, rgba(8,11,20,0.72) 50%, rgba(8,11,20,0.97) 100%),
        url('/glory_banner.png')
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
  const [gloryBalance, setGloryBalance] = useState('');

  const update = (i, field, raw) => {
    let v = parseInt(raw) || 0;
    if (v < 0) v = 0;
    if (field === 'level' && v > 50) v = 50;
    if (field === 'star'  && v > 10) v = 10;
    const next = [...rows];
    next[i] = { ...next[i], [field]: v };
    setRows(next);
  };

  const clear = () => setRows(keys.map(k => ({ key: k, level: 0, star: 0 })));
  const maximize = () => setRows(keys.map(k => ({ key: k, level: 50, star: 10 })));

  const totals = rows.reduce((acc, r) => {
    const c = calcRow(r.key, r.level, r.star);
    acc.stat   += c.statIncrease;
    acc.cost   += c.totalCost;
    acc.prot   += c.prot;
    acc.attack += c.attack;
    return acc;
  }, { stat: 0, cost: 0, prot: 0, attack: 0 });

  const balance = (Number(gloryBalance) || 0) - totals.cost;

  return (
    <div className="calc-page fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        <header className="page-header">
          <h1 className="page-title"><Swords size={32} /> Glory Calculator</h1>
        </header>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Unit Type</th>
                  <th style={{ width: 90 }}>Level</th>
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

          {/* Controls */}
          <div className="glory-controls">
            <div className="glory-balance-block">
              <div className="field-group">
                <label className="field-label">Your Glory Balance</label>
                <input
                  className="field-input"
                  type="number"
                  placeholder="0"
                  value={gloryBalance}
                  onChange={e => setGloryBalance(e.target.value)}
                />
              </div>
            </div>
            <div className="glory-leftover-block">
              <div className="field-label" style={{ marginBottom: '0.5rem' }}>Left Over</div>
              <div className={`big-value ${balance < 0 ? 'text-red' : 'text-green'}`}>
                {balance.toLocaleString()}
              </div>
            </div>
            <div className="glory-actions">
              <button className="btn-secondary" onClick={clear}>Clear</button>
              <button className="btn-primary" onClick={maximize}>Maximize</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GloryPage;
