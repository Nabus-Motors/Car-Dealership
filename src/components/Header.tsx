import { Button } from './ui/button';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' }
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/nabus-motors-logo.png" alt="Nabus Motors" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold">Nabus Motors</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`hover:text-red-400 transition-colors ${
                  currentPage === item.value ? 'text-red-400 border-b-2 border-red-400' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-red-400"
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                menu?.classList.toggle('hidden');
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav id="mobile-menu" className="hidden md:hidden mt-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onNavigate(item.value);
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className={`block w-full text-left py-2 px-4 hover:bg-slate-800 rounded transition-colors ${
                currentPage === item.value ? 'text-red-400 bg-slate-800' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}