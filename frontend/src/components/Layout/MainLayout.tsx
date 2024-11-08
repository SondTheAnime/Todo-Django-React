import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

export default function MainLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navbar isSidebarExpanded={isSidebarExpanded} />
      <div className="flex">
        <Sidebar
          onExpand={() => setIsSidebarExpanded(true)}
          onCollapse={() => setIsSidebarExpanded(false)}
        />
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'
          }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
} 