import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 w-full z-50
        transition-all duration-300 ease-in-out
        ${scrolled || mobileOpen
          ? 'bg-[#0A0A0A] shadow-[0_2px_20px_rgba(0,0,0,0.4)]'
          : 'bg-[#0A0A0A]/90 backdrop-blur-sm'}
      `}>
        <div className="max-w-[1280px] mx-auto px-8 md:px-6 sm:px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="font-['Barlow_Condensed',sans-serif] text-white 
                               text-[22px] font-black tracking-[3px] uppercase">
                NABUS<span className="text-[#C9A84C]">.</span>MOTORS
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home',      to: '/' },
                { label: 'Inventory', to: '/explore' },
                { label: 'About',     to: '/about' },
                { label: 'Contact',   to: '/contact' },
              ].map(({ label, to }) => (
                <Link key={to} to={to}
                  className={`text-[13px] font-medium uppercase tracking-[0.8px]
                             transition-colors
                             ${location.pathname === to
                               ? 'text-[#C9A84C]'
                               : 'text-white/70 hover:text-white'}`}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/explore"
                className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-2.5 rounded
                           text-[12px] font-black uppercase tracking-[1px]
                           hover:bg-[#b8943e] transition-colors">
                Browse Cars
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              className="md:hidden flex flex-col gap-[5px] p-2"
              aria-label="Toggle menu">
              <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300
                                ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300
                                ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[2px] bg-white rounded transition-all duration-300
                                ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu — drop down */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 z-50
                         ${mobileOpen ? 'max-h-[400px] border-t border-white/10 bg-[#0A0A0A] shadow-lg' : 'max-h-0'}`}>
          <div className="px-6 py-4 flex flex-col gap-4 bg-[#0A0A0A]">
            {[
              { label: 'Home',      to: '/' },
              { label: 'Inventory', to: '/explore' },
              { label: 'About',     to: '/about' },
              { label: 'Contact',   to: '/contact' },
            ].map(({ label, to }) => (
              <Link key={to} to={to}
                className="text-[14px] font-medium text-white/80 
                           hover:text-[#C9A84C] transition-colors py-1">
                {label}
              </Link>
            ))}
            <Link to="/explore"
              className="mt-2 bg-[#C9A84C] text-[#0A0A0A] text-center
                         px-5 py-3 rounded text-[13px] font-black 
                         uppercase tracking-[1px]">
              Browse Cars
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-16" />

      {/* Mobile menu backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

