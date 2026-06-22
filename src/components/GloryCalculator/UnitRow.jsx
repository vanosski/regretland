import React from 'react';
import { unitData } from '../../assets/unit-data';

const UnitRow = ({ index, unit, level, star, onChange, getMaxStars }) => {
  const calculateRow = (unit, level, star) => {
    const totalLevelCost = level > 0 ? unitData[unit].level_cost.slice(0, level).reduce((a, b) => a + b, 0) : 0;
    const totalStarCost = star > 0 ? unitData[unit].star_cost.slice(0, star).reduce((a, b) => a + b, 0) : 0;
    const totalCost = totalLevelCost + totalStarCost;

    const totalStatIncrease = level > 0 ? unitData[unit].stat_increase.slice(0, level).reduce((a, b) => a + b, 0) : 0;

    let protBlessing = 0;
    let attackBlessing = 0;
    if (star > 0) {
      const blessings = unitData[unit].blessing_increase.slice(0, star);
      const totalBlessing = blessings.reduce((a, b) => a + b, 0);
      if (unitData[unit].blessing_type === "protection" || unitData[unit].blessing_type === "both") {
        protBlessing = totalBlessing;
      }
      if (unitData[unit].blessing_type === "attack" || unitData[unit].blessing_type === "both") {
        attackBlessing = totalBlessing;
      }
    }

    return { totalStatIncrease, totalCost, protBlessing, attackBlessing };
  };

  const { totalStatIncrease, totalCost, protBlessing, attackBlessing } = calculateRow(unit, level, star);

  const handleLevelChange = (e) => {
    let newLevel = parseInt(e.target.value) || 0;
    if (newLevel < 0) newLevel = 0;
    if (newLevel > 50) newLevel = 50;
    onChange('level', newLevel);
  };

  const handleStarChange = (e) => {
    let newStar = parseInt(e.target.value) || 0;
    if (newStar < 0) newStar = 0;
    const maxStars = getMaxStars(level);
    if (newStar > maxStars) newStar = maxStars;
    onChange('star', newStar);
  };

  const unitDisplayName = unit
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <tr className="unit-row">
      <td className="text-muted small">{index}</td>
      <td className="font-semibold text-main">{unitDisplayName}</td>
      <td>
        <input
          type="number"
          min="0"
          max="50"
          placeholder="0"
          className="level-input mini"
          value={level === 0 ? '' : level}
          onChange={handleLevelChange}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max={getMaxStars(level)}
          placeholder="0"
          className="star-input mini"
          value={star === 0 ? '' : star}
          onChange={handleStarChange}
        />
      </td>
      <td className="stat-value">{totalStatIncrease.toFixed(2)}%</td>
      <td className="cost-value highlight">{totalCost.toLocaleString()}</td>
      <td className="stat-value">{protBlessing.toFixed(2)}%</td>
      <td className="stat-value">{attackBlessing.toFixed(2)}%</td>
    </tr>
  );
};

export default UnitRow;
