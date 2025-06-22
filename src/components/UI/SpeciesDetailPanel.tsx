import React, { useState, useEffect } from 'react';
import { X, Shield, Droplet, Heart, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { Species } from '../../types/species';
import Model3DViewer from './Model3DViewer';

interface SpeciesDetailPanelProps {
  species: Species; // The species object to display details for.
  onClose: () => void; // Callback function to close the panel.
  onDonate: (species: Species) => void; // Callback function to trigger the donation flow.
}

/**
 * A modal that pops up to display detailed information
 * about a selected species.
 */
const SpeciesDetailPanel: React.FC<SpeciesDetailPanelProps> = ({ species, onClose, onDonate }) => {
  console.log('SpeciesDetailPanel rendered with species:', species.name);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const getAnimalSound = (species: Species) => {
    // Use the sound property if it exists
    if (species.sound) {
      return species.sound;
    }
    // Check for hardcoded species
    if (species.name.toLowerCase().includes('fowler') || species.name.toLowerCase().includes('toad')) {
      return '/audio/12-Fowlers-Toad-Call.mp3';
    }
    if (species.name.toLowerCase().includes('barn owl')) {
      return '/audio/barn-owl.mp3';
    }
    // Fallback placeholder
    return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
  };

  const handlePlaySound = async () => {
    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    const soundUrl = getAnimalSound(species);
    const newAudio = new Audio(soundUrl);
    
    newAudio.addEventListener('ended', () => {
      setIsPlaying(false);
      setIsLoading(false);
    });

    newAudio.addEventListener('error', () => {
      setIsPlaying(false);
      setIsLoading(false);
      console.log('Audio failed to load');
      
      // Show specific message for Fowler's Toad
      if (species.name.toLowerCase().includes('fowler') || species.name.toLowerCase().includes('toad')) {
        alert('Fowler\'s Toad sound file not found. Please ensure the audio file is placed in public/audio/12-Fowlers-Toad-Call.mp3');
      } else if (species.name.toLowerCase().includes('barn owl')) {
        alert('Barn Owl sound file not found. Please ensure the audio file is placed in public/audio/barn-owl.mp3');
      } else {
        alert(`Sound for ${species.name} is not available yet. This feature is coming soon!`);
      }
    });

    newAudio.addEventListener('canplaythrough', () => {
      setIsLoading(false);
    });

    setAudio(newAudio);
    setIsPlaying(true);
    
    try {
      await newAudio.play();
    } catch (error) {
      setIsPlaying(false);
      setIsLoading(false);
      console.log('Audio playback failed');
      
      // Show specific message for Fowler's Toad
      if (species.name.toLowerCase().includes('fowler') || species.name.toLowerCase().includes('toad')) {
        alert('Fowler\'s Toad sound file not found. Please ensure the audio file is placed in public/audio/12-Fowlers-Toad-Call.mp3');
      } else if (species.name.toLowerCase().includes('barn owl')) {
        alert('Barn Owl sound file not found. Please ensure the audio file is placed in public/audio/barn-owl.mp3');
      } else {
        alert(`Sound for ${species.name} is not available yet. This feature is coming soon!`);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  return (
    // The modal container: a fixed overlay that covers the screen.
    // Clicking the backdrop will close the modal.
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 
        The modal content itself. `onClick` is stopped from propagating to the overlay,
        so clicking inside the modal doesn't close it. 
        The `animate-pop-in` class controls the pop-in animation.
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl flex flex-col max-w-4xl w-full max-h-[90vh] animate-pop-in overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-emerald-200 flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{species.name}</h2>
            <p className="text-sm text-gray-500">{species.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Body - Two-column grid */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Column: 3D Model */}
          <div className="w-full lg:w-1/2 bg-gray-100/50 flex items-center justify-center p-4 lg:p-6 relative">
            {species.modelPath ? (
              <div className="w-full h-full min-h-[400px]">
                <Model3DViewer 
                  modelPath={species.modelPath} 
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              </div>
            ) : (species.name.toLowerCase().includes('fowler') || species.name.toLowerCase().includes('toad')) ? (
              <div className="w-full h-full min-h-[400px]">
                <Model3DViewer 
                  modelPath="/models/fowler-toad.glb" 
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              </div>
            ) : species.name.toLowerCase().includes('barn owl') ? (
              <div className="w-full h-full min-h-[400px]">
                <Model3DViewer 
                  modelPath="/models/barn-owl.mp3.glb" 
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                {/* Placeholder content for other species */}
                <p className="text-lg font-semibold">3D Model</p>
                <p className="text-sm">Coming Soon</p>
              </div>
            )}
            
            {/* Sound Button - Bottom Right */}
            <button
              onClick={handlePlaySound}
              disabled={isLoading}
              className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isPlaying 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
              title={
                isLoading 
                  ? "Loading sound..." 
                  : isPlaying 
                    ? "Stop sound" 
                    : `Play ${species.name} sound`
              }
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Right Column: Scrollable Text Content */}
          <div className="w-full lg:w-1/2 p-4 lg:p-6 overflow-y-auto space-y-6">
            {/* Conservation Status Section */}
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Conservation Status
              </h3>
              <p className="text-lg font-bold text-red-600">{species.status}</p>
            </div>

            {/* AI-Generated Summary Section */}
            {species.summary && (
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Droplet className="w-5 h-5 text-emerald-600" />
                  Quick Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{species.summary}</p>
              </div>
            )}

            {/* Link to Official Ontario.ca page */}
            <a
              href={`https://www.ontario.ca/page/species-risk-ontario?q=${species.name.replace(/ /g, '+')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-800">Learn more on Ontario.ca</span>
              <ExternalLink className="w-5 h-5 text-gray-500" />
            </a>
          </div>
        </div>

        {/* Modal Footer with Donation Button */}
        <div className="p-6 border-t border-emerald-200 bg-gray-50">
          <button
            onClick={() => onDonate(species)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white 
                       font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
          >
            <Heart className="w-5 h-5" />
            <span>Support {species.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeciesDetailPanel;