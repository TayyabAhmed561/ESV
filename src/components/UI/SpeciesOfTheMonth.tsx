import React from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import { Species } from '../../types/species';

interface SpeciesOfTheMonthProps {
  species: Species;
  onDonate: (species: Species) => void;
  onViewOnMap: (coordinates: [number, number]) => void;
}

/**
 * A beautifully designed panel that highlights a featured species of the month.
 * Features compelling storytelling and direct donation calls-to-action.
 */
const SpeciesOfTheMonth: React.FC<SpeciesOfTheMonthProps> = ({ 
  species, 
  onDonate, 
  onViewOnMap 
}) => {
  if (!species) return null;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-80 border border-gray-200/50 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      
      {/* Image */}
      {species.image && (
        <div className="aspect-w-16 aspect-h-9">
          <img 
            src={species.image} 
            alt={`Image of ${species.name}`} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Header without yellow Month badge */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Species of the Month
          </h3>
        </div>
        {/* Status badge here */}
        <div className="mb-2">
          {species.status === 'Endangered' && (
            <span className="bg-red-500/90 text-white font-bold px-3 py-1 rounded-full text-sm shadow-sm uppercase tracking-wide">Endangered</span>
          )}
          {species.status === 'Threatened' && (
            <span className="bg-orange-400/90 text-white font-bold px-3 py-1 rounded-full text-sm shadow-sm uppercase tracking-wide">Threatened</span>
          )}
          {species.status === 'Special Concern' && (
            <span className="bg-yellow-300/90 text-gray-900 font-bold px-3 py-1 rounded-full text-sm shadow-sm uppercase tracking-wide">Special Concern</span>
          )}
        </div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-2xl text-gray-800">{species.displayName || species.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-emerald-600 font-medium capitalize">{species.category}</span>
            </div>
          </div>
          <div className="flex-shrink-0 bg-yellow-400/90 text-yellow-900 font-bold py-1 px-3 rounded-full text-xs flex items-center gap-1 shadow-md">
              <Star className="w-4 h-4" />
              <span>Month</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-4">
          {species.summary}
        </p>

        <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200/80">
          <button 
            onClick={() => onDonate(species)}
            className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-semibold 
                      hover:bg-emerald-600 transition-colors transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            <span>Donate</span>
          </button>
          {species.coordinates && (
            <button
              onClick={() => onViewOnMap(species.coordinates!)}
              className="flex-1 bg-sky-500 text-white py-2 px-4 rounded-lg text-sm font-semibold 
                        hover:bg-sky-600 transition-colors transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>View on Map</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeciesOfTheMonth; 