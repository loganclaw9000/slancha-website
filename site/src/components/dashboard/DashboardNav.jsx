import React from 'react';
import { Link } from 'react-router-dom';

const DashboardNav = () => {
  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-container">
        <Link to="/dashboard" className="dashboard-logo">
          Slancha
        </Link>
        <div className="dashboard-nav-links">
          <Link to="/dashboard/overview">Overview</Link>
          <Link to="/dashboard/api-keys">API Keys</Link>
          <Link to="/dashboard/usage">Usage</Link>
          <Link to="/dashboard/settings">Settings</Link>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;