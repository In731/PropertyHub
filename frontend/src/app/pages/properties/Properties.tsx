import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { PropertyCard } from '../../components/property/PropertyCard';
import { FilterSidebar } from '../../components/property/FilterSidebar';
import { SearchBar } from '../../components/property/SearchBar';
import { useProperties } from '../../context/PropertiesContext';
import { SearchFilters } from '../../types';
import { SlidersHorizontal, Loader2, Map as MapIcon, List } from 'lucide-react';
import { PropertiesMap } from '../../components/property/PropertiesMap';

export function Properties() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { properties, loading, total, page, totalPages, refresh } = useProperties();

  useEffect(() => {
    const status = searchParams.get('status') as 'for-sale' | 'for-rent' | undefined;
    const propertyType = searchParams.get('propertyType');

    const initialFilters: SearchFilters = {};
    if (status) initialFilters.status = status;
    if (propertyType) initialFilters.propertyType = propertyType;

    setFilters(initialFilters);
  }, [searchParams]);

  // Fetch properties when filters change
  useEffect(() => {
    refresh(filters, 1);
  }, [filters, refresh]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      refresh(filters, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (_query: string, location: string) => {
    setFilters(prev => ({
      ...prev,
      location: location || undefined
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Search Section */}
      <section className="bg-white dark:bg-gray-900 py-8 shadow-sm border-b border-gray-100 dark:border-gray-800">
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filters.status === 'for-sale' ? 'Properties for Sale' : 
                   filters.status === 'for-rent' ? 'Properties for Rent' : 
                   'All Properties'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {total} properties found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="hidden lg:flex bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === 'map' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <MapIcon className="w-4 h-4" />
                    Map
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:border-blue-600 transition"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            ) : properties.length > 0 ? (
              viewMode === 'map' ? (
                <div className="h-[700px]">
                  <PropertiesMap properties={properties} />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-4">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || loading}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages || loading}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )
          ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={() => setFilters({})}
                  className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition"
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
        <div className="fixed inset-0 bg-black/60 z-50 lg:hidden flex justify-end">
          <div className="h-full w-full max-w-md bg-white dark:bg-gray-900 overflow-y-auto">
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
