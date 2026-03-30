import React from 'react';
import EmptyState from './EmptyState';

const Overview = () => {
  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      
      <div className="overview-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="btn-secondary">Create API Key</button>
          <button className="btn-secondary">View Usage</button>
          <button className="btn-secondary">Settings</button>
        </div>
      </div>
      
      <div className="overview-section">
        <h3>Recent Activity</h3>
        <div className="activity-feed">
          <p>No recent activity</p>
        </div>
      </div>
      
      <div className="overview-section">
        <h3>Getting Started</h3>
        <EmptyState
          icon="🚀"
          heading="Ready to get started?"
          description="Create your first API key to begin using our platform."
          ctaText="Create API Key"
          onCtaClick={() => console.log('Create API key clicked')}
        />
      </div>
    </div>
  );
};

export default Overview;