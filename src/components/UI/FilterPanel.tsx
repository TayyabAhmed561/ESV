import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { FilterType, FilterStatus } from '../../types/species';
import { useClickOutside } from '../../hooks/useClickOutside';

interface FilterPanelProps {
  selectedType: FilterType;
  selectedStatus: FilterStatus;
  onTypeChange: (type: FilterType) => void;
  onStatusChange: (status: FilterStatus) => void;
}

/**
 * A dropdown component that allows users to filter species by type and conservation status.
 */
const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange
}) => {
  // State to manage whether the dropdown is open or closed.
  const [isOpen, setIsOpen] = useState(false);
  
  // Custom hook to detect clicks outside of the dropdown panel, which closes it.
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  // Options for the species type filter dropdown.
  const typeOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'Mammals', label: 'Mammals' },
    { value: 'Birds', label: 'Birds' },
    { value: 'Reptiles', label: 'Reptiles' },
    { value: 'Amphibians', label: 'Amphibians' },
    { value: 'Fishes', label: 'Fish' },
    { value: 'Plants', label: 'Plants' },
    { value: 'Insects', label: 'Insects' },
    { value: 'Lichens', label: 'Lichens' },
    { value: 'Molluscs', label: 'Molluscs' },
    { value: 'Mosses', label: 'Mosses' },
  ];

  // Options for the conservation status filter radio buttons.
  const statusOptions: { value: FilterStatus; label: string; color: string }[] = [
    { value: 'all', label: 'All Status', color: 'bg-gray-500' },
    { value: 'Endangered', label: 'Endangered', color: 'bg-red-600' },
    { value: 'Threatened', label: 'Threatened', color: 'bg-orange-500' },
    { value: 'Special Concern', label: 'Special Concern', color: 'bg-yellow-500' },
  ];

  // Calculate the number of active filters to display a badge on the button.
  const activeFilterCount = (selectedType !== 'all' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0);

  return (
    // The ref is attached here to define the "outside" area for the useClickOutside hook.
    <div className="relative" ref={dropdownRef}>
      {/* The main button that toggles the dropdown's visibility. */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
                   border border-emerald-200/50 hover:bg-white transition-colors text-gray-900"
      >
        <Filter className="w-5 h-5 text-emerald-600" />
        <span className="font-semibold">Filters</span>
        {/* Badge to show the number of active filters. */}
        {activeFilterCount > 0 && (
          <div className="bg-emerald-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {activeFilterCount}
          </div>
        )}
        {/* Arrow icon that rotates based on the dropdown's open state. */}
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* The dropdown panel, which is conditionally rendered based on the isOpen state. */}
      {isOpen && (
        <div 
          className="absolute top-full mt-2 w-72 bg-white/90 backdrop-blur-sm p-4 rounded-lg 
                     shadow-2xl border border-emerald-200/50 z-20"
        >
          <div className="space-y-4">
            {/* Species Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Species Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value as FilterType)}
                className="w-full p-2 border border-emerald-200 rounded-md focus:border-emerald-500 
                         focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Conservation Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conservation Status
              </label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;