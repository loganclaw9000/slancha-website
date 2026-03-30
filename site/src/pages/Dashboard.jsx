import React from 'react';
import DashboardNav from '../components/dashboard/DashboardNav';
import Sidebar from '../components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <DashboardNav />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;