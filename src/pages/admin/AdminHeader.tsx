import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Search, Bell, User, Settings, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({ title, showSearch = false, searchPlaceholder = "Search...", onSearch, onToggleMobileMenu }: AdminHeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button and Title */}
        <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 p-0 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onToggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">{title}</h1>
        </div>

        {/* Search Bar - Desktop */}
        {showSearch && (
          <div className="relative hidden md:block flex-1 max-w-md mx-4">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 h-10 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Admin Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Button */}
          {showSearch && (
            <Button variant="ghost" size="sm" className="md:hidden h-10 w-10 p-0 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
              3
            </Badge>
          </Button>

          {/* Admin Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-10 px-2 lg:px-3 hover:bg-gray-100 rounded-lg transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-red-100 text-red-700 text-sm font-medium">AM</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin Manager</p>
                  <p className="text-xs text-gray-500">admin@automax.com</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <DropdownMenuItem className="h-10 cursor-pointer">
                <User className="w-4 h-4 mr-3" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-10 cursor-pointer">
                <Settings className="w-4 h-4 mr-3" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="h-10 text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                <LogOut className="w-4 h-4 mr-3" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 h-10 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}