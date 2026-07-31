import React from 'react';
import { useStudio } from '../context/StudioContext';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export const LegalModals: React.FC = () => {
  const { currentView, setCurrentView } = useStudio();

  if (currentView !== 'privacy' && currentView !== 'terms') return null;

  return (
    <div className="py-24 min-h-screen bg-[#F8F5F2] dark:bg-[#121110] text-[#1F1F1F] dark:text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          id="legal-back-btn"
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B58E5B] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Main Website</span>
        </button>

        {currentView === 'privacy' && (
          <div className="glass-panel p-8 sm:p-12 border border-[#D8CBBE]/40 dark:border-gray-800 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#B58E5B]" />
              <h1 className="font-serif text-3xl font-normal text-[#1F1F1F] dark:text-white">
                Privacy Policy
              </h1>
            </div>

            <p className="text-xs text-gray-500 font-light">Last Updated: February 2026</p>

            <div className="space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              <h3 className="font-serif text-lg text-[#1F1F1F] dark:text-white font-normal">1. Confidentiality & Data Protection</h3>
              <p>
                At Homescapes Studio, client confidentiality is paramount. Any personal identification, floor plan schematics, financial budget allocations, or architectural drawings shared with our studio are safeguarded under strict non-disclosure policies.
              </p>

              <h3 className="font-serif text-lg text-[#1F1F1F] dark:text-white font-normal">2. Information We Collect</h3>
              <p>
                We only collect information directly submitted by clients during consultation bookings or contact forms (Name, Email, Telephone, Property Type, and Project Scope).
              </p>

              <h3 className="font-serif text-lg text-[#1F1F1F] dark:text-white font-normal">3. Use of Architectural Imagery</h3>
              <p>
                Photographs of completed client residences are published in our portfolio archive strictly with prior written client consent and complete address pseudonymization.
              </p>
            </div>
          </div>
        )}

        {currentView === 'terms' && (
          <div className="glass-panel p-8 sm:p-12 border border-[#D8CBBE]/40 dark:border-gray-800 space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#B58E5B]" />
              <h1 className="font-serif text-3xl font-normal text-[#1F1F1F] dark:text-white">
                Terms of Service
              </h1>
            </div>

            <p className="text-xs text-gray-500 font-light">Last Updated: February 2026</p>

            <div className="space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              <h3 className="font-serif text-lg text-[#1F1F1F] dark:text-white font-normal">1. Architectural Proposals & IP</h3>
              <p>
                All 3D visualization renders, spatial CAD floor plans, material moodboards, and custom joinery technical drawings created by Homescapes Studio remain the intellectual property of the studio until final project payment completion.
              </p>

              <h3 className="font-serif text-lg text-[#1F1F1F] dark:text-white font-normal">2. Turnkey Warranties</h3>
              <p>
                Our 3-Year Craftsmanship Guarantee applies to all custom built-in cabinetry, stone millwork, and architectural finishes executed under our direct site supervision.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
