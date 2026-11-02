import React from 'react';
import { NavigationRoute, StudentUser } from '../../types';

interface NotEnrolledPageProps {
  currentUser: StudentUser;
  onRouteChange: (route: NavigationRoute) => void;
  onLogout: () => void;
}

export const NotEnrolledPage: React.FC<NotEnrolledPageProps> = ({ currentUser, onRouteChange, onLogout }) => (
  <div className="bg-[#08070B] text-white">
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold font-['Sora']">Welcome, {currentUser.fullName.split(' ')[0]}</h1>
      <p className="text-sm text-[#D1CADB]">
        Your student dashboard unlocks once you enrol in a program. Pick a program and complete payment to get started.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          onClick={() => onRouteChange('course-details')}
          className="px-5 py-2.5 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg cursor-pointer"
        >
          View programs
        </button>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 text-sm font-semibold text-[#D1CADB] bg-[#2E1A47]/60 hover:bg-[#2E1A47] border border-[#5C4B8A]/50 rounded-lg cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
);
