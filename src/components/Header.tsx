import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Sun, Moon, User as UserIcon } from 'lucide-react'; // FIXED: renamed User → UserIcon
import { User } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';
import Swal from 'sweetalert2';

interface HeaderProps {
  activeProgram: 'GIP' | 'TUPAD';
  onProgramChange: (program: 'GIP' | 'TUPAD') => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeProgram, onProgramChange, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const toggleProgram = () => {
    onProgramChange(activeProgram === 'GIP' ? 'TUPAD' : 'GIP');
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      onLogout();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const headerColor = activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';
  const gipLogo = '/src/assets/GIPLogo.png';
  const tupadLogo = '/src/assets/TupadLogo.png';
  const logoSrc = activeProgram === 'GIP' ? gipLogo : tupadLogo;

  return (
    <header className={`${headerColor} text-white border-b-4 border-yellow-400`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12">
              <img
                src={logoSrc}
                alt={`${activeProgram} logo`}
                className="w-full h-full object-contain scale-125 transition-transform duration-300"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold">SOFT PROJECTS MANAGEMENT SYSTEM</h1>
              <p className="text-sm opacity-90">
                City Government of Santa Rosa - Office of the City Mayor
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6">

            {/* Program Toggle */}
            <div className="flex items-center space-x-3 bg-black bg-opacity-20 px-4 py-2 rounded-lg">
              <button
                onClick={toggleProgram}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeProgram === 'GIP'
                    ? 'text-white'
                    : 'text-white opacity-60 hover:opacity-80'
                }`}
              >
                GIP
              </button>

              <button
                onClick={toggleProgram}
                className="relative w-8 h-4 bg-white bg-opacity-30 rounded-full transition-colors duration-200"
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                    activeProgram === 'GIP' ? 'translate-x-0.5' : 'translate-x-4'
                  }`}
                />
              </button>

              <button
                onClick={toggleProgram}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeProgram === 'TUPAD'
                    ? 'text-white'
                    : 'text-white opacity-60 hover:opacity-80'
                }`}
              >
                TUPAD
              </button>
            </div>

            {/* THEME BUTTON */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-white" />
              )}
            </button>

            {/* USER INFO + USER MENU */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">
                  Welcome, {user?.name || 'User'}
                </p>
                <p className="text-xs opacity-75 capitalize">
                  {user?.role || 'user'}
                </p>
              </div>

              {/* USER ICON MENU */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                  title="User menu"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center hover:bg-opacity-40 transition-colors duration-200">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
