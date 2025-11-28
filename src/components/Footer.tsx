import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#001F3F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Nabus Motors" className="h-10 w-auto" />
              <div>
                <div className="text-sm tracking-wider font-semibold">Nabus</div>
                <div className="text-xs text-[#FFD700]">Motors</div>
              </div>
            </Link>
            <p className="text-gray-400">
              Your trusted partner in finding the perfect vehicle. Quality cars, exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/explore"
                className="block text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
              >
                Inventory
              </Link>
              <Link
                to="/about"
                className="block text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                <span className="text-sm">123 Auto Street, Car City, CC 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                <span className="text-sm">info@nabusmotors.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Business Hours</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 9:00 AM - 6:00 PM</p>
              <p>Sunday: 12:00 PM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1A3A52] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">&copy; 2024 Nabus Motors. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
