import React from 'react';

const UsageStats = () => {
  // Mock data - in real app this would come from API
  const stats = {
    totalRequests: 12450,
    uniqueModels: 23,
    avgLatency: 142
  };

  const chartData = [65, 75, 85, 90, 70, 80, 95];

  return (
    <div className="usage-stats">
      <h2>Usage Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Requests</h3>
          <p className="stat-value">{stats.totalRequests.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <h3>Unique Models</h3>
          <p className="stat-value">{stats.uniqueModels}</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Latency</h3>
          <p className="stat-value">{stats.avgLatency}ms</p>
        </div>
      </div>
      
      <div className="bar-chart">
        <h3>Last 7 Days</h3>
        <div className="chart-bars">
          {chartData.map((height, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ height: `${height}%` }}
              ></div>
              <span className="bar-label">Day {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsageStats;