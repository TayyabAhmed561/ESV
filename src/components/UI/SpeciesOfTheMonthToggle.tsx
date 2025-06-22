import React from 'react';
import { Star, X } from 'lucide-react';

interface SpeciesOfTheMonthToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  hasNewSpecies?: boolean;
}

/**
 * A toggle button for the Species of the Month panel.
 * Shows a star icon when closed, and an X when open.
 */
const SpeciesOfTheMonthToggle: React.FC<SpeciesOfTheMonthToggleProps> = ({ 
  isVisible, 
  onToggle, 
  hasNewSpecies = false 
}) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
                 border transition-all duration-200 text-gray-900 
                 hover:bg-white hover:shadow-xl transform hover:scale-105
                 ${isVisible 
                   ? 'border-amber-300 bg-amber-50/90 hover:bg-amber-100/90' 
                   : 'border-emerald-200/50'
                 }
                 ${hasNewSpecies && !isVisible ? 'animate-pulse' : ''}`}
      aria-label={isVisible ? "Hide Species of the Month" : "Show Species of the Month"}
      title={isVisible ? "Hide featured species" : "View this month's featured species"}
    >
      {isVisible ? (
        <X className="w-5 h-5 text-amber-600" />
      ) : (
        <div className="relative">
          <Star className="w-5 h-5 text-emerald-600" />
          {hasNewSpecies && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          )}
        </div>
      )}
    </button>
  );
};

export default SpeciesOfTheMonthToggle; 