import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from '../components/dashboard/DashboardNav';
import Sidebar from '../components/dashboard/Sidebar';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dash-layout">
      <DashboardNav />
      <div className="dash-body">
        <Sidebar />
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
