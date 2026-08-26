import { Link, useNavigate } from 'react-router';
import { Home, Heart, User, Menu, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBuyersDropdown, setShowBuyersDropdown] = useState(false);
  const [showTenantsDropdown, setShowTenantsDropdown] = useState(false);
  const [showSellersDropdown, setShowSellersDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showNewsDropdown, setShowNewsDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handlePostProperty = () => {
    if (isAuthenticated) {
      navigate('/add-property');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">PropertyHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* For Buyers Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowBuyersDropdown(true)}
              onMouseLeave={() => setShowBuyersDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition py-2">
                For Buyers
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBuyersDropdown && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                  <Link to="/properties?status=for-sale" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Buy Property
                  </Link>
                  <Link to="/properties?status=for-sale&propertyType=apartment" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Apartments
                  </Link>
                  <Link to="/properties?status=for-sale&propertyType=villa" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Villas
                  </Link>
                  <Link to="/properties?status=for-sale&propertyType=commercial" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Commercial
                  </Link>
                  <Link to="/properties?status=for-sale&propertyType=plot" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Plots
                  </Link>
                </div>
              )}
            </div>

            {/* For Tenants Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowTenantsDropdown(true)}
              onMouseLeave={() => setShowTenantsDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition py-2">
                For Tenants
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTenantsDropdown && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link to="/properties?status=for-rent" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Rent Property
                  </Link>
                  <Link to="/properties?status=for-rent&propertyType=apartment" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Apartments
                  </Link>
                  <Link to="/properties?status=for-rent&propertyType=house" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Houses
                  </Link>
                  <Link to="/properties?status=for-rent&propertyType=commercial" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Commercial
                  </Link>
                </div>
              )}
            </div>

            {/* For Sellers Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowSellersDropdown(true)}
              onMouseLeave={() => setShowSellersDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition py-2">
                For Sellers
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSellersDropdown && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button onClick={handlePostProperty} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Post Property
                  </button>
                  <Link to="/properties" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Browse Properties
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowServicesDropdown(true)}
              onMouseLeave={() => setShowServicesDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition py-2">
                Services
                <ChevronDown className="w-4 h-4" />
              </button>
              {showServicesDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link to="/services/emi-calculator" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    EMI Calculator
                  </Link>
                  <Link to="/services/home-loan" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Home Loan
                  </Link>
                  <Link to="/services/property-value" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Property Value Generator
                  </Link>
                </div>
              )}
            </div>

            {/* News & Guide Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowNewsDropdown(true)}
              onMouseLeave={() => setShowNewsDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition py-2">
                News & Guide
                <ChevronDown className="w-4 h-4" />
              </button>
              {showNewsDropdown && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link to="/news" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Latest News
                  </Link>
                  <Link to="/guides" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Property Guides
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            <Link to="/favorites" className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <Heart className="w-5 h-5" />
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Login</span>
              </Link>
            )}
            
            <button 
              onClick={handlePostProperty}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Post Property
            </button>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <nav className="flex flex-col gap-4">
              {isAuthenticated && (
                <div className="px-4 py-2 bg-gray-50 rounded-lg mb-2">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              )}
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                Home
              </Link>
              <Link to="/properties?status=for-sale" className="text-gray-700 hover:text-blue-600 transition">
                Buy
              </Link>
              <Link to="/properties?status=for-rent" className="text-gray-700 hover:text-blue-600 transition">
                Rent
              </Link>
              <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">
                All Properties
              </Link>
              <Link to="/favorites" className="text-gray-700 hover:text-blue-600 transition">
                Favorites
              </Link>
              <Link to="/services/emi-calculator" className="text-gray-700 hover:text-blue-600 transition">
                EMI Calculator
              </Link>
              <Link to="/services/home-loan" className="text-gray-700 hover:text-blue-600 transition">
                Home Loan
              </Link>
              <Link to="/news" className="text-gray-700 hover:text-blue-600 transition">
                News
              </Link>
              <Link to="/guides" className="text-gray-700 hover:text-blue-600 transition">
                Guides
              </Link>
              <button 
                onClick={handlePostProperty}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-left"
              >
                Post Property
              </button>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-left"
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}