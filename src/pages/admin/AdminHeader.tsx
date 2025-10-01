import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Search, Car, PlusCircle, ArrowLeft, LayoutDashboard, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 relative">
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

        {/* Right Side - Navigation & Profile */}
        <div className="flex items-center space-x-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {currentPage !== 'dashboard' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('dashboard')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            )}
            {currentPage !== 'listings' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('listings')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Car className="w-4 h-4 mr-2" />
                Listings
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('add-listing')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Car
            </Button>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('main-site')}
              className="hidden sm:flex text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Main Site
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-red-100 text-red-700 text-sm font-medium">AM</AvatarFallback>
            </Avatar>
            <div className="hidden xl:block text-left">
              <p className="text-sm font-medium text-gray-900">Admin Manager</p>
              <p className="text-xs text-gray-500">admin@automax.com</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onNavigate?.('dashboard');
                closeMobileMenu();
              }}
              className={`w-full justify-start text-left hover:bg-gray-100 ${
                currentPage === 'dashboard' ? 'bg-red-50 text-red-700' : 'text-gray-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onNavigate?.('listings');
                closeMobileMenu();
              }}
              className={`w-full justify-start text-left hover:bg-gray-100 ${
                currentPage === 'listings' ? 'bg-red-50 text-red-700' : 'text-gray-700'
              }`}
            >
              <Car className="w-4 h-4 mr-3" />
              Car Listings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onNavigate?.('add-listing');
                closeMobileMenu();
              }}
              className={`w-full justify-start text-left hover:bg-gray-100 ${
                currentPage === 'add-listing' ? 'bg-red-50 text-red-700' : 'text-gray-700'
              }`}
            >
              <PlusCircle className="w-4 h-4 mr-3" />
              Add New Car
            </Button>
            <div className="border-t border-gray-200 my-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onNavigate?.('main-site');
                  closeMobileMenu();
                }}
                className="w-full justify-start text-left hover:bg-gray-100 text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-3" />
                Back to Main Site
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 py-3 border-b border-gray-200">
          <div className="relative">
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
    </header>
  );
}