import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { propertiesApi } from '../../lib/api';
import { MapPin, Home, ArrowLeft } from 'lucide-react';
import { ImageUpload } from '../../components/common/ImageUpload';

export function AddProperty() {
  const { id } = useParams();
  const isEditing = !!id;
  const { isAuthenticated } = useAuth();
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
    images: [] as string[],
  });

  // Fetch existing data if editing
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      propertiesApi.get(id)
        .then(prop => {
          setFormData({
            title: prop.title || '',
            price: String(prop.price || ''),
            location: prop.location || '',
            city: prop.city || '',
            bedrooms: String(prop.bedrooms || ''),
            bathrooms: String(prop.bathrooms || ''),
            area: String(prop.area || ''),
            type: prop.type || 'apartment',
            status: prop.status || 'for-sale',
            description: prop.description || '',
            amenities: prop.amenities?.join(', ') || '',
            yearBuilt: String(prop.yearBuilt || ''),
            parking: String(prop.parking || ''),
            furnished: prop.furnished || false,
            images: prop.images && prop.images.length > 0 ? prop.images : (prop.image ? [prop.image] : []),
          });
        })
        .catch(err => {
          console.error("Failed to fetch property for editing:", err);
          navigate('/properties');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

      const finalImages = formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];
      const primaryImage = finalImages[0];

      const payload = {
        title:       formData.title,
        price:       Number(formData.price),
        location:    formData.location,
        city:        formData.city,
        bedrooms:    Number(formData.bedrooms),
        bathrooms:   Number(formData.bathrooms),
        area:        Number(formData.area),
        type:        formData.type,
        status:      formData.status,
        image:       primaryImage,
        images:      finalImages,
        description: formData.description,
        amenities:   formData.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a),
        yearBuilt:   formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
        parking:     formData.parking ? Number(formData.parking) : undefined,
        furnished:   formData.furnished,
      };

      if (isEditing && id) {
        await propertiesApi.update(id, payload);
      } else {
        await propertiesApi.create(payload);
      }

      setLoading(false);
      navigate(isEditing ? `/property/${id}` : '/properties');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 relative transition-colors">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition z-10 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{isEditing ? 'Edit Property' : 'Post Your Property'}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{isEditing ? 'Update the details of your listing' : 'Fill in the details to list your property'}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-10 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Modern 3BHK Apartment in Downtown"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Listing Type *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Property Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., 5000000"
                />
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Area (sq ft) *
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., 1200"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Mumbai"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Locality *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Bandra West"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <label htmlFor="parking" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  id="parking"
                  name="parking"
                  min="0"
                  value={formData.parking}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <label htmlFor="yearBuilt" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., 2020"
                />
              </div>

              <div className="md:col-span-2 flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Furnished Property</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Describe your property in detail..."
            />
          </div>

          {/* Amenities */}
          <div>
            <label htmlFor="amenities" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g., Gym, Swimming Pool, Parking (comma separated)"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate amenities with commas</p>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Images</h2>
            <ImageUpload 
              images={formData.images}
              onChange={(images) => setFormData(prev => ({ ...prev, images }))}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="px-8 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-md shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Save Changes' : 'Publish Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
