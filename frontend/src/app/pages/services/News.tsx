import { Newspaper, Calendar, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { newsApi, ApiNewsArticle } from '../../lib/api';

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

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Fetching the latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <Newspaper className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
      </div>
    );
  }

  const featured = news[0];
  const gridNews = news.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-10 h-10" />
            <h1 className="text-4xl font-extrabold">Latest Real Estate News</h1>
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
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition group">
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
                    <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Top Story
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-3">
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base line-clamp-3">
                    {stripHtml(featured.description)}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featured.pubDate)}</span>
                    </div>
                    <a 
                      href={featured.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-sm"
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            More Recent Updates
          </h2>
          {gridNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridNews.map((article, index) => (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={article.guid}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col group"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length]}
                      alt="News Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 line-clamp-3 flex-grow">
                      {stripHtml(article.description)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(article.pubDate)}</span>
                      </div>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white shadow-xl shadow-blue-600/20">
          <Newspaper className="w-14 h-14 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-blue-100 mb-8 text-base">
            Get the latest real estate news and market insights delivered to your inbox weekly
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold transition text-sm shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
