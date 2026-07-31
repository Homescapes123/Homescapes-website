import React, { useState, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { Search, Sun, Moon, Database, Calendar, Menu, X, ArrowRight, MapPin, Phone, Mail, Clock, Lock } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    setIsBookingOpen,
    openOwnerPortal,
    setIsSearchOpen
  } = useStudio();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', view: 'home' as const },
    { label: 'About', view: 'about' as const },
    { label: 'Portfolio', view: 'portfolio' as const },
    { label: 'Services', view: 'services' as const },
    { label: 'Blog', view: 'blog' as const },
    { label: 'Contact', view: 'contact' as const }
  ];

  const handleNavClick = (view: typeof navItems[number]['view']) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div
          className="h-full bg-[#B58E5B] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Studio Quick Info Bar */}
      <div className="fixed top-1 left-0 right-0 z-40 bg-[#121110] text-[#E8DFC8] border-b border-[#B58E5B]/30 py-1.5 px-4 hidden md:block text-[11px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#B58E5B]" />
              <span>Indira Nagar, Sugamau, Lucknow, UP 226016</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-[#B58E5B]" />
              <a href="tel:+917380334333" className="hover:text-[#B58E5B] transition-colors">+91 7380334333</a>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#B58E5B]" />
              <a href="mailto:workwithhomescapes@gmail.com" className="hover:text-[#B58E5B] transition-colors">workwithhomescapes@gmail.com</a>
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-[#B58E5B]">
            <Clock className="w-3.5 h-3.5" />
            <span>Mon – Sat: 9:00 AM – 9:00 PM IST</span>
          </div>
        </div>
      </div>

      <header
        id="main-header"
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'glass-panel py-3 shadow-md'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 border border-[#B58E5B] flex items-center justify-center font-serif text-xl tracking-widest text-[#B58E5B] group-hover:bg-[#B58E5B] group-hover:text-white transition-all duration-300">
              H
            </div>
            <div>
              <span className="block font-serif text-lg tracking-[0.15em] uppercase font-medium text-[#1F1F1F] dark:text-white group-hover:text-[#B58E5B] transition-colors">
                HOMESCAPES
              </span>
              <span className="block text-[9px] tracking-[0.35em] uppercase text-[#B58E5B]">
                STUDIO DESIGN
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.view}
                id={`nav-${item.view}-btn`}
                onClick={() => handleNavClick(item.view)}
                className={`text-xs tracking-[0.18em] uppercase transition-all duration-300 py-1 relative ${
                  currentView === item.view
                    ? 'text-[#B58E5B] font-semibold'
                    : 'text-[#1F1F1F]/80 dark:text-gray-300 hover:text-[#B58E5B] dark:hover:text-[#B58E5B]'
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B58E5B] animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Button */}
            <button
              id="search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1F1F1F] dark:text-gray-200 hover:text-[#B58E5B] dark:hover:text-[#B58E5B] transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 text-[#1F1F1F] dark:text-gray-200 hover:text-[#B58E5B] dark:hover:text-[#B58E5B] transition-colors"
              title={theme === 'light' ? 'Switch to Noir Dark Mode' : 'Switch to Warm Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Owner CMS Manager Button (PIN Protected) */}
            <button
              id="cms-open-btn"
              onClick={openOwnerPortal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase border border-[#B58E5B] bg-[#B58E5B]/10 dark:bg-[#B58E5B]/20 text-[#121212] dark:text-gray-100 hover:bg-[#B58E5B] hover:text-white transition-all shadow-xs"
              title="Studio Owner Portal: PIN Protected Access for Content & Photo Management"
            >
              <Lock className="w-3.5 h-3.5 text-[#B58E5B] group-hover:text-white" />
              <span>Owner Portal</span>
            </button>

            {/* Book Consultation CTA Button */}
            <button
              id="header-book-consultation-btn"
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 bg-[#1F1F1F] dark:bg-[#B58E5B] text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#B58E5B] dark:hover:bg-white dark:hover:text-[#1F1F1F] transition-all duration-300 shadow-sm flex items-center gap-2 group"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              id="mobile-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1F1F1F] dark:text-gray-200"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1F1F1F] dark:text-gray-200 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#F8F5F2] dark:bg-[#121110] px-6 py-8 transition-all animate-fadeIn">
          <div className="flex items-center justify-between pb-6 border-b border-[#D8CBBE]/50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#B58E5B] flex items-center justify-center font-serif text-lg text-[#B58E5B]">
                H
              </div>
              <span className="font-serif tracking-widest text-lg uppercase dark:text-white">HOMESCAPES</span>
            </div>
            <button
              id="mobile-drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-700 dark:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6 my-8">
            {navItems.map(item => (
              <button
                key={item.view}
                id={`mobile-nav-${item.view}-btn`}
                onClick={() => handleNavClick(item.view)}
                className={`text-left font-serif text-2xl tracking-wide transition-colors ${
                  currentView === item.view
                    ? 'text-[#B58E5B] font-semibold pl-2 border-l-2 border-[#B58E5B]'
                    : 'text-[#1F1F1F] dark:text-gray-200 hover:text-[#B58E5B]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-[#D8CBBE]/50 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Theme</span>
              <button
                id="mobile-theme-toggle-btn"
                onClick={toggleTheme}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#1F1F1F] dark:text-white"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>

            <button
              id="mobile-cms-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openOwnerPortal();
              }}
              className="w-full py-3 bg-[#B58E5B]/15 border border-[#B58E5B] text-[#121212] dark:text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#B58E5B]" />
              <span>Owner Portal (PIN Protected)</span>
            </button>

            <button
              id="mobile-book-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBookingOpen(true);
              }}
              className="w-full py-3.5 bg-[#1F1F1F] dark:bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 font-medium"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
