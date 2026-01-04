import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Sun, Moon, User as UserIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import gipLogo from '../assets/GIPLogo.png';
import tupadLogo from '../assets/TupadLogo.png';

import { User } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  activeProgram: 'GIP' | 'TUPAD';
  onProgramChange: (program: 'GIP' | 'TUPAD') => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeProgram,
  onProgramChange,
  user,
  onLogout
}) => {
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

  const headerColor =
    activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';

  const logoSrc = activeProgram === 'GIP' ? gipLogo : tupadLogo;

  return (
    <header className={`${headerColor} text-white border-b-4 border-yellow-400`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 flex items-center justify-center">
              <img
                src={logoSrc}
                alt={`${activeProgram} logo`}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                SOFT PROJECTS MANAGEMENT SYSTEM
              </h1>
              <p className="text-sm opacity-90">
                City Government of Santa Rosa - Office of the City Mayor
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6">

            {/* PROGRAM TOGGLE */}
            <div className="flex items-center space-x-3 bg-black bg-opacity-20 px-4 py-2 rounded-lg">
              <button
                onClick={toggleProgram}
                className={`text-sm font-medium ${
                  activeProgram === 'GIP'
                    ? 'text-white'
                    : 'text-white opacity-60 hover:opacity-80'
                }`}
              >
                GIP
              </button>

              <button
                onClick={toggleProgram}
                className="relative w-8 h-4 bg-white bg-opacity-30 rounded-full"
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                    activeProgram === 'GIP'
                      ? 'translate-x-0.5'
                      : 'translate-x-4'
                  }`}
                />
              </button>

              <button
                onClick={toggleProgram}
                className={`text-sm font-medium ${
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
              onClick={() =>
                setTheme(theme === 'light' ? 'dark' : 'light')
              }
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* USER INFO */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">
                  Welcome, {user?.name || 'User'}
                </p>
                <p className="text-xs opacity-75 capitalize">
                  {user?.role || 'user'}
                </p>
              </div>

              {/* USER MENU */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 space-x-3 hover:bg-red-600 transition"
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
