import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dataset from '../data/blessing_stats.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BlessingPage = () => {
    useEffect(() => {
        document.body.style.backgroundImage = `
            linear-gradient(to bottom, rgba(8,11,20,0.60) 0%, rgba(8,11,20,0.85) 50%, rgba(8,11,20,0.98) 100%),
            url('/blessing_banner.webp')
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

    const tabs = Object.keys(dataset);
    const [activeTab, setActiveTab] = useState(tabs[0] || '');

    const currentData = dataset[activeTab] || [];

    const stats = useMemo(() => {
        if (!currentData.length) return { maxLevel: 0, totalCost: 0, maxBonus: 0 };
        return {
            maxLevel: currentData.length,
            totalCost: currentData[currentData.length - 1].cum_cost.toLocaleString(),
            maxBonus: currentData[currentData.length - 1].global_stat + '%'
        };
    }, [currentData]);

    const chartData = useMemo(() => {
        return {
            labels: currentData.map(d => `Lv ${d.global_lv}`),
            datasets: [
                {
                    label: 'Upgrade Cost',
                    data: currentData.map(d => d.cost),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4
                },
                {
                    label: 'Sage / 1%',
                    data: currentData.map(d => d.efficiency),
                    borderColor: '#e879f9',
                    backgroundColor: 'rgba(232, 121, 249, 0.05)',
                    yAxisID: 'y',
                    tension: 0.4
                },
                {
                    label: 'Stat Gain per Level (%)',
                    data: currentData.map(d => d.delta_pct),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4
                }
            ]
        };
    }, [currentData]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Sage Stones / Cost Per 1% Gain',
                    color: '#94a3b8'
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Stat Increase per Level (%)',
                    color: '#94a3b8'
                },
                grid: { drawOnChartArea: false }
            }
        },
        plugins: {
            legend: { labels: { color: '#f8fafc' } }
        }
    };

    return (
        <div className="blessing-page fade-in-up" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

            <header className="page-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title"><Sparkles size={32} /> Blessing Analytics</h1>
            </header>

            <div className="glass-select-container">
                <select 
                    className="glass-select" 
                    value={activeTab} 
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {tabs.map(tab => (
                        <option key={tab} value={tab}>{tab}</option>
                    ))}
                </select>
            </div>

            <div className="summary-stats">
                <div className="stat-card">
                    <div className="stat-value">{stats.maxLevel}</div>
                    <div className="stat-label">Total Levels</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.totalCost}</div>
                    <div className="stat-label">Total Sage Stones Required</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.maxBonus}</div>
                    <div className="stat-label">Maximum Stat Bonus</div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Cost Efficiency & Progression</div>
                    </div>
                    <div className="chart-container">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Detailed Level Data</div>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Global Lv</th>
                                    <th>Node Lv</th>
                                    <th>Level Cost</th>
                                    <th>Cumulative Cost</th>
                                    <th>Stat Increase</th>
                                    <th>Cost per 1%</th>
                                    <th>Total Global Stat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map(row => (
                                    <tr key={row.global_lv}>
                                        <td>{row.global_lv}</td>
                                        <td>{row.node_lv}</td>
                                        <td>{row.cost}</td>
                                        <td>{row.cum_cost}</td>
                                        <td>+{row.delta_pct}%</td>
                                        <td className="highlight">{row.efficiency.toFixed(1)}</td>
                                        <td className="highlight">{row.global_stat}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlessingPage;
