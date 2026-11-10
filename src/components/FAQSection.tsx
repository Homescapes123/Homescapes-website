import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { FAQItem } from '../types';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faqs, goToContact } = useStudio();
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const faqCategories = ['All', 'Cost', 'Timeline', 'Design Process', 'Consultation', 'Materials', 'Warranty'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(localSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq-section" className="py-24 bg-[#E4DCD2] dark:bg-[#181716] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-bold block">
            COMMON INQUIRIES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#121212] dark:text-white">
            Frequently Asked <br />
            <span className="italic font-light text-[#B58E5B]">Questions.</span>
          </h2>
          <p className="text-gray-800 dark:text-gray-300 text-sm font-medium max-w-xl mx-auto">
            Everything you need to know about our project investment parameters, timelines, stone sourcing, and 3-Year Craftsmanship Guarantee.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-10">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search questions (e.g., marble, timeline, budget)..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs bg-[#EBE3D8] dark:bg-[#1C1B19] border border-[#B58E5B]/50 dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#121212] dark:text-white placeholder-gray-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-center gap-2.5 flex-wrap pb-2">
            {faqCategories.map(cat => (
              <button
                key={cat}
                id={`faq-cat-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm uppercase tracking-wider font-bold transition-all border whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#B58E5B] text-white border-[#B58E5B] shadow-md scale-105'
                    : 'bg-[#DAD1C4] dark:bg-[#252422] text-[#121212] dark:text-gray-100 border-[#B58E5B]/40 dark:border-gray-700 hover:border-[#B58E5B] hover:text-[#B58E5B] hover:bg-[#D0C6B8] dark:hover:bg-[#1C1B19]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 glass-card text-gray-500">
              No matching questions found for "{localSearch}".
            </div>
          ) : (
            filteredFaqs.map((faq: FAQItem) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  id={`faq-accordion-item-${faq.id}`}
                  className="bg-[#EAE1D4] dark:bg-[#1C1B19] border border-[#B58E5B]/40 dark:border-gray-800 transition-all duration-300 shadow-xs rounded-md"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#B58E5B] shrink-0" />
                      <span className="font-serif text-lg text-[#121212] dark:text-white font-medium">
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#B58E5B] bg-[#B58E5B]/15 px-2.5 py-1 border border-[#B58E5B]/40 hidden sm:inline-block">
                        {faq.category}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#B58E5B] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#2A2725] dark:text-gray-200 leading-relaxed font-normal border-t border-[#B58E5B]/20 dark:border-gray-800 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center glass-panel p-8 border border-[#B58E5B]/30 max-w-2xl mx-auto space-y-4">
          <MessageSquare className="w-8 h-8 text-[#B58E5B] mx-auto" />
          <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white font-normal">
            Have a Specific Architectural Question?
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-light">
            Our principal architectural team is available to answer custom technical inquiries during your initial consultation.
          </p>
          <button
            id="faq-ask-director-btn"
            onClick={() => goToContact()}
            className="px-6 py-3 bg-[#B58E5B] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#1F1F1F] transition-colors"
          >
            Ask Our Design Director
          </button>
        </div>

      </div>
    </section>
  );
};
