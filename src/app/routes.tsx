import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AddProperty } from './pages/AddProperty';
import { Favorites } from './pages/Favorites';
import { EMICalculator } from './pages/EMICalculator';
import { HomeLoan } from './pages/HomeLoan';
import { PropertyValue } from './pages/PropertyValue';
import { News } from './pages/News';
import { Guide } from './pages/Guide';
import { Profile } from './pages/Profile';
import { NotFoundError } from './pages/NotFoundError';
import { AuthError } from './pages/AuthError';
import { FormSubmissionError } from './pages/FormSubmissionError';
import { NetworkError } from './pages/NetworkError';
import { Header } from './components/Header';
import { ScrollToTop } from './components/ScrollToTop';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ScrollToTop />
      <Header />
      {children}
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
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