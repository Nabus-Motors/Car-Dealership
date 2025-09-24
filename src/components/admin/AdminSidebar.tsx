import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AdminSidebar({ currentPage, onNavigate }: AdminSidebarProps) {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      badge: null
    },
    {
      id: 'listings',
      label: 'Car Listings',
      icon: '🚗',
      badge: '24'
    },
    {
      id: 'add-listing',
      label: 'Add New Listing',
      icon: '➕',
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      badge: 'Soon'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      badge: null
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Admin Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AutoMax</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "secondary" : "ghost"}
            className={`w-full justify-start h-12 px-3 ${
              currentPage === item.id 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onNavigate(item.id)}
            disabled={item.badge === 'Soon'}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge 
                variant={item.badge === 'Soon' ? 'secondary' : 'default'}
                className={`text-xs ${
                  item.badge === 'Soon' 
                    ? 'bg-gray-100 text-gray-500' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* Back to Main Site */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNavigate('main-site')}
        >
          ← Back to Main Site
        </Button>
      </div>
    </div>
  );
}