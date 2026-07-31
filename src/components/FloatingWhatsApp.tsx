import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {showTooltip && (
        <div className="glass-panel p-3 border border-[#25D366]/40 shadow-xl text-xs text-[#1F1F1F] dark:text-white animate-fadeIn max-w-xs flex items-center justify-between gap-3">
          <span>Inquire directly on WhatsApp with our Lead Architect</span>
          <button onClick={() => setShowTooltip(false)} className="text-gray-400 hover:text-black dark:hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/917380334333?text=Hello%20Homescapes%20Studio,%20I%20would%20like%20to%20discuss%20an%20interior%20or%20architectural%20project%20in%20India."
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
      </a>
    </div>
  );
};
