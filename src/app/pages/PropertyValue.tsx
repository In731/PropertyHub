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

  // Base rates per sq ft for different cities (in ₹)
  const baseRates: { [key: string]: number } = {
    Mumbai: 15000,
    Delhi: 12000,
    Bangalore: 8000,
    Pune: 7000,
    Hyderabad: 6500,
    Chennai: 7500,
    Kolkata: 6000,
  };

  // Property type multipliers
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
    
    // Calculate base value
    let value = baseRate * area * typeMultiplier;
    
    // Adjust for bedrooms (if applicable)
    if (propertyType !== 'plot' && propertyType !== 'commercial') {
      const bedroomFactor = 1 + (bedrooms - 2) * 0.1;
      value *= bedroomFactor;
    }
    
    // Depreciation based on age
    const depreciationRate = 0.02; // 2% per year
    const depreciation = 1 - (age * depreciationRate);
    value *= Math.max(depreciation, 0.7); // Minimum 70% of base value
    
    return Math.round(value);
  };

  const handleEstimate = () => {
    setEstimated(true);
  };

  const estimatedValue = calculateValue();
  const minValue = Math.round(estimatedValue * 0.9);
  const maxValue = Math.round(estimatedValue * 1.1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Property Value Generator</h1>
          </div>
          <p className="text-gray-600">
            Get an estimated market value for your property based on current market trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6">Property Details</h2>

            {/* Property Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="text-sm font-medium text-gray-700">
                  Carpet Area (sq ft)
                </label>
                <span className="text-sm font-semibold text-blue-600">
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
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>300 sq ft</span>
                <span>10,000 sq ft</span>
              </div>
            </div>

            {/* Bedrooms */}
            {propertyType !== 'plot' && propertyType !== 'commercial' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Bedrooms
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setBedrooms(num)}
                      className={`py-2 rounded-lg font-medium transition ${
                        bedrooms === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <label className="text-sm font-medium text-gray-700">
                  Property Age (years)
                </label>
                <span className="text-sm font-semibold text-blue-600">
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
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>New</span>
                <span>30 years</span>
              </div>
            </div>

            <button
              onClick={handleEstimate}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Estimate Value
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {estimated ? (
              <>
                {/* Estimated Value Card */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-5 h-5" />
                    <p className="text-sm opacity-90">Estimated Property Value</p>
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    ₹{estimatedValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm opacity-75">
                    Range: ₹{minValue.toLocaleString('en-IN')} - ₹{maxValue.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Property Summary */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Property Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Property Type</span>
                      </div>
                      <span className="font-semibold capitalize">{propertyType}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Location</span>
                      </div>
                      <span className="font-semibold">{city}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Maximize className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Area</span>
                      </div>
                      <span className="font-semibold">{area} sq ft</span>
                    </div>

                    {propertyType !== 'plot' && propertyType !== 'commercial' && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Home className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">Bedrooms</span>
                        </div>
                        <span className="font-semibold">{bedrooms} BHK</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Age</span>
                      </div>
                      <span className="font-semibold">{age} years</span>
                    </div>
                  </div>
                </div>

                {/* Price per sq ft */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Base Rate (per sq ft)</span>
                      <span className="font-semibold">
                        ₹{baseRates[city].toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated Rate (per sq ft)</span>
                      <span className="font-semibold text-blue-600">
                        ₹{Math.round(estimatedValue / area).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Estimate?
                </h3>
                <p className="text-gray-600">
                  Fill in the property details and click "Estimate Value" to get your property valuation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Disclaimer</h3>
          <p className="text-sm text-yellow-800">
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
