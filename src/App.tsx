import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthContext } from './contexts/AuthContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardTab from './components/DashboardTab';
import ApplicantsTab from './components/ApplicantsTab';
import ReportsTab from './components/ReportsTab';

function App() {
  const { logout, user } = useAuthContext();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [activeProgram, setActiveProgram] = React.useState<'GIP' | 'TUPAD'>('GIP');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applicants':
        return <ApplicantsTab activeProgram={activeProgram} />;
      case 'reports':
        return <ReportsTab activeProgram={activeProgram} />;
      default:
        return <DashboardTab activeProgram={activeProgram} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200">
        <Header
          activeProgram={activeProgram}
          onProgramChange={setActiveProgram}
          user={user}
          onLogout={logout}
        />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} activeProgram={activeProgram} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          {renderTabContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default App;