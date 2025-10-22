import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (query: string, days: number) => void;
  loading: boolean;
  defaultDays: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading, defaultDays }) => {
  const [query, setQuery] = useState('');
  const [days, setDays] = useState(defaultDays);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(days > 0) {
        onSearch(query, days);
    } else {
        alert("Please enter a valid number of days.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., Japan, Brazil, Egypt..."
        className="w-full px-4 py-2 text-sky-800 bg-white/70 border border-r-0 border-sky-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#00A3FF]"
        disabled={loading}
      />
      <div className="flex items-center border border-r-0 border-l-0 border-sky-200 bg-white/70">
        <input
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
            min="1"
            className="w-20 px-2 py-2 text-center text-sky-800 bg-transparent focus:outline-none"
            disabled={loading}
        />
        <span className="pr-3 text-sky-600">Days</span>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-[#00A3FF] text-white font-semibold rounded-r-md hover:bg-[#0082cc] focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-offset-2 disabled:bg-sky-300 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={loading}
        style={{height: '42px'}}
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
};

export default SearchBar;