import React from 'react';
import { MapPin, Layers } from 'lucide-react';

interface HeatmapToggleProps {
  isHeatmap: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * A toggle button that switches between individual pin view and heatmap view.
 * Shows the density of endangered species with color-coded intensity.
 */
const HeatmapToggle: React.FC<HeatmapToggleProps> = ({ isHeatmap, onToggle, disabled = false }) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
                 border transition-all duration-200 text-gray-900 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 ${isHeatmap 
                   ? 'border-orange-300 bg-orange-50/90 hover:bg-orange-100/90' 
                   : 'border-emerald-200/50 hover:bg-white'
                 }`}
      aria-label={isHeatmap ? "Switch to pin view" : "Switch to heatmap view"}
      title={isHeatmap 
        ? "Switch to individual species pins" 
        : "Show species density heatmap - identifies biodiversity hotspots"
      }
    >
      {isHeatmap ? (
        <MapPin className="w-5 h-5 text-orange-600" />
      ) : (
        <Layers className="w-5 h-5 text-emerald-600" />
      )}
    </button>
  );
};

export default HeatmapToggle; 