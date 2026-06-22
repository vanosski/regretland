import React, { useState } from 'react';

const TroopCalculator = () => {
    const [name, setName] = useState('');
    const [totalTroops, setTotalTroops] = useState(0);
    const [numGuards, setNumGuards] = useState(0);
    const [troops, setTroops] = useState([{ type: '', dead: 1, wounded: 1, survived: 1, kills: 1 }]);
    const [result, setResult] = useState('');
    const [resultData, setResultData] = useState(null);

    const addTroopType = () => {
        setTroops([...troops, { type: '', dead: 1, wounded: 1, survived: 1, kills: 1 }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newTroops = [...troops];
        // Ensure numbers are handled correctly
        newTroops[index][name] = name === 'type' ? value : Number(value);
        setTroops(newTroops);
    };

    const removeTroopType = (index) => {
        if (troops.length > 1) {
            const newTroops = troops.filter((_, i) => i !== index);
            setTroops(newTroops);
        }
    };

    const calculateFormation = (e) => {
        e.preventDefault();

        const troopTypes = troops.length;
        const types = troops.map(troop => troop.type);
        const dead = troops.map(troop => Number(troop.dead) || 0.1);
        const wounded = troops.map(troop => Number(troop.wounded) || 0.1);
        const survived = troops.map(troop => Number(troop.survived) || 0.1);
        const kills = troops.map(troop => Number(troop.kills) || 0.1);

        let dw = [];
        let total = [];
        let coef = [];
        let mot = [];
        let resultArray = [];

        for (let i = 0; i < troopTypes; i++) {
            dw[i] = dead[i] + wounded[i];
            total[i] = dw[i] + survived[i];
            
            // Avoid division by zero
            let divisor = ((kills[i] - dw[i]) / Math.sqrt(total[i])) * ((kills[i] - dw[i]) / Math.sqrt(total[i]));
            coef[i] = 1 / (divisor || 0.0001);

            mot[i] = [];
            for (let j = 0; j < troopTypes + 1; j++) {
                if (i === 0 && j < troopTypes) mot[i][j] = 1;
                else if (i === 0 && j === troopTypes) mot[0][troopTypes] = totalTroops - numGuards;
                else if (i >= 1 && i < troopTypes && j === 0) mot[i][0] = coef[0];
                else mot[i][j] = 0;
            }
        }

        for (let i = 1; i < troopTypes; i++) {
            mot[i][i] = -1 * coef[i];
        }

        // Gaussian elimination
        for (let i = 0; i < troopTypes - 1; i++) {
            for (let j = i + 1; j < troopTypes; j++) {
                if (Math.abs(mot[i][i]) < Math.abs(mot[j][i])) {
                    for (let k = 0; k < troopTypes + 1; k++) {
                        let temp = mot[i][k];
                        mot[i][k] = mot[j][k];
                        mot[j][k] = temp;
                    }
                }
            }
        }

        for (let i = 0; i < troopTypes - 1; i++) {
            for (let j = i + 1; j < troopTypes; j++) {
                const f = mot[j][i] / (mot[i][i] || 0.0001);
                for (let k = 0; k < troopTypes + 1; k++) {
                    mot[j][k] -= f * mot[i][k];
                }
            }
        }

        for (let i = troopTypes - 1; i >= 0; i--) {
            resultArray[i] = mot[i][troopTypes];
            for (let j = i + 1; j < troopTypes; j++) {
                if (i !== j) {
                    resultArray[i] -= mot[i][j] * resultArray[j];
                }
            }
            resultArray[i] /= (mot[i][i] || 0.0001);
        }

        // Prepare the result data object for structured rendering instead of raw HTML
        const finalResults = {
            name,
            numGuards,
            totalTroops,
            breakdown: types.map((type, i) => ({
                type,
                count: Math.floor(resultArray[i])
            }))
        };

        setResultData(finalResults);
        
        // Form scrolling to results
        setTimeout(() => {
            document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <section id="formation" className="calculator-section fade-in">
            <div className="container">
                <div className="glass calculator-card">
                    <h2 className="section-title">Troop Formation <span className="gradient-text">Calculator</span></h2>
                    
                    <form onSubmit={calculateFormation}>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>General Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="e.g. Imperial Guard" 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label>Total Troops</label>
                                <input 
                                    type="number" 
                                    value={totalTroops} 
                                    onChange={(e) => setTotalTroops(Number(e.target.value))} 
                                    placeholder="Enter total" 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label>Number of Guards</label>
                                <input 
                                    type="number" 
                                    value={numGuards} 
                                    onChange={(e) => setNumGuards(Number(e.target.value))} 
                                    placeholder="Enter guards" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="troops-container">
                            <div className="section-header">
                                <h3>Troop Details</h3>
                                <button type="button" className="btn-secondary small" onClick={addTroopType}>
                                    + Add Troop Type
                                </button>
                            </div>
                            
                            {troops.map((troop, index) => (
                                <div key={index} className="troop-row glass shadow-sm">
                                    <div className="troop-inputs-grid">
                                        <div className="input-group">
                                            <label>Type</label>
                                            <input 
                                                type="text" 
                                                name="type" 
                                                value={troop.type} 
                                                onChange={(e) => handleInputChange(index, e)} 
                                                placeholder="Troop Type" 
                                                required 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Dead</label>
                                            <input 
                                                type="number" 
                                                name="dead" 
                                                value={troop.dead} 
                                                onChange={(e) => handleInputChange(index, e)} 
                                                required 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Wounded</label>
                                            <input 
                                                type="number" 
                                                name="wounded" 
                                                value={troop.wounded} 
                                                onChange={(e) => handleInputChange(index, e)} 
                                                required 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Survived</label>
                                            <input 
                                                type="number" 
                                                name="survived" 
                                                value={troop.survived} 
                                                onChange={(e) => handleInputChange(index, e)} 
                                                required 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Kills</label>
                                            <input 
                                                type="number" 
                                                name="kills" 
                                                value={troop.kills} 
                                                onChange={(e) => handleInputChange(index, e)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    {troops.length > 1 && (
                                        <button 
                                            type="button" 
                                            className="remove-btn" 
                                            onClick={() => removeTroopType(index)}
                                            aria-label="Remove"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="form-actions text-center">
                            <button type="submit" className="btn-primary large">Calculate Optimal Formation</button>
                        </div>
                    </form>

                    {resultData && (
                        <div id="result-section" className="results-box glass animated-border">
                            <h3>Formation for <span className="gradient-text">{resultData.name}</span></h3>
                            <p className="summary-text">For <strong>{resultData.numGuards}</strong> guards and <strong>{resultData.totalTroops}</strong> total troops:</p>
                            <div className="results-grid">
                                {resultData.breakdown.map((item, idx) => (
                                    <div key={idx} className="result-item">
                                        <span className="type">{item.type}</span>
                                        <span className="count">{item.count.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TroopCalculator;
