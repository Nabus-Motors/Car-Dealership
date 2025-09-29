import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminFloatingButton } from './components/AdminFloatingButton';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ListingsManagement } from './pages/admin/ListingsManagement';
import { AddEditListing } from './pages/admin/AddEditListing';
import { useAuth } from './context/AuthContext';

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Admin router wrapper that determines current page from URL
function AdminRouter({ onNavigate }: { onNavigate: (path: string) => void }) {
  const location = useLocation();
  
  // Determine current page from pathname
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path.includes('/admin/listings')) return 'listings';
    if (path.includes('/admin/add-listing')) return 'add-listing';
    if (path.includes('/admin/edit-listing')) return 'add-listing';
    return 'dashboard';
  };
  
  return (
    <AdminLayout
      onNavigate={onNavigate}
      currentPage={getCurrentPage()}
    >
      <Routes>
        <Route index element={<AdminDashboard onNavigate={onNavigate} />} />
        <Route path="listings" element={<ListingsManagement onNavigate={onNavigate} />} />
        <Route path="add-listing" element={<AddEditListing onNavigate={onNavigate} />} />
        <Route path="edit-listing/:id" element={<AddEditListing onNavigate={onNavigate} />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    // Normalize known admin routes to absolute paths
    if (path === 'dashboard') {
      navigate('/admin');
      return;
    }
    if (path === 'listings') {
      navigate('/admin/listings');
      return;
    }
    if (path === 'add-listing') {
      navigate('/admin/add-listing');
      return;
    }
    if (path.startsWith('edit-listing/')) {
      navigate(`/admin/${path}`);
      return;
    }
    if (path === 'main-site') {
      navigate('/');
      return;
    }
    // If an absolute path is passed, use it as is
    if (path.startsWith('/')) {
      navigate(path);
      return;
    }
    // Fallback: treat as relative to /admin
    navigate(`/admin/${path}`);
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminRouter onNavigate={handleNavigation} />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer onNavigate={handleNavigation} />
        
        {/* Floating Admin Button */}
        <AdminFloatingButton />
      </div>
    </AuthProvider>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}