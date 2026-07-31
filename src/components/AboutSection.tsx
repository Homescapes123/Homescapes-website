import React from 'react';
import { useStudio } from '../context/StudioContext';
import {
  Award,
  ShieldCheck,
  Heart,
  Sparkles,
  ArrowRight,
  Quote,
  CheckCircle2
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const {
    setIsBookingOpen,
    setCurrentView,
    founderData
  } = useStudio();

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

            {/* Experience Stats Row */}
            <div className="pt-6 border-t border-[#D8CBBE]/50 dark:border-gray-800 flex items-center justify-between gap-6">
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#1F1F1F] dark:text-white font-medium">3+</span>
                <span className="block text-[10px] uppercase tracking-widest text-[#B58E5B] mt-0.5">Years Experience</span>
              </div>
              <div className="w-px h-10 bg-[#D8CBBE] dark:bg-gray-800" />
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#1F1F1F] dark:text-white font-medium">40+</span>
                <span className="block text-[10px] uppercase tracking-widest text-[#B58E5B] mt-0.5">Projects Completed</span>
              </div>
              <div className="w-px h-10 bg-[#D8CBBE] dark:bg-gray-800" />
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-[#1F1F1F] dark:text-white font-medium">98%</span>
                <span className="block text-[10px] uppercase tracking-widest text-[#B58E5B] mt-0.5">Satisfaction Rate</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center gap-4">
              <button
                id="about-learn-more-btn"
                onClick={() => setCurrentView('about')}
                className="px-6 py-3.5 bg-[#1F1F1F] dark:bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B58E5B] dark:hover:bg-white dark:hover:text-[#1F1F1F] transition-all flex items-center gap-2 group"
              >
                <span>Read Full Studio Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="about-consult-btn"
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3.5 border border-[#1F1F1F] dark:border-white text-[#1F1F1F] dark:text-white text-xs uppercase tracking-[0.2em] font-medium hover:border-[#B58E5B] hover:text-[#B58E5B] transition-all"
              >
                Consult Director
              </button>
            </div>
          </div>

        </div>

        {/* Compact Instagram-Style Founder Section (Clean display without manual photo add triggers) */}
        <div className="bg-[#E8DFC8] dark:bg-[#1C1B19] border border-[#B58E5B]/50 p-6 sm:p-8 relative overflow-hidden shadow-lg rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
            
            {/* Instagram-style Circle Avatar */}
            <div className="relative group shrink-0">
              {/* Instagram Gradient Ring */}
              <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#B58E5B] via-[#F3E3C3] to-[#8C6638] shadow-xl hover:shadow-[#B58E5B]/20 transition-all duration-300">
                <div className="p-1 bg-[#E8DFC8] dark:bg-[#1C1B19] rounded-full">
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-gray-900">
                    <img
                      src={founderData.photo}
                      alt={`${founderData.name} - ${founderData.title}`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Instagram Story / Founder Verified Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#121212] border border-[#B58E5B] px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#B58E5B] animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-white font-bold">FOUNDER</span>
              </div>
            </div>

            {/* Founder Info & Bio (Compact) */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#B58E5B] font-bold block">
                    FOUNDER & DIRECTOR
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-[#B58E5B] font-mono">@homescapes.founder</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F1F1F] dark:text-white mt-0.5">
                  {founderData.name}
                </h3>
              </div>

              <div className="relative pl-4 border-l-2 border-[#B58E5B] text-left">
                <p className="font-serif italic text-sm sm:text-base text-[#1F1F1F] dark:text-gray-200 leading-relaxed">
                  "{founderData.quote}"
                </p>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light text-left">
                {founderData.bio}
              </p>

              {/* Achievements Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 pt-1">
                {founderData.achievements.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B58E5B] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  id="consult-hariom-srivastava-btn"
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-2.5 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.15em] font-bold hover:bg-[#121212] transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Book Session with {founderData.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};



