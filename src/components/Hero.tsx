import React, { useEffect, useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { ArrowRight, Calendar, Compass, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentView, goToContact } = useStudio();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('portfolio');
    }
  };

  return (
    <section id="hero-section" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Hero Image with subtle parallax */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-75 ease-out scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')`,
          transform: `translateY(${scrollY * 0.35}px) scale(${1 + scrollY * 0.0002})`
        }}
      >
        {/* Subtle Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/90 via-[#1F1F1F]/40 to-[#1F1F1F]/60" />
      </div>

      {/* Floating Glassmorphism Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white space-y-8 mt-16">

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.08] text-white">
          Designing Spaces <br />
          <span className="italic font-light gold-gradient-text">That Inspire Living.</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-light text-gray-200 tracking-wide leading-relaxed">
          Premier Indian architectural and interior design studio crafting luxury residences and commercial spaces across India with timeless elegance and precision.
        </p>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            id="hero-view-portfolio-btn"
            onClick={() => scrollToSection('featured-projects-section')}
            className="w-full sm:w-auto px-8 py-4 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-white hover:text-[#1F1F1F] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 group"
          >
            <span>View Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-book-consultation-btn"
            onClick={() => goToContact()}
            className="w-full sm:w-auto px-8 py-4 border border-white/40 bg-white/10 backdrop-blur-md text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-white hover:text-[#1F1F1F] hover:border-white transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Calendar className="w-4 h-4 text-[#B58E5B]" />
            <span>Book Consultation</span>
          </button>
        </div>

        {/* Highlights Bar */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/15 text-xs text-gray-300 uppercase tracking-widest font-light">
          <div className="py-2">
            <span className="block text-[#B58E5B] font-serif text-lg">01</span>
            <span>Pan-India Projects</span>
          </div>
          <div className="py-2">
            <span className="block text-[#B58E5B] font-serif text-lg">02</span>
            <span>3 Years Experience</span>
          </div>
          <div className="py-2">
            <span className="block text-[#B58E5B] font-serif text-lg">03</span>
            <span>40+ Completed Works</span>
          </div>
          <div className="py-2">
            <span className="block text-[#B58E5B] font-serif text-lg">04</span>
            <span>Turnkey Execution</span>
          </div>
        </div>
      </div>

      {/* Down Scroll Arrow */}
      <button
        id="hero-scroll-down-btn"
        onClick={() => scrollToSection('about-us-section')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-[#B58E5B] transition-colors p-2 animate-bounce"
        aria-label="Scroll down to about section"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
};
