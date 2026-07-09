import React from 'react';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onNavigate
      });
    }
    return child;
  });

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'listings': return 'Car Listings';
      case 'add-listing': return 'Add New Listing';
      case 'settings': return 'Settings';
      default: return 'Admin Panel';
    }
  };

  return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100 ">

        <div className="max-w-[1600px] mx-auto w-full flex flex-col min-h-screen items-center">

          <AdminHeader
              title={getPageTitle()}
              currentPage={currentPage}
              onNavigate={onNavigate}
              showSearch={currentPage === 'listings'}
              searchPlaceholder="Search car listings..."
          />

          <main className="flex-1 overflow-auto pb-16 md:pb-0 w-full mt-3">
            {childrenWithProps}
          </main>

        </div>
      </div>
  );
}