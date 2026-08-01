import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ViewMode,
  PortfolioCategory,
  Project,
  Service,
  Testimonial,
  FAQItem,
  BlogPost,
  ConsultationBooking,
  FounderData
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_BLOG_POSTS
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
  selectedArticle: BlogPost | null;
  setSelectedArticle: (article: BlogPost | null) => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  isCMSOpen: boolean;
  setIsCMSOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Security / Owner PIN state
  ownerPin: string;
  isOwnerAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openOwnerPortal: () => void;
  authenticateOwner: (enteredPin: string) => boolean;
  changeOwnerPin: (newPin: string) => boolean;
  lockOwnerPortal: () => void;
  // Founder state
  founderData: FounderData;
  setFounderData: React.Dispatch<React.SetStateAction<FounderData>>;
  updateFounderPhoto: (photoUrl: string) => void;
  resetFounderPhoto: () => void;
  // Dynamic CMS state
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  consultations: ConsultationBooking[];
  setConsultations: React.Dispatch<React.SetStateAction<ConsultationBooking[]>>;
  addConsultation: (booking: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'date'>) => void;
  resetAllDataToDefaults: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isCMSOpen, setIsCMSOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Security / Owner Portal PIN state
  const [ownerPin, setOwnerPin] = useState<string>(() => {
    return localStorage.getItem('homescapes_owner_pin') || '1234';
  });
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openOwnerPortal = () => {
    if (isOwnerAuthenticated) {
      setIsCMSOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const authenticateOwner = (enteredPin: string): boolean => {
    if (enteredPin.trim() === ownerPin) {
      setIsOwnerAuthenticated(true);
      setIsAuthModalOpen(false);
      setIsCMSOpen(true);
      return true;
    }
    return false;
  };

  const changeOwnerPin = (newPin: string): boolean => {
    if (newPin && newPin.trim().length >= 4) {
      const clean = newPin.trim();
      setOwnerPin(clean);
      localStorage.setItem('homescapes_owner_pin', clean);
      return true;
    }
    return false;
  };

  const lockOwnerPortal = () => {
    setIsOwnerAuthenticated(false);
    setIsCMSOpen(false);
  };

  // Helper to replace $ with ₹ in strings
  const sanitizeINR = (str: string) => (str ? str.replace(/\$/g, '₹') : str);

  // Load state from localStorage or initial defaults, clearing old legacy keys
  const [projects, setProjects] = useState<Project[]>(() => {
    localStorage.removeItem('maison_projects');
    const saved = localStorage.getItem('homescapes_projects_v2');
    if (saved) {
      try {
        const parsed: Project[] = JSON.parse(saved);
        return parsed.map(p => ({ ...p, budget: sanitizeINR(p.budget) }));
      } catch (e) {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  const [services, setServices] = useState<Service[]>(() => {
    localStorage.removeItem('maison_services');
    const saved = localStorage.getItem('homescapes_services_v2');
    if (saved) {
      try {
        const parsed: Service[] = JSON.parse(saved);
        return parsed.map(s => ({ ...s, startingPrice: sanitizeINR(s.startingPrice) }));
      } catch (e) {
        return INITIAL_SERVICES;
      }
    }
    return INITIAL_SERVICES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    localStorage.removeItem('maison_testimonials');
    localStorage.removeItem('homescapes_testimonials_v2');
    const saved = localStorage.getItem('homescapes_testimonials_v3');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    localStorage.removeItem('maison_faqs');
    const saved = localStorage.getItem('homescapes_faqs_v2');
    if (saved) {
      try {
        const parsed: FAQItem[] = JSON.parse(saved);
        return parsed.map(f => ({ ...f, answer: sanitizeINR(f.answer), question: sanitizeINR(f.question) }));
      } catch (e) {
        return INITIAL_FAQS;
      }
    }
    return INITIAL_FAQS;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    localStorage.removeItem('maison_blog_posts');
    const saved = localStorage.getItem('homescapes_blog_posts_v2');
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [consultations, setConsultations] = useState<ConsultationBooking[]>(() => {
    localStorage.removeItem('maison_consultations');
    const saved = localStorage.getItem('homescapes_consultations_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [founderData, setFounderData] = useState<FounderData>(() => {
    localStorage.removeItem('homescapes_founder_data_v1');
    localStorage.removeItem('homescapes_founder_data_v2');
    localStorage.removeItem('homescapes_founder_data_v3');
    const saved = localStorage.getItem('homescapes_founder_data_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.photo || parsed.photo.includes('unsplash.com') || parsed.photo.includes('photo-1507003211169')) {
          parsed.photo = defaultFounderPhoto;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_FOUNDER_DATA;
      }
    }
    return DEFAULT_FOUNDER_DATA;
  });

  const isServerSyncLoadedRef = useRef(false);

  // Sync with server API on mount so changes reflect across all devices/browsers
  useEffect(() => {
    fetch('/api/cms/store')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          if (data.founderData) {
            if (!data.founderData.photo || data.founderData.photo.includes('unsplash.com')) {
              data.founderData.photo = defaultFounderPhoto;
            }
            setFounderData(data.founderData);
          }
          if (Array.isArray(data.projects) && data.projects.length > 0) setProjects(data.projects);
          if (Array.isArray(data.services) && data.services.length > 0) setServices(data.services);
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) setTestimonials(data.testimonials);
          if (Array.isArray(data.faqs) && data.faqs.length > 0) setFaqs(data.faqs);
          if (Array.isArray(data.blogPosts) && data.blogPosts.length > 0) setBlogPosts(data.blogPosts);
          if (Array.isArray(data.consultations)) setConsultations(data.consultations);
        }
      })
      .catch(err => console.info('Server sync initial fetch:', err))
      .finally(() => {
        isServerSyncLoadedRef.current = true;
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('homescapes_founder_data_v4', JSON.stringify(founderData));
    } catch (e) {
      console.warn('LocalStorage quota exceeded saving founder data', e);
    }

    if (!isServerSyncLoadedRef.current) return;

    // Sync updated founder data to server API so all users & devices see it
    fetch('/api/cms/founder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(founderData),
    }).catch(err => console.warn('Server sync error for founder photo:', err));
  }, [founderData]);

  const updateFounderPhoto = (photoUrl: string) => {
    setFounderData(prev => {
      const updated = { ...prev, photo: photoUrl };
      try {
        localStorage.setItem('homescapes_founder_data_v4', JSON.stringify(updated));
      } catch (e) {}

      fetch('/api/cms/founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(err => console.warn('Direct upload server error:', err));

      return updated;
    });
  };

  const resetFounderPhoto = () => {
    setFounderData(prev => {
      const updated = { ...prev, photo: defaultFounderPhoto };
      try {
        localStorage.setItem('homescapes_founder_data_v4', JSON.stringify(updated));
      } catch (e) {}

      fetch('/api/cms/founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(err => console.warn('Direct reset server error:', err));

      return updated;
    });
  };

  // Sync state to local storage and server API whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('homescapes_projects_v2', JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage quota exceeded saving projects', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('homescapes_services_v2', JSON.stringify(services));
    } catch (e) {
      console.warn('LocalStorage quota exceeded saving services', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('homescapes_testimonials_v3', JSON.stringify(testimonials));
    } catch (e) {
      console.warn('LocalStorage quota exceeded saving testimonials', e);
    }
  }, [testimonials]);

  const addTestimonial = (review: Omit<Testimonial, 'id' | 'date'>) => {
    const newTestimonial: Testimonial = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
  };

  useEffect(() => {
    try {
      localStorage.setItem('homescapes_faqs_v2', JSON.stringify(faqs));
    } catch (e) {
      console.warn('LocalStorage quota exceeded saving faqs', e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem('homescapes_blog_posts_v2', JSON.stringify(blogPosts));
    } catch (e) {
      console.warn('LocalStorage quota exceeded saving blog posts', e);
    }
  }, [blogPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('homescapes_consultations_v2', JSON.stringify(consultations));
    } catch (e) {
      console.warn('LocalStorage quota exceeded saving consultations', e);
    }
  }, [consultations]);

  // Sync overall store to server API when content changes
  useEffect(() => {
    if (!isServerSyncLoadedRef.current) return;

    const timeout = setTimeout(() => {
      fetch('/api/cms/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          founderData,
          projects,
          services,
          testimonials,
          faqs,
          blogPosts,
          consultations
        })
      }).catch(err => console.warn('Failed to sync full CMS store to server:', err));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [founderData, projects, services, testimonials, faqs, blogPosts, consultations]);

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

  const addConsultation = (bookingData: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: ConsultationBooking = {
      ...bookingData,
      id: 'consult-' + Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setConsultations(prev => [newBooking, ...prev]);
  };

  const resetAllDataToDefaults = () => {
    setProjects(INITIAL_PROJECTS);
    setServices(INITIAL_SERVICES);
    setTestimonials(INITIAL_TESTIMONIALS);
    setFaqs(INITIAL_FAQS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setConsultations([]);
    setFounderData(DEFAULT_FOUNDER_DATA);
    localStorage.removeItem('maison_projects');
    localStorage.removeItem('maison_services');
    localStorage.removeItem('maison_testimonials');
    localStorage.removeItem('maison_faqs');
    localStorage.removeItem('maison_blog_posts');
    localStorage.removeItem('homescapes_consultations_v2');
    localStorage.removeItem('homescapes_founder_data_v1');
    localStorage.removeItem('homescapes_founder_data_v2');
    localStorage.removeItem('homescapes_founder_data_v3');
    localStorage.removeItem('homescapes_founder_data_v4');
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
        selectedArticle,
        setSelectedArticle,
        isBookingOpen,
        setIsBookingOpen,
        isCMSOpen,
        setIsCMSOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        ownerPin,
        isOwnerAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openOwnerPortal,
        authenticateOwner,
        changeOwnerPin,
        lockOwnerPortal,
        founderData,
        setFounderData,
        updateFounderPhoto,
        resetFounderPhoto,
        projects,
        setProjects,
        services,
        setServices,
        testimonials,
        setTestimonials,
        faqs,
        setFaqs,
        blogPosts,
        setBlogPosts,
        consultations,
        setConsultations,
        addConsultation,
        addTestimonial,
        resetAllDataToDefaults
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
