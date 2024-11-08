import { HomeIcon, ListBulletIcon, FolderIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm h-screen">
      <nav className="mt-5 px-2">
        <Link to="/" className="group flex items-center px-2 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <HomeIcon className="mr-3 h-6 w-6" />
          Dashboard
        </Link>
        <Link to="/tasks" className="mt-1 group flex items-center px-2 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <ListBulletIcon className="mr-3 h-6 w-6" />
          Tarefas
        </Link>
        <Link to="/categories" className="mt-1 group flex items-center px-2 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <FolderIcon className="mr-3 h-6 w-6" />
          Categorias
        </Link>
      </nav>
    </aside>
  );
} 