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
      <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
        {/* Location Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
          <MapPin className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter city or locality"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-900"
          />
        </div>

        {/* Search Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-900"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Search
        </button>
      </div>
    </form>
  );
}