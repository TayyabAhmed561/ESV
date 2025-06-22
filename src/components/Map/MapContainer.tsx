import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Species } from '../../types/species';

// Set the Mapbox access token. This is required for Mapbox GL JS to work.
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFhemlxY29kZSIsImEiOiJjbWM1djRxb3kwa3B6MmtweXE2b3gxYW5tIn0.JQ9mOa1Z6QM5Ou9CFYYbvQ';

interface MapContainerProps {
  species: Species[]; // Array of species data to display on the map.
  onPointClick: (species: Species) => void; // Callback function for when a species point is clicked.
  flyToCoordinates: [number, number] | null; // Coordinates to fly to, or null.
  onFlyToComplete: () => void; // Callback after fly-to animation completes.
  isHeatmap: boolean; // Whether to show heatmap or individual pins.
}

/**
 * The core map component that renders the Mapbox map and species data points.
 */
const MapContainer: React.FC<MapContainerProps> = ({ species, onPointClick, flyToCoordinates, onFlyToComplete, isHeatmap }) => {
  // Refs to hold the map container div and the mapboxgl.Map instance.
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Effect hook to initialize the map on first render.
  useEffect(() => {
    // Prevent re-initialization if the map already exists or the container is not ready.
    if (map.current || !mapContainer.current) return;

    // Define the geographical boundaries for Ontario to restrict map panning.
    const ontarioBounds: [number, number, number, number] = [-95.2, 41.7, -74.3, 56.9];

    // Create the Mapbox map instance.
    map.current = new mapboxgl.Map({
      container: mapContainer.current, // The container element for the map.
      style: 'mapbox://styles/mapbox/light-v11', // The base map style.
      center: [-84.5, 50.0], // Initial center of the map (centered on Ontario).
      zoom: 5.5, // Initial zoom level.
      minZoom: 3, // Minimum allowed zoom level.
      pitch: 45, // Initial pitch (tilt) of the map in degrees.
      bearing: 0, // Initial bearing (rotation) of the map.
      antialias: true, // Enable antialiasing for smoother rendering.
      maxBounds: ontarioBounds // Restrict map panning to these bounds.
    });

    // Add zoom and rotation controls to the map.
    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    // Add 3D terrain to the map once the style has loaded.
    map.current.on('load', () => {
      if (!map.current) return;
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14 // Optimized maxzoom for performance.
      });
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });
    });

    // Cleanup function to remove the map instance when the component unmounts.
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once.

  // Effect hook to update the map data whenever the species array changes.
  useEffect(() => {
    if (!map.current) return;

    // A helper function to ensure map operations are only performed when the style is fully loaded.
    const runWhenLoaded = (callback: () => void) => {
      if (!map.current) return;
      if (map.current.isStyleLoaded()) {
        callback();
      } else {
        map.current.once('load', callback);
      }
    };

    runWhenLoaded(() => {
      updateMapData(map.current!, species, onPointClick, isHeatmap);
    });
  }, [species, onPointClick, isHeatmap]);

  // Effect hook to handle the fly-to animation.
  useEffect(() => {
    if (map.current && flyToCoordinates) {
      map.current.flyTo({
        center: flyToCoordinates,
        zoom: 12, // Zoom in closer when flying to a specific point.
        essential: true // This animation is considered essential with respect to prefers-reduced-motion.
      });

      // Listen for the end of the move event to know when the animation is complete.
      map.current.once('moveend', onFlyToComplete);
    }
  }, [flyToCoordinates, onFlyToComplete]);

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0 w-full h-full"
    />
  );
};

/**
 * A helper function to add or update the species data on the map.
 * This keeps the data-handling logic separate from the component's effect hooks.
 * @param map The mapboxgl.Map instance.
 * @param species The array of species to display.
 * @param onPointClick The callback for click events.
 * @param isHeatmap Whether to show heatmap or individual pins.
 */
const updateMapData = (map: mapboxgl.Map, species: Species[], onPointClick: (s: Species) => void, isHeatmap: boolean) => {
  // Convert the species array to a GeoJSON FeatureCollection.
  // This is the standard format Mapbox uses for point data.
  const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: 'FeatureCollection',
    features: species
      .filter(s => s.coordinates) // Only include species that have coordinates.
      .map((s, index) => ({
        type: 'Feature',
        properties: { 
          id: index, 
          name: s.name, 
          status: s.status,
          // Add weight for heatmap intensity based on conservation status
          weight: getConservationWeight(s.status)
        },
        geometry: {
          type: 'Point',
          coordinates: s.coordinates!
        }
      }))
  };

  // Get the existing data source, if it exists.
  const source = map.getSource('species-points') as mapboxgl.GeoJSONSource;
  if (source) {
    // If the source exists, just update its data. This is more efficient than removing and re-adding.
    source.setData(geojsonData);
  } else {
    // If the source doesn't exist, add it to the map.
    map.addSource('species-points', {
      type: 'geojson',
      data: geojsonData
    });
  }

  // Remove existing layers if they exist
  if (map.getLayer('species-layer')) {
    map.removeLayer('species-layer');
  }
  if (map.getLayer('species-heatmap')) {
    map.removeLayer('species-heatmap');
  }

  if (isHeatmap) {
    // Add heatmap layer
    map.addLayer({
      id: 'species-heatmap',
      type: 'heatmap',
      source: 'species-points',
      paint: {
        // Increase the heatmap weight based on conservation status
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'weight'],
          0, 0,
          10, 1
        ],
        // Reduce intensity to make heatmaps more spread out
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 0.5,
          9, 1.5
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 0, 255, 0)',
          0.2, 'rgba(0, 0, 255, 0.2)',
          0.4, 'rgba(0, 255, 255, 0.3)',
          0.6, 'rgba(0, 255, 0, 0.4)',
          0.8, 'rgba(255, 255, 0, 0.5)',
          1, 'rgba(255, 0, 0, 0.6)'
        ],
        // Increase the heatmap radius to spread out the heatmaps more
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 8,
          9, 40
        ],
        // Reduce opacity for more subtle blending
        'heatmap-opacity': 0.6
      }
    });

    // Add a subtle outline layer for better visibility
    map.addLayer({
      id: 'species-layer',
      type: 'circle',
      source: 'species-points',
      paint: {
        'circle-radius': 0,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.3)',
        'circle-stroke-width': 1
      }
    });

  } else {
    // Add the layer for displaying the species points as individual pins
    map.addLayer({
      id: 'species-layer',
      type: 'circle',
      source: 'species-points',
      paint: {
        'circle-radius': 8,
        // Dynamically color the circles based on the species' conservation status.
        'circle-color': [
          'match',
          ['get', 'status'],
          'Endangered', '#d73027',
          'Threatened', '#fdae61',
          'Special Concern', '#fee090',
          'Extirpated', '#636363',
          'Not at risk', '#1a9850',
          /* default color */ '#abd9e9'
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 2
      }
    });

    // --- Event Listeners for the Layer ---

    // Handle click events on the species layer.
    map.on('click', 'species-layer', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const speciesId = feature.properties?.id;
        // Find the corresponding species from the original array.
        const clickedSpecies = species.filter(s => s.coordinates)[speciesId];
        if (clickedSpecies) {
          onPointClick(clickedSpecies); // Trigger the callback with the clicked species data.
        }
      }
    });

    // Change the cursor to a pointer when hovering over a species point.
    map.on('mouseenter', 'species-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back when leaving a species point.
    map.on('mouseleave', 'species-layer', () => {
      map.getCanvas().style.cursor = '';
    });
  }
};

/**
 * Helper function to assign weights to species based on their conservation status.
 * This affects the intensity of the heatmap visualization.
 */
const getConservationWeight = (status: string): number => {
  switch (status) {
    case 'Endangered':
      return 10; // Highest weight for most critical species
    case 'Threatened':
      return 8;
    case 'Special Concern':
      return 6;
    case 'Extirpated':
      return 4;
    case 'Not at risk':
      return 2;
    default:
      return 5;
  }
};

export default MapContainer;
