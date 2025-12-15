import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">System</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              GIP & TUPAD Management System for City Government of Santa Rosa
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Developers</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Ivan James Villaluna Rodriguez</li>
              <li>John Louis Garcia Bajalan</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Client</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              City Government of Santa Rosa
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {currentYear} GIP & TUPAD Management System. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 md:mt-0">
              Developed by: Ivan James Villaluna Rodriguez & John Louis Garcia Bajalan
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
            For: City Government of Santa Rosa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
