import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Service } from '../types';
import {
  Home,
  Building2,
  ChefHat,
  Sofa,
  Bed,
  Briefcase,
  LayoutGrid,
  Eye,
  Hammer,
  Key,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, goToContact } = useStudio();
  const [activeModalService, setActiveModalService] = useState<Service | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-6 h-6 text-[#B58E5B]" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-[#B58E5B]" />;
      case 'ChefHat': return <ChefHat className="w-6 h-6 text-[#B58E5B]" />;
      case 'Sofa': return <Sofa className="w-6 h-6 text-[#B58E5B]" />;
      case 'Bed': return <Bed className="w-6 h-6 text-[#B58E5B]" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-[#B58E5B]" />;
      case 'LayoutGrid': return <LayoutGrid className="w-6 h-6 text-[#B58E5B]" />;
      case 'Eye': return <Eye className="w-6 h-6 text-[#B58E5B]" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-[#B58E5B]" />;
      case 'Key': return <Key className="w-6 h-6 text-[#B58E5B]" />;
      default: return <Home className="w-6 h-6 text-[#B58E5B]" />;
    }
  };

  return (
    <section id="our-services-section" className="py-24 bg-[#E2D9CD] dark:bg-[#181716] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-[#9E723B] font-bold block">
            OUR ARCHITECTURAL SERVICES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#121212] dark:text-white">
            Bespoke Solutions for <br />
            <span className="italic font-light text-[#9E723B]">Discerning Spaces.</span>
          </h2>
          <p className="text-[#332F2B] dark:text-gray-200 text-sm sm:text-base font-normal max-w-2xl mx-auto">
            From initial spatial concept drawings to white-glove turnkey delivery, explore our comprehensive suite of luxury architectural and interior design offerings.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group p-8 border border-[#B58E5B]/40 dark:border-gray-800 hover:border-[#9E723B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-[#E8DFC8] dark:bg-[#201F1D] rounded-none"
            >
              {/* Card Background Number Accent */}
              <span className="absolute top-4 right-6 font-serif text-5xl font-light text-[#9E723B]/20 dark:text-[#9E723B]/30 group-hover:text-[#9E723B]/40 transition-colors pointer-events-none select-none">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div>
                {/* Modern Icon Header */}
                <div className="w-14 h-14 border border-[#9E723B]/40 bg-[#FAF6F0] dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-[#9E723B] group-hover:border-[#9E723B] transition-all duration-300">
                  <div className="group-hover:text-white group-hover:[&_svg]:text-white transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#121212] dark:text-white mb-3 group-hover:text-[#9E723B] transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-[#2D2A26] dark:text-gray-200 leading-relaxed font-normal mb-6">
                  {service.shortDescription}
                </p>

                {/* Key Features List */}
                <ul className="space-y-2.5 mb-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                  {service.features.slice(0, 3).map((feat, fIdx) => (
                    <li key={fIdx} className="text-xs text-[#1F1F1F] dark:text-gray-200 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#9E723B] shrink-0 rounded-full" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  id={`service-details-btn-${service.id}`}
                  onClick={() => setActiveModalService(service)}
                  className="text-xs tracking-widest uppercase font-bold text-[#121212] dark:text-gray-100 hover:text-[#9E723B] dark:hover:text-[#9E723B] flex items-center gap-1.5 group/btn"
                >
                  <span>Scope & Specs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-[#9E723B]" />
                </button>

                {service.startingPrice && (
                  <span className="text-xs uppercase tracking-wider text-[#9E723B] font-bold">
                    From {service.startingPrice.replace(/\$/g, '₹')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 border border-[#9E723B]/40 text-center flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-[#201F1D] shadow-md">
          <div className="text-left space-y-2">
            <h4 className="font-serif text-2xl text-[#121212] dark:text-white font-medium">
              Need a Custom Architectural Scope?
            </h4>
            <p className="text-xs sm:text-sm text-[#2D2A26] dark:text-gray-200 font-normal max-w-xl">
              Our principal directors curate bespoke multi-disciplinary scopes combining spatial re-planning, structural engineering, and white-glove furnishing.
            </p>
          </div>
          <button
            id="services-custom-scope-btn"
            onClick={() => goToContact()}
            className="px-8 py-4 bg-[#9E723B] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#121212] transition-all whitespace-nowrap shadow-lg shrink-0"
          >
            Request Custom Proposal
          </button>
        </div>

      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#1C1B19] max-w-2xl w-full p-6 sm:p-8 border border-[#9E723B]/50 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              id="service-modal-close-btn"
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 border border-[#9E723B] text-[#9E723B] bg-[#FAF6F0] dark:bg-gray-800">
                {getIcon(activeModalService.iconName)}
              </div>
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9E723B] font-bold">Service Details</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#121212] dark:text-white font-medium">
                  {activeModalService.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#2D2A26] dark:text-gray-200 leading-relaxed font-normal mb-6">
              {activeModalService.fullDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-serif text-base text-[#121212] dark:text-white mb-3 font-semibold">Key Features</h5>
                <ul className="space-y-2">
                  {activeModalService.features.map((f, i) => (
                    <li key={i} className="text-xs text-[#2D2A26] dark:text-gray-200 flex items-start gap-2 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9E723B] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-serif text-base text-[#121212] dark:text-white mb-3 font-semibold">Client Deliverables</h5>
                <ul className="space-y-2">
                  {activeModalService.deliverables.map((d, i) => (
                    <li key={i} className="text-xs text-[#2D2A26] dark:text-gray-200 flex items-start gap-2 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9E723B] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#2D2A26] dark:text-gray-200 font-semibold">Timeline: {activeModalService.estimatedTimeline}</span>
                {activeModalService.startingPrice && (
                  <span className="text-xs font-bold text-[#9E723B] uppercase tracking-wider mt-0.5">
                    Starting from {activeModalService.startingPrice.replace(/\$/g, '₹')}
                  </span>
                )}
              </div>
              <button
                id="service-modal-inquire-btn"
                onClick={() => {
                  setActiveModalService(null);
                  goToContact();
                }}
                className="px-6 py-3 bg-[#9E723B] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#121212] transition-colors shadow-md"
              >
                Book This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
