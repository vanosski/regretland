import React, { useState, useEffect, useMemo } from 'react';
import { Crown, CheckCircle2, Circle } from 'lucide-react';
import { plannerData } from '../data/ceremonyData';
import '../index.css';

const CeremonyPage = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `
        linear-gradient(to bottom, rgba(8,11,20,0.60) 0%, rgba(8,11,20,0.85) 50%, rgba(8,11,20,0.98) 100%),
        url('/ceremony_banner.png')
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

  const [goal, setGoal] = useState(8300);
  const [selectedItems, setSelectedItems] = useState(() => {
    const initial = new Set();
    // Default check all daily tasks
    Object.values(plannerData.daily_tasks).forEach(dayTasks => {
      dayTasks.forEach(t => {
        initial.add(t.id);
      });
    });
    // Default check some milestones
    ['Glory Badge Tasks', 'Resource Tasks'].forEach(cat => {
      if (plannerData.milestone_tasks[cat]) {
        plannerData.milestone_tasks[cat].forEach(t => {
          initial.add(t.id);
        });
      }
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState('daily');
  const [activeDay, setActiveDay] = useState('1');
  const [buffEnabled, setBuffEnabled] = useState(false);

  const toggleItem = (id, isChest = false) => {
    if (isChest) return; // Chests are auto-unlocked
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Calculate auto-chests
  const completedDailyTasksByDay = useMemo(() => {
    const counts = {};
    for (let d = 1; d <= 7; d++) {
      let count = 0;
      (plannerData.daily_tasks[d] || []).forEach(t => {
        if (!t.is_passive && selectedItems.has(t.id)) count++;
      });
      counts[d] = count;
    }
    return counts;
  }, [selectedItems]);

  const earnedChests = useMemo(() => {
    const earned = new Set();
    for (let d = 1; d <= 7; d++) {
      (plannerData.daily_chests[d] || []).forEach(c => {
        if (completedDailyTasksByDay[d] >= c.req) {
          earned.add(c.id);
        }
      });
    }
    return earned;
  }, [completedDailyTasksByDay]);

  // Calculate Totals
  const { totalDrops, dailyMonsterDrops, missingDrops } = useMemo(() => {
    let sum = 0;
    
    // Sum selected daily tasks
    Object.values(plannerData.daily_tasks).forEach(dayTasks => {
      dayTasks.forEach(t => {
        if (selectedItems.has(t.id)) sum += t.drops;
      });
    });
    // Sum earned chests
    Object.values(plannerData.daily_chests).forEach(dayChests => {
      dayChests.forEach(c => {
        if (earnedChests.has(c.id)) sum += c.drops;
      });
    });
    // Sum selected milestones
    Object.values(plannerData.milestone_tasks).forEach(catTasks => {
      catTasks.forEach(t => {
        if (selectedItems.has(t.id)) sum += t.drops;
      });
    });

    if (goal >= 6600 && buffEnabled) {
      sum += 150;
    }

    const missing = Math.max(0, goal - sum);
    const dailyMonster = Math.ceil(missing / 7);

    return { totalDrops: sum, dailyMonsterDrops: dailyMonster, missingDrops: missing };
  }, [selectedItems, earnedChests, goal, buffEnabled]);

  const renderDailyTasks = () => {
    const tasks = plannerData.daily_tasks[activeDay] || [];
    const chests = plannerData.daily_chests[activeDay] || [];
    
    let dayTotal = 0;
    tasks.forEach(t => {
      if (selectedItems.has(t.id)) dayTotal += t.drops;
    });
    chests.forEach(c => {
      if (earnedChests.has(c.id)) dayTotal += c.drops;
    });

    return (
      <div className="task-list" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 600 }}>Day {activeDay}</h2>
          <span style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 700 }}>{dayTotal} Drops</span>
        </div>
        
        {tasks.map(t => (
          <div key={t.id} 
               onClick={() => toggleItem(t.id)}
               style={{
                 display: 'flex', alignItems: 'center', padding: '1rem',
                 background: selectedItems.has(t.id) ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.03)',
                 border: `1px solid ${selectedItems.has(t.id) ? 'rgba(34, 211, 238, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                 borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
               }}>
            <div style={{ marginRight: '1rem', color: selectedItems.has(t.id) ? '#22d3ee' : '#6b7280' }}>
              {selectedItems.has(t.id) ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#fff', fontSize: '0.95rem' }}>{t.desc}</p>
            </div>
            <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>
              +{t.drops} Drops
            </div>
          </div>
        ))}

        {chests.length > 0 && (
          <>
            <div style={{ margin: '1.5rem 0 0.5rem', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 600 }}>
              Chests (Auto-Unlocked based on daily tasks)
            </div>
            {chests.map((c, idx) => {
              const isEarned = earnedChests.has(c.id);
              return (
                <div key={c.id} 
                     style={{
                       display: 'flex', alignItems: 'center', padding: '1rem',
                       background: isEarned ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.03)',
                       border: `1px solid ${isEarned ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                       borderRadius: '8px', opacity: isEarned ? 1 : 0.6
                     }}>
                  <div style={{ marginRight: '1rem', color: isEarned ? '#fbbf24' : '#6b7280' }}>
                    {isEarned ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#fff', fontSize: '0.95rem' }}>Chest {idx + 1} (Needs {c.req} tasks)</p>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>
                    +{c.drops} Drops
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  const renderMilestones = () => {
    const priorityOrder = ["Lion Skill Tasks", "Gold Tasks", "Adv Recruitment Tasks"];
    const categories = Object.keys(plannerData.milestone_tasks).sort((a, b) => {
        const indexA = priorityOrder.indexOf(a);
        const indexB = priorityOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {categories.map(cat => (
          <div key={cat} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#22d3ee', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>{cat}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {plannerData.milestone_tasks[cat].map(t => (
                <div key={t.id} 
                     onClick={() => toggleItem(t.id)}
                     style={{
                       display: 'flex', alignItems: 'flex-start', padding: '0.75rem',
                       background: selectedItems.has(t.id) ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.03)',
                       border: `1px solid ${selectedItems.has(t.id) ? 'rgba(34, 211, 238, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                       borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                     }}>
                  <div style={{ marginRight: '0.75rem', marginTop: '2px', color: selectedItems.has(t.id) ? '#22d3ee' : '#6b7280' }}>
                    {selectedItems.has(t.id) ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#fff', fontSize: '0.85rem', lineHeight: 1.4 }}>{t.desc}</p>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                    +{t.drops}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calc-page fade-in-up" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Crown size={32} color="#fbbf24" /> Ceremony Planner
        </h1>
        <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem', textAlign: 'center' }}>
          Smartly calculate and plan your tasks for the Ceremony event.
        </p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Sidebar Dashboard */}
        <div className="card" style={{ 
          flex: '1 1 350px',
          padding: '2rem', 
          background: 'rgba(0, 0, 0, 0.45)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          position: 'sticky',
          top: '100px'
        }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Target Milestone
            </label>
            <div className="glass-select-container" style={{ margin: 0, width: '100%' }}>
              <select 
                className="glass-select" 
                value={goal} 
                onChange={(e) => setGoal(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem 1rem' }}
              >
                {plannerData.goals.map(g => (
                  <option key={g} value={g}>{g.toLocaleString()} Drops</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>Tasks & Chest Drops</span>
              <span style={{ color: '#22d3ee', fontSize: '1.2rem', fontWeight: 700 }}>{totalDrops.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>Missing Drops</span>
              <span style={{ color: missingDrops === 0 ? '#10b981' : '#f59e0b', fontSize: '1.2rem', fontWeight: 700 }}>{missingDrops.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span style={{ color: '#10b981', fontSize: '0.95rem', fontWeight: 600 }}>Daily Monster Drops</span>
              <span style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: 800 }}>{dailyMonsterDrops.toLocaleString()}</span>
            </div>
          </div>

          {goal >= 6600 && (
            <div 
              onClick={() => setBuffEnabled(!buffEnabled)}
              style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: buffEnabled ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${buffEnabled ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', cursor: 'pointer', marginBottom: '2rem', transition: 'all 0.2s' }}
            >
              <div style={{ marginRight: '1rem', color: buffEnabled ? '#a78bfa' : '#6b7280' }}>
                {buffEnabled ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
              <div style={{ flex: 1, color: '#fff', fontSize: '0.95rem' }}>5400 Buff</div>
              <div style={{ color: '#a78bfa', fontWeight: 600 }}>+150</div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>
              <span>Progress</span>
              <span>{Math.min(100, Math.round((totalDrops / goal) * 100))}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(100, (totalDrops / goal) * 100)}%`, 
                background: totalDrops >= goal ? '#10b981' : 'linear-gradient(90deg, #22d3ee, #a78bfa)',
                transition: 'width 0.3s ease, background 0.3s ease'
              }} />
            </div>
          </div>

        </div>

        {/* Main Area */}
        <div className="card" style={{ 
          flex: '3 1 600px',
          padding: '2rem', 
          background: 'rgba(0, 0, 0, 0.45)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minHeight: '600px'
        }}>
          
          {/* Custom Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <button 
              onClick={() => setActiveTab('daily')}
              style={{
                background: 'transparent', border: 'none', color: activeTab === 'daily' ? '#22d3ee' : '#9ca3af',
                fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem',
                borderBottom: activeTab === 'daily' ? '2px solid #22d3ee' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Daily Tasks
            </button>
            <button 
              onClick={() => setActiveTab('milestone')}
              style={{
                background: 'transparent', border: 'none', color: activeTab === 'milestone' ? '#22d3ee' : '#9ca3af',
                fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem',
                borderBottom: activeTab === 'milestone' ? '2px solid #22d3ee' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Ceremony Tasks
            </button>
          </div>

          {activeTab === 'daily' && (
            <div>
              <div className="glass-select-container" style={{ margin: 0, width: '200px' }}>
                <select 
                  className="glass-select" 
                  value={activeDay} 
                  onChange={(e) => setActiveDay(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem' }}
                >
                  {[1,2,3,4,5,6,7].map(d => (
                    <option key={d} value={d}>Day {d}</option>
                  ))}
                </select>
              </div>
              
              {renderDailyTasks()}
            </div>
          )}

          {activeTab === 'milestone' && (
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '1rem' }}>Select the one-time milestone tasks you plan to complete.</p>
              {renderMilestones()}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CeremonyPage;
