import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth';
import { Header } from '@/components/layout/header';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;