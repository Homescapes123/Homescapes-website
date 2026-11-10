import React from 'react';
import { useStudio } from '../context/StudioContext';
import {
  Award,
  ShieldCheck,
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LeadershipSection } from './LeadershipSection';

// `compact` is the home page version: the studio values are left for the About page.
export const AboutSection: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { setCurrentView } = useStudio();

  return (
    <section id="about-us-section" className="py-24 bg-[#E2D9CD] dark:bg-[#121110] transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Main About Studio Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Large Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 img-zoom-container border border-[#D8CBBE]/40 dark:border-gray-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
                alt="Homescapes Studio Luxury Interior Design"
                className="w-full h-[480px] sm:h-[600px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating Overlaid Quote Box */}
            <div className="absolute -bottom-8 -right-4 sm:right-6 z-20 bg-[#E8DFC8] dark:bg-[#1C1B19] p-6 sm:p-8 max-w-sm border-l-4 border-l-[#B58E5B] shadow-2xl hidden sm:block">
              <p className="font-serif italic text-sm sm:text-base text-[#121212] dark:text-gray-200 font-medium">
                "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
              </p>
              <span className="block mt-3 text-[10px] tracking-[0.2em] uppercase text-[#B58E5B] font-bold">
                — Le Corbusier Inspiration
              </span>
            </div>

            {/* Subtle Architectural Accent Box */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-[#B58E5B]/30 -z-0 hidden sm:block" />
          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-medium block">
                ABOUT HOMESCAPES STUDIO
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F1F1F] dark:text-white leading-tight">
                Crafting Timeless Environments <br />
                <span className="italic font-light text-[#B58E5B]">With Uncompromising Vision.</span>
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-light">
              Founded on the principles of refined spatial harmony, climate-responsive design, and master Indian craftsmanship, Homescapes Studio transforms luxury residences and commercial spaces across India into enduring architectural works of art.
            </p>

            {/* Core Values / Features Grid */}
            {!compact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-[#B58E5B]/40 flex items-center justify-center shrink-0 bg-[#D8CBBE]/20 dark:bg-gray-800 text-[#B58E5B]">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-[#1F1F1F] dark:text-white">Passion for Design</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">
                    Driven by artistic emotion, proportion, and natural light harmony.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-[#B58E5B]/40 flex items-center justify-center shrink-0 bg-[#D8CBBE]/20 dark:bg-gray-800 text-[#B58E5B]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-[#1F1F1F] dark:text-white">Personalized Approach</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">
                    Every space is tailored uniquely around your personal routine & aspirations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-[#B58E5B]/40 flex items-center justify-center shrink-0 bg-[#D8CBBE]/20 dark:bg-gray-800 text-[#B58E5B]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-[#1F1F1F] dark:text-white">Attention to Detail</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">
                    Millimetric precision in stone grain alignment, shadow gaps, & acoustics.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 border border-[#B58E5B]/40 flex items-center justify-center shrink-0 bg-[#D8CBBE]/20 dark:bg-gray-800 text-[#B58E5B]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-[#1F1F1F] dark:text-white">End-to-End Execution</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">
                    Single-point white-glove accountability from permit to champagne handover.
                  </p>
                </div>
              </div>
            </div>
            )}

            {/* The About page is where the full story lives */}
            {compact && (
              <div className="pt-4">
                <button
                  id="about-learn-more-btn"
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-[#1F1F1F] dark:bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B58E5B] dark:hover:bg-white dark:hover:text-[#1F1F1F] transition-all flex items-center gap-2 group"
                >
                  <span>Read Full Studio Story</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Founder & Co-Founder profiles (managed in the CMS) */}
        <LeadershipSection />

      </div>
    </section>
  );
};
