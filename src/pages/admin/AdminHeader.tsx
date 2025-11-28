import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Avatar, AvatarFallback } from '@components/ui/avatar';
import { Menu, Search, Car, PlusCircle, ArrowLeft, LayoutDashboard, X } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';

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
  const { user } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white border-b-2 border-slate-200 px-4 lg:px-6 py-3 lg:py-4 relative shadow-sm">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-[#001F3F] truncate">{title}</h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        {showSearch && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
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
                className="text-slate-600 hover:text-[#001F3F] hover:bg-slate-100"
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
                className="text-slate-600 hover:text-[#001F3F] hover:bg-slate-100"
              >
                <Car className="w-4 h-4 mr-2" />
                Listings
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('add-listing')}
              className="text-slate-600 hover:text-[#001F3F] hover:bg-slate-100"
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
              className="hidden sm:flex text-slate-600 hover:text-[#001F3F]"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Main Site
            </Button>
            <Avatar 
              className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-[#FFD700] transition-all"
              onClick={() => onNavigate?.('settings')}
            >
              <AvatarFallback className="bg-[#FFD700]/20 text-[#FFD700] text-sm font-bold">AM</AvatarFallback>
            </Avatar>
            <div 
              className="hidden xl:block text-left max-w-[180px] truncate cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate?.('settings')}
            >
              <p className="text-sm font-semibold text-[#001F3F] truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || '—'}</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 h-10 w-10 flex items-center justify-center"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeMobileMenu} />
          {/* Panel */}
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-slate-200 shadow-lg z-50">
            <div className="px-4 py-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onNavigate?.('dashboard');
                closeMobileMenu();
              }}
              className={`w-full justify-start text-left hover:bg-slate-100 ${
                currentPage === 'dashboard' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-slate-700'
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
              className={`w-full justify-start text-left hover:bg-slate-100 ${
                currentPage === 'listings' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-slate-700'
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
              className={`w-full justify-start text-left hover:bg-slate-100 ${
                currentPage === 'add-listing' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-slate-700'
              }`}
            >
              <PlusCircle className="w-4 h-4 mr-3" />
              Add New Car
            </Button>
              <div className="border-t border-slate-200 my-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onNavigate?.('main-site');
                  closeMobileMenu();
                }}
                className="w-full justify-start text-left hover:bg-slate-100 text-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-3" />
                Back to Main Site
              </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 py-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
            />
          </div>
        </div>
      )}
    </header>
  );
}
