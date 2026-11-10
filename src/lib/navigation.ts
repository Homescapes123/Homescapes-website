// Header navigation helpers: which link to underline while scrolling, and scrolling to a section.
import type { ViewMode } from '../types';

export type NavView = 'home' | 'about' | 'portfolio' | 'services' | 'contact';

export const CONTACT_SECTION_ID = 'contact-section';

// The section each header link stands for. "Home" has none: it is underlined above the first of these.
export const NAV_SECTION_IDS: Record<Exclude<NavView, 'home'>, string> = {
  about: 'about-us-section',
  services: 'our-services-section',
  portfolio: 'featured-projects-section',
  contact: CONTACT_SECTION_ID
};

export interface SectionPosition {
  view: NavView;
  top: number; // distance of the section's top from the top of the viewport
}

// Scroll-spy rule: underline the last section (in page order) whose top has scrolled above `line`.
// At the very bottom of the page the last section wins even if it is too short to reach the line.
// Above every section, keep the current view's own link (Home on the home page; none on legal pages).
export function pickActiveNav(sections: SectionPosition[], line: number, atBottom: boolean, fallback: ViewMode): ViewMode {
  const ordered = [...sections].sort((a, b) => a.top - b.top);
  if (atBottom && ordered.length > 0) return ordered[ordered.length - 1].view;

  let active: ViewMode = fallback;
  for (const section of ordered) {
    if (section.top <= line) active = section.view;
  }
  return active;
}

// Bottom edge of the fixed header, so sections are measured from (and scrolled to) just below it.
const headerBottom = () => document.getElementById('main-header')?.getBoundingClientRect().bottom ?? 0;

export function findActiveNav(fallback: ViewMode): ViewMode {
  const sections: SectionPosition[] = [];
  for (const [view, id] of Object.entries(NAV_SECTION_IDS) as [NavView, string][]) {
    const element = document.getElementById(id);
    if (element) sections.push({ view, top: element.getBoundingClientRect().top });
  }
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  return pickActiveNav(sections, headerBottom() + window.innerHeight * 0.25, atBottom, fallback);
}

// Smooth-scrolls so the section starts just below the fixed header. Returns false if it isn't on the page.
export function scrollToSection(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;
  window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - headerBottom(), behavior: 'smooth' });
  return true;
}
