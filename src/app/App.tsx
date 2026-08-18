import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PropertiesProvider>
          <RouterProvider router={router} />
        </PropertiesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}