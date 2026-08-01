import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Mail, Instagram, Linkedin, Facebook, ArrowUp, Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsBookingOpen, openOwnerPortal } = useStudio();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#181716] text-gray-300 transition-colors duration-300 border-t border-gray-800">
      
      {/* Upper Newsletter Bar */}
      <div className="border-b border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-2xl text-white font-normal">
              Subscribe to Homescapes Studio Journal
            </h4>
            <p className="text-xs text-gray-400 font-light">
              Receive quarterly architectural essays, stone sourcing previews, and luxury interior design trends.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex items-center w-full md:w-auto max-w-md gap-2">
            {newsletterSubscribed ? (
              <div className="px-6 py-3 bg-[#B58E5B] text-white text-xs uppercase tracking-widest flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Subscribed Successfully</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 text-xs bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#B58E5B] w-full"
                />
                <button
                  id="newsletter-subscribe-btn"
                  type="submit"
                  className="px-6 py-3 bg-[#B58E5B] text-white text-xs uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#B58E5B] flex items-center justify-center font-serif text-xl text-[#B58E5B]">
                H
              </div>
              <div>
                <span className="block font-serif text-xl tracking-[0.15em] uppercase font-medium text-white">
                  HOMESCAPES
                </span>
                <span className="block text-[9px] tracking-[0.35em] uppercase text-[#B58E5B]">
                  STUDIO DESIGN
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm">
              An internationally recognized luxury interior design and architectural studio crafting bespoke residential and commercial environments with timeless elegance and millimetric craftsmanship.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <a href="https://instagram.com/homescapes.studio/" target="_blank" rel="noopener noreferrer" className="p-2 border border-gray-800 text-gray-400 hover:text-[#B58E5B] hover:border-[#B58E5B] transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h5 className="font-serif text-lg text-white font-normal">Navigation</h5>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li>
                <button id="footer-link-home" onClick={() => { setCurrentView('home'); scrollToTop(); }} className="hover:text-[#B58E5B] transition-colors">Home Studio</button>
              </li>
              <li>
                <button id="footer-link-about" onClick={() => { setCurrentView('about'); scrollToTop(); }} className="hover:text-[#B58E5B] transition-colors">About Us</button>
              </li>
              <li>
                <button id="footer-link-portfolio" onClick={() => { setCurrentView('portfolio'); scrollToTop(); }} className="hover:text-[#B58E5B] transition-colors">Project Portfolio</button>
              </li>
              <li>
                <button id="footer-link-services" onClick={() => { setCurrentView('services'); scrollToTop(); }} className="hover:text-[#B58E5B] transition-colors">Architectural Services</button>
              </li>
              <li>
                <button id="footer-link-contact" onClick={() => { setCurrentView('contact'); scrollToTop(); }} className="hover:text-[#B58E5B] transition-colors">Contact Studio</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-4">
            <h5 className="font-serif text-lg text-white font-normal">Services</h5>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li>Residential Interiors</li>
              <li>Commercial HQ & Hospitality</li>
              <li>Monolithic Modular Kitchens</li>
              <li>Master Suite & Spa Retreats</li>
              <li>Space Planning & 3D Renders</li>
              <li>Complete Turnkey Execution</li>
            </ul>
          </div>

          {/* Col 4: Studio Contact */}
          <div className="space-y-4">
            <h5 className="font-serif text-lg text-white font-normal">Studio Location</h5>
            <div className="space-y-2 text-xs text-gray-400 font-light">
              <p>Indira Nagar, Sugamau</p>
              <p>Lucknow, Uttar Pradesh 226016, India</p>
              <p className="pt-2 text-white font-medium">+91 7380334333</p>
              <p className="text-[#B58E5B]">workwithhomescapes@gmail.com</p>
              <p className="text-gray-400 text-[11px] pt-1">Mon – Sat: 9:00 AM – 9:00 PM IST</p>
              
              <button
                id="footer-book-btn"
                onClick={() => setIsBookingOpen(true)}
                className="mt-4 px-4 py-2 bg-[#B58E5B] text-white text-[10px] uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-colors block w-full text-center"
              >
                Book Consultation
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal bar */}
        <div className="pt-12 mt-12 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-light">
          <p>© 2026 Homescapes Studio Interior Design. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <button id="footer-privacy-link" onClick={() => setCurrentView('privacy')} className="hover:text-[#B58E5B]">Privacy Policy</button>
            <button id="footer-terms-link" onClick={() => setCurrentView('terms')} className="hover:text-[#B58E5B]">Terms of Service</button>
            <button
              id="footer-back-to-top-btn"
              onClick={scrollToTop}
              className="p-2 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-colors"
              title="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
