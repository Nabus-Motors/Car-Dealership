import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Car, PlusCircle, ArrowLeft, LayoutDashboard } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function AdminHeader({ title, showSearch = false, searchPlaceholder = "Search...", onSearch, currentPage, onNavigate }: AdminHeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">{title}</h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        {showSearch && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        )}

        {/* User Profile and Navigation - Simplified */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Back button for mobile */}
          {currentPage !== 'dashboard' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('dashboard')}
              className="md:hidden p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          {/* Navigation buttons - visible on larger screens */}
          <div className="hidden md:flex items-center space-x-2">
            {currentPage !== 'dashboard' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            )}
            {currentPage !== 'listings' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('listings')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Car className="w-4 h-4 mr-1" />
                Listings
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('add-listing')}
              className="text-gray-600 hover:text-gray-900"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Add Car
            </Button>
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
              3
            </Badge>
          </Button>
          
          {/* Profile Section - Simplified */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('main-site')}
              className="hidden sm:flex text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Main Site
            </Button>
            <Avatar 
              className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-red-200 transition-all"
              onClick={() => onNavigate?.('settings')}
            >
              <AvatarFallback className="bg-red-100 text-red-700 text-sm font-medium">NM</AvatarFallback>
            </Avatar>
            <div 
              className="hidden lg:block text-left cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate?.('settings')}
            >
              <p className="text-sm font-medium text-gray-900">Admin Manager</p>
              <p className="text-xs text-gray-500">admin@nabusmotors.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}