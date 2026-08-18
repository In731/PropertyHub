import { BookOpen, TrendingUp, FileText, Shield, Calculator, Home, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

export function Guide() {
  const propertyGuides = [
    {
      id: 1,
      title: 'First-Time Home Buyer\'s Guide',
      description: 'Everything you need to know about buying your first property',
      icon: Home,
      articles: 12,
      topics: [
        'Understanding your budget',
        'Choosing the right location',
        'Property inspection checklist',
        'Negotiation strategies',
      ],
      color: 'blue',
    },
    {
      id: 2,
      title: 'Property Investment Tips',
      description: 'Expert advice on making smart real estate investments',
      icon: TrendingUp,
      articles: 8,
      topics: [
        'ROI calculation methods',
        'Market trend analysis',
        'Rental property management',
        'Tax benefits for investors',
      ],
      color: 'green',
    },
    {
      id: 3,
      title: 'Home Loan Guide',
      description: 'Complete guide to understanding and applying for home loans',
      icon: Calculator,
      articles: 15,
      topics: [
        'Types of home loans',
        'Interest rate comparison',
        'EMI calculation guide',
        'Pre-approval process',
      ],
      color: 'purple',
    },
    {
      id: 4,
      title: 'Legal Documentation',
      description: 'Understanding property papers and legal requirements',
      icon: FileText,
      articles: 10,
      topics: [
        'Essential documents checklist',
        'Title verification process',
        'Registration procedures',
        'Legal due diligence',
      ],
      color: 'orange',
    },
    {
      id: 5,
      title: 'RERA Compliance Guide',
      description: 'Everything about Real Estate Regulatory Authority',
      icon: Shield,
      articles: 7,
      topics: [
        'Understanding RERA',
        'Buyer protection rights',
        'Project registration check',
        'Filing complaints',
      ],
      color: 'red',
    },
    {
      id: 6,
      title: 'Property Valuation',
      description: 'How to assess the true value of a property',
      icon: BookOpen,
      articles: 9,
      topics: [
        'Valuation methods',
        'Market comparison approach',
        'Factors affecting value',
        'Professional appraisal',
      ],
      color: 'indigo',
    },
  ];

  const popularArticles = [
    {
      title: '10 Things Every First-Time Home Buyer Should Know',
      category: 'Home Buying',
      readTime: '8 min read',
    },
    {
      title: 'How to Calculate Your Home Loan EMI',
      category: 'Home Loans',
      readTime: '5 min read',
    },
    {
      title: 'Complete Checklist for Property Documentation',
      category: 'Legal',
      readTime: '10 min read',
    },
    {
      title: 'Understanding Property Registration Process in India',
      category: 'Legal',
      readTime: '12 min read',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; hover: string } } = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', hover: 'hover:bg-red-100' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'hover:bg-indigo-100' },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Property Guides</h1>
          </div>
          <p className="text-xl text-green-100">
            Expert guides and resources to help you make informed real estate decisions
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Guides Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse Guides by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyGuides.map((guide) => {
              const colors = getColorClasses(guide.color);
              return (
                <div
                  key={guide.id}
                  className={`${colors.bg} rounded-xl p-6 ${colors.hover} transition cursor-pointer group`}
                >
                  <div className={`w-14 h-14 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <guide.icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {guide.topics.map((topic, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">{guide.articles} articles</span>
                    <span className={`${colors.text} font-semibold text-sm flex items-center gap-1`}>
                      Explore <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Articles Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer group"
              >
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-3">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600">{article.readTime}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Helpful Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/services/emi-calculator"
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white hover:shadow-xl transition group"
            >
              <Calculator className="w-12 h-12 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold mb-2">EMI Calculator</h3>
              <p className="text-blue-100 mb-4">Calculate your monthly loan payments</p>
              <span className="inline-flex items-center gap-2 font-semibold">
                Try Now <ChevronRight className="w-5 h-5" />
              </span>
            </Link>

            <Link 
              to="/services/home-loan"
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-8 text-white hover:shadow-xl transition group"
            >
              <Home className="w-12 h-12 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold mb-2">Home Loan</h3>
              <p className="text-purple-100 mb-4">Get the best home loan rates</p>
              <span className="inline-flex items-center gap-2 font-semibold">
                Apply Now <ChevronRight className="w-5 h-5" />
              </span>
            </Link>

            <Link 
              to="/services/property-value"
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-8 text-white hover:shadow-xl transition group"
            >
              <TrendingUp className="w-12 h-12 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-bold mb-2">Property Value</h3>
              <p className="text-orange-100 mb-4">Estimate your property's worth</p>
              <span className="inline-flex items-center gap-2 font-semibold">
                Check Now <ChevronRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-10 text-center text-white">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Need Personalized Guidance?</h2>
          <p className="text-green-100 mb-8 text-lg">
            Our real estate experts are here to help you with personalized advice and support
          </p>
          <button className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold text-lg">
            Talk to an Expert
          </button>
        </div>
      </div>
    </div>
  );
}
