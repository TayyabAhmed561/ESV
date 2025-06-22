import React from 'react';
import { Locate, Loader2 } from 'lucide-react';

interface LocateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  title?: string;
}

/**
 * A button that triggers a process to find the user's location.
 * It shows a loading spinner while the location is being fetched.
 */
const LocateButton: React.FC<LocateButtonProps> = ({ onClick, isLoading, title = "Find species near me" }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
                 border border-emerald-200/50 hover:bg-white transition-colors text-gray-900 
                 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={title}
      title="Find species near your location (requires location permission)"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
      ) : (
        <Locate className="w-5 h-5 text-emerald-600" />
      )}
    </button>
  );
};

export default LocateButton; 