import { Newspaper, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function News() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const latestNews = [
    {
      id: 1,
      title: 'Real Estate Market Shows Strong Growth in Q1 2026',
      excerpt: 'The Indian real estate market witnessed a 15% year-on-year growth in the first quarter of 2026, driven by increased demand in metro cities.',
      image: 'https://images.unsplash.com/photo-1708064931211-62825371b683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwbmV3cyUyMGluZGlhfGVufDF8fHx8MTc3NDM0NDgxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Market Trends',
      date: 'March 20, 2026',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Government Announces New Housing Scheme for Middle-Class Families',
      excerpt: 'The government has launched a new affordable housing initiative targeting middle-class families with subsidized interest rates.',
      image: 'https://images.unsplash.com/photo-1743844914134-b744ec0623f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMGludmVzdG1lbnQlMjBndWlkZXxlbnwxfHx8fDE3NzQzNDQ4MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Policy Updates',
      date: 'March 18, 2026',
      readTime: '4 min read',
    },
    {
      id: 3,
      title: 'Smart Homes: The Future of Real Estate in India',
      excerpt: 'Technology integration in residential properties is becoming a key selling point, with smart home features gaining popularity among buyers.',
      image: 'https://images.unsplash.com/photo-1759428935131-cee6cd331234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwYnV5aW5nJTIwdGlwc3xlbnwxfHx8fDE3NzQzNDQ4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Technology',
      date: 'March 15, 2026',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Mumbai Property Prices Rise by 12% in Last Six Months',
      excerpt: 'Mumbai continues to lead the real estate market with significant price appreciation, particularly in suburbs and upcoming areas.',
      image: 'https://images.unsplash.com/photo-1708064931211-62825371b683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwbmV3cyUyMGluZGlhfGVufDF8fHx8MTc3NDM0NDgxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'City Updates',
      date: 'March 12, 2026',
      readTime: '4 min read',
    },
    {
      id: 5,
      title: 'Commercial Real Estate Sector Sees Revival Post-Pandemic',
      excerpt: 'Office spaces and commercial properties are witnessing increased demand as companies adopt hybrid work models.',
      image: 'https://images.unsplash.com/photo-1743844914134-b744ec0623f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMGludmVzdG1lbnQlMjBndWlkZXxlbnwxfHx8fDE3NzQzNDQ4MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Commercial',
      date: 'March 10, 2026',
      readTime: '5 min read',
    },
    {
      id: 6,
      title: 'Sustainable Building Practices Gain Momentum in India',
      excerpt: 'Green buildings and eco-friendly construction methods are becoming increasingly popular among developers and buyers.',
      image: 'https://images.unsplash.com/photo-1759428935131-cee6cd331234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwYnV5aW5nJTIwdGlwc3xlbnwxfHx8fDE3NzQzNDQ4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Sustainability',
      date: 'March 8, 2026',
      readTime: '7 min read',
    },
    {
      id: 7,
      title: 'Bengaluru Emerges as Top Choice for Tech Professionals',
      excerpt: 'The IT capital continues to attract young professionals with premium residential projects and excellent connectivity.',
      image: 'https://images.unsplash.com/photo-1708064931211-62825371b683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwbmV3cyUyMGluZGlhfGVufDF8fHx8MTc3NDM0NDgxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'City Updates',
      date: 'March 5, 2026',
      readTime: '5 min read',
    },
    {
      id: 8,
      title: 'RERA Brings Transparency to Real Estate Sector',
      excerpt: 'The Real Estate Regulatory Authority continues to strengthen buyer protection and ensure project accountability.',
      image: 'https://images.unsplash.com/photo-1743844914134-b744ec0623f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMGludmVzdG1lbnQlMjBndWlkZXxlbnwxfHx8fDE3NzQzNDQ4MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Policy Updates',
      date: 'March 3, 2026',
      readTime: '6 min read',
    },
  ];

  const categories = ['All', 'Market Trends', 'Policy Updates', 'Technology', 'City Updates', 'Commercial', 'Sustainability'];

  // Filter news based on selected category
  const filteredNews = selectedCategory === 'All' 
    ? latestNews 
    : latestNews.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Latest News</h1>
          </div>
          <p className="text-xl text-blue-100">
            Stay updated with the latest real estate news and market insights
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition ${selectedCategory === category ? 'bg-blue-600 text-white' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {filteredNews.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-80 lg:h-auto">
                  <img
                    src={filteredNews[0].image}
                    alt={filteredNews[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-10">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full mb-4">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    {filteredNews[0].category}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {filteredNews[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">{filteredNews[0].excerpt}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{filteredNews[0].date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{filteredNews[0].readTime}</span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                    Read Full Article →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest News Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {selectedCategory === 'All' ? 'All News' : `${selectedCategory} News`}
          </h2>
          {filteredNews.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.slice(1).map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No news articles found in this category.</p>
            </div>
          ) : null}
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