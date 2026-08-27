import { useState } from 'react';
import { TrendingUp, MapPin, Home, Maximize, Calendar, IndianRupee } from 'lucide-react';

export function PropertyValue() {
  const [propertyType, setPropertyType] = useState('apartment');
  const [city, setCity] = useState('Mumbai');
  const [area, setArea] = useState(1000);
  const [bedrooms, setBedrooms] = useState(2);
  const [age, setAge] = useState(5);
  const [estimated, setEstimated] = useState(false);

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'];
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'Independent House' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'plot', label: 'Plot' },
  ];

  const baseRates: { [key: string]: number } = {
    Mumbai: 15000,
    Delhi: 12000,
    Bangalore: 8000,
    Pune: 7000,
    Hyderabad: 6500,
    Chennai: 7500,
    Kolkata: 6000,
  };

  const typeMultipliers: { [key: string]: number } = {
    apartment: 1.0,
    villa: 1.4,
    house: 1.2,
    commercial: 1.5,
    plot: 0.6,
  };

  const calculateValue = () => {
    const baseRate = baseRates[city];
    const typeMultiplier = typeMultipliers[propertyType];
    
    let value = baseRate * area * typeMultiplier;
    
    if (propertyType !== 'plot' && propertyType !== 'commercial') {
      const bedroomFactor = 1 + (bedrooms - 2) * 0.1;
      value *= bedroomFactor;
    }
    
    const depreciationRate = 0.02;
    const depreciation = 1 - (age * depreciationRate);
    value *= Math.max(depreciation, 0.7);
    
    return Math.round(value);
  };

  const handleEstimate = () => {
    setEstimated(true);
  };

  const estimatedValue = calculateValue();
  const minValue = Math.round(estimatedValue * 0.9);
  const maxValue = Math.round(estimatedValue * 1.1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Property Value Generator</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Get an estimated market value for your property based on current market trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Property Details</h2>

            {/* Property Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Carpet Area (sq ft)
                </label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {area} sq ft
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>300 sq ft</span>
                <span>10,000 sq ft</span>
              </div>
            </div>

            {/* Bedrooms */}
            {propertyType !== 'plot' && propertyType !== 'commercial' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Number of Bedrooms
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBedrooms(num)}
                      className={`py-2 rounded-xl text-sm font-semibold transition ${
                        bedrooms === num
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Property Age */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Property Age (years)
                </label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {age} years
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>New</span>
                <span>30 years</span>
              </div>
            </div>

            <button
              onClick={handleEstimate}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-md shadow-blue-600/25 text-sm"
            >
              Estimate Value
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {estimated ? (
              <>
                {/* Estimated Value Card */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-green-600/20">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-5 h-5" />
                    <p className="text-sm font-medium opacity-90">Estimated Property Value</p>
                  </div>
                  <p className="text-4xl sm:text-5xl font-extrabold mb-2">
                    ₹{estimatedValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs opacity-80">
                    Range: ₹{minValue.toLocaleString('en-IN')} - ₹{maxValue.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Property Summary */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Property Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Property Type</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{propertyType}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{city}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <Maximize className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Area</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{area} sq ft</span>
                    </div>

                    {propertyType !== 'plot' && propertyType !== 'commercial' && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{bedrooms} BHK</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Age</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{age} years</span>
                    </div>
                  </div>
                </div>

                {/* Price per sq ft */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Price Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Base Rate (per sq ft)</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{baseRates[city].toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Rate (per sq ft)</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ₹{Math.round(estimatedValue / area).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Estimate?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Fill in the property details and click "Estimate Value" to get your property valuation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6">
          <h3 className="text-base font-bold text-amber-900 dark:text-amber-300 mb-2">Disclaimer</h3>
          <p className="text-xs text-amber-800 dark:text-amber-400/90 leading-relaxed">
            This is an estimated value based on general market trends and property characteristics. 
            The actual property value may vary based on various factors including exact location, 
            property condition, amenities, market conditions, and more. For accurate valuation, 
            please consult a professional property valuator.
          </p>
        </div>
      </div>
    </div>
  );
}
