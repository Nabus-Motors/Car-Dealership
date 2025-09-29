import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Car, PlusCircle, Users, Settings, X, ChevronLeft } from 'lucide-react';

import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge: string | null;
}

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onToggleMobile: () => void;
}

export function AdminSidebar({ currentPage, onNavigate, collapsed, mobileOpen, onToggleCollapse, onToggleMobile }: AdminSidebarProps) {
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'listings',
      label: 'Car Listings',
      icon: Car,
      badge: null
    },
    {
      id: 'add-listing',
      label: 'Add New Listing',
      icon: PlusCircle,
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: 'Soon'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    // Auto-close mobile menu after navigation for better UX
    if (mobileOpen) {
      setTimeout(() => onToggleMobile(), 150);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } shadow-sm`}>
        {/* Admin Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className={`transition-all duration-300 overflow-hidden ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}>
                <h2 className="text-lg font-semibold text-gray-900 whitespace-nowrap">AutoMax</h2>
                <p className="text-sm text-gray-500 whitespace-nowrap">Admin Panel</p>
              </div>
            </div>
            
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              onClick={onToggleCollapse}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${
                collapsed ? 'rotate-180' : ''
              }`} />
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.id} className="relative group">
              <Button
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full h-10 transition-all duration-200 ease-in-out ${
                  collapsed ? 'px-0 justify-center' : 'px-3 justify-start'
                } ${
                  currentPage === item.id 
                    ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                } ${
                  item.badge === 'Soon' ? 'opacity-60' : ''
                }`}
                onClick={() => handleNavigation(item.id)}
                disabled={item.badge === 'Soon'}
              >
                <item.icon className={`h-5 w-5 transition-colors duration-200 flex-shrink-0 ${
                  collapsed ? '' : 'mr-3'
                }`} />
                <span className={`font-medium transition-all duration-300 overflow-hidden ${
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}>
                  {item.label}
                </span>
                {!collapsed && item.badge && (
                  <Badge 
                    variant={item.badge === 'Soon' ? 'secondary' : 'default'}
                    className={`text-xs ml-auto transition-all duration-200 ${
                      item.badge === 'Soon' 
                        ? 'bg-gray-100 text-gray-500 border-gray-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 text-xs opacity-75">({item.badge})</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Back to Main Site */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="relative group">
            <Button
              variant="outline"
              className={`w-full h-10 transition-all duration-200 hover:bg-white hover:border-gray-300 active:bg-gray-50 ${
                collapsed ? 'px-0 justify-center' : 'px-3 justify-start'
              }`}
              onClick={() => handleNavigation('main-site')}
            >
              <svg className={`w-4 h-4 transition-all duration-300 flex-shrink-0 ${
                collapsed ? '' : 'mr-2'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className={`font-medium transition-all duration-300 overflow-hidden ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}>
                Back to Main Site
              </span>
            </Button>
            
            {/* Tooltip for collapsed back button */}
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Back to Main Site
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-xl`}>
        {/* Mobile Admin Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AutoMax</h2>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onToggleMobile}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={`w-full h-12 px-3 justify-start transition-all duration-200 ease-in-out ${
                currentPage === item.id 
                  ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
              } ${
                item.badge === 'Soon' ? 'opacity-60' : ''
              }`}
              onClick={() => handleNavigation(item.id)}
              disabled={item.badge === 'Soon'}
            >
              <item.icon className="h-5 w-5 mr-3 transition-colors duration-200" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={item.badge === 'Soon' ? 'secondary' : 'default'}
                  className={`text-xs ml-2 transition-all duration-200 ${
                    item.badge === 'Soon' 
                      ? 'bg-gray-100 text-gray-500 border-gray-200' 
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* Mobile Back to Main Site */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            className="w-full h-12 px-3 justify-start transition-all duration-200 hover:bg-white hover:border-gray-300 active:bg-gray-50"
            onClick={() => handleNavigation('main-site')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Main Site</span>
          </Button>
        </div>
      </div>
    </>
  );
}