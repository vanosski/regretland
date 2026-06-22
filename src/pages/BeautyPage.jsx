import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import globalData from '../data/beauty_stats.json';

const BEAUTY_BG = {
  "Chang'e":    '/change.png',
  'Azai Chacha':'/azai_chacha.png',
  'Helen':      '/helen.png',
  'Statila':    '/statila.png',
  'Wajit':      '/wajit.png',
};

const RARITY_ORDER = ["Common", "Uncommon", "Rare", "Epic", "Gold", "Mythic"];

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const BeautyPage = () => {
    const beauties = Object.keys(globalData);
    const [activeTab, setActiveTab] = useState(beauties[0] || '');
    const [activeDressIndex, setActiveDressIndex] = useState(0);

    const handleTabChange = (beauty) => {
        setActiveTab(beauty);
        setActiveDressIndex(0); // Reset dress index when switching characters
    };

    const activeDresses = globalData[activeTab] || [];

    // Set character image as the full document body background
    useEffect(() => {
        const img = BEAUTY_BG[activeTab];
        if (img) {
            document.body.style.backgroundImage = `
                linear-gradient(to bottom, rgba(8,11,20,0.55) 0%, rgba(8,11,20,0.80) 55%, rgba(8,11,20,0.97) 100%),
                url(${img})
            `;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center top';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.transition = 'background-image 0.5s ease';
        }
        return () => {
            // Restore default on unmount
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundAttachment = '';
        };
    }, [activeTab]);

    const renderDress = (dress) => {
        // Extract all unique stat keys across all rarities
        const allStatKeys = new Set();
        RARITY_ORDER.forEach(rarity => {
            const levelData = dress.levels[rarity];
            if (levelData && levelData.stats) {
                levelData.stats.forEach(stat => {
                    allStatKeys.add(`${stat.buff_name}||${stat.unlock_lv}||${stat.is_percent}`);
                });
            }
        });

        const statKeysArray = Array.from(allStatKeys);
        const costTypes = [
            { name: "Dress Fragments", idCheck: (id) => id !== 4110027 && id !== 4110028 },
            { name: "Golden Fleece", idCheck: (id) => id === 4110027 },
            { name: "Silk", idCheck: (id) => id === 4110028 }
        ];

        return (
            <div key={dress.id} className="dress-section">
                <div className="dress-header">
                    <h2>{dress.name} <span className="dress-id">ID: {dress.id}</span></h2>
                </div>
                <div className="table-container" style={{ maxHeight: 'none' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Stat / Upgrade Cost</th>
                                {RARITY_ORDER.map(rarity => (
                                    <th key={rarity} className={`rarity-${rarity.toLowerCase()}`}>{rarity}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {statKeysArray.map(key => {
                                const [buffName, unlockLv, isPercentStr] = key.split('||');
                                const isPercent = isPercentStr === '1';

                                return (
                                    <tr key={key}>
                                        <td>
                                            <div className="stat-name">{buffName}</div>
                                            <div className="stat-unlock">Intimacy Unlocks @ {unlockLv}</div>
                                        </td>
                                        {RARITY_ORDER.map(rarity => {
                                            const levelData = dress.levels[rarity];
                                            let cellVal = '-';
                                            if (levelData && levelData.stats) {
                                                const matchingStat = levelData.stats.find(s => s.buff_name === buffName && s.unlock_lv.toString() === unlockLv);
                                                if (matchingStat) {
                                                    const val = matchingStat.value;
                                                    const suffix = isPercent ? '%' : '';
                                                    cellVal = `+${val.toLocaleString()}${suffix}`;
                                                }
                                            }
                                            return <td key={rarity}><span className="stat-val">{cellVal}</span></td>;
                                        })}
                                    </tr>
                                );
                            })}
                            
                            <tr>
                                <td colSpan={RARITY_ORDER.length + 1} style={{ borderBottom: '2px dashed var(--border-color)', padding: '1.5rem 1rem 0.5rem', color: 'var(--gold)', fontFamily: "'Outfit', sans-serif" }}>
                                    UPGRADE COSTS TO REACH LEVEL
                                </td>
                            </tr>

                            {costTypes.map((costType, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="stat-name" style={{ color: 'var(--text-secondary)' }}>{costType.name}</div>
                                    </td>
                                    {RARITY_ORDER.map(rarity => {
                                        const levelData = dress.levels[rarity];
                                        let cellVal = '-';
                                        if (levelData && levelData.costs) {
                                            const matchingCost = levelData.costs.find(c => costType.idCheck(c.param_0));
                                            if (matchingCost) {
                                                cellVal = matchingCost.param_1.toLocaleString();
                                            } else if (rarity === "Common") {
                                                cellVal = "Base";
                                            }
                                        }
                                        return <td key={rarity}><span className="stat-val" style={{ color: 'var(--text-primary)' }}>{cellVal}</span></td>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="beauty-page fade-in-up">

            <header className="page-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ color: 'var(--primary)', textShadow: 'var(--shadow-neon)' }}><Wand2 size={32} /> Beauty Manor</h1>
            </header>

            <div className="beauty-tabs">
                {beauties.map(beauty => (
                    <button 
                        key={beauty} 
                        className={`tab-btn ${activeTab === beauty ? 'active' : ''}`}
                        onClick={() => handleTabChange(beauty)}
                    >
                        {beauty}
                    </button>
                ))}
            </div>

            {activeDresses.length > 1 && (
                <div className="beauty-sub-tabs" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '5px' }}>
                    {activeDresses.map((dress, idx) => (
                        <button 
                            key={idx}
                            className={`tab-btn ${activeDressIndex === idx ? 'active' : ''}`}
                            onClick={() => setActiveDressIndex(idx)}
                            style={{ padding: '0.4rem 1.2rem', fontSize: '0.9rem' }}
                        >
                            Dress {ROMAN_NUMERALS[idx] || (idx + 1)}
                        </button>
                    ))}
                </div>
            )}

            <div className="content-area">
                {activeDresses.length > 0 && renderDress(activeDresses[activeDressIndex])}
            </div>
        </div>
    );
};

export default BeautyPage;
