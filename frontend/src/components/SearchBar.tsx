import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Location, searchLocations } from '../services/geocoding';

interface SearchBarProps {
  onSearch: (location: Location) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 0) {
        const locations = await searchLocations(query);
        setSuggestions(locations);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      onSearch(suggestions[selectedIndex]);
      setShowSuggestions(false);
    } else if (suggestions.length > 0) {
      onSearch(suggestions[0]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (location: Location) => {
    setQuery(location.name);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for a location..."
          className={`w-full px-4 py-3 pl-12 rounded-full border ${
            isInputFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
          } focus:outline-none transition-all`}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          Search
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.latitude}-${suggestion.longitude}`}
                className={`px-4 py-2 cursor-pointer ${
                  index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-sm text-gray-500">
                  {[suggestion.admin1, suggestion.country].filter(Boolean).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}