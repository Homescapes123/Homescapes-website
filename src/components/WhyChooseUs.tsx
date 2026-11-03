import React from 'react';
import { useStudio } from '../context/StudioContext';
import {
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  Users,
  Box,
  UserCheck,
  Headphones,
  Award
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { setIsBookingOpen } = useStudio();

  const reasons = [
    {
      title: 'Personalized Designs',
      desc: 'No duplicate templates. Every concept is bespoke to your lifestyle, daylight paths, and routine.',
      icon: Sparkles
    },
    {
      title: 'Premium Materials',
      desc: 'Direct sourcing from Makrana marble quarries, CPWD certified teak mills, & Italian stone ateliers.',
      icon: Shield
    },
    {
      title: 'Transparent Pricing',
      desc: 'Itemized fixed-cost proposals with zero hidden markups or surprise variations.',
      icon: Award
    },
    {
      title: 'On-Time Delivery',
      desc: 'Rigorous milestone schedules with financial completion guarantees built into contracts.',
      icon: Clock
    },
    {
      title: 'Experienced Team',
      desc: 'Award-winning architects, senior interior designers, and master Indian stone craftsmen.',
      icon: Users
    },
    {
      title: '3D VR Visualization',
      desc: 'Experience your future residence in photorealistic 8K render fidelity before construction.',
      icon: Box
    },
    {
      title: 'Dedicated Project Manager',
      desc: 'Single point of daily contact handling contractor coordination, permits, and white-glove setup.',
      icon: UserCheck
    },
    {
      title: 'Post-Completion Support',
      desc: '3-Year Craftsmanship Warranty with 24/7 client concierge for any maintenance requests.',
      icon: Headphones
    }
  ];

  return (
    <section id="why-choose-us-section" className="py-24 bg-[#EFECE6] dark:bg-[#181716] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-medium block">
            UNCOMPROMISING STANDARDS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F1F1F] dark:text-white">
            Why Discerning Clients <br />
            <span className="italic font-light text-[#B58E5B]">Entrust Us With Their Homes.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-light">
            We bridge architectural artistic ambition with surgical project discipline, guaranteeing world-class execution at every stage.
          </p>
        </div>

        {/* 8 Modern Icon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 border border-[#D8CBBE]/40 dark:border-gray-800 hover:border-[#B58E5B] transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 border border-[#B58E5B]/40 bg-[#F8F5F2] dark:bg-gray-800 flex items-center justify-center text-[#B58E5B] group-hover:bg-[#B58E5B] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#B58E5B]" />
                  </div>

                  <h3 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white mb-2 group-hover:text-[#B58E5B] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Material Quality Showcase Strip */}
        <div className="glass-panel p-8 sm:p-12 border border-[#D8CBBE]/50 dark:border-gray-800">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B58E5B] font-semibold">
              SIGNATURE MATERIAL SOURCING
            </span>
            <h3 className="font-serif text-2xl text-[#1F1F1F] dark:text-white mt-1">
              Hand-Selected Organic Textures
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="h-24 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400')] bg-cover bg-center border border-[#B58E5B]/30" />
              <span className="block text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-medium">Calacatta Viola</span>
              <span className="block text-[10px] text-gray-400 font-light">Carrara Quarry, Italy</span>
            </div>

            <div className="space-y-2">
              <div className="h-24 bg-[url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400')] bg-cover bg-center border border-[#B58E5B]/30" />
              <span className="block text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-medium">Smoked Swiss Oak</span>
            </div>

            <div className="space-y-2">
              <div className="h-24 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400')] bg-cover bg-center border border-[#B58E5B]/30" />
              <span className="block text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-medium">Navona Travertine</span>
              <span className="block text-[10px] text-gray-400 font-light">Tivoli, Italy</span>
            </div>

            <div className="space-y-2">
              <div className="h-24 bg-[url('https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=400')] bg-cover bg-center border border-[#B58E5B]/30" />
              <span className="block text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-medium">Belgian Linen</span>
              <span className="block text-[10px] text-gray-400 font-light">Flanders Atelier, Belgium</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
