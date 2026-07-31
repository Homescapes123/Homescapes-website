import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      id="floating-back-to-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-[#1F1F1F] dark:bg-[#B58E5B] text-white flex items-center justify-center shadow-2xl hover:bg-[#B58E5B] dark:hover:bg-white dark:hover:text-black transition-all duration-300 border border-white/20"
      title="Back to Top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
