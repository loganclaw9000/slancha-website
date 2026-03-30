import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      path: '/dashboard/overview', 
      label: 'Overview',
      icon: '📊'
    },
    { 
      path: '/dashboard/api-keys', 
      label: 'API Keys',
      icon: '🔑'
    },
    { 
      path: '/dashboard/usage', 
      label: 'Usage',
      icon: '📈'
    },
    { 
      path: '/dashboard/settings', 
      label: 'Settings',
      icon: '⚙️'
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-container">
        <nav className="dashboard-sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`dashboard-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="dashboard-sidebar-icon">{item.icon}</span>
                  <span className="dashboard-sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;