import React, { useState } from 'react';
import {
  Users,
  Clock,
  UserCheck,
  CheckCircle,
  X,
  UserMinus,
  MapPin,
  ClipboardCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useData } from '../hooks/useData';

interface StatsGridProps {
  activeProgram: 'GIP' | 'TUPAD';
  onCardClick?: (status: string | null) => void;
}

const StatsGrid: React.FC<StatsGridProps> = ({ activeProgram, onCardClick }) => {
  const { statistics, isLoading } = useData(activeProgram);
  const [showMore, setShowMore] = useState(false);

  const primaryColor = activeProgram === 'GIP' ? 'bg-red-200' : 'bg-green-200';
  const primaryDarkColor = activeProgram === 'GIP' ? 'bg-red-600' : 'bg-green-600';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 animate-pulse rounded-lg p-6 h-32"
          ></div>
        ))}
      </div>
    );
  }

  const mainStats = [
    {
      title: 'TOTAL APPLICANTS',
      value: statistics?.totalApplicants?.toString() ?? '0',
      male: statistics?.maleCount?.toString() ?? '0',
      female: statistics?.femaleCount?.toString() ?? '0',
      icon: Users,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: null,
      clickable: true
    },
    {
      title: 'PENDING',
      value: statistics?.pending?.toString() ?? '0',
      male: statistics?.pendingMale?.toString() ?? '0',
      female: statistics?.pendingFemale?.toString() ?? '0',
      icon: Clock,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: 'PENDING',
      clickable: true
    },
    {
      title: 'APPROVED',
      value: statistics?.approved?.toString() ?? '0',
      male: statistics?.approvedMale?.toString() ?? '0',
      female: statistics?.approvedFemale?.toString() ?? '0',
      icon: UserCheck,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: 'APPROVED',
      clickable: true
    },
    {
      title: 'DEPLOYED',
      value: statistics?.deployed?.toString() ?? '0',
      male: statistics?.deployedMale?.toString() ?? '0',
      female: statistics?.deployedFemale?.toString() ?? '0',
      icon: CheckCircle,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: 'DEPLOYED',
      clickable: true
    },
    {
      title: 'COMPLETED',
      value: statistics?.completed?.toString() ?? '0',
      male: statistics?.completedMale?.toString() ?? '0',
      female: statistics?.completedFemale?.toString() ?? '0',
      icon: CheckCircle,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: 'COMPLETED',
      clickable: true
    },
    {
      title: 'REJECTED',
      value: statistics?.rejected?.toString() ?? '0',
      male: statistics?.rejectedMale?.toString() ?? '0',
      female: statistics?.rejectedFemale?.toString() ?? '0',
      icon: X,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: 'REJECTED',
      clickable: true
    },
    {
      title: 'RESIGNED',
      value: statistics?.resigned?.toString() ?? '0',
      male: statistics?.resignedMale?.toString() ?? '0',
      female: statistics?.resignedFemale?.toString() ?? '0',
      icon: UserMinus,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: 'RESIGNED',
      clickable: true
    },
    {
      title: 'BARANGAYS COVERED',
      value: statistics?.barangaysCovered?.toString() ?? '0',
      male: statistics?.maleCount?.toString() ?? '0',
      female: statistics?.femaleCount?.toString() ?? '0',
      icon: MapPin,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: null,
      clickable: false
    }
  ];

  const additionalStats = [
    {
      title: 'INTERVIEWED',
      value: statistics?.interviewed?.toString() ?? '0',
      male: statistics?.interviewedMale?.toString() ?? '0',
      female: statistics?.interviewedFemale?.toString() ?? '0',
      icon: ClipboardCheck,
      bgColor: `${primaryColor} border-2 border-yellow-400`,
      iconBg: `${primaryDarkColor}`,
      status: null,
      clickable: false
    }
  ];

  const displayStats = showMore ? [...mainStats, ...additionalStats] : mainStats;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={() => stat.clickable && onCardClick?.(stat.status)}
              className={`${stat.bgColor} text-gray-800 rounded-lg p-6 relative overflow-hidden transition-all duration-300 ease-in-out transform ${stat.clickable ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'cursor-not-allowed opacity-90'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium opacity-90 mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-full text-white`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
              <div className="flex items-center space-x-4 text-xs opacity-75">
                <div className="flex items-center space-x-1">
                  <span>♂</span>
                  <span>{stat.male}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>♀</span>
                  <span>{stat.female}</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Icon className="w-20 h-20" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => setShowMore(!showMore)}
          className="
            flex items-center space-x-2 px-6 py-3 
            bg-white dark:bg-slate-800 
            text-gray-800 dark:text-gray-200 
            border border-gray-300 dark:border-slate-700 
            hover:bg-gray-100 dark:hover:bg-slate-700 
            rounded-lg shadow-sm 
            transition-all duration-200 hover:shadow-md
          "
        >
          <span className="font-medium">{showMore ? "See Less" : "See More"}</span>
          {showMore ? (
            <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default StatsGrid;
