import { SearchFilters } from '../../types';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({ filters, onFilterChange, onClose, isMobile }: FilterSidebarProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ${isMobile ? 'p-6' : 'rounded-2xl shadow-sm p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        {isMobile && (
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Property Status */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Property For
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => updateFilter('status', 'for-sale')}
            className={`flex-1 px-4 py-2.5 rounded-xl border-2 font-medium transition ${
              filters.status === 'for-sale'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => updateFilter('status', 'for-rent')}
            className={`flex-1 px-4 py-2.5 rounded-xl border-2 font-medium transition ${
              filters.status === 'for-rent'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Property Type
        </label>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => updateFilter('propertyType', e.target.value || undefined)}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
          <option value="commercial">Commercial</option>
          <option value="plot">Plot</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Bedrooms
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => updateFilter('bedrooms', filters.bedrooms === num ? undefined : num)}
              className={`px-3 py-2 rounded-xl border-2 font-medium transition ${
                filters.bedrooms === num
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Bathrooms
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => updateFilter('bathrooms', filters.bathrooms === num ? undefined : num)}
              className={`px-3 py-2 rounded-xl border-2 font-medium transition ${
                filters.bathrooms === num
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ''}
            onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ''}
            onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition"
      >
        Clear All Filters
      </button>
    </div>
  );
}
