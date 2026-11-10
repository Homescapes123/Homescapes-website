import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { X, MapPin, Maximize2, Layers, IndianRupee, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';

export const ProjectDetailModal: React.FC = () => {
  const { selectedProject, setSelectedProject, goToContact } = useStudio();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [beforeAfterPos, setBeforeAfterPos] = useState(50);

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="bg-[#F8F5F2] dark:bg-[#141312] w-full max-w-6xl min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-y-auto border border-[#B58E5B]/40 shadow-2xl relative text-[#1F1F1F] dark:text-gray-100">
        
        {/* Close Button Header */}
        <div className="sticky top-0 z-30 bg-[#F8F5F2]/90 dark:bg-[#141312]/90 backdrop-blur-md px-6 py-4 border-b border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between">
          <button
            id="project-detail-back-btn"
            onClick={() => setSelectedProject(null)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>
          
          <button
            id="project-detail-close-btn"
            onClick={() => setSelectedProject(null)}
            className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-10 space-y-12">
          
          {/* Main Title Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#B58E5B]">
              <span>{selectedProject.category.join(' • ')}</span>
              <span>—</span>
              <span>{selectedProject.completionYear}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1F1F1F] dark:text-white">
              {selectedProject.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-light text-base max-w-3xl leading-relaxed">
              {selectedProject.description}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-6 glass-card border border-[#D8CBBE]/40 dark:border-gray-800">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] flex items-center gap-1.5 mb-1">
                <MapPin className="w-3 h-3" /> Location
              </span>
              <span className="text-xs font-medium dark:text-white">{selectedProject.location}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] flex items-center gap-1.5 mb-1">
                <Maximize2 className="w-3 h-3" /> Area
              </span>
              <span className="text-xs font-medium dark:text-white">{selectedProject.area}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] flex items-center gap-1.5 mb-1">
                <Layers className="w-3 h-3" /> Style
              </span>
              <span className="text-xs font-medium dark:text-white">{selectedProject.style}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] flex items-center gap-1.5 mb-1">
                <IndianRupee className="w-3 h-3" /> Investment
              </span>
              <span className="text-xs font-medium text-[#B58E5B]">{selectedProject.budget || 'Custom Confidential'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] flex items-center gap-1.5 mb-1">
                <Calendar className="w-3 h-3" /> Completed
              </span>
              <span className="text-xs font-medium dark:text-white">{selectedProject.completionYear}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] flex items-center gap-1.5 mb-1">
                <User className="w-3 h-3" /> Client Profile
              </span>
              <span className="text-xs font-medium dark:text-white">{selectedProject.client}</span>
            </div>
          </div>

          {/* Main Hero & Gallery Showcase */}
          <div className="space-y-4">
            <div className="relative aspect-[16/9] bg-black overflow-hidden border border-[#D8CBBE]/40 dark:border-gray-800">
              <img
                src={selectedProject.galleryImages[activeGalleryIndex] || selectedProject.heroImage}
                alt={selectedProject.name}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {selectedProject.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  id={`project-thumb-${idx}`}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`relative w-24 h-16 shrink-0 border transition-all ${
                    activeGalleryIndex === idx
                      ? 'border-[#B58E5B] ring-2 ring-[#B58E5B]/40'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Project Narrative: Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#EFECE6] dark:bg-[#1C1B1A] border-l-2 border-l-[#B58E5B]">
              <h4 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white mb-3">
                Architectural Challenge
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                {selectedProject.challenge}
              </p>
            </div>

            <div className="p-6 bg-[#EFECE6] dark:bg-[#1C1B1A] border-l-2 border-l-[#B58E5B]">
              <h4 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white mb-3">
                MAISON Design Solution
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                {selectedProject.solution}
              </p>
            </div>
          </div>

          {/* Interactive Before / After Comparison (if available) */}
          {selectedProject.beforeImage && selectedProject.afterImage && (
            <div className="space-y-4 pt-6 border-t border-[#D8CBBE]/40 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] block">Interactive Transformation</span>
                  <h3 className="font-serif text-2xl text-[#1F1F1F] dark:text-white">Before & After Reveal</h3>
                </div>
                <span className="text-xs text-gray-500">Drag handle left/right</span>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden select-none border border-[#B58E5B]/30 touch-none">
                {/* After Image */}
                <img
                  src={selectedProject.afterImage}
                  alt="After Transformation"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Before Image with Clip */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${beforeAfterPos}%` }}
                >
                  <img
                    src={selectedProject.beforeImage}
                    alt="Before State"
                    className="w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-black/75 text-white text-[10px] uppercase tracking-widest px-3 py-1">
                    Before Restoration
                  </span>
                </div>

                <span className="absolute top-4 right-4 bg-[#B58E5B] text-white text-[10px] uppercase tracking-widest px-3 py-1">
                  After Transformation
                </span>

                {/* Drag Slider Handle */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={beforeAfterPos}
                  onChange={e => setBeforeAfterPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none shadow-2xl"
                  style={{ left: `${beforeAfterPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg border border-black/20 text-xs font-bold">
                    ↔
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Materials & Finishes Used */}
          <div className="space-y-4 pt-6 border-t border-[#D8CBBE]/40 dark:border-gray-800">
            <h4 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white">
              Bespoke Materials & Finishes Spec
            </h4>
            <div className="flex flex-wrap gap-3">
              {selectedProject.materialsUsed.map((mat, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-[#EFECE6] dark:bg-gray-800 border border-[#D8CBBE]/60 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div className="pt-8 border-t border-[#D8CBBE]/40 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h5 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white">
                Inspired by {selectedProject.name}?
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5">
                Schedule a consultation to discuss replicating this aesthetic in your space.
              </p>
            </div>

            <button
              id="project-detail-consult-cta-btn"
              onClick={() => {
                setSelectedProject(null);
                goToContact();
              }}
              className="px-8 py-3.5 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1F1F1F] transition-all whitespace-nowrap"
            >
              Book Project Consultation
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
