import { createBrowserRouter } from 'react-router';
// Layout components
import { Header } from './components/layout/Header';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Property Pages
import { Home } from './pages/properties/Home';
import { Properties } from './pages/properties/Properties';
import { PropertyDetail } from './pages/properties/PropertyDetail';
import { AddProperty } from './pages/properties/AddProperty';
import { Favorites } from './pages/properties/Favorites';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Service Pages
import { EMICalculator } from './pages/services/EMICalculator';
import { HomeLoan } from './pages/services/HomeLoan';
import { PropertyValue } from './pages/services/PropertyValue';
import { News } from './pages/services/News';
import { Guide } from './pages/services/Guide';

// User Pages
import { Profile } from './pages/user/Profile';

// Error Pages
import { NotFoundError } from './pages/errors/NotFoundError';
import { AuthError } from './pages/errors/AuthError';
import { FormSubmissionError } from './pages/errors/FormSubmissionError';
import { NetworkError } from './pages/errors/NetworkError';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <ScrollToTop />
      <Header />
      {children}
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <ScrollToTop />
      {children}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/properties',
    element: <Layout><Properties /></Layout>,
  },
  {
    path: '/property/:id',
    element: <Layout><PropertyDetail /></Layout>,
  },
  {
    path: '/favorites',
    element: <Layout><Favorites /></Layout>,
  },
  {
    path: '/services/emi-calculator',
    element: <Layout><EMICalculator /></Layout>,
  },
  {
    path: '/services/home-loan',
    element: <Layout><HomeLoan /></Layout>,
  },
  {
    path: '/services/property-value',
    element: <Layout><PropertyValue /></Layout>,
  },
  {
    path: '/news',
    element: <Layout><News /></Layout>,
  },
  {
    path: '/guides',
    element: <Layout><Guide /></Layout>,
  },
  {
    path: '/profile',
    element: <Layout><Profile /></Layout>,
  },
  {
    path: '/login',
    element: <AuthLayout><Login /></AuthLayout>,
  },
  {
    path: '/signup',
    element: <AuthLayout><Signup /></AuthLayout>,
  },
  {
    path: '/forgot-password',
    element: <AuthLayout><ForgotPassword /></AuthLayout>,
  },
  {
    path: '/reset-password',
    element: <AuthLayout><ResetPassword /></AuthLayout>,
  },
  {
    path: '/add-property',
    element: <Layout><AddProperty /></Layout>,
  },
  {
    path: '/edit-property/:id',
    element: <Layout><AddProperty /></Layout>,
  },
  {
    path: '/error/auth',
    element: <AuthLayout><AuthError /></AuthLayout>,
  },
  {
    path: '/error/form-submission',
    element: <Layout><FormSubmissionError /></Layout>,
  },
  {
    path: '/error/network',
    element: <Layout><NetworkError /></Layout>,
  },
  {
    path: '*',
    element: (
      <Layout>
        <NotFoundError />
      </Layout>
    ),
  },
]);
