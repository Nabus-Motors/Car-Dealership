import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Close mobile menu on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Clone children and pass mobile menu toggle function
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onToggleMobileMenu: toggleMobileMenu
      });
    }
    return child;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Enhanced Mobile backdrop with smooth animation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ease-in-out"
          onClick={() => setMobileMenuOpen(false)}
          style={{ touchAction: 'none' }} // Prevent scroll on backdrop
        />
      )}
      
      <AdminSidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleMobile={toggleMobileMenu}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {childrenWithProps}
      </div>
    </div>
  );
}