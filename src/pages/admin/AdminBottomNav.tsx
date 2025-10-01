import React from 'react';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Car, PlusCircle, Settings } from 'lucide-react';

type AdminPageKey = 'dashboard' | 'listings' | 'add-listing' | 'settings';

interface AdminBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const items: Array<{
  id: AdminPageKey;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'listings', label: 'Listings', icon: Car },
  { id: 'add-listing', label: 'Add', icon: PlusCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminBottomNav({ currentPage, onNavigate }: AdminBottomNavProps) {
  return (
    <nav
      aria-label="Admin bottom navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-gray-200"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon as any;
          return (
            <li key={item.id} className="flex">
              <Button
                variant="ghost"
                className={cn(
                  'flex-1 h-14 rounded-none flex flex-col items-center justify-center gap-1 text-xs',
                  isActive
                    ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'text-red-600' : 'text-gray-600')} />
                <span>{item.label}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default AdminBottomNav;
