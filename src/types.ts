export type ViewMode = 'home' | 'about' | 'portfolio' | 'services' | 'blog' | 'contact' | 'privacy' | 'terms';

export type PortfolioCategory =
  | 'All'
  | 'Residential'
  | 'Commercial'
  | 'Office'
  | 'Luxury'
  | 'Modern'
  | 'Minimal'
  | 'Kitchen'
  | 'Bedroom'
  | 'Living Room';

export interface Project {
  id: string;
  name: string;
  category: PortfolioCategory[];
  location: string;
  area: string;
  style: string;
  budget?: string;
  completionYear: string;
  heroImage: string;
  galleryImages: string[];
  beforeImage?: string;
  afterImage?: string;
  description: string;
  challenge: string;
  solution: string;
  materialsUsed: string[];
  client: string;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string; // Lucide icon identifier
  features: string[];
  deliverables: string[];
  estimatedTimeline: string;
  startingPrice?: string;
  image: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  location: string;
  clientPhoto: string;
  projectTitle: string;
  rating: number;
  review: string;
  date: string;
  featured?: boolean;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
  duration: string;
  deliverable: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Cost' | 'Timeline' | 'Design Process' | 'Consultation' | 'Materials' | 'Warranty';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Interior Trends' | 'Architecture' | 'Material Guide' | 'Design Tips' | 'Case Study';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readTime: string;
  coverImage: string;
  featured?: boolean;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
  link: string;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  estimatedBudget: string;
  preferredDate: string;
  preferredTime: string;
  spaceType: string;
  location: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface FounderData {
  name: string;
  title: string;
  role: string;
  photo: string;
  quote: string;
  bio: string;
  achievements: string[];
}
