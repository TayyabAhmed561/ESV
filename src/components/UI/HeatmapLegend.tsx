import React from 'react';

interface HeatmapLegendProps {
  isVisible: boolean;
}

/**
 * A legend component that explains the heatmap color scale and what it represents.
 */
const HeatmapLegend: React.FC<HeatmapLegendProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Species Density Heatmap</h3>
      <p className="text-xs text-gray-600 mb-3">
        Shows concentration of endangered species. Hotter colors indicate higher density and conservation priority.
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 via-cyan-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
          <span className="text-xs text-gray-700">Low → High Density</span>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Endangered Species:</span>
            <span className="font-medium text-red-600">Highest Weight</span>
          </div>
          <div className="flex justify-between">
            <span>Threatened Species:</span>
            <span className="font-medium text-orange-600">High Weight</span>
          </div>
          <div className="flex justify-between">
            <span>Special Concern:</span>
            <span className="font-medium text-yellow-600">Medium Weight</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapLegend; 