import { Outlet } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import DashboardNav from '../components/dashboard/DashboardNav';
import Sidebar from '../components/dashboard/Sidebar';
import './Dashboard.css';

export default function Dashboard() {
  usePageMeta({ title: 'Dashboard', description: 'Manage your Slancha deployment: API keys, usage analytics, model routing, and account settings.' });
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
