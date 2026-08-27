import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, location);
    } else {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (location) params.append('location', location);
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-2.5 flex flex-col md:flex-row gap-2 transition-all">
        {/* Location Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            placeholder="Enter city or locality..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
          />
        </div>

        {/* Search Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search properties (e.g. villa, 3BHK)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition duration-200"
        >
          Search
        </button>
      </div>
    </form>
  );
}
