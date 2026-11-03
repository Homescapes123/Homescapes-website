import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewMode,
  PortfolioCategory,
  Project,
  Service,
  Testimonial,
  FAQItem,
  FounderData
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS
} from '../data/initialData';
import defaultFounderPhoto from '../assets/images/hariom_srivastava_founder_1785395029579.jpg';

export const DEFAULT_FOUNDER_DATA: FounderData = {
  name: 'Hariom Srivastava',
  title: 'Founder & Principal Director, Homescapes Studio',
  role: 'DIRECTOR & FOUNDER',
  photo: defaultFounderPhoto,
  email: 'workwithhomescapes@gmail.com',
  phone: '+91 7380334333',
  quote: 'Our philosophy at Homescapes Studio is grounded in creating spaces that resonate with soul, elegance, and effortless luxury. Every villa, penthouse, or workspace we craft reflects the unique personality of its owner while maintaining absolute architectural integrity.',
  bio: "Under Hariom Srivastava's visionary leadership, Homescapes Studio is headquartered in Indira Nagar, Sugamau, Lucknow, and has spearheaded over 40 landmark luxury residential and commercial projects across Lucknow, Delhi NCR, Mumbai, Bengaluru, Hyderabad, and Goa.",
  achievements: [
    'Pan-India Turnkey Delivery',
    'VR 3D Spatial Walkthroughs',
    'Bespoke Indian & Italian Sourcing',
    '3-Year Craftsmanship Warranty'
  ]
};

interface StudioContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedCategory: PortfolioCategory;
  setSelectedCategory: (cat: PortfolioCategory) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  // Site content: read-only here, edited by the owner in the CMS
  founderData: FounderData;
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
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

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
        isBookingOpen,
        setIsBookingOpen,
        founderData: DEFAULT_FOUNDER_DATA,
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
