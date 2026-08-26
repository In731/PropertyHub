import { useParams, useNavigate } from 'react-router';
import { useProperties } from '../context/PropertiesContext';
import { useAuth } from '../context/AuthContext';
import {
  Bed, Bath, Maximize, Calendar, Car, Home,
  MapPin, Heart, Share2, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight,
  Star, MessageSquare, User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { reviewsApi, propertiesApi, ApiReview, tokenStore } from '../lib/api';

// ─── Star Rating Component ──────────────────────────────────────────────────────
function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
        >
          <Star
            className={`${sizeClass} ${
              star <= rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────────
function ReviewCard({ review, currentUserId, onDelete }: { review: ApiReview, currentUserId?: string, onDelete?: (id: string) => void }) {
  const dateStr = new Date(review.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">
            {review.user_name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{review.user_name || 'Anonymous'}</h4>
            <span className="text-xs text-gray-500">{dateStr}</span>
          </div>
          <StarRating rating={review.rating} size="sm" />
          <p className="mt-2 text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          
          {currentUserId === review.user_id && (
            <div className="mt-3 flex gap-3">
              <button onClick={() => onDelete?.(review.id)} className="text-sm font-medium text-red-600 hover:text-red-800 transition">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, refresh } = useProperties();
  const { user } = useAuth();
  const property = properties.find(p => p.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

  // ─── Review State ──────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isLoggedIn = !!tokenStore.get();

  useEffect(() => {
    if (id) {
      // Check if property is in favorites
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(id));
    }
  }, [id]);

  // Fetch reviews on mount
  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    reviewsApi
      .list(id)
      .then((data) => setReviews(data))
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => setReviewsLoading(false));
  }, [id]);

  // Computed review stats
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitError('');
    setSubmitSuccess(false);

    if (newRating === 0) {
      setSubmitError('Please select a star rating.');
      return;
    }
    if (!newComment.trim()) {
      setSubmitError('Please write a comment.');
      return;
    }

    setSubmitLoading(true);
    try {
      const created = await reviewsApi.create(id, newRating, newComment.trim());
      setReviews((prev) => [created, ...prev]);
      setNewRating(0);
      setNewComment('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!id || !window.confirm('Delete this review?')) return;
    try {
      await reviewsApi.delete(id, reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (e: any) {
      alert(e.message || 'Failed to delete review');
    }
  };

  const handleDeleteProperty = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await propertiesApi.delete(id);
      await refresh();
      navigate('/properties');
    } catch (e: any) {
      alert(e.message || 'Failed to delete property');
    }
  };

  const handleFavoriteClick = () => {
    if (!id) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updated = favorites.filter((favId: string) => favId !== id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      // Add to favorites
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShareClick = async () => {
    if (!property) return;

    const shareUrl = window.location.href;
    const shareData = {
      title: property.title,
      text: `Check out this property: ${property.title} - ${formatPrice(property.price, property.status)}`,
      url: shareUrl,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        // Show a better notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = 'Link copied to clipboard!';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } catch (err: any) {
      // If clipboard fails, provide a manual copy option
      if (err.name !== 'AbortError') {
        console.log('Error sharing:', err);
        prompt('Copy this link:', shareUrl);
      }
    }
  };

  // Custom arrow components for carousel
  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: (property?.images?.length ?? 0) > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: 'slick-dots !bottom-4',
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View All Properties
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, status: string) => {
    if (status === 'for-rent') {
      return `₹${price.toLocaleString('en-IN')}/month`;
    }
    return `₹${(price / 100000).toFixed(2)} Lacs`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to listings
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-xl overflow-hidden">
            <Slider {...sliderSettings}>
              {property.images.map((image, index) => (
                <div key={index} className="h-96 md:h-[500px]">
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-96 md:h-[500px] object-cover"
                  />
                </div>
              ))}
            </Slider>
            <div className="absolute top-4 right-4 flex gap-3 z-20">
              <button
                className={`p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition ${
                  isFavorite ? 'bg-red-50' : ''
                }`}
                onClick={handleFavoriteClick}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite ? 'text-red-600 fill-red-600' : 'text-gray-700'
                  }`}
                />
              </button>
              <button
                className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
                onClick={handleShareClick}
              >
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Price */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-3">
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{property.location}, {property.city}</span>
                  </div>
                  {user?.id === property.userId && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/edit-property/${id}`)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition text-sm"
                      >
                        Edit Listing
                      </button>
                      <button
                        onClick={handleDeleteProperty}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {formatPrice(property.price, property.status)}
              </div>
              
              {/* RERA Number for apartments, villas, and commercial */}
              {property.reraNumber && (property.type === 'apartment' || property.type === 'villa' || property.type === 'commercial') && (
                <div className="text-sm text-gray-500 mt-2">
                  RERA: {property.reraNumber}
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Maximize className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{property.area}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold capitalize">{property.type}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.yearBuilt && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Year Built</div>
                      <div className="font-semibold">{property.yearBuilt}</div>
                    </div>
                  </div>
                )}
                {property.parking && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Parking</div>
                      <div className="font-semibold">{property.parking} Spaces</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Home className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Furnished</div>
                    <div className="font-semibold">{property.furnished ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Reviews & Ratings Section ─────────────────────────────────── */}
            <div className="bg-white rounded-xl p-6 mb-6" id="reviews-section">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
                <span className="ml-auto text-sm text-gray-500">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>

              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  {/* Average */}
                  <div className="flex flex-col items-center justify-center sm:pr-6 sm:border-r border-blue-200">
                    <div className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
                    <StarRating rating={Math.round(avgRating)} size="md" />
                    <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="flex-1 space-y-1.5">
                    {ratingCounts.map(({ star, count }) => {
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-6 text-right font-medium text-gray-700">{star}</span>
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-gray-500">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Write a Review Form */}
              <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Write a Review
                </h3>

                {isLoggedIn ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Your Rating</label>
                      <StarRating
                        rating={newRating}
                        size="lg"
                        interactive
                        onRate={setNewRating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Your Review</label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        placeholder="Share your experience about this property..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      />
                    </div>

                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {submitError}
                      </div>
                    )}

                    {submitSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                        ✅ Your review has been submitted successfully!
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
                    >
                      {submitLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <User className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">Log in to write a review</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Log In
                    </button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-500 mt-3 text-sm">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews yet. Be the first to review this property!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} currentUserId={user?.id} onDelete={handleDeleteReview} />
                  ))}
                </div>
              )}
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Location</h2>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>{property.location}, {property.city}</span>
                </p>
              </div>

              <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  title="Property Location"
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(property.location + ', ' + property.city)}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-900">📍 Note:</span> The map shows the approximate location of the property in {property.location}.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
              
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">PH</span>
                </div>
                <h3 className="text-center font-semibold">PropertyHub Agent</h3>
                <p className="text-center text-sm text-gray-600">Real Estate Expert</p>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Phone className="w-5 h-5" />
                  Call Now
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                  <Mail className="w-5 h-5" />
                  Send Email
                </button>
              </div>

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="I'm interested in this property"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}