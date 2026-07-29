import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Globe, MapPin } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Models', to: '/explore' },
  { label: 'Pre-Owned', to: '/explore?condition=Used' },
  { label: 'Ownership', to: '/about' },
  { label: 'Finance', to: '/contact' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const activeIndex = NAV_LINKS.findIndex(
    ({ to }) => to === `${location.pathname}${location.search}`
  );
  const fallbackIndex = NAV_LINKS.findIndex(
    ({ to }) => to.split('?')[0] === location.pathname
  );
  const currentIndex = activeIndex !== -1 ? activeIndex : fallbackIndex;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_18px_rgba(24,28,32,0.10)]' : ''
        }`}
      >
        <div className="hidden md:block border-b border-[var(--hairline)]">
          <div className="shell flex h-9 items-center justify-between">
            <button className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-ink">
              <Globe className="h-3.5 w-3.5" />
              Ghana
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              <span>Nabusmotors.com</span>
              <span className="text-ink/25">/</span>
              <span className="text-ink/70">Sales</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </div>
          </div>
        </div>

        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <span className="font-display text-[21px] font-bold uppercase tracking-[0.14em] text-ink">
              Nabus
              <span className="ml-[3px] font-light text-[var(--accent-solid)]">Motors</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {NAV_LINKS.map(({ label, to }, index) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  index === currentIndex
                    ? 'text-[var(--accent-deep)]'
                    : 'text-ink/75 hover:text-ink'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link to="/contact" className="btn-pill hidden shrink-0 md:inline-flex">
            <MapPin className="h-3.5 w-3.5" />
            Find Us
          </Link>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex flex-col gap-[5px] p-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span
              className={`block h-[1.5px] w-[22px] bg-ink transition-all duration-300 ${
                mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-[22px] bg-ink transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-[22px] bg-ink transition-all duration-300 ${
                mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        <div
          className={`overflow-hidden bg-white transition-[max-height] duration-300 lg:hidden ${
            mobileOpen ? 'max-h-[460px] border-t border-[var(--hairline)]' : 'max-h-0'
          }`}
        >
          <div className="shell flex flex-col py-4">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="border-b border-[var(--hairline)] py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/75 transition-colors hover:text-ink"
              >
                {label}
              </Link>
            ))}
            <Link to="/contact" className="btn-pill mt-5 justify-center">
              <MapPin className="h-3.5 w-3.5" />
              Find Us
            </Link>
          </div>
        </div>
      </header>

      <div className="h-[68px] md:h-[104px]" />
    </>
  );
}
