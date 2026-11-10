import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewMode,
  PortfolioCategory,
  Project,
  Service,
  Testimonial,
  FAQItem,
  LeaderProfile
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_LEADERSHIP
} from '../data/initialData';
import { CONTACT_SECTION_ID, scrollToSection } from '../lib/navigation';

interface StudioContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedCategory: PortfolioCategory;
  setSelectedCategory: (cat: PortfolioCategory) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  // "Book consultation" and similar buttons: scroll to the contact form at the end of the page.
  goToContact: () => void;
  // Site content: read-only here, edited by the owner in the CMS
  leadership: LeaderProfile[];
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Every page view ends with the contact section; the Privacy and Terms pages don't, so open Contact instead.
  const goToContact = () => {
    if (scrollToSection(CONTACT_SECTION_ID)) return;
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <StudioContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        selectedCategory,
        setSelectedCategory,
        selectedProject,
        setSelectedProject,
        goToContact,
        leadership: INITIAL_LEADERSHIP,
        projects: INITIAL_PROJECTS,
        services: INITIAL_SERVICES,
        testimonials: INITIAL_TESTIMONIALS,
        faqs: INITIAL_FAQS
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
