import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A1929] text-white">
      {/* Newsletter Section */}
      <div className="bg-[#001F3F] py-12">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl mb-2">Follow Us and</h3>
              <p className="text-gray-300">Get a chance to win $885,100</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#FFC700] rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#FFC700] rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#FFC700] rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#FFC700] rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Subscribe to our newsletter"
                className="flex-1 md:w-80 px-4 py-3 bg-[#0A1929] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFC700]"
              />
              <button className="px-6 py-3 bg-[#FFC700] text-[#001F3F] hover:bg-[#FFD700] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 px-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl mb-4">
              <span className="text-[#FFC700]">ZODEA</span>
              <span className="ml-2">BURBAI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in finding the perfect vehicle. We offer a wide selection of quality cars to meet every need and budget.
            </p>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg mb-4">OUR SERVICES</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Car Financing</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Vehicle Inspection</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Trade-In Services</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Extended Warranty</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Maintenance & Repairs</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-4">QUICK LINKS</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[#FFC700] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg mb-4">CONTACT</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>123 Auto Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+123-456-789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@zodeaburbai.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>Copyright © 2025 Zodea Burbai - All rights reserved</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FFC700] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FFC700] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#FFC700] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
