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
import { Toaster } from 'react-hot-toast';
// import { useAuth } from './context/AuthContext'; // Temporarily commented for testing

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Temporarily disabled for testing - remove this comment and uncomment below when done
  return <>{children}</>;
  
  // const { user, isAdmin } = useAuth();
  // 
  // if (!user || !isAdmin) {
  //   return <Navigate to="/" replace />;
  // }
  // 
  // return <>{children}</>;
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
  <Route path="add-listing" element={<AddEditListing />} />
  <Route path="edit-listing/:id" element={<AddEditListing />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
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
        {/* Hide navbar on admin routes */}
        {!isAdminRoute && <Navbar />}
        
        <main className={isAdminRoute ? "flex-grow" : "flex-grow"}>
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

        {/* Hide footer on admin routes */}
        {!isAdminRoute && <Footer onNavigate={handleNavigation} />}
        
        {/* Hide floating admin button on admin routes */}
        {!isAdminRoute && <AdminFloatingButton />}
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
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