import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { LeaderProfile } from '../types';
import { ArrowRight, CheckCircle2, Mail, Phone } from 'lucide-react';

const STUDIO_EMAIL = 'workwithhomescapes@gmail.com';
const STUDIO_PHONE = '+91 7380334333';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

// Circular portrait with the gold ring; a monogram stands in until a photograph is supplied (or if it fails to load).
const Portrait: React.FC<{ leader: LeaderProfile }> = ({ leader }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative shrink-0">
      <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#B58E5B] via-[#F3E3C3] to-[#8C6638] shadow-xl hover:shadow-[#B58E5B]/20 transition-all duration-300">
        <div className="p-1 bg-[#E8DFC8] dark:bg-[#1C1B19] rounded-full">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-[#121212] group">
            {leader.photo && !failed ? (
              <img
                src={leader.photo}
                alt={`${leader.name}, ${leader.designation}`}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={() => setFailed(true)}
              />
            ) : (
              <div
                role="img"
                aria-label={`${leader.name}, ${leader.designation} (photograph to be added)`}
                className="w-full h-full flex items-center justify-center font-serif text-4xl sm:text-5xl tracking-[0.1em] text-[#B58E5B]"
              >
                {initials(leader.name)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#121212] border border-[#B58E5B] px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#B58E5B] animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest text-white font-bold">{leader.shortTitle}</span>
      </div>
    </div>
  );
};

// One profile column. Columns start at the top so the portraits and names line up side by side.
const LeaderProfileColumn: React.FC<{ leader: LeaderProfile }> = ({ leader }) => (
  <article className="flex flex-col items-center gap-6 py-10 first:pt-0 last:pb-0 md:py-0 md:px-8 lg:px-12">
    <Portrait leader={leader} />

    <div className="text-center">
      <span className="text-[10px] tracking-[0.25em] uppercase text-[#B58E5B] font-bold block">
        {leader.designation}
      </span>
      <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F1F1F] dark:text-white mt-1">
        {leader.name}
      </h4>
    </div>

    {leader.quote && (
      <blockquote className="self-stretch pl-4 border-l-2 border-[#B58E5B]">
        <p className="font-serif italic text-sm sm:text-base text-[#1F1F1F] dark:text-gray-200 leading-relaxed">
          "{leader.quote}"
        </p>
      </blockquote>
    )}

    {leader.bio && (
      <p className="self-stretch text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light whitespace-pre-line">
        {leader.bio}
      </p>
    )}

    {leader.highlights && leader.highlights.length > 0 && (
      <ul className="self-stretch flex flex-wrap justify-center gap-x-4 gap-y-2">
        {leader.highlights.map(item => (
          <li key={item} className="flex items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B58E5B] shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </article>
);

export const LeadershipSection: React.FC = () => {
  const { leadership, goToContact } = useStudio();
  if (leadership.length === 0) return null;

  return (
    <div id="leadership" className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-medium block">
          THE PEOPLE BEHIND THE STUDIO
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-white">
          Meet Our <span className="italic font-light text-[#B58E5B]">Leadership.</span>
        </h3>
      </div>

      {/* One frame: profiles side by side from tablet width (divided by a gold rule), stacked on phones */}
      <div className={`bg-[#E8DFC8] dark:bg-[#1C1B19] border border-[#B58E5B]/50 p-6 sm:p-10 shadow-lg rounded-xl ${leadership.length > 1 ? '' : 'max-w-2xl mx-auto'}`}>
        <div
          className={`grid grid-cols-1 divide-y divide-[#B58E5B]/30 md:divide-y-0 md:divide-x ${
            leadership.length > 1 ? 'md:grid-cols-2' : ''
          }`}
        >
          {leadership.map(leader => (
            <LeaderProfileColumn key={leader.id} leader={leader} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
        <a
          href={`mailto:${STUDIO_EMAIL}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121110]/5 dark:bg-white/10 border border-[#B58E5B]/40 hover:border-[#B58E5B] text-[#B58E5B] transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-[#B58E5B]" />
          <span>{STUDIO_EMAIL}</span>
        </a>
        <a
          href={`tel:${STUDIO_PHONE.replace(/\s+/g, '')}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121110]/5 dark:bg-white/10 border border-[#B58E5B]/40 hover:border-[#B58E5B] text-[#B58E5B] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#B58E5B]" />
          <span>{STUDIO_PHONE}</span>
        </a>
        <button
          id="leadership-book-btn"
          onClick={() => goToContact()}
          className="px-6 py-2.5 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.15em] font-bold hover:bg-[#121212] transition-colors shadow-md flex items-center gap-2"
        >
          <span>Book a Consultation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
