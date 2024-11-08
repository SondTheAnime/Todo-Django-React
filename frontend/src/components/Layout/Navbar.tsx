import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Task Manager</h1>
          </div>
          <div className="flex items-center">
            <UserCircleIcon className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>
    </nav>
  );
} 