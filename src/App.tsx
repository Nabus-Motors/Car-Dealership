import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ListingsManagement } from './components/admin/ListingsManagement';
import { AddEditListing } from './components/admin/AddEditListing';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | undefined>();

  const handleNavigation = (page: string, carId?: string) => {
    if (page === 'admin') {
      setIsAdminMode(true);
      setCurrentPage('login');
    } else if (page === 'main-site') {
      setIsAdminMode(false);
      setIsAuthenticated(false);
      setCurrentPage('home');
    } else if (page === 'edit-listing') {
      setCurrentPage('edit-listing');
      setEditingCarId(carId);
    } else {
      setCurrentPage(page);
      setEditingCarId(undefined);
    }
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleBackToMainSite = () => {
    setIsAdminMode(false);
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const renderAdminPage = () => {
    // Show login screen if not authenticated
    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleLogin} onBack={handleBackToMainSite} />;
    }

    // Show admin pages if authenticated
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigation} />;
      case 'listings':
        return <ListingsManagement onNavigate={handleNavigation} />;
      case 'add-listing':
        return <AddEditListing onNavigate={handleNavigation} />;
      case 'edit-listing':
        return <AddEditListing onNavigate={handleNavigation} carId={editingCarId} />;
      case 'users':
      case 'settings':
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600">This feature is currently under development.</p>
            </div>
          </div>
        );
      default:
        return <AdminDashboard onNavigate={handleNavigation} />;
    }
  };

  const renderMainSitePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  if (isAdminMode) {
    // Show login screen without admin layout
    if (!isAuthenticated) {
      return renderAdminPage();
    }
    
    // Show admin layout with authenticated pages
    return (
      <AdminLayout currentPage={currentPage} onNavigate={handleNavigation}>
        {renderAdminPage()}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigation} />
      
      <main className="flex-1">
        {renderMainSitePage()}
      </main>
      
      <Footer onNavigate={handleNavigation} />
      
      {/* Admin Access Button */}
      <button
        onClick={() => handleNavigation('admin')}
        className="fixed bottom-4 left-4 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-colors z-50"
        title="Admin Panel"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}