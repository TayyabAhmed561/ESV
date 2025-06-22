export interface Species {
  name: string;
  displayName?: string;
  category: "Mammal" | "Bird" | "Reptile" | "Amphibian" | "Fish" | "Insect" | "Plant";
  status: "Endangered" | "Threatened" | "Special Concern";
  summary: string;
  story?: string;
  image?: string;
  coordinates?: [number, number];
  modelPath?: string;
  soundPath?: string;
}

export type FilterType = 'all' | 'Amphibians' | 'Birds' | 'Fishes' | 'Insects' | 'Lichens' | 'Mammals' | 'Molluscs' | 'Mosses' | 'Plants' | 'Reptiles';
export type FilterStatus = 'all' | 'Endangered' | 'Threatened' | 'Special Concern' | 'Extirpated' | 'Not at risk';

export interface MonthlyData {
  month: number; // 1-12
  year: number;
  sightings: number;
  coordinates: [number, number][];
  populationEstimate?: number;
}

export interface HeatmapPoint {
  coordinates: [number, number];
  weight: number;
  species: Species[];
  month?: number; // New field for month filtering
}

export interface MonthFilter {
  month: number;
  year: number;
}