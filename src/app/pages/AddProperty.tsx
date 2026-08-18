import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { propertiesApi } from '../lib/api';
import { Upload, MapPin, Home, DollarSign, ArrowLeft } from 'lucide-react';

export function AddProperty() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    type: 'apartment',
    status: 'for-sale',
    description: '',
    amenities: '',
    yearBuilt: '',
    parking: '',
    furnished: false,
    imageUrl: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Don't render form if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      const errors: string[] = [];
      
      if (!formData.title.trim()) errors.push('Property title is required');
      if (!formData.price || Number(formData.price) <= 0) errors.push('Valid price is required');
      if (!formData.location.trim()) errors.push('Location is required');
      if (!formData.city.trim()) errors.push('City is required');
      if (!formData.bedrooms || Number(formData.bedrooms) < 0) errors.push('Number of bedrooms is required');
      if (!formData.bathrooms || Number(formData.bathrooms) < 0) errors.push('Number of bathrooms is required');
      if (!formData.area || Number(formData.area) <= 0) errors.push('Property area is required');
      if (!formData.description.trim()) errors.push('Property description is required');

      // If there are validation errors, redirect to error page
      if (errors.length > 0) {
        setLoading(false);
        navigate('/error/form-submission', {
          state: {
            errorDetails: errors,
            errorMessage: 'Please fix the following errors to submit your property listing:'
          }
        });
        return;
      }

      const imageUrl = formData.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';

      await propertiesApi.create({
        title:       formData.title,
        price:       Number(formData.price),
        location:    formData.location,
        city:        formData.city,
        bedrooms:    Number(formData.bedrooms),
        bathrooms:   Number(formData.bathrooms),
        area:        Number(formData.area),
        type:        formData.type,
        status:      formData.status,
        image:       imageUrl,
        images:      [imageUrl],
        description: formData.description,
        amenities:   formData.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a),
        yearBuilt:   formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
        parking:     formData.parking ? Number(formData.parking) : undefined,
        furnished:   formData.furnished,
      });

      setLoading(false);
      alert('Property published successfully!');
      navigate('/properties');
    } catch (error) {
      setLoading(false);
      navigate('/error/form-submission', {
        state: {
          errorDetails: ['An unexpected error occurred while saving your property'],
          errorMessage: 'Something went wrong. Please try again.'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      {/* Back Button - Top Left Corner */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Property</h1>
          <p className="text-gray-600">Fill in the details to list your property</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Modern 3BHK Apartment in Downtown"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="commercial">Commercial</option>
                  <option value="plot">Plot</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5000000"
                />
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft) *
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1200"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mumbai"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Locality *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bandra West"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  required
                  min="1"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  required
                  min="1"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  id="parking"
                  name="parking"
                  min="0"
                  value={formData.parking}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  min="1900"
                  max="2026"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2020"
                />
              </div>

              <div className="md:col-span-2 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Furnished</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your property..."
            />
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Gym, Swimming Pool, Parking (comma separated)"
            />
            <p className="text-sm text-gray-500 mt-1">Separate amenities with commas</p>
          </div>

          {/* Image URL */}
          <div className="mb-8">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Provide an image URL for your property</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}