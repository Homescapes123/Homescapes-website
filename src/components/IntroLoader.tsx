import React, { useEffect, useState } from 'react';

export const IntroLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F5F2] dark:bg-[#121110] flex flex-col items-center justify-center transition-opacity duration-700 animate-fadeOut">
      <div className="w-16 h-16 border-2 border-[#B58E5B] flex items-center justify-center font-serif text-3xl text-[#B58E5B] animate-pulse">
        H
      </div>
      <span className="mt-4 font-serif text-sm tracking-[0.4em] uppercase text-[#1F1F1F] dark:text-white font-medium">
        HOMESCAPES STUDIO
      </span>
      <span className="text-[9px] tracking-[0.3em] uppercase text-[#B58E5B] mt-1">
        LUXURY INTERIORS
      </span>
    </div>
  );
};
