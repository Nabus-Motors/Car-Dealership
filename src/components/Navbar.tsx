import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Button, Icons } from './ui';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Rely on backdrop click for outside close

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Icons.car className="h-8 w-8 text-red-600" />
            <span className="font-bold text-xl">Nabus Motors</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="text-gray-700" onClick={() => setMobileOpen(true)}>
              <Icons.menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (left like admin) */}
      <div className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        {/* Panel */}
        <div
          ref={mobileMenuRef}
          className={`absolute left-0 top-0 h-full w-72 max-w-[85%] bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icons.car className="h-6 w-6 text-red-600" />
              <span className="font-semibold">Nabus Motors</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <Icons.x className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}