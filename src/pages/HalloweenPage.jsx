import React, { useState, useEffect, useMemo } from 'react';
import { Ghost, CheckCircle2, Circle } from 'lucide-react';
import {
  stages,
  PRESETS,
  presetOptions,
  TARGET_OPTIONS,
  DEFAULT_TARGET,
  SWORD_TO_PUMPKIN,
  EVENT_DAYS,
} from '../data/halloweenData';
import '../index.css';

const PUMPKIN = '#f97316';
const VIOLET = '#7c3aed';
const EMERALD = '#10b981';

const panelStyle = {
  padding: '2rem',
  background: 'rgba(6, 8, 20, 0.82)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.14)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
};

const metricRow = (label, value, color, bg) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: bg || 'rgba(255,255,255,0.06)',
      borderRadius: '8px',
      border: `1px solid ${bg ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
    }}
  >
    <span style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{label}</span>
    <span style={{ color, fontSize: '1.2rem', fontWeight: 700 }}>{value}</span>
  </div>
);

const HalloweenPage = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `
      radial-gradient(circle at 15% 5%, rgba(124,58,237,0.35) 0%, transparent 45%),
      radial-gradient(circle at 85% 90%, rgba(249,115,22,0.28) 0%, transparent 50%),
      linear-gradient(to bottom, rgba(8,11,20,0.90) 0%, rgba(8,11,20,0.98) 100%)
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

  const [target, setTarget] = useState(String(DEFAULT_TARGET));
  const [customTarget, setCustomTarget] = useState('');
  const [selected, setSelected] = useState(() => new Set(PRESETS.stamina_grind.ids));
  const [activeStage, setActiveStage] = useState(1);
  const [activePreset, setActivePreset] = useState('stamina_grind');

  const goal = target === 'custom' ? Math.max(0, parseInt(customTarget, 10) || 0) : Number(target);

  const toggleTask = id => {
    setActivePreset(null);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const applyPreset = key => {
    setActivePreset(key);
    setSelected(new Set(PRESETS[key].ids));
  };

  const { pumpkins, swords, swordPumpkins, total, missing, monsterNeeded, dailyNeeded, checkedCount } =
    useMemo(() => {
      let p = 0;
      let s = 0;
      let count = 0;
      stages.forEach(stage => {
        stage.tasks.forEach(t => {
          if (selected.has(t.id)) {
            p += t.pumpkins;
            s += t.swords;
            count += 1;
          }
        });
      });
      const sp = s * SWORD_TO_PUMPKIN;
      const combined = p + sp;
      const miss = Math.max(0, goal - combined);
      const monster = Math.ceil(miss / SWORD_TO_PUMPKIN);
      const daily = Math.round(monster / EVENT_DAYS);
      return {
        pumpkins: p,
        swords: s,
        swordPumpkins: sp,
        total: combined,
        missing: miss,
        monsterNeeded: monster,
        dailyNeeded: daily,
        checkedCount: count,
      };
    }, [selected, goal]);

  const progress = goal > 0 ? Math.min(100, (total / goal) * 100) : 0;

  const stage = stages.find(s => s.id === activeStage);
  const stageTotals = stage.tasks.reduce(
    (acc, t) => {
      if (selected.has(t.id)) {
        acc.pumpkins += t.pumpkins;
        acc.swords += t.swords;
        acc.count += 1;
      }
      return acc;
    },
    { pumpkins: 0, swords: 0, count: 0 }
  );

  const renderTask = t => {
    const isOn = selected.has(t.id);
    const isMilestone = t.category === 'Milestone';
    return (
      <div
        key={t.id}
        onClick={() => toggleTask(t.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: isMilestone ? '0.9rem 1rem' : '0.75rem 1rem',
          background: isOn
            ? isMilestone
              ? 'rgba(124,58,237,0.20)'
              : 'rgba(249,115,22,0.16)'
            : 'rgba(255,255,255,0.06)',
          border: `1px solid ${
            isOn
              ? isMilestone
                ? 'rgba(124,58,237,0.5)'
                : 'rgba(249,115,22,0.45)'
              : 'rgba(255,255,255,0.14)'
          }`,
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: isOn ? `0 0 14px ${isMilestone ? 'rgba(124,58,237,0.25)' : 'rgba(249,115,22,0.22)'}` : 'none',
        }}
      >
        <span style={{ color: isOn ? (isMilestone ? VIOLET : PUMPKIN) : '#6b7280', display: 'flex' }}>
          {isOn ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: '#fff', fontSize: '0.92rem', lineHeight: 1.4 }}>{t.desc}</p>
          {isMilestone && (
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#a78bfa',
                fontWeight: 700,
              }}
            >
              Milestone
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ color: PUMPKIN, fontWeight: 700, fontSize: '0.88rem' }}>+{t.pumpkins} 🎃</span>
          <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.88rem' }}>+{t.swords} ⚔️</span>
        </div>
      </div>
    );
  };

  const activityTasks = stage.tasks.filter(t => t.category === 'Activity');
  const milestoneTasks = stage.tasks.filter(t => t.category === 'Milestone');

  return (
    <div className="calc-page fade-in-up" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Ghost size={32} color={PUMPKIN} /> Halloween Planner
        </h1>
        <p style={{ color: 'var(--text-dim, #9ca3af)', marginTop: '0.5rem', textAlign: 'center' }}>
          🎃 Turn task rewards into a daily monster-slaying schedule — {EVENT_DAYS} days, 5 stages, 1 goal.
        </p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Sticky Dashboard */}
        <div className="card" style={{ ...panelStyle, flex: '1 1 340px', position: 'sticky', top: '100px', marginBottom: 0 }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                color: '#9ca3af',
                marginBottom: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Target Milestone
            </label>
            <div className="glass-select-container" style={{ margin: 0, width: '100%' }}>
              <select
                className="glass-select"
                value={target}
                onChange={e => setTarget(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 1rem', fontSize: '0.95rem' }}
              >
                {TARGET_OPTIONS.map(t => (
                  <option key={t} value={String(t)}>
                    {t.toLocaleString()} Pumpkins
                  </option>
                ))}
                <option value="custom">Custom…</option>
              </select>
            </div>
            {target === 'custom' && (
              <input
                className="field-input"
                type="number"
                min="0"
                placeholder="Enter pumpkin goal"
                value={customTarget}
                onChange={e => setCustomTarget(e.target.value)}
                style={{ marginTop: '0.6rem', padding: '0.6rem 0.85rem' }}
              />
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                display: 'block',
                color: '#9ca3af',
                marginBottom: '0.6rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Quick Presets
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {presetOptions.map(p => {
                const isActive = activePreset === p.key;
                const isClear = p.key === 'clear_all';
                const color = isClear ? '#f87171' : p.key === 'select_all' ? VIOLET : PUMPKIN;
                return (
                  <button
                    key={p.key}
                    onClick={() => applyPreset(p.key)}
                    style={{
                      background: isActive ? `${color}2e` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.16)'}`,
                      color: isActive ? color : '#d1d5db',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? `0 0 12px ${color}40` : 'none',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {metricRow('Direct Task Pumpkins', `${pumpkins.toLocaleString()} 🎃`, PUMPKIN)}
            {metricRow(
              'Task Swords Earned',
              `${swords.toLocaleString()} ⚔️  (+${swordPumpkins.toLocaleString()} 🎃)`,
              '#94a3b8'
            )}
            {metricRow(
              'Pumpkin Deficit',
              missing === 0 ? '0 🎃 — Goal Met!' : `${missing.toLocaleString()} 🎃`,
              missing === 0 ? EMERALD : '#fbbf24'
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.1rem',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.20), rgba(16,185,129,0.08))',
                borderRadius: '8px',
                border: `1px solid ${missing === 0 ? 'rgba(16,185,129,0.5)' : 'rgba(251,191,36,0.45)'}`,
              }}
            >
              <div>
                <span style={{ color: '#d1d5db', fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>
                  Daily Monster Swords
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  over {EVENT_DAYS} days
                </span>
              </div>
              <span
                style={{
                  color: missing === 0 ? EMERALD : '#fbbf24',
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  textShadow: missing === 0 ? '0 0 16px rgba(16,185,129,0.6)' : '0 0 16px rgba(251,191,36,0.5)',
                }}
              >
                {dailyNeeded.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.25rem', color: '#6b7280', fontSize: '0.75rem' }}>
              <span>Total Monster Swords: {monsterNeeded.toLocaleString()}</span>
              <span>
                {checkedCount}/{stages.reduce((n, s) => n + s.tasks.length, 0)} tasks
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>
              <span>Progress</span>
              <span style={{ color: PUMPKIN, fontWeight: 700 }}>
                {total.toLocaleString()} / {goal.toLocaleString()} ({Math.round(progress)}%)
              </span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background:
                    progress >= 100
                      ? EMERALD
                      : `linear-gradient(90deg, ${PUMPKIN}, ${VIOLET})`,
                  transition: 'width 0.3s ease, background 0.3s ease',
                  boxShadow: `0 0 12px ${progress >= 100 ? EMERALD : PUMPKIN}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Task Panel */}
        <div className="card" style={{ ...panelStyle, flex: '3 1 600px', marginBottom: 0, minHeight: '600px' }}>
          <div className="tabs" style={{ marginBottom: '1.5rem' }}>
            {stages.map(s => (
              <button
                key={s.id}
                className={`tab-btn ${activeStage === s.id ? 'active' : ''}`}
                onClick={() => setActiveStage(s.id)}
                style={
                  activeStage === s.id
                    ? {
                        background: 'rgba(249,115,22,0.15)',
                        borderColor: PUMPKIN,
                        color: PUMPKIN,
                        boxShadow: `0 0 15px ${PUMPKIN}50`,
                      }
                    : undefined
                }
              >
                Stage {s.id}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#fff', fontWeight: 700 }}>
                Stage {stage.id}: {stage.name}
              </h2>
              <span style={{ color: '#6b7280', fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {stageTotals.count}/{stage.tasks.length} tasks checked
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.95rem', fontWeight: 700 }}>
              <span style={{ color: PUMPKIN }}>+{stageTotals.pumpkins.toLocaleString()} 🎃</span>
              <span style={{ color: '#94a3b8' }}>+{stageTotals.swords.toLocaleString()} ⚔️</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {activityTasks.map(renderTask)}

            <div
              style={{
                margin: '1rem 0 0.25rem',
                color: '#a78bfa',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '2px',
                fontWeight: 700,
              }}
            >
              Heavy Investment Milestones
            </div>
            {milestoneTasks.map(renderTask)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalloweenPage;
