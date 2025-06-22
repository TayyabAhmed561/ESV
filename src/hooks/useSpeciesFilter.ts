import { useState, useMemo, useCallback } from 'react';
import { Species, FilterType, FilterStatus } from '../types/species';

/**
 * A custom hook to manage filtering of the species list.
 * @param allSpecies The full, unfiltered array of species.
 * @returns An object with the filtered species list and state setters for the filters.
 */
export const useSpeciesFilter = (allSpecies: Species[]) => {
  // State for the selected species category (e.g., "Birds", "Mammals").
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  // State for the selected conservation status (e.g., "Endangered").
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  // State for search results
  const [searchResults, setSearchResults] = useState<Species[]>(allSpecies);
  // State to track if search is active
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Memoize the filtered species list to avoid re-calculating on every render.
  // The list is re-calculated only when the source data or filter criteria change.
  const filteredSpecies = useMemo(() => {
    // Start with search results if search is active, otherwise use all species
    const baseSpecies = isSearchActive ? searchResults : allSpecies;
    
    return baseSpecies.filter(species => {
      // Check if the species matches the selected type filter.
      const typeMatch = selectedType === 'all' || species.category === selectedType;
      // Check if the species matches the selected status filter.
      const statusMatch = selectedStatus === 'all' || species.status === selectedStatus;
      
      // A species is included if it matches both the type and status filters.
      return typeMatch && statusMatch;
    });
  }, [allSpecies, selectedType, selectedStatus, searchResults, isSearchActive]);

  // Wrapper function to handle search results and update search state
  const handleSearchResults = useCallback((results: Species[]) => {
    setSearchResults(results);
    setIsSearchActive(results.length !== allSpecies.length);
  }, [allSpecies.length]);

  return {
    filteredSpecies,
    selectedType,
    selectedStatus,
    setSelectedType,
    setSelectedStatus,
    setSearchResults: handleSearchResults,
  };
};