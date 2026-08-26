import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <PropertiesProvider>
            <RouterProvider router={router} />
          </PropertiesProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}