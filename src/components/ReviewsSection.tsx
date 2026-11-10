import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { GOOGLE_REVIEWS_URL } from '../data/studioLinks';

// Client reviews live on the studio's Google listing. Reviews the owner has confirmed are from real
// clients (added in the CMS) are shown here too; until then the section only invites a Google review.
export const ReviewsSection: React.FC = () => {
  const { testimonials } = useStudio();
  const shown = testimonials.slice(0, 3);

  return (
    <section id="reviews-section" className="py-20 bg-[#FAF8F5] dark:bg-[#181716] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-medium block">
            CLIENT REVIEWS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-white">
            Worked With Us? <span className="italic font-light text-[#B58E5B]">Tell Others.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-light">
            Reviews on our Google listing help families and businesses find a studio they can trust.
            It takes a minute, and we read every one.
          </p>
          <a
            id="google-review-btn"
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#1F1F1F] dark:hover:bg-white dark:hover:text-[#1F1F1F] transition-colors shadow-md"
          >
            <Star className="w-4 h-4" />
            <span>Review Us on Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {shown.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shown.map(t => (
              <figure key={t.id} className="p-6 border border-[#B58E5B]/30 bg-white dark:bg-[#1C1B19] space-y-4">
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-[#B58E5B] text-[#B58E5B]' : 'text-gray-300 dark:text-gray-700'}`} />
                  ))}
                </div>
                <blockquote className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-light">"{t.review}"</blockquote>
                <figcaption className="text-xs">
                  <span className="block font-semibold text-[#1F1F1F] dark:text-white">{t.clientName}</span>
                  <span className="text-gray-500 dark:text-gray-400">{t.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
