import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Species } from '../../types/species';

interface SearchBarProps {
  species: Species[];
  onSearchResults: (results: Species[]) => void;
  onSpeciesSelect?: (species: Species) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  species,
  onSearchResults,
  onSpeciesSelect,
  placeholder = 'Search species...'
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<Species[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions and notify parent on query change
  useEffect(() => {
    if (query.trim()) {
      const filtered = species.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      onSearchResults(filtered);
    } else {
      setSuggestions([]);
      onSearchResults(species);
    }
  }, [query, species, onSearchResults]);

  // Collapse on click outside
  useEffect(() => {
    if (!isExpanded) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isExpanded]);

  // Expand and focus input
  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Select a species
  const handleSelect = (s: Species) => {
    setQuery(s.name);
    setIsExpanded(false);
    setSuggestions([]);
    if (onSpeciesSelect) onSpeciesSelect(s);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsExpanded(false);
    onSearchResults(species);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  // Compact button
  if (!isExpanded) {
    return (
      <button
        onClick={handleExpand}
        className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-emerald-200/50 hover:bg-white transition-colors text-gray-900"
        title="Search species"
      >
        <Search className="w-5 h-5 text-emerald-600" />
      </button>
    );
  }

  // Expanded search bar
  return (
    <div className="relative w-80" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-emerald-600 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-8 pr-8 py-2 text-sm border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white shadow-sm transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {/* Suggestions */}
      {isExpanded && query.trim() && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-emerald-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={s.name + i}
              onClick={() => handleSelect(s)}
              className="w-full px-3 py-2 text-left hover:bg-emerald-50 transition-colors border-b border-emerald-100 last:border-b-0 group text-sm"
            >
              <div className="font-medium text-gray-900 group-hover:text-emerald-700">{s.name}</div>
              <div className="text-xs text-emerald-600 mt-0.5 capitalize flex items-center justify-between">
                <span>{s.category} • {s.status}</span>
                {s.coordinates && <MapPin className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            </button>
          ))}
        </div>
      )}
      {isExpanded && query.trim() && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-emerald-200 rounded-lg shadow-lg z-50 p-3 text-center text-gray-500 text-sm">
          No species found matching "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;