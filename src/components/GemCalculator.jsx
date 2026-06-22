import React, { useState } from 'react';

const GemCalculator = () => {
    const [gemType, setGemType] = useState('infAttack');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [desiredLevel, setDesiredLevel] = useState(1);
    const [level1Gems, setLevel1Gems] = useState(0);
    const [numGems, setNumGems] = useState(1);
    const [result, setResult] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const gemCosts = {
        infAttack: 45,
        cavAttack: 55,
        archAttack: 55,
        siegeAttack: 65,
        infHealth: 65,
        cavHealth: 50,
        archHealth: 50,
        siegeHealth: 55,
        infDmg: 55,
        cavDmg: 65,
        archDmg: 65,
        siegeDmg: 75,
        infDmgRcv: 75,
        cavDmgRcv: 60,
        archDmgRcv: 60,
        siegeDmgRcv: 65,
        troopAttack: 75,
        troopHealth: 75,
        troopDmg: 85,
        troopDmgRcv: 85,
    };

    const gemLabels = {
        infAttack: "Infantry Attack",
        cavAttack: "Cavalry Attack",
        archAttack: "Archer Attack",
        siegeAttack: "Siege Attack",
        infHealth: "Infantry Health",
        cavHealth: "Cavalry Health",
        archHealth: "Archer Health",
        siegeHealth: "Siege Health",
        infDmg: "Infantry Damage",
        cavDmg: "Cavalry Damage",
        archDmg: "Archer Damage",
        siegeDmg: "Siege Damage",
        infDmgRcv: "Infantry Damage Received",
        cavDmgRcv: "Cavalry Damage Received",
        archDmgRcv: "Archer Damage Received",
        siegeDmgRcv: "Siege Damage Received",
        troopAttack: "Troop Attack",
        troopHealth: "Troop Health",
        troopDmg: "Troop Damage",
        troopDmgRcv: "Troop Damage Received",
    };

    const calculateUpgrade = (e) => {
        e.preventDefault();

        if (currentLevel < 1 || desiredLevel < 1 || currentLevel > desiredLevel || level1Gems < 0 || numGems < 1) {
            alert("Please enter valid numbers: Current Level >= 1, Desired Level >= Current Level, Available Gems >= 0, Number to Upgrade >= 1.");
            setResult('');
            setIsVisible(false);
            return;
        }

        const costOfLevel1 = gemCosts[gemType] || 0;
        const gemsNeededForDesired = Math.pow(3, desiredLevel - 1);
        const gemsAlreadyInCurrent = Math.pow(3, currentLevel - 1);
        const additionalGemsPerGem = gemsNeededForDesired - gemsAlreadyInCurrent;
        const totalAdditionalGemsNeeded = additionalGemsPerGem * numGems;
        const numLevel1GemsToBuy = Math.max(0, totalAdditionalGemsNeeded - level1Gems);
        const totalCost = numLevel1GemsToBuy * costOfLevel1;

        const formattedCost = totalCost.toLocaleString();
        const formattedNeeded = numLevel1GemsToBuy.toLocaleString();

        let resText;
        if (totalAdditionalGemsNeeded <= 0) {
            resText = `Your gems are already at or above the desired level. No additional gems needed.`;
        } else if (numLevel1GemsToBuy <= 0) {
            resText = `You have enough Level 1 gems to upgrade ${numGems} ${gemLabels[gemType]} gem(s) from Level ${currentLevel} to Level ${desiredLevel}. No additional cost.`;
        } else {
            resText = `To upgrade ${numGems} ${gemLabels[gemType]} gem(s) from Level ${currentLevel} to Level ${desiredLevel}: You need ${formattedNeeded} more Level 1 gems. Estimated cost: ${formattedCost} coins.`;
        }

        setResult(resText);
        setIsVisible(true);
    };

    return (
        <section id="gem-calculator" className="calculator-section fade-in">
            <div className="container">
                <div className="glass calculator-card">
                    <h2 className="section-title">Gem <span className="gradient-text">Calculator</span></h2>
                    
                    <form onSubmit={calculateUpgrade}>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Select Gem Type</label>
                                <select value={gemType} onChange={(e) => { setGemType(e.target.value); setIsVisible(false); }}>
                                    {Object.entries(gemLabels).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Current Level</label>
                                <input type="number" value={currentLevel} onChange={(e) => { setCurrentLevel(Number(e.target.value)); setIsVisible(false); }} min="1" />
                            </div>
                            <div className="input-group">
                                <label>Desired Level</label>
                                <input type="number" value={desiredLevel} onChange={(e) => { setDesiredLevel(Number(e.target.value)); setIsVisible(false); }} min="1" />
                            </div>
                            <div className="input-group">
                                <label>Lvl 1 Gems Available</label>
                                <input type="number" value={level1Gems} onChange={(e) => { setLevel1Gems(Number(e.target.value)); setIsVisible(false); }} min="0" />
                            </div>
                            <div className="input-group">
                                <label>Number to Upgrade</label>
                                <input type="number" value={numGems} onChange={(e) => { setNumGems(Number(e.target.value)); setIsVisible(false); }} min="1" />
                            </div>
                        </div>

                        <div className="form-actions text-center">
                            <button type="submit" className="btn-primary large">Calculate Upgrade Cost</button>
                        </div>
                    </form>

                    {isVisible && (
                        <div className="results-box glass animated-border visible">
                            <h3>Upgrade <span className="gradient-text">Estimate</span></h3>
                            <div className="result-item large">
                                <p className="result-text">{result}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default GemCalculator;
