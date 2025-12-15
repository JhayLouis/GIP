import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthContext } from './contexts/AuthContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import DashboardTab from './components/DashboardTab';
import ApplicantsTab from './components/ApplicantsTab';
import ReportsTab from './components/ReportsTab';

function App() {
  const { logout, user } = useAuthContext();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [activeProgram, setActiveProgram] = React.useState<'GIP' | 'TUPAD'>('GIP');
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);

  const handleNavigateToApplicants = (status: string | null) => {
    setStatusFilter(status);
    setActiveTab('applicants');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applicants':
        return <ApplicantsTab activeProgram={activeProgram} initialStatusFilter={statusFilter || undefined} />;
      case 'reports':
        return <ReportsTab activeProgram={activeProgram} />;
      default:
        return <DashboardTab activeProgram={activeProgram} onNavigateToApplicants={handleNavigateToApplicants} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200 flex flex-col">
        <Header
          activeProgram={activeProgram}
          onProgramChange={setActiveProgram}
          user={user}
          onLogout={logout}
        />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} activeProgram={activeProgram} />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
          {renderTabContent()}
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default App;