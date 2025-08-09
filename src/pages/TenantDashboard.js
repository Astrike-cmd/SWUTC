import React from 'react';
import './TenantDashboard.css';

function TenantDashboard() {
  // Placeholder usage data
  const usageData = [
    { activity: 'Brushing Teeth', amount: '5L' },
    { activity: 'Shower', amount: '50L' },
    { activity: 'Cooking', amount: '20L' },
    { activity: 'Washing Clothes', amount: '60L' }
  ];

  // Placeholder water-saving tips
  const tips = [
    'Turn off the tap while brushing your teeth.',
    'Take shorter showers to save water.',
    'Use a bucket instead of a hose for washing vehicles.'
  ];

  return (
    <div className="tenant-dashboard">
      <h2>Tenant Dashboard</h2>

      <div className="welcome-message">
        Welcome back! Here’s your water usage summary for today.
      </div>

      <div className="usage-card">
        <h3>Daily Water Usage</h3>
        <ul className="usage-list">
          {usageData.map((item, index) => (
            <li key={index}>
              <span>{item.activity}</span>
              <span>{item.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="tips-section">
        <h4>Water Saving Tips</h4>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TenantDashboard;