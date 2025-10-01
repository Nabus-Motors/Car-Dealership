import React from 'react';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  // Clone children and pass navigation props if needed
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onNavigate
      });
    }
    return child;
  });

  // Determine the page title based on current page
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'listings':
        return 'Car Listings';
      case 'add-listing':
        return 'Add New Listing';
      case 'settings':
        return 'Settings';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader 
        title={getPageTitle()}
        currentPage={currentPage}
        onNavigate={onNavigate}
        showSearch={currentPage === 'listings'}
        searchPlaceholder="Search car listings..."
      />
      
      <main className="flex-1 overflow-auto">
        {childrenWithProps}
      </main>
    </div>
  );
}