import React from 'react';
import HeroSection from './HeroSection';
import StatsGrid from './StatsGrid';

interface DashboardTabProps {
  activeProgram: 'GIP' | 'TUPAD';
  onNavigateToApplicants?: (statusFilter: string | null) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ activeProgram, onNavigateToApplicants }) => {
  const handleStatCardClick = (status: string | null) => {
    onNavigateToApplicants?.(status);
  };

  return (
    <>
      <HeroSection activeProgram={activeProgram} />
      <StatsGrid activeProgram={activeProgram} onCardClick={handleStatCardClick} />
    </>
  );
};

export default DashboardTab;