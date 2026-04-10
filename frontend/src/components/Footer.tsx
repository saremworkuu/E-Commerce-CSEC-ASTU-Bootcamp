import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-500 hover:text-black transition-colors text-sm">All Products</Link></li>
              <li><Link to="/shop?category=Electronics" className="text-gray-500 hover:text-black transition-colors text-sm">Electronics</Link></li>
              <li><Link to="/shop?category=Accessories" className="text-gray-500 hover:text-black transition-colors text-sm">Accessories</Link></li>
              <li><Link to="/shop?category=Furniture" className="text-gray-500 hover:text-black transition-colors text-sm">Furniture</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-500 hover:text-black transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-black transition-colors text-sm">Contact</Link></li>
              <li><a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Sustainability</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs mb-4 md:mb-0">
            © 2026 LUXECART. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
