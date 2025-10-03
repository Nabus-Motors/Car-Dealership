import { Icons } from './ui';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/nabus-motors-logo.png" alt="Nabus Motors" className="w-12 h-12 object-contain" />
              <span className="text-xl font-bold">Nabus Motors</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner in finding the perfect vehicle. Quality cars, exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('home')}
                className="block text-gray-300 hover:text-red-400 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="block text-gray-300 hover:text-red-400 transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="block text-gray-300 hover:text-red-400 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Icons.mapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">123 Auto Street, Car City, CC 12345</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.contact className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">info@nabusmotors.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold">Business Hours</h3>
            <div className="space-y-2 text-gray-300">
              <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 9:00 AM - 6:00 PM</p>
              <p>Sunday: 12:00 PM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-300 text-sm text-center sm:text-left">© 2024 Nabus Motors. All rights reserved.</p>
          <div className="flex space-x-4">
            <button 
              className="text-gray-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-800"
              aria-label="Follow us on Facebook"
            >
              <Icons.facebook className="w-5 h-5" />
            </button>
            <button 
              className="text-gray-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-800"
              aria-label="Follow us on Twitter"
            >
              <Icons.twitter className="w-5 h-5" />
            </button>
            <button 
              className="text-gray-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-800"
              aria-label="Follow us on Instagram"
            >
              <Icons.instagram className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}