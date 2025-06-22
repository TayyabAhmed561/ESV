import { Species } from '../types/species';

/**
 * Selects the featured species of the month based on a rotation system.
 * Uses the current month to ensure consistent rotation across all users.
 * Prioritizes endangered and threatened species for maximum impact.
 */
export const getSpeciesOfTheMonth = (species: Species[]): Species => {
  const currentMonth = new Date().getMonth(); // 0-11
  
  // Filter species that have coordinates and are at risk
  const eligibleSpecies = species.filter(s => 
    s.coordinates && 
    ['Endangered', 'Threatened', 'Special Concern'].includes(s.status)
  );
  
  if (eligibleSpecies.length === 0) {
    // Fallback to any species with coordinates
    const speciesWithCoords = species.filter(s => s.coordinates);
    if (speciesWithCoords.length === 0) {
      return species[0]; // Last resort
    }
    return speciesWithCoords[currentMonth % speciesWithCoords.length];
  }
  
  // Use modulo to cycle through eligible species based on current month
  return eligibleSpecies[currentMonth % eligibleSpecies.length];
};

/**
 * Gets the next featured species for preview purposes.
 */
export const getNextSpeciesOfTheMonth = (species: Species[]): Species => {
  const nextMonth = (new Date().getMonth() + 1) % 12;
  
  const eligibleSpecies = species.filter(s => 
    s.coordinates && 
    ['Endangered', 'Threatened', 'Special Concern'].includes(s.status)
  );
  
  if (eligibleSpecies.length === 0) {
    const speciesWithCoords = species.filter(s => s.coordinates);
    if (speciesWithCoords.length === 0) {
      return species[0];
    }
    return speciesWithCoords[nextMonth % speciesWithCoords.length];
  }
  
  return eligibleSpecies[nextMonth % eligibleSpecies.length];
};

/**
 * Gets the month name for display purposes.
 */
export const getCurrentMonthName = (): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[new Date().getMonth()];
}; 