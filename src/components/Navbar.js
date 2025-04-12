import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, TrophyIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold mb-4 md:mb-0">
            Futbol App
          </Link>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/" className="flex flex-col items-center space-y-1 hover:text-accent group">
              <HomeIcon className="h-6 w-6" />
              <span className="text-sm">Ana Sayfa</span>
            </Link>
            <Link to="/leagues" className="flex flex-col items-center space-y-1 hover:text-accent group">
              <TrophyIcon className="h-6 w-6" />
              <span className="text-sm">Ligler</span>
            </Link>
            <Link to="/matches" className="flex flex-col items-center space-y-1 hover:text-accent group">
              <CalendarIcon className="h-6 w-6" />
              <span className="text-sm">Maçlar</span>
            </Link>
            <Link to="/goal-kings" className="flex flex-col items-center space-y-1 hover:text-accent group">
              <UserIcon className="h-6 w-6" />
              <span className="text-sm">Gol Kralları</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 