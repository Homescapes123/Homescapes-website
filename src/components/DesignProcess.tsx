import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { INITIAL_PROCESS } from '../data/initialData';
import {
  MessageSquare,
  Ruler,
  Palette,
  Box,
  Sparkles,
  Wrench,
  CheckCircle,
  Key,
  ArrowRight,
  Clock
} from 'lucide-react';

export const DesignProcess: React.FC = () => {
  const { setIsBookingOpen } = useStudio();
  const [activeStep, setActiveStep] = useState<number>(1);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
      case 'Ruler': return <Ruler className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'Box': return <Box className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'CheckCircle': return <CheckCircle className="w-5 h-5" />;
      case 'Key': return <Key className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const activeStepData = INITIAL_PROCESS.find(s => s.stepNumber === activeStep) || INITIAL_PROCESS[0];

  return (
    <section id="design-process-section" className="py-24 bg-[#E2D9CD] dark:bg-[#121110] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-bold block">
            HOW WE WORK
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#121212] dark:text-white">
            Our 8-Step Luxury <br />
            <span className="italic font-light text-[#B58E5B]">Architectural Roadmap.</span>
          </h2>
          <p className="text-gray-800 dark:text-gray-300 text-sm sm:text-base font-normal">
            A seamless linear journey designed to protect your time, eliminate construction anxiety, and deliver architectural perfection.
          </p>
        </div>

        {/* Timeline Horizontal Step Numbers Bar */}
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#B58E5B]/40 dark:bg-gray-800 -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
            {INITIAL_PROCESS.map(step => (
              <button
                key={step.stepNumber}
                id={`process-step-btn-${step.stepNumber}`}
                onClick={() => setActiveStep(step.stepNumber)}
                className={`flex flex-col items-center text-center p-3 border transition-all ${
                  activeStep === step.stepNumber
                    ? 'bg-[#B58E5B] text-white border-[#B58E5B] shadow-lg scale-105 font-bold'
                    : 'bg-[#DAD1C4] dark:bg-[#252422] text-[#121212] dark:text-gray-100 border-[#B58E5B]/40 dark:border-gray-700 hover:border-[#B58E5B] hover:bg-[#D0C6B8] dark:hover:bg-[#1C1B19]'
                }`}
              >
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-serif text-xs font-bold mb-1 ${
                  activeStep === step.stepNumber ? 'border-white text-white' : 'border-[#B58E5B] text-[#B58E5B]'
                }`}>
                  0{step.stepNumber}
                </div>
                <span className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-bold leading-tight w-full ${
                  activeStep === step.stepNumber ? 'text-white' : 'text-[#121212] dark:text-gray-100'
                }`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Highlight Card */}
        <div className="bg-[#EAE1D4] dark:bg-[#1C1B19] p-8 sm:p-12 border-2 border-[#B58E5B]/60 dark:border-[#B58E5B]/40 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-2 border-[#B58E5B] bg-[#B58E5B] text-white flex items-center justify-center shrink-0 shadow-md">
                  {getStepIcon(activeStepData.iconName)}
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#B58E5B] font-bold block">
                    STAGE 0{activeStepData.stepNumber} OF 08
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#121212] dark:text-white font-medium">
                    {activeStepData.title}
                  </h3>
                </div>
              </div>

              <p className="text-[#121212] dark:text-gray-100 text-sm sm:text-base leading-relaxed font-normal max-w-2xl bg-white/40 dark:bg-black/20 p-4 border-l-4 border-l-[#B58E5B]">
                {activeStepData.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#B58E5B]/30 dark:border-gray-800">
                <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-900/40 p-3 border border-[#B58E5B]/30">
                  <Clock className="w-5 h-5 text-[#B58E5B] shrink-0" />
                  <div>
                    <span className="block text-[11px] uppercase text-[#7C5A28] dark:text-[#B58E5B] font-bold">Estimated Duration</span>
                    <span className="text-xs sm:text-sm font-bold text-[#121212] dark:text-white">{activeStepData.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-900/40 p-3 border border-[#B58E5B]/30">
                  <CheckCircle className="w-5 h-5 text-[#B58E5B] shrink-0" />
                  <div>
                    <span className="block text-[11px] uppercase text-[#7C5A28] dark:text-[#B58E5B] font-bold">Milestone Deliverable</span>
                    <span className="text-xs sm:text-sm font-bold text-[#121212] dark:text-white">{activeStepData.deliverable}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-[#B58E5B]/40 dark:border-gray-800 pt-6 lg:pt-0 lg:pl-8">
              <button
                id="process-next-step-btn"
                onClick={() => setActiveStep(prev => (prev < 8 ? prev + 1 : 1))}
                className="w-full py-4 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>{activeStep === 8 ? 'Restart Process Tour' : 'Next Stage'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="process-start-project-btn"
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3.5 bg-[#121212] dark:bg-white text-white dark:text-[#121212] hover:bg-[#B58E5B] dark:hover:bg-[#B58E5B] dark:hover:text-white text-xs uppercase tracking-[0.2em] font-bold transition-all text-center shadow-xs"
              >
                Initiate Stage 1 Consultation
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
