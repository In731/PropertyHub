import { Newspaper, Calendar, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { newsApi, ApiNewsArticle } from '../lib/api';

// Fallback images since Google News RSS doesn't provide high-res thumbnails reliably
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1708064931211-62825371b683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1743844914134-b744ec0623f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1759428935131-cee6cd331234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
];

export function News() {
  const [news, setNews] = useState<ApiNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await newsApi.fetchLatest();
        if (mounted) {
          // Take top 10 articles
          setNews(data.slice(0, 10));
        }
      } catch (err) {
        if (mounted) setError('Failed to load latest news. Please try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNews();
    return () => { mounted = false; };
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
  };

  // Strip HTML tags from description (Google News puts links in descriptions)
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-medium">Fetching the latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Newspaper className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
        <p className="text-gray-600 text-center">{error}</p>
      </div>
    );
  }

  const featured = news[0];
  const gridNews = news.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Latest Real Estate News</h1>
          </div>
          <p className="text-xl text-blue-100">
            Live updates and market insights straight from Google News
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Featured Article */}
        {featured && (
          <div className="mb-12">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-80 lg:h-auto overflow-hidden">
                  <img
                    src={FALLBACK_IMAGES[0]}
                    alt="Featured News"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Top Story
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 line-clamp-3">
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg line-clamp-3">
                    {stripHtml(featured.description)}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(featured.pubDate)}</span>
                      </div>
                    </div>
                    <a 
                      href={featured.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Read Full Article <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest News Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
            More Recent Updates
          </h2>
          {gridNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridNews.map((article, index) => (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={article.guid}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer flex flex-col group"
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length]}
                      alt="News Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-3 group-hover:text-blue-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {stripHtml(article.description)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4 mt-auto">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.pubDate)}</span>
                      </div>
                      <span className="font-medium text-blue-600 group-hover:underline flex items-center gap-1">
                        Read <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-10 text-center text-white">
          <Newspaper className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get the latest real estate news and market insights delivered to your inbox weekly
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}