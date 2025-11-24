import { Menu, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-[#001F3F] text-white py-2 px-8 text-sm">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +123-456-789 (24/7 Support Line)
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              support@cardealership.com
            </span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#FFC700] transition-colors">Login</a>
            <span>|</span>
            <a href="#" className="hover:text-[#FFC700] transition-colors">Register</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[#0A1929] text-white py-4 px-8 sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="text-2xl tracking-wider">
              <span className="text-[#FFC700]">ZODEA</span>
              <span className="ml-2">BURBAI</span>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex gap-8">
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Home</a></li>
              <li><a href="#" className="text-[#FFC700]">Our Cars</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Services We Offer</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">News</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="block hover:text-[#FFC700] transition-colors">Home</a></li>
              <li><a href="#" className="block text-[#FFC700]">Our Cars</a></li>
              <li><a href="#" className="block hover:text-[#FFC700] transition-colors">About Us</a></li>
              <li><a href="#" className="block hover:text-[#FFC700] transition-colors">Services We Offer</a></li>
              <li><a href="#" className="block hover:text-[#FFC700] transition-colors">News</a></li>
              <li><a href="#" className="block hover:text-[#FFC700] transition-colors">Contact</a></li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
