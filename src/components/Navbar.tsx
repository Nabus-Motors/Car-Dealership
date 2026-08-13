import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Models', to: '/explore' },
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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
            className={`sticky top-0 left-0 right-0 z-50 w-full bg-white transition-shadow duration-300 ${
                scrolled ? 'shadow-[0_1px_18px_rgba(24,28,32,0.10)]' : ''
            }`}
        >
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

            <a
                href="https://www.google.com/maps?q=NABUS%20MOTORS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill hidden shrink-0 md:inline-flex"
            >
              <MapPin className="h-3.5 w-3.5" />
              Find Us
            </a>

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
              <a
                  href="https://www.google.com/maps?q=NABUS%20MOTORS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill mt-5 justify-center"
              >
                <MapPin className="h-3.5 w-3.5" />
                Find Us
              </a>
            </div>
          </div>
        </header>
      </>
  );
}