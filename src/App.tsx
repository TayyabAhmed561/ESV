import React, { useState, useEffect } from 'react';
import { Leaf, Info, Heart, X, XCircle, MapPin, Search } from 'lucide-react';
import MapContainer from './components/Map/MapContainer';
import SearchBar from './components/UI/SearchBar';
import FilterPanel from './components/UI/FilterPanel';
import SpeciesDetailPanel from './components/UI/SpeciesDetailPanel';
import StatsOverview from './components/UI/StatsOverview';
import DonationModal from './components/UI/DonationModal';
import DonationButton from './components/UI/DonationButton';
import LocateButton from './components/UI/LocateButton';
import HeatmapToggle from './components/UI/HeatmapToggle';
import HeatmapLegend from './components/UI/HeatmapLegend';
import SpeciesOfTheMonth from './components/UI/SpeciesOfTheMonth';
import SpeciesOfTheMonthToggle from './components/UI/SpeciesOfTheMonthToggle';
import Logo from './components/UI/Logo';
import speciesData from './data/species.json';
import { useSpeciesFilter } from './hooks/useSpeciesFilter';
import { Species } from './types/species';
import { getDistance } from './utils/geometry';
import { getSpeciesOfTheMonth } from './utils/speciesRotation';

/**
 * The main application component.
 * It orchestrates the state and renders the map and UI panels.
 */
function App() {
  // State for the currently selected species, which is shown in the detail panel.
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  // State for controlling the visibility of the "About" info modal.
  const [showInfo, setShowInfo] = useState(false);
  // State for controlling the visibility of the donation modal.
  const [showDonationModal, setShowDonationModal] = useState(false);
  // State to hold the species for which a donation is being made.
  const [donationSpecies, setDonationSpecies] = useState<Species | undefined>(undefined);
  
  // State for the "Find Near Me" feature
  const [isLocating, setIsLocating] = useState(false);
  const [flyToCoordinates, setFlyToCoordinates] = useState<[number, number] | null>(null);
  const [speciesToHighlight, setSpeciesToHighlight] = useState<Species | null>(null);
  // State to hold and display a user-friendly location error message.
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  
  // State for heatmap view toggle
  const [isHeatmap, setIsHeatmap] = useState(false);
  
  // State for featured species of the month
  const [featuredSpecies, setFeaturedSpecies] = useState<Species>(() => 
    getSpeciesOfTheMonth(speciesData)
  );
  
  // State for Species of the Month panel visibility
  const [showSpeciesOfTheMonth, setShowSpeciesOfTheMonth] = useState(true);
  
  // State to track if user has seen the current featured species
  const [hasSeenCurrentSpecies, setHasSeenCurrentSpecies] = useState(false);
  
  // Debug useEffect to monitor selectedSpecies changes
  useEffect(() => {
    console.log('App: selectedSpecies state changed to:', selectedSpecies?.name || 'null');
  }, [selectedSpecies]);
  
  // Custom hook to manage filtering logic based on species type and status.
  const {
    filteredSpecies,
    selectedType,
    selectedStatus,
    setSelectedType,
    setSelectedStatus,
    setSearchResults
  } = useSpeciesFilter(speciesData);

  /**
   * Handles clicks on a species pin on the map.
   * Sets the selected species to display its details.
   * @param species The species object that was clicked.
   */
  const handlePointClick = (species: Species) => {
    if (species.coordinates) {
      setSpeciesToHighlight(species);
      setFlyToCoordinates(species.coordinates);
    } else {
      setSelectedSpecies(species);
    }
  };

  /**
   * Opens the donation modal.
   * Can be called with or without a specific species.
   * @param species The optional species to donate to.
   */
  const handleDonateClick = (species?: Species) => {
    setDonationSpecies(species);
    setShowDonationModal(true);
  };

  /**
   * A specific handler for the "Donate" button within the SpeciesDetailPanel.
   * It closes the detail panel before opening the donation modal for a smoother UX.
   * @param species The species to donate to from the detail panel.
   */
  const handleDonateFromSpeciesDetail = (species: Species) => {
    setSelectedSpecies(null); // Close species detail
    handleDonateClick(species);
  };

  /**
   * Handles the "Find Species Near Me" button click.
   */
  const handleLocateMe = () => {
    // Clear any previous errors when starting a new request.
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const speciesWithCoords = filteredSpecies.filter(s => s.coordinates);
        if (speciesWithCoords.length === 0) {
          alert("No species with location data are currently visible. Try adjusting your filters.");
          setIsLocating(false);
          return;
        }

        // Find the closest species
        let closestSpecies = speciesWithCoords[0];
        let minDistance = getDistance(latitude, longitude, closestSpecies.coordinates![1], closestSpecies.coordinates![0]);

        for (const species of speciesWithCoords) {
          const distance = getDistance(latitude, longitude, species.coordinates![1], species.coordinates![0]);
          if (distance < minDistance) {
            minDistance = distance;
            closestSpecies = species;
          }
        }

        // Set the state to trigger the fly-to animation and highlight the species
        setSpeciesToHighlight(closestSpecies);
        setFlyToCoordinates(closestSpecies.coordinates!);
      },
      (error) => {
        // Provide specific error messages based on the error code
        let errorMessage = "Could not determine your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. This often happens on desktop devices without GPS. Try entering your location manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or enter your location manually.";
            break;
          default:
            errorMessage = "Could not determine your location. This may be due to system settings or network issues. Try entering your location manually.";
        }
        
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: false, // Set to false to avoid CoreLocation issues on macOS
        timeout: 15000, // Increased timeout
        maximumAge: 300000 // Allow cached location up to 5 minutes old
      }
    );
  };
  
  /**
   * Callback for when the map's fly-to animation is complete.
   */
  const handleFlyToComplete = () => {
    if (speciesToHighlight) {
      setSelectedSpecies(speciesToHighlight); // Open the modal
    }
    // Reset states after animation
    setFlyToCoordinates(null);
    setSpeciesToHighlight(null);
    setIsLocating(false);
  };

  /**
   * Handles manual location submission.
   */
  const handleManualLocationSubmit = () => {
    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      setLocationError("Please enter valid coordinates.");
      return;
    }
    
    if (lat < 41.0 || lat > 57.0 || lng < -95.0 || lng > -74.0) {
      setLocationError("Please enter coordinates within Ontario, Canada.");
      return;
    }
    
    // Use the manual coordinates
    const userLocation: [number, number] = [lng, lat];
    
    // Find the closest species
    let closestSpecies: Species | null = null;
    let minDistance = Infinity;
    
    filteredSpecies.forEach(species => {
      if (species.coordinates) {
        const distance = getDistance(userLocation, species.coordinates);
        if (distance < minDistance) {
          minDistance = distance;
          closestSpecies = species;
        }
      }
    });
    
    if (closestSpecies) {
      setSpeciesToHighlight(closestSpecies);
      setFlyToCoordinates(closestSpecies.coordinates!);
      setShowManualLocation(false);
      setManualLatitude('');
      setManualLongitude('');
      // Show a message if the closest species is not very close
      if (minDistance > 10) {
        setLocationError(`No species found nearby. Redirected to the closest species: ${closestSpecies.name}.`);
      } else {
        setLocationError(null);
      }
    } else {
      setLocationError("No species found in the data.");
    }
  };

  /**
   * Handles toggling between pin view and heatmap view.
   */
  const handleHeatmapToggle = () => {
    setIsHeatmap(!isHeatmap);
  };

  /**
   * Handles viewing the featured species on the map.
   */
  const handleViewFeaturedOnMap = (coordinates: [number, number]) => {
    setFlyToCoordinates(coordinates);
    // Find the species in the filtered list to highlight it
    const speciesToHighlight = filteredSpecies.find(s => 
      s.coordinates && 
      s.coordinates[0] === coordinates[0] && 
      s.coordinates[1] === coordinates[1]
    );
    if (speciesToHighlight) {
      setSpeciesToHighlight(speciesToHighlight);
    }
  };

  /**
   * Handles toggling the Species of the Month panel visibility.
   */
  const handleSpeciesOfTheMonthToggle = () => {
    const newVisibility = !showSpeciesOfTheMonth;
    setShowSpeciesOfTheMonth(newVisibility);
    
    // Mark the species as seen when opening the panel
    if (newVisibility) {
      setHasSeenCurrentSpecies(true);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans">
      {/* The main map container, which serves as the background. */}
      <MapContainer 
        species={filteredSpecies} 
        onPointClick={handlePointClick}
        flyToCoordinates={flyToCoordinates}
        onFlyToComplete={handleFlyToComplete}
        isHeatmap={isHeatmap}
      />
      
      {/* Location Error Toast Notification */}
      {locationError && (
        <div className="absolute top-4 right-4 z-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-pop-in max-w-md">
          <XCircle className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <span className="block">{locationError}</span>
            {locationError.includes("Location information is unavailable") && (
              <div className="mt-2 text-sm">
                <p className="mb-1">On macOS, try:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>System Preferences → Security & Privacy → Location Services</li>
                  <li>Enable location for your browser</li>
                  <li>Or use manual location input below</li>
                </ul>
              </div>
            )}
            {(locationError.includes("Could not determine your location") || 
              locationError.includes("Location information is unavailable") ||
              locationError.includes("Location request timed out")) && (
              <button 
                onClick={() => setShowManualLocation(true)}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Enter location manually
              </button>
            )}
          </div>
          <button onClick={() => setLocationError(null)} className="p-1 hover:bg-red-200 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Manual Location Modal */}
      {showManualLocation && (
        <div className="absolute inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 animate-pop-in">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Enter Your Location</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Enter your coordinates to find species near you. You can find your coordinates on Google Maps by right-clicking on your location.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude (e.g., 43.6532)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLatitude}
                  onChange={(e) => setManualLatitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="43.6532"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude (e.g., -79.3832)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLongitude}
                  onChange={(e) => setManualLongitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-79.3832"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleManualLocationSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Find Species
              </button>
              <button
                onClick={() => {
                  setShowManualLocation(false);
                  setManualLatitude('');
                  setManualLongitude('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Legend */}
      <HeatmapLegend isVisible={isHeatmap} />

      {/* A wrapper for all UI overlays, positioned above the map. */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* Logo in bottom-left corner */}
        <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-gray-200/50 hover:bg-white transition-all duration-300 relative overflow-hidden group">
            {/* Subtle gradient accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Logo size="lg" variant="compact" className="text-gray-900" />
            </div>
          </div>
        </div>
        
        {/* Container for the main UI panels (left and right). */}
        <div className="p-4 flex justify-between">
          
          {/* Left Panel: Contains the filter controls and Species of the Month. */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            {/* Control buttons row */}
            <div className="flex items-start gap-2">
              <FilterPanel
                selectedType={selectedType}
                selectedStatus={selectedStatus}
                onTypeChange={setSelectedType}
                onStatusChange={setSelectedStatus}
              />
              <LocateButton onClick={handleLocateMe} isLoading={isLocating} />
              <HeatmapToggle 
                isHeatmap={isHeatmap} 
                onToggle={handleHeatmapToggle}
                disabled={filteredSpecies.filter(s => s.coordinates).length === 0}
              />
              <SpeciesOfTheMonthToggle 
                isVisible={showSpeciesOfTheMonth}
                onToggle={handleSpeciesOfTheMonthToggle}
                hasNewSpecies={!hasSeenCurrentSpecies}
              />
              <SearchBar
                species={speciesData}
                onSearchResults={setSearchResults}
                onSpeciesSelect={handlePointClick}
                placeholder="Search species..."
              />
            </div>
            
            {/* Species of the Month panel */}
            {showSpeciesOfTheMonth && (
              <SpeciesOfTheMonth
                species={featuredSpecies}
                onDonate={handleDonateClick}
                onViewOnMap={handleViewFeaturedOnMap}
              />
            )}
          </div>

          {/* Right Panel: Currently empty, can be used for other UI elements. */}
          <div className="w-[450px] space-y-4 pointer-events-auto">
            {/* Future UI elements can go here */}
          </div>
        </div>
      </div>

      {/* Detail panel that slides in when a species is selected. */}
      {selectedSpecies && (
        <SpeciesDetailPanel
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
          onDonate={handleDonateFromSpeciesDetail}
        />
      )}

      {/* Donation Modal, shown when its state is toggled. */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setDonationSpecies(undefined); // Reset donation species on close
        }}
        species={donationSpecies}
      />

      {/* "About" Info Modal, shown when its state is toggled. */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">About This System</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                This interactive heatmap displays endangered species across Ontario, 
                helping visualize conservation priorities and species distribution patterns over time.
              </p>
              <h3 className="font-semibold text-gray-900">Features:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Monthly species activity tracking and visualization</li>
                <li>Interactive heatmap showing species concentration by time period</li>
                <li>Detailed species profiles with conservation status</li>
                <li>Advanced filtering by species type, conservation status, and time</li>
                <li>Real-time search functionality</li>
                <li>Secure donation system to support conservation efforts</li>
                <li>Links to official conservation resources</li>
              </ul>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-emerald-900">Support Conservation</h4>
                </div>
                <p className="text-emerald-800 text-sm">
                  Your donations directly fund habitat protection, species research, and recovery programs. 
                  Every contribution makes a real difference in protecting Ontario's endangered wildlife.
                </p>
              </div>
              <p className="text-sm text-gray-500 pt-2 border-t">
                Data is for demonstration purposes. For official conservation information, 
                please visit Ontario.ca or contact the Ministry of Environment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;