import { UserCircleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  isSidebarExpanded: boolean;
}

export default function Navbar({ isSidebarExpanded }: NavbarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className={`flex items-center transition-all duration-300 ${isSidebarExpanded ? 'mr-[110px]' : 'ml-[110px]'
            }`}>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Task Manager
            </h1>
          </div>
          <div className="flex items-center space-x-4 pr-6">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
            <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
} 