import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { PropertyCard } from '../components/PropertyCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SearchBar } from '../components/SearchBar';
import { useProperties } from '../context/PropertiesContext';
import { SearchFilters, Property } from '../types';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

export function Properties() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { properties, loading } = useProperties();

  useEffect(() => {
    const status = searchParams.get('status') as 'for-sale' | 'for-rent' | undefined;
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');

    const initialFilters: SearchFilters = {};
    if (status) initialFilters.status = status;
    if (location) initialFilters.location = location;
    if (propertyType) initialFilters.propertyType = propertyType;

    setFilters(initialFilters);
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...properties];

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.location) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.type === filters.propertyType);
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms!);
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathrooms!);
    }

    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin!);
    }

    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax!);
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleSearch = (query: string, location: string) => {
    setFilters(prev => ({
      ...prev,
      location: location || undefined
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {filters.status === 'for-sale' ? 'Properties for Sale' : 
                   filters.status === 'for-rent' ? 'Properties for Rent' : 
                   'All Properties'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredProperties.length} properties found
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-600 transition"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={() => setFilters({})}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClose={() => setShowMobileFilters(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </div>
  );
}