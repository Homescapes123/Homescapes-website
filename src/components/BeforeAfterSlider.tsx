import React, { useState } from 'react';
import { Sliders, Sparkles } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);

  const pairs = [
    {
      title: 'TriBeCa Living Room Transformation',
      location: 'New York Penthouse',
      before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
      details: 'Converted a raw 1980s brick warehouse floor into a seamless French Parisian light haven with hand-carved Calacatta Viola fireplaces.'
    },
    {
      title: 'Kensington Monolithic Kitchen',
      location: 'London Townhouse',
      before: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600&auto=format&fit=crop',
      details: 'Replaced dated oak cabinetry with a 14-foot Arabescato marble island, concealed Gaggenau appliances, and soft perimeter shadow coves.'
    },
    {
      title: 'Beverly Hills Solaria Living Suite',
      location: 'California Estate',
      before: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      details: 'Introduced floor-to-ceiling pivot glass portals, micro-cement plaster walls, and custom motorized exterior shade louvers.'
    }
  ];

  const currentPair = pairs[selectedPairIndex];

  return (
    <section id="before-after-section" className="py-24 bg-[#F8F5F2] dark:bg-[#121110] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-medium block">
            THE ART OF TRANSFORMATION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F1F1F] dark:text-white">
            Before & After <br />
            <span className="italic font-light text-[#B58E5B]">Architectural Reveals.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-light">
            Slide horizontally to experience the dramatic evolution from raw space to refined luxury living.
          </p>
        </div>

        {/* Pair Selector Pills */}
        <div className="flex items-center justify-center gap-3 mb-8 overflow-x-auto pb-2">
          {pairs.map((pair, idx) => (
            <button
              key={idx}
              id={`before-after-selector-${idx}`}
              onClick={() => setSelectedPairIndex(idx)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-all rounded-none ${
                selectedPairIndex === idx
                  ? 'bg-[#B58E5B] text-white font-medium shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-[#D8CBBE]/40 dark:border-gray-700 hover:border-[#B58E5B]'
              }`}
            >
              {pair.title}
            </button>
          ))}
        </div>

        {/* Interactive Image Split View Container */}
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden select-none border border-[#B58E5B]/40 shadow-2xl touch-none bg-black">
            
            {/* After Image (Background) */}
            <img
              src={currentPair.after}
              alt="After Transformation"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={currentPair.before}
                alt="Before Space"
                className="w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 border border-white/20">
                RAW BEFORE STATE
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-[#B58E5B] text-white text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 shadow-lg">
              MAISON TRANSFORMATION
            </div>

            {/* Range Input for dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={e => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Image comparison slider"
            />

            {/* Vertical Split Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none shadow-2xl"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#1F1F1F] flex items-center justify-center shadow-2xl border-2 border-[#B58E5B]">
                <Sliders className="w-4 h-4 text-[#B58E5B]" />
              </div>
            </div>
          </div>

          {/* Narrative Caption */}
          <div className="glass-card p-6 border border-[#D8CBBE]/40 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] font-semibold">
                {currentPair.location}
              </span>
              <h4 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white mt-0.5">
                {currentPair.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-1 max-w-2xl">
                {currentPair.details}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#B58E5B] font-medium shrink-0">
              <Sparkles className="w-4 h-4" />
              <span>Drag slider to compare</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
