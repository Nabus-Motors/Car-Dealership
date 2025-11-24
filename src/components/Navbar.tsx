import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Menu, Search, User, X } from 'lucide-react';

const navigation = [
  { name: 'Inventory', href: '/explore' },
  { name: 'Best Deals', href: '/explore' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#001F3F]/95 backdrop-blur-sm border-b border-[#FFD700]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFD700] rounded flex items-center justify-center">
              <span className="text-[#001F3F] font-bold text-sm">NM</span>
            </div>
            <div>
              <div className="text-sm tracking-wider font-semibold text-white">Nabus</div>
              <div className="text-xs text-[#FFD700]">Motors</div>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === item.href
                    ? 'text-[#FFD700]'
                    : 'text-white hover:text-[#FFD700]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#FFD700]/10 rounded-full transition-colors duration-300 hidden sm:block">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-[#FFD700]/10 rounded-full transition-colors duration-300 hidden sm:block">
              <User className="w-5 h-5 text-white" />
            </button>
            <button 
              className="p-2 hover:bg-[#FFD700]/10 rounded-full transition-colors duration-300 md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? '' : 'pointer-events-none invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setMobileOpen(false)} 
        />
        <div
          ref={mobileMenuRef}
          className={`absolute left-0 top-0 h-full w-72 max-w-[85%] bg-[#001F3F] shadow-xl transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-4 border-b border-[#FFD700]/20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="w-10 h-10 bg-[#FFD700] rounded flex items-center justify-center">
                <span className="text-[#001F3F] font-bold text-sm">NM</span>
              </div>
              <div>
                <div className="text-sm tracking-wider font-semibold text-white">Nabus</div>
                <div className="text-xs text-[#FFD700]">Motors</div>
              </div>
            </Link>
            <button 
              className="p-2 hover:bg-[#FFD700]/10 rounded-full transition-colors duration-300"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-300 ${
                  location.pathname === item.href
                    ? 'bg-[#FFD700]/20 text-[#FFD700]'
                    : 'text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}