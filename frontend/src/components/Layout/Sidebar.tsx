import { ChartBarIcon, ListBulletIcon, FolderIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface SidebarProps {
  onExpand: () => void;
  onCollapse: () => void;
}

export default function Sidebar({ onExpand, onCollapse }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onExpand();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onCollapse();
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed h-screen bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 ${isHovered ? 'w-64' : 'w-20'
        }`}
    >
      <nav className="mt-5 px-2">
        <Link
          to="/"
          className={`group flex items-center px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors ${!isHovered && 'justify-center'
            }`}
        >
          <ChartBarIcon className="h-6 w-6" />
          {isHovered && <span className="ml-3">Dashboard</span>}
        </Link>
        <Link
          to="/tasks"
          className={`mt-1 group flex items-center px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors ${!isHovered && 'justify-center'
            }`}
        >
          <ListBulletIcon className="h-6 w-6" />
          {isHovered && <span className="ml-3">Tarefas</span>}
        </Link>
        <Link
          to="/categories"
          className={`mt-1 group flex items-center px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors ${!isHovered && 'justify-center'
            }`}
        >
          <FolderIcon className="h-6 w-6" />
          {isHovered && <span className="ml-3">Categorias</span>}
        </Link>
      </nav>
    </aside>
  );
} 