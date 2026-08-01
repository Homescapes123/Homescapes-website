import React, { useState, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import { Project, Service, Testimonial, FAQItem, BlogPost, PortfolioCategory, ConsultationBooking } from '../types';
import defaultFounderPhoto from '../assets/images/hariom_srivastava_founder_1785395029579.jpg';
import {
  X,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Download,
  Upload,
  Database,
  CheckCircle2,
  FolderKanban,
  Wrench,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Calendar,
  UserCheck,
  Camera,
  Link as LinkIcon,
  UploadCloud,
  Check,
  Edit2,
  Lock,
  KeyRound,
  Mail,
  Send,
  ExternalLink
} from 'lucide-react';

const ALL_CATEGORIES: PortfolioCategory[] = [
  'Residential',
  'Commercial',
  'Office',
  'Luxury',
  'Modern',
  'Minimal',
  'Kitchen',
  'Bedroom',
  'Living Room'
];

export const CMSManagerModal: React.FC = () => {
  const {
    isCMSOpen,
    setIsCMSOpen,
    isOwnerAuthenticated,
    lockOwnerPortal,
    changeOwnerPin,
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
    resetAllDataToDefaults,
    founderData,
    setFounderData,
    updateFounderPhoto,
    resetFounderPhoto
  } = useStudio();

  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'testimonials' | 'faqs' | 'blog' | 'bookings' | 'founder'>('projects');
  const [successMsg, setSuccessMsg] = useState('');
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinNotice, setPinNotice] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'project' | 'service' | 'testimonial' | 'faq' | 'blog' | 'booking' | 'reset';
    id?: string;
    name: string;
  } | null>(null);

  const cmsFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const founderFileInputRef = useRef<HTMLInputElement>(null);
  const serviceFileInputRef = useRef<HTMLInputElement>(null);
  const testimonialFileInputRef = useRef<HTMLInputElement>(null);

  const [founderUrlInput, setFounderUrlInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [lastEmailResult, setLastEmailResult] = useState<{
    success?: boolean;
    isSandbox?: boolean;
    previewUrl?: string | null;
    message?: string;
  } | null>(null);

  // --- Services CMS State & Handlers ---
  const [showAddService, setShowAddService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFeaturesInput, setServiceFeaturesInput] = useState('');
  const [serviceDeliverablesInput, setServiceDeliverablesInput] = useState('');
  const [newService, setNewService] = useState<Partial<Service>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Building2',
    features: [],
    deliverables: [],
    estimatedTimeline: '6–10 Weeks',
    startingPrice: '₹1,50,000',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800'
  });

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setShowAddService(false);
    setServiceFeaturesInput('');
    setServiceDeliverablesInput('');
    setNewService({
      title: '',
      shortDescription: '',
      fullDescription: '',
      iconName: 'Building2',
      features: [],
      deliverables: [],
      estimatedTimeline: '6–10 Weeks',
      startingPrice: '₹1,50,000',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800'
    });
  };

  const startEditService = (s: Service) => {
    setEditingServiceId(s.id);
    setNewService({ ...s });
    setServiceFeaturesInput(s.features ? s.features.join(', ') : '');
    setServiceDeliverablesInput(s.deliverables ? s.deliverables.join(', ') : '');
    setShowAddService(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title) return;

    const features = serviceFeaturesInput
      ? serviceFeaturesInput.split(',').map(f => f.trim()).filter(Boolean)
      : (newService.features || []);

    const deliverables = serviceDeliverablesInput
      ? serviceDeliverablesInput.split(',').map(d => d.trim()).filter(Boolean)
      : (newService.deliverables || []);

    if (editingServiceId) {
      setServices(prev =>
        prev.map(s => s.id === editingServiceId ? {
          ...s,
          title: newService.title || s.title,
          shortDescription: newService.shortDescription || s.shortDescription,
          fullDescription: newService.fullDescription || s.fullDescription,
          iconName: newService.iconName || s.iconName,
          features,
          deliverables,
          estimatedTimeline: newService.estimatedTimeline || s.estimatedTimeline,
          startingPrice: newService.startingPrice || s.startingPrice,
          image: newService.image || s.image
        } : s)
      );
      showNotification(`Updated service "${newService.title}" successfully!`);
    } else {
      const created: Service = {
        id: 'serv-' + Date.now(),
        title: newService.title || 'Bespoke Architectural Service',
        shortDescription: newService.shortDescription || 'Full turn-key luxury interior solution.',
        fullDescription: newService.fullDescription || 'Complete design, execution, material procurement, and project supervision.',
        iconName: newService.iconName || 'Building2',
        features: features.length > 0 ? features : ['Spatial Layouts', '3D Walkthroughs', 'Turnkey Execution'],
        deliverables: deliverables.length > 0 ? deliverables : ['3D Renders', 'BOQ & Estimations', 'Site Handover'],
        estimatedTimeline: newService.estimatedTimeline || '6–12 Weeks',
        startingPrice: newService.startingPrice || '₹1,50,000',
        image: newService.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800'
      };
      setServices(prev => [...prev, created]);
      showNotification(`Added new service "${created.title}"!`);
    }
    resetServiceForm();
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await compressImage(file, 1000, 0.75);
      if (base64) {
        setNewService(prev => ({ ...prev, image: base64 }));
        showNotification('Service image uploaded successfully!');
      }
    }
  };

  // --- Testimonials CMS State & Handlers ---
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    clientName: '',
    clientRole: 'Villa Owner',
    location: 'Lucknow',
    clientPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
    projectTitle: 'Luxury Interior Residence',
    rating: 5,
    review: '',
    date: '2026'
  });

  const resetTestimonialForm = () => {
    setEditingTestimonialId(null);
    setShowAddTestimonial(false);
    setNewTestimonial({
      clientName: '',
      clientRole: 'Villa Owner',
      location: 'Lucknow',
      clientPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
      projectTitle: 'Luxury Interior Residence',
      rating: 5,
      review: '',
      date: '2026'
    });
  };

  const startEditTestimonial = (t: Testimonial) => {
    setEditingTestimonialId(t.id);
    setNewTestimonial({ ...t });
    setShowAddTestimonial(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.clientName) return;

    if (editingTestimonialId) {
      setTestimonials(prev =>
        prev.map(t => t.id === editingTestimonialId ? {
          ...t,
          clientName: newTestimonial.clientName || t.clientName,
          clientRole: newTestimonial.clientRole || t.clientRole,
          location: newTestimonial.location || t.location,
          clientPhoto: newTestimonial.clientPhoto || t.clientPhoto,
          projectTitle: newTestimonial.projectTitle || t.projectTitle,
          rating: newTestimonial.rating ?? t.rating,
          review: newTestimonial.review || t.review,
          date: newTestimonial.date || t.date
        } : t)
      );
      showNotification(`Updated testimonial from "${newTestimonial.clientName}"!`);
    } else {
      const created: Testimonial = {
        id: 'testi-' + Date.now(),
        clientName: newTestimonial.clientName || 'Valued Client',
        clientRole: newTestimonial.clientRole || 'Villa Owner',
        location: newTestimonial.location || 'Lucknow',
        clientPhoto: newTestimonial.clientPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
        projectTitle: newTestimonial.projectTitle || 'Bespoke Residence',
        rating: newTestimonial.rating || 5,
        review: newTestimonial.review || 'Flawless craftsmanship and prompt execution by the Homescapes team.',
        date: newTestimonial.date || '2026',
        featured: true
      };
      setTestimonials(prev => [created, ...prev]);
      showNotification(`Added new testimonial from "${created.clientName}"!`);
    }
    resetTestimonialForm();
  };

  const handleTestimonialPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await compressImage(file, 400, 0.75);
      if (base64) {
        setNewTestimonial(prev => ({ ...prev, clientPhoto: base64 }));
        showNotification('Client portrait photo uploaded!');
      }
    }
  };

  // --- FAQs CMS State & Handlers ---
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
    category: 'Consultation'
  });

  const resetFaqForm = () => {
    setEditingFaqId(null);
    setShowAddFaq(false);
    setNewFaq({
      question: '',
      answer: '',
      category: 'Consultation'
    });
  };

  const startEditFaq = (f: FAQItem) => {
    setEditingFaqId(f.id);
    setNewFaq({ ...f });
    setShowAddFaq(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question) return;

    if (editingFaqId) {
      setFaqs(prev =>
        prev.map(f => f.id === editingFaqId ? {
          ...f,
          question: newFaq.question || f.question,
          answer: newFaq.answer || f.answer,
          category: (newFaq.category as any) || f.category
        } : f)
      );
      showNotification(`Updated FAQ question!`);
    } else {
      const created: FAQItem = {
        id: 'faq-' + Date.now(),
        question: newFaq.question || 'How does Homescapes manage timelines?',
        answer: newFaq.answer || 'We provide detailed milestone tracking and transparent project supervision.',
        category: (newFaq.category as any) || 'Consultation'
      };
      setFaqs(prev => [...prev, created]);
      showNotification(`Added new FAQ question!`);
    }
    resetFaqForm();
  };

  // --- Consultation Booking State & Handlers ---
  const [editingConsultationId, setEditingConsultationId] = useState<string | null>(null);
  const [editingConsultationData, setEditingConsultationData] = useState<Partial<ConsultationBooking>>({});

  const handleUpdateConsultationStatus = (id: string, newStatus: 'Pending' | 'Confirmed' | 'Completed') => {
    setConsultations(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
    showNotification(`Consultation status updated to "${newStatus}"!`);
  };

  const startEditConsultation = (c: ConsultationBooking) => {
    setEditingConsultationId(c.id);
    setEditingConsultationData({ ...c });
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConsultationId) return;

    setConsultations(prev =>
      prev.map(c =>
        c.id === editingConsultationId
          ? {
              ...c,
              name: editingConsultationData.name || c.name,
              email: editingConsultationData.email || c.email,
              phone: editingConsultationData.phone || c.phone,
              projectType: editingConsultationData.projectType || c.projectType,
              estimatedBudget: editingConsultationData.estimatedBudget || c.estimatedBudget,
              preferredDate: editingConsultationData.preferredDate || c.preferredDate,
              preferredTime: editingConsultationData.preferredTime || c.preferredTime,
              spaceType: editingConsultationData.spaceType || c.spaceType,
              location: editingConsultationData.location || c.location,
              notes: editingConsultationData.notes,
              status: editingConsultationData.status || c.status
            }
          : c
      )
    );
    showNotification(`Consultation details updated for "${editingConsultationData.name || 'client'}"!`);
    setEditingConsultationId(null);
    setEditingConsultationData({});
  };

  const handleTriggerDailyEmail = async () => {
    setIsSendingEmail(true);
    setLastEmailResult(null);
    try {
      const res = await fetch('/api/admin/trigger-daily-digest', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastEmailResult(data.details || { success: true, message: data.message });
        showNotification(data.details?.isSandbox ? 'Email generated in Ethereal test inbox!' : 'Daily email digest sent successfully!');
      } else {
        setLastEmailResult({ success: false, message: data.error || 'Failed to dispatch email.' });
        showNotification(data.error || 'Email dispatch completed');
      }
    } catch (err: any) {
      setLastEmailResult({ success: false, message: 'Request failed. Check server logs.' });
      showNotification('Email dispatch request attempted.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Editing state for new/existing project
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [materialsInput, setMaterialsInput] = useState('Statuario Marble, Teak Wood, Fluted Glass');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    category: ['Residential'],
    location: '',
    area: '',
    style: 'Modern Luxury',
    budget: '₹25,00,000+',
    completionYear: '2026',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200'
    ],
    description: '',
    challenge: '',
    solution: '',
    materialsUsed: ['Statuario Marble', 'Teak Wood', 'Fluted Glass'],
    client: 'Private Residence'
  });

  if (!isCMSOpen || !isOwnerAuthenticated) return null;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFounderPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await compressImage(file, 600, 0.75);
      if (base64) {
        updateFounderPhoto(base64);
        showNotification('Founder portrait uploaded & saved to live website!');
      }
    }
  };

  const handleFounderUrlSubmit = () => {
    if (founderUrlInput.trim()) {
      updateFounderPhoto(founderUrlInput.trim());
      setFounderUrlInput('');
      showNotification('Founder portrait URL saved to live website!');
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setShowAddProject(false);
    setGalleryUrlInput('');
    setMaterialsInput('Statuario Marble, Teak Wood, Fluted Glass');
    setNewProject({
      name: '',
      category: ['Residential'],
      location: '',
      area: '',
      style: 'Modern Luxury',
      budget: '₹25,00,000+',
      completionYear: '2026',
      heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
      galleryImages: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200'
      ],
      description: '',
      challenge: '',
      solution: '',
      materialsUsed: ['Statuario Marble', 'Teak Wood'],
      client: 'Private Client'
    });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;

    const parsedMaterials = materialsInput
      ? materialsInput.split(',').map(m => m.trim()).filter(Boolean)
      : (newProject.materialsUsed || ['Marble', 'Wood']);

    if (editingProjectId) {
      // Update existing project
      setProjects(prev =>
        prev.map(p => {
          if (p.id === editingProjectId) {
            return {
              ...p,
              name: newProject.name || p.name,
              category: (newProject.category && newProject.category.length > 0) ? newProject.category : p.category,
              location: newProject.location || p.location,
              area: newProject.area || p.area,
              style: newProject.style || p.style,
              budget: newProject.budget || p.budget,
              completionYear: newProject.completionYear || p.completionYear,
              heroImage: newProject.heroImage || p.heroImage,
              galleryImages: (newProject.galleryImages && newProject.galleryImages.length > 0) ? newProject.galleryImages : p.galleryImages,
              description: newProject.description || p.description,
              challenge: newProject.challenge || p.challenge,
              solution: newProject.solution || p.solution,
              materialsUsed: parsedMaterials,
              client: newProject.client || p.client
            };
          }
          return p;
        })
      );
      showNotification(`Updated project "${newProject.name}" details & photos!`);
    } else {
      // Create new project
      const created: Project = {
        id: 'proj-' + Date.now(),
        name: newProject.name || 'Bespoke Interior Residence',
        category: (newProject.category && newProject.category.length > 0) ? newProject.category : ['Residential'],
        location: newProject.location || 'Indira Nagar, Sugamau, Lucknow',
        area: newProject.area || '4,200 sq.ft.',
        style: newProject.style || 'Modern Indian Luxury',
        budget: newProject.budget || '₹35,00,000',
        completionYear: newProject.completionYear || '2026',
        heroImage: newProject.heroImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
        galleryImages: (newProject.galleryImages && newProject.galleryImages.length > 0)
          ? newProject.galleryImages
          : ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200'],
        description: newProject.description || 'Custom luxury architectural interior design project.',
        challenge: newProject.challenge || 'Integrating natural spatial sunlight with custom Italian millwork.',
        solution: newProject.solution || 'Engineered bespoke acoustic wood panelling and ambient brass fixtures.',
        materialsUsed: parsedMaterials,
        client: newProject.client || 'Private Residence Owner',
        featured: true
      };

      setProjects(prev => [created, ...prev]);
      showNotification(`Published new project "${created.name}" to live portfolio!`);
    }

    resetProjectForm();
  };

  const startEditProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setNewProject({ ...proj });
    setMaterialsInput(proj.materialsUsed ? proj.materialsUsed.join(', ') : '');
    setShowAddProject(true);
  };

  const compressImage = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const raw = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(raw);
          }
        };
        img.onerror = () => resolve(raw);
        img.src = raw;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await compressImage(file, 1200, 0.75);
      if (base64) {
        setNewProject(prev => ({
          ...prev,
          heroImage: base64,
          galleryImages: prev.galleryImages?.length ? prev.galleryImages : [base64]
        }));
        showNotification('Project hero cover photo uploaded & optimized successfully!');
      }
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const compressedList = await Promise.all(files.map(f => compressImage(f, 1200, 0.75)));
      const validCompressed = compressedList.filter(Boolean);
      if (validCompressed.length > 0) {
        setNewProject(prev => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), ...validCompressed]
        }));
        showNotification(`Added and optimized ${validCompressed.length} gallery photo(s)!`);
      }
    }
  };

  const toggleCategory = (cat: PortfolioCategory) => {
    const current = newProject.category || [];
    if (current.includes(cat)) {
      if (current.length > 1) {
        setNewProject({ ...newProject, category: current.filter(c => c !== cat) });
      }
    } else {
      setNewProject({ ...newProject, category: [...current, cat] });
    }
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    const { type, id, name } = deleteTarget;

    if (type === 'project' && id) {
      setProjects(prev => prev.filter(p => p.id !== id));
      showNotification(`Project "${name}" removed successfully.`);
    } else if (type === 'service' && id) {
      setServices(prev => prev.filter(s => s.id !== id));
      showNotification(`Service "${name}" removed.`);
    } else if (type === 'testimonial' && id) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      showNotification(`Testimonial from "${name}" removed.`);
    } else if (type === 'faq' && id) {
      setFaqs(prev => prev.filter(f => f.id !== id));
      showNotification(`FAQ item removed.`);
    } else if (type === 'blog' && id) {
      setBlogPosts(prev => prev.filter(b => b.id !== id));
      showNotification(`Article "${name}" removed.`);
    } else if (type === 'booking' && id) {
      setConsultations(prev => prev.filter(c => c.id !== id));
      showNotification(`Consultation request from "${name}" deleted.`);
    } else if (type === 'reset') {
      resetAllDataToDefaults();
      showNotification('CMS restored to studio defaults.');
    }

    setDeleteTarget(null);
  };

  const exportJSON = () => {
    const data = { projects, services, testimonials, faqs, blogPosts, consultations };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homescapes-studio-cms-backup-${Date.now()}.json`;
    a.click();
    showNotification('Full CMS Database exported as JSON.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-[#F8F5F2] dark:bg-[#141312] w-full max-w-6xl min-h-screen sm:min-h-0 sm:max-h-[94vh] border border-[#B58E5B]/40 shadow-2xl flex flex-col overflow-hidden text-[#1F1F1F] dark:text-gray-100">
        
        {/* Top Header */}
        <div className="p-6 bg-[#1F1F1F] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#B58E5B] text-[#B58E5B]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B58E5B] block font-semibold">
                STUDIO BACKEND CMS MANAGER
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Live Content Manager
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {successMsg && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#B58E5B] text-white text-xs animate-fadeIn font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {successMsg}
              </span>
            )}

            <button
              id="cms-change-pin-btn"
              onClick={() => {
                setShowChangePinModal(true);
                setPinNotice('');
                setNewPinInput('');
              }}
              className="px-3 py-1.5 border border-[#B58E5B]/60 hover:bg-[#B58E5B] text-xs uppercase tracking-wider flex items-center gap-1.5 text-gray-200 transition-colors"
              title="Change Owner Security PIN"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#B58E5B]" />
              <span className="hidden sm:inline">Change PIN</span>
            </button>

            <button
              id="cms-export-btn"
              onClick={exportJSON}
              className="px-3 py-1.5 border border-gray-700 hover:border-[#B58E5B] text-xs uppercase tracking-wider flex items-center gap-1.5 text-gray-200"
              title="Backup JSON Data"
            >
              <Download className="w-3.5 h-3.5 text-[#B58E5B]" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              id="cms-reset-btn"
              onClick={() => setDeleteTarget({ type: 'reset', name: 'All CMS Content' })}
              className="px-3 py-1.5 border border-red-900/50 hover:bg-red-950 text-xs uppercase tracking-wider flex items-center gap-1.5 text-red-300 transition-colors"
              title="Reset Content to Factory Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              id="cms-lock-btn"
              onClick={lockOwnerPortal}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Lock Owner Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>

            <button
              id="cms-close-btn"
              onClick={() => setIsCMSOpen(false)}
              className="p-2 text-gray-400 hover:text-white"
              title="Close CMS Window"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto p-4 bg-[#EFECE6] dark:bg-[#1C1B1A] border-b border-[#D8CBBE]/40 dark:border-gray-800 shrink-0">
          <button
            id="cms-tab-projects"
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'projects' ? 'bg-[#B58E5B] text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Portfolio ({projects.length})</span>
          </button>

          <button
            id="cms-tab-services"
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'services' ? 'bg-[#B58E5B] text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Services ({services.length})</span>
          </button>

          <button
            id="cms-tab-testimonials"
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'testimonials' ? 'bg-[#B58E5B] text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Testimonials ({testimonials.length})</span>
          </button>

          <button
            id="cms-tab-faqs"
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'faqs' ? 'bg-[#B58E5B] text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs ({faqs.length})</span>
          </button>

          <button
            id="cms-tab-bookings"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'bookings' ? 'bg-[#B58E5B] text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultations ({consultations.length})</span>
          </button>

          <button
            id="cms-tab-founder"
            onClick={() => setActiveTab('founder')}
            className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'founder' ? 'bg-[#B58E5B] text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Founder & Leadership</span>
          </button>
        </div>

        {/* Tab Body View */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* Projects CMS Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBBE]/40 dark:border-gray-800">
                <div>
                  <h4 className="font-serif text-2xl text-[#121212] dark:text-white flex items-center gap-2">
                    <FolderKanban className="w-6 h-6 text-[#B58E5B]" />
                    <span>Website Owner Portfolio Manager</span>
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1">
                    Upload project photos from your computer or mobile, edit project descriptions, budgets, and manage your live website portfolio archive.
                  </p>
                </div>

                <button
                  id="cms-add-project-btn"
                  onClick={() => {
                    if (showAddProject && !editingProjectId) {
                      resetProjectForm();
                    } else {
                      resetProjectForm();
                      setShowAddProject(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#B58E5B] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#121212] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Project & Photos</span>
                </button>
              </div>

              {/* Add / Edit Project Form Drawer */}
              {showAddProject && (
                <form onSubmit={handleSaveProject} className="p-6 glass-card border-2 border-[#B58E5B] space-y-6 animate-fadeIn bg-[#EDE6DC]/60 dark:bg-gray-900/90 rounded-none shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#B58E5B]/40 pb-3">
                    <h5 className="font-serif text-xl font-normal text-[#121212] dark:text-white flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-[#B58E5B]" />
                      <span>{editingProjectId ? `Edit Project: ${newProject.name || 'Untitled'}` : 'Create & Publish New Project'}</span>
                    </h5>
                    <span className="text-[11px] uppercase tracking-wider text-[#B58E5B] font-bold">
                      Owner Portal Active
                    </span>
                  </div>

                  {/* 1. Project Hero Cover Photo Upload */}
                  <div className="space-y-3 bg-white/70 dark:bg-gray-800/60 p-4 border border-[#D8CBBE] dark:border-gray-700">
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200">
                      1. Main Cover / Hero Photo
                    </label>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                      {/* Live Image Preview */}
                      <div className="relative w-full md:w-48 h-32 bg-gray-200 dark:bg-gray-900 border border-[#B58E5B] flex items-center justify-center overflow-hidden shrink-0">
                        {newProject.heroImage ? (
                          <img
                            src={newProject.heroImage}
                            alt="Project cover preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center p-2 text-gray-500 text-xs">No Cover Image</div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        {/* File Upload Button */}
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            ref={heroFileInputRef}
                            accept="image/*"
                            onChange={handleHeroFileUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => heroFileInputRef.current?.click()}
                            className="px-4 py-2.5 bg-[#121212] dark:bg-[#B58E5B] text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-[#B58E5B] dark:hover:bg-white dark:hover:text-[#121212] transition-all"
                          >
                            <UploadCloud className="w-4 h-4 text-[#B58E5B] dark:text-white" />
                            <span>Upload Photo File from Device</span>
                          </button>
                          <span className="text-[11px] text-gray-500">Supports JPG, PNG, WEBP</span>
                        </div>

                        {/* Direct URL alternative */}
                        <div>
                          <input
                            type="url"
                            placeholder="Or enter direct Image Web URL (e.g. Unsplash or hosted link)"
                            value={newProject.heroImage}
                            onChange={e => setNewProject({ ...newProject, heroImage: e.target.value })}
                            className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Portfolio Category Selectors */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200">
                      2. Select Category Badges (Click to toggle)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CATEGORIES.map(cat => {
                        const isSelected = newProject.category?.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#B58E5B] text-white border-[#B58E5B]'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#D8CBBE] dark:border-gray-700 hover:border-[#B58E5B]'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Key Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Seafront Imperial Villa"
                        value={newProject.name}
                        onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Location / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Indira Nagar, Sugamau, Lucknow"
                        value={newProject.location}
                        onChange={e => setNewProject({ ...newProject, location: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Covered Area (sq.ft)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5,200 sq.ft."
                        value={newProject.area}
                        onChange={e => setNewProject({ ...newProject, area: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Investment Budget (₹)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹45,00,000"
                        value={newProject.budget}
                        onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Completion Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026"
                        value={newProject.completionYear}
                        onChange={e => setNewProject({ ...newProject, completionYear: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Design Style
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Italian Modern Minimalist"
                        value={newProject.style}
                        onChange={e => setNewProject({ ...newProject, style: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* 4. Description & Architectural Narrative */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Project Overview & Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe the overall design vision, room highlights, and client preferences..."
                        value={newProject.description}
                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                          Design Challenge
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Key spatial or architectural challenges solved..."
                          value={newProject.challenge}
                          onChange={e => setNewProject({ ...newProject, challenge: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                          Design Solution
                        </label>
                        <textarea
                          rows={2}
                          placeholder="How your studio engineered the solution..."
                          value={newProject.solution}
                          onChange={e => setNewProject({ ...newProject, solution: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Key Materials Used (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Statuario Marble, Teak Wood, Fluted Glass, Brushed Brass"
                        value={materialsInput}
                        onChange={e => setMaterialsInput(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* 5. Additional Gallery Photos */}
                  <div className="space-y-3 bg-white/70 dark:bg-gray-800/60 p-4 border border-[#D8CBBE] dark:border-gray-700">
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200">
                      5. Project Gallery Photos ({newProject.galleryImages?.length || 0})
                    </label>

                    {/* Gallery Thumbnails */}
                    <div className="flex flex-wrap gap-3">
                      {newProject.galleryImages?.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 border border-gray-300 dark:border-gray-700 overflow-hidden group">
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => {
                              setNewProject(prev => ({
                                ...prev,
                                galleryImages: prev.galleryImages?.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white opacity-90 hover:opacity-100 rounded-full"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <input
                        type="file"
                        ref={galleryFileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleGalleryFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#B58E5B] text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-[#121212] transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload Additional Gallery Photos</span>
                      </button>

                      <div className="flex-1 flex gap-2 w-full sm:w-auto">
                        <input
                          type="url"
                          placeholder="Or paste photo URL..."
                          value={galleryUrlInput}
                          onChange={e => setGalleryUrlInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (galleryUrlInput.trim()) {
                              setNewProject(prev => ({
                                ...prev,
                                galleryImages: [...(prev.galleryImages || []), galleryUrlInput.trim()]
                              }));
                              setGalleryUrlInput('');
                            }
                          }}
                          className="px-3 py-1.5 bg-gray-800 text-white text-xs uppercase font-bold"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Submission Controls */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#B58E5B]/40">
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="px-5 py-2.5 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-bold border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingProjectId ? 'Save Updated Project' : 'Publish Project to Live Site'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Projects List */}
              <div className="space-y-4">
                <h5 className="font-serif text-lg font-normal text-[#121212] dark:text-white">
                  Live Portfolio Projects ({projects.length})
                </h5>

                <div className="grid grid-cols-1 gap-4">
                  {projects.map(proj => (
                    <div
                      key={proj.id}
                      className="p-4 glass-card border border-[#D8CBBE] dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#B58E5B] transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <img
                          src={proj.heroImage}
                          alt={proj.name}
                          className="w-24 h-20 object-cover border border-[#D8CBBE] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-serif text-lg font-medium text-[#121212] dark:text-white">
                              {proj.name}
                            </h5>
                            <span className="text-[10px] px-2 py-0.5 bg-[#B58E5B]/20 text-[#B58E5B] font-bold uppercase tracking-wider">
                              {proj.category?.join(', ') || 'Residential'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {proj.location} • {proj.area} • {proj.completionYear} • Budget: {proj.budget}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                            {proj.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => startEditProject(proj)}
                          className="px-3 py-2 bg-[#121212] dark:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#B58E5B] transition-colors"
                          title="Edit project details and photos"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#B58E5B]" />
                          <span>Edit Details & Photos</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ type: 'project', id: proj.id, name: proj.name })}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBBE]/40 dark:border-gray-800">
                <div>
                  <h4 className="font-serif text-2xl text-[#121212] dark:text-white flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-[#B58E5B]" />
                    <span>Architectural Services Manager ({services.length})</span>
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1">
                    Add new studio services or update descriptions, timelines, deliverables, pricing, and service photos live on the website.
                  </p>
                </div>

                <button
                  id="cms-add-service-btn"
                  type="button"
                  onClick={() => {
                    if (showAddService && !editingServiceId) {
                      resetServiceForm();
                    } else {
                      resetServiceForm();
                      setShowAddService(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#B58E5B] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#121212] transition-colors shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Service</span>
                </button>
              </div>

              {/* Add / Edit Service Form Drawer */}
              {showAddService && (
                <form onSubmit={handleSaveService} className="p-6 glass-card border-2 border-[#B58E5B] space-y-6 animate-fadeIn bg-[#EDE6DC]/60 dark:bg-gray-900/90 rounded-none shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#B58E5B]/40 pb-3">
                    <h5 className="font-serif text-xl font-normal text-[#121212] dark:text-white flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-[#B58E5B]" />
                      <span>{editingServiceId ? `Edit Service: ${newService.title}` : 'Create & Publish New Studio Service'}</span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Turnkey Interior Architecture"
                        value={newService.title || ''}
                        onChange={e => setNewService({ ...newService, title: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Service Icon Type
                      </label>
                      <select
                        value={newService.iconName || 'Building2'}
                        onChange={e => setNewService({ ...newService, iconName: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      >
                        <option value="Building2">Building / Architecture</option>
                        <option value="Palette">Palette / Interior Styling</option>
                        <option value="Compass">Compass / Master Planning</option>
                        <option value="DraftingCompass">Drafting / Blueprint Design</option>
                        <option value="Home">Home / Residence</option>
                        <option value="Ruler">Ruler / Bespoke Furniture</option>
                        <option value="Sparkles">Sparkles / Luxury Styling</option>
                        <option value="Layers">Layers / Material Curation</option>
                        <option value="Wrench">Wrench / Turnkey Contracting</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Estimated Execution Timeline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 8–12 Weeks"
                        value={newService.estimatedTimeline || ''}
                        onChange={e => setNewService({ ...newService, estimatedTimeline: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Starting Investment Price
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹1,50,000"
                        value={newService.startingPrice || ''}
                        onChange={e => setNewService({ ...newService, startingPrice: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                      Short Description (Card Summary)
                    </label>
                    <input
                      type="text"
                      placeholder="Brief 1-sentence summary for homepage grid..."
                      value={newService.shortDescription || ''}
                      onChange={e => setNewService({ ...newService, shortDescription: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                      Full Detailed Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive overview of what this service delivers..."
                      value={newService.fullDescription || ''}
                      onChange={e => setNewService({ ...newService, fullDescription: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Key Features (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="3D Visualization, Material Selection, BOQ Preparation"
                        value={serviceFeaturesInput}
                        onChange={e => setServiceFeaturesInput(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Client Deliverables (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Architectural Blueprints, High-Res Renders, Site Handover"
                        value={serviceDeliverablesInput}
                        onChange={e => setServiceDeliverablesInput(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Service Image File / URL */}
                  <div className="space-y-3 bg-white/70 dark:bg-gray-800/60 p-4 border border-[#D8CBBE] dark:border-gray-700">
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200">
                      Service Display Photo
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {newService.image && (
                        <img src={newService.image} alt="Service preview" className="w-24 h-16 object-cover border border-[#B58E5B] shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
                        <input type="file" ref={serviceFileInputRef} accept="image/*" onChange={handleServiceImageUpload} className="hidden" />
                        <button
                          type="button"
                          onClick={() => serviceFileInputRef.current?.click()}
                          className="px-4 py-2 bg-[#121212] dark:bg-[#B58E5B] text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-[#B58E5B] transition-colors"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload Photo</span>
                        </button>
                        <input
                          type="url"
                          placeholder="Or paste Image URL..."
                          value={newService.image || ''}
                          onChange={e => setNewService({ ...newService, image: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#B58E5B]/40">
                    <button
                      type="button"
                      onClick={resetServiceForm}
                      className="px-5 py-2.5 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-bold border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingServiceId ? 'Save Updated Service' : 'Publish Service'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Services List */}
              <div className="space-y-3">
                {services.map(s => (
                  <div key={s.id} className="p-4 glass-card border border-[#D8CBBE]/60 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#B58E5B] transition-colors">
                    <div className="flex items-start gap-4">
                      {s.image && (
                        <img src={s.image} alt={s.title} className="w-20 h-16 object-cover border border-[#D8CBBE] shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif text-base font-medium text-[#121212] dark:text-white">{s.title}</h5>
                          {s.startingPrice && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#B58E5B]/20 text-[#B58E5B] font-bold uppercase tracking-wider">
                              From {s.startingPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{s.shortDescription}</p>
                        <p className="text-[11px] text-gray-500 mt-1">Timeline: {s.estimatedTimeline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => startEditService(s)}
                        className="px-3 py-2 bg-[#121212] dark:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#B58E5B] transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#B58E5B]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: 'service', id: s.id, name: s.title })}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBBE]/40 dark:border-gray-800">
                <div>
                  <h4 className="font-serif text-2xl text-[#121212] dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#B58E5B]" />
                    <span>Client Testimonials Manager ({testimonials.length})</span>
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1">
                    Add new client reviews, edit existing quotes, client photos, star ratings, or update project titles.
                  </p>
                </div>

                <button
                  id="cms-add-testimonial-btn"
                  type="button"
                  onClick={() => {
                    if (showAddTestimonial && !editingTestimonialId) {
                      resetTestimonialForm();
                    } else {
                      resetTestimonialForm();
                      setShowAddTestimonial(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#B58E5B] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#121212] transition-colors shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Testimonial</span>
                </button>
              </div>

              {/* Add / Edit Testimonial Form Drawer */}
              {showAddTestimonial && (
                <form onSubmit={handleSaveTestimonial} className="p-6 glass-card border-2 border-[#B58E5B] space-y-6 animate-fadeIn bg-[#EDE6DC]/60 dark:bg-gray-900/90 rounded-none shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#B58E5B]/40 pb-3">
                    <h5 className="font-serif text-xl font-normal text-[#121212] dark:text-white flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-[#B58E5B]" />
                      <span>{editingTestimonialId ? `Edit Review: ${newTestimonial.clientName}` : 'Add New Client Testimonial'}</span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Client Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Sharma"
                        value={newTestimonial.clientName || ''}
                        onChange={e => setNewTestimonial({ ...newTestimonial, clientName: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Client Designation / Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Villa Owner"
                        value={newTestimonial.clientRole || ''}
                        onChange={e => setNewTestimonial({ ...newTestimonial, clientRole: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Gomti Nagar, Lucknow"
                        value={newTestimonial.location || ''}
                        onChange={e => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Project Name / Room
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5,000 sq.ft. Penthouse"
                        value={newTestimonial.projectTitle || ''}
                        onChange={e => setNewTestimonial({ ...newTestimonial, projectTitle: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Star Rating (1 to 5)
                      </label>
                      <select
                        value={newTestimonial.rating || 5}
                        onChange={e => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★☆</option>
                        <option value={3}>3 Stars ★★★☆☆</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Year / Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026"
                        value={newTestimonial.date || ''}
                        onChange={e => setNewTestimonial({ ...newTestimonial, date: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                      Full Client Review Quote *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter the full testimonial statement..."
                      value={newTestimonial.review || ''}
                      onChange={e => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                    />
                  </div>

                  {/* Client Photo */}
                  <div className="space-y-3 bg-white/70 dark:bg-gray-800/60 p-4 border border-[#D8CBBE] dark:border-gray-700">
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200">
                      Client Portrait / Avatar Photo
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {newTestimonial.clientPhoto && (
                        <img src={newTestimonial.clientPhoto} alt="Client preview" className="w-14 h-14 rounded-full object-cover border-2 border-[#B58E5B] shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
                        <input type="file" ref={testimonialFileInputRef} accept="image/*" onChange={handleTestimonialPhotoUpload} className="hidden" />
                        <button
                          type="button"
                          onClick={() => testimonialFileInputRef.current?.click()}
                          className="px-4 py-2 bg-[#121212] dark:bg-[#B58E5B] text-white text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-[#B58E5B] transition-colors"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload Photo</span>
                        </button>
                        <input
                          type="url"
                          placeholder="Or paste Photo URL..."
                          value={newTestimonial.clientPhoto || ''}
                          onChange={e => setNewTestimonial({ ...newTestimonial, clientPhoto: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#B58E5B]/40">
                    <button
                      type="button"
                      onClick={resetTestimonialForm}
                      className="px-5 py-2.5 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-bold border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingTestimonialId ? 'Save Updated Testimonial' : 'Publish Testimonial'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Testimonials List */}
              <div className="space-y-3">
                {testimonials.map(t => (
                  <div key={t.id} className="p-4 glass-card border border-[#D8CBBE]/60 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#B58E5B] transition-colors">
                    <div className="flex items-start gap-4">
                      {t.clientPhoto && (
                        <img src={t.clientPhoto} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border border-[#D8CBBE] shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif text-base font-medium text-[#121212] dark:text-white">{t.clientName}</h5>
                          <span className="text-xs text-[#B58E5B]">{'★'.repeat(t.rating || 5)}</span>
                          <span className="text-[10px] text-gray-400">({t.location})</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 italic mt-1 font-serif">"{t.review}"</p>
                        <p className="text-[11px] text-gray-500 mt-1">{t.clientRole} • Project: {t.projectTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => startEditTestimonial(t)}
                        className="px-3 py-2 bg-[#121212] dark:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#B58E5B] transition-colors"
                        title="Edit Testimonial"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#B58E5B]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: 'testimonial', id: t.id, name: t.clientName })}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CBBE]/40 dark:border-gray-800">
                <div>
                  <h4 className="font-serif text-2xl text-[#121212] dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#B58E5B]" />
                    <span>Frequently Asked Questions Manager ({faqs.length})</span>
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-normal mt-1">
                    Add new FAQ entries or update questions, answers, and category tags live on the website.
                  </p>
                </div>

                <button
                  id="cms-add-faq-btn"
                  type="button"
                  onClick={() => {
                    if (showAddFaq && !editingFaqId) {
                      resetFaqForm();
                    } else {
                      resetFaqForm();
                      setShowAddFaq(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#B58E5B] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#121212] transition-colors shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New FAQ Question</span>
                </button>
              </div>

              {/* Add / Edit FAQ Form Drawer */}
              {showAddFaq && (
                <form onSubmit={handleSaveFaq} className="p-6 glass-card border-2 border-[#B58E5B] space-y-6 animate-fadeIn bg-[#EDE6DC]/60 dark:bg-gray-900/90 rounded-none shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#B58E5B]/40 pb-3">
                    <h5 className="font-serif text-xl font-normal text-[#121212] dark:text-white flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-[#B58E5B]" />
                      <span>{editingFaqId ? 'Edit FAQ Item' : 'Add New FAQ Question'}</span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Question *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. What is the typical timeframe for a full villa renovation?"
                        value={newFaq.question || ''}
                        onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Category Tag
                      </label>
                      <select
                        value={newFaq.category || 'Consultation'}
                        onChange={e => setNewFaq({ ...newFaq, category: e.target.value as any })}
                        className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      >
                        <option value="Consultation">Consultation</option>
                        <option value="Cost">Cost & Budget</option>
                        <option value="Timeline">Timeline & Delivery</option>
                        <option value="Design Process">Design Process</option>
                        <option value="Materials">Materials & Finishes</option>
                        <option value="Warranty">Warranty & Execution</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                      Detailed Answer *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Provide a clear, reassuring answer for clients..."
                      value={newFaq.answer || ''}
                      onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#B58E5B]/40">
                    <button
                      type="button"
                      onClick={resetFaqForm}
                      className="px-5 py-2.5 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-bold border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingFaqId ? 'Save Updated Question' : 'Publish FAQ Question'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FAQs List */}
              <div className="space-y-3">
                {faqs.map(f => (
                  <div key={f.id} className="p-4 glass-card border border-[#D8CBBE]/60 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#B58E5B] transition-colors">
                    <div className="space-y-1">
                      <span className="text-[10px] px-2 py-0.5 bg-[#B58E5B]/20 text-[#B58E5B] font-bold uppercase tracking-wider inline-block">
                        {f.category}
                      </span>
                      <h5 className="font-serif text-base font-medium text-[#121212] dark:text-white">{f.question}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{f.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => startEditFaq(f)}
                        className="px-3 py-2 bg-[#121212] dark:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#B58E5B] transition-colors"
                        title="Edit FAQ Question"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#B58E5B]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: 'faq', id: f.id, name: f.question })}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#B58E5B]/10 border border-[#B58E5B]/30">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#B58E5B] font-bold block">
                    EVERYDAY EMAIL SCHEDULER ACTIVE
                  </span>
                  <h4 className="font-serif text-xl text-[#1F1F1F] dark:text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#B58E5B]" />
                    <span>Server Persistent Storage & Email Dispatch</span>
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Form submissions in Server Storage (<code>/data/cms_store.json</code>) are dispatched daily to <strong>workwithhomescapes@gmail.com</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerDailyEmail}
                  disabled={isSendingEmail}
                  className="px-4 py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-wider font-bold transition-all shadow flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Dispatching Report...' : 'Send Email Digest Now'}</span>
                </button>
              </div>

              {lastEmailResult && (
                <div className={`p-4 border text-xs space-y-2 ${lastEmailResult.success ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-gray-200' : 'bg-red-500/10 border-red-500/40 text-red-200'}`}>
                  <p className="font-semibold text-sm">
                    {lastEmailResult.isSandbox ? '⚡ Sandbox Test Delivery Completed' : lastEmailResult.message}
                  </p>
                  <p className="text-gray-300">
                    {lastEmailResult.isSandbox ? (
                      <>
                        Because SMTP credentials (<code>SMTP_USER</code> / <code>SMTP_PASS</code> or <code>GMAIL_APP_PASSWORD</code>) are not configured in environment variables, Nodemailer generated the complete HTML email report in an <strong>Ethereal Sandbox Preview</strong>.
                      </>
                    ) : (
                      lastEmailResult.message
                    )}
                  </p>
                  {lastEmailResult.previewUrl && (
                    <div className="pt-1">
                      <a
                        href={lastEmailResult.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] text-black font-bold uppercase tracking-wider text-[11px] hover:bg-white transition-colors"
                      >
                        <span>View Sent Email Report in Ethereal Sandbox</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  {lastEmailResult.isSandbox && (
                    <div className="pt-2 border-t border-gray-700/50 text-[11px] text-gray-400">
                      💡 <strong>To receive live inbox emails directly to workwithhomescapes@gmail.com:</strong>
                      <br />
                      Set <code>SMTP_HOST</code> (e.g. <code>smtp.gmail.com</code>), <code>SMTP_USER</code> (your email address), and <code>SMTP_PASS</code> (or Gmail App Password) in your App Secrets / Environment Variables.
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-2">
                <h4 className="font-serif text-2xl text-[#121212] dark:text-white">
                  Incoming Client Consultations ({consultations.length})
                </h4>
                <div className="text-xs text-gray-500">
                  Update consultation statuses (Pending / Confirmed / Completed) or edit consultation details live.
                </div>
              </div>

              {/* Consultation Edit Drawer / Form */}
              {editingConsultationId && (
                <form onSubmit={handleSaveConsultation} className="p-6 glass-card border-2 border-[#B58E5B] space-y-5 animate-fadeIn bg-[#EDE6DC]/80 dark:bg-gray-900/90 rounded-none shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#B58E5B]/40 pb-3">
                    <h5 className="font-serif text-xl font-normal text-[#121212] dark:text-white flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-[#B58E5B]" />
                      <span>Edit Consultation Booking #{editingConsultationId}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingConsultationId(null);
                        setEditingConsultationData({});
                      }}
                      className="p-1 text-gray-500 hover:text-black dark:hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Consultation Status / State *
                      </label>
                      <select
                        value={editingConsultationData.status || 'Pending'}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 text-xs font-bold border border-[#B58E5B] bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      >
                        <option value="Pending">● Pending Review</option>
                        <option value="Confirmed">✓ Confirmed & Scheduled</option>
                        <option value="Completed">★ Consultation Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Client Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingConsultationData.name || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, name: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editingConsultationData.phone || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, phone: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editingConsultationData.email || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, email: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="text"
                        value={editingConsultationData.preferredDate || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, preferredDate: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Preferred Time Slot
                      </label>
                      <input
                        type="text"
                        value={editingConsultationData.preferredTime || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, preferredTime: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Scope / Project Type
                      </label>
                      <input
                        type="text"
                        value={editingConsultationData.projectType || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, projectType: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        Estimated Budget
                      </label>
                      <input
                        type="text"
                        value={editingConsultationData.estimatedBudget || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, estimatedBudget: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={editingConsultationData.location || ''}
                        onChange={e => setEditingConsultationData({ ...editingConsultationData, location: e.target.value })}
                        className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#121212] dark:text-gray-300 mb-1">
                      Notes & Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={editingConsultationData.notes || ''}
                      onChange={e => setEditingConsultationData({ ...editingConsultationData, notes: e.target.value })}
                      className="w-full px-4 py-2 text-xs border border-[#D8CBBE] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#121212] dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#B58E5B]/40">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingConsultationId(null);
                        setEditingConsultationData({});
                      }}
                      className="px-5 py-2 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-bold border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Consultation Updates</span>
                    </button>
                  </div>
                </form>
              )}

              {consultations.length === 0 ? (
                <p className="text-xs text-gray-500 italic p-6 glass-card text-center">No submitted consultation requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {consultations.map(c => {
                    const statusColorClass =
                      c.status === 'Confirmed'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : c.status === 'Completed'
                        ? 'bg-blue-700 text-white border-blue-800'
                        : 'bg-amber-600 text-white border-amber-700';

                    return (
                      <div key={c.id} className="p-5 glass-card border border-[#D8CBBE]/60 dark:border-gray-800 space-y-3 hover:border-[#B58E5B] transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-serif text-lg font-medium text-[#121212] dark:text-white">{c.name}</h5>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">({c.location || 'Lucknow'})</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                              📞 {c.phone} • ✉️ {c.email}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {/* State / Status Dropdown Selector */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Status:</span>
                              <select
                                value={c.status || 'Pending'}
                                onChange={e => handleUpdateConsultationStatus(c.id, e.target.value as any)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-none shadow-sm cursor-pointer transition-all ${statusColorClass}`}
                              >
                                <option value="Pending" className="bg-white text-black dark:bg-gray-900 dark:text-white">● Pending Review</option>
                                <option value="Confirmed" className="bg-white text-black dark:bg-gray-900 dark:text-white">✓ Confirmed & Scheduled</option>
                                <option value="Completed" className="bg-white text-black dark:bg-gray-900 dark:text-white">★ Consultation Completed</option>
                              </select>
                            </div>

                            {/* Edit Details Button */}
                            <button
                              type="button"
                              onClick={() => startEditConsultation(c)}
                              className="px-3 py-1.5 bg-[#121212] dark:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#B58E5B] transition-colors"
                              title="Edit consultation details"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#B58E5B]" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ type: 'booking', id: c.id, name: c.name })}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Delete Consultation Request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-gray-700 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-gray-200/80 dark:border-gray-800">
                          <p><strong>Preferred Date:</strong> {c.preferredDate} ({c.preferredTime})</p>
                          <p><strong>Scope & Budget:</strong> {c.projectType} ({c.estimatedBudget})</p>
                          <p><strong>Space Type:</strong> {c.spaceType || 'Interior Residence'}</p>
                        </div>

                        {c.notes && (
                          <div className="p-2.5 bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 italic">
                            <strong>Notes:</strong> "{c.notes}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Founder & Leadership Spotlight Tab */}
          {activeTab === 'founder' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#B58E5B] font-bold block">
                    FOUNDER CMS
                  </span>
                  <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white">
                    Founder Profile & Photo Management
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Upload photo directly from your device or edit Hariom Srivastava's leadership bio & vision quote.
                  </p>
                </div>
                <button
                  id="reset-founder-photo-cms-btn"
                  onClick={() => {
                    resetFounderPhoto();
                    showNotification('Restored default founder portrait.');
                  }}
                  className="px-4 py-2 border border-red-800/40 text-red-500 hover:bg-red-950/20 text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Portrait</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white dark:bg-[#1A1918] p-6 border border-[#D8CBBE]/40 dark:border-gray-800 shadow-md">
                
                {/* Photo Upload & Preview Left Column */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs uppercase tracking-wider text-[#B58E5B] font-bold block">
                    FOUNDER PORTRAIT & PHOTO UPLOAD
                  </span>
                  
                  <div className="flex flex-col items-center justify-center p-5 bg-gray-50 dark:bg-[#121110] border border-gray-200 dark:border-gray-800 rounded-xl space-y-4">
                    <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#B58E5B] via-[#F3E3C3] to-[#8C6638] shadow-lg">
                      <div className="p-1 bg-white dark:bg-[#1C1B19] rounded-full">
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-gray-900 group">
                          <img
                            src={founderData.photo}
                            alt={founderData.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = defaultFounderPhoto;
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => founderFileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                          >
                            <Camera className="w-6 h-6 text-[#B58E5B]" />
                            <span>Upload New Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] font-bold">LIVE WEBSITE PREVIEW</span>

                    {/* Hidden Device File Input */}
                    <input
                      type="file"
                      ref={founderFileInputRef}
                      accept="image/*"
                      onChange={handleFounderPhotoUpload}
                      className="hidden"
                    />

                    {/* Upload Actions */}
                    <div className="w-full space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => founderFileInputRef.current?.click()}
                        className="w-full py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-wider font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload Photo From Device</span>
                      </button>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                          Or Paste Web Image URL:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={founderUrlInput}
                            onChange={(e) => setFounderUrlInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-[#1A1918] border border-gray-300 dark:border-gray-700 text-[#1F1F1F] dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={handleFounderUrlSubmit}
                            className="px-3 py-1.5 bg-gray-800 text-white text-xs font-bold uppercase shrink-0 hover:bg-[#B58E5B]"
                          >
                            Set URL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Founder Details Form Right Column */}
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs uppercase tracking-wider text-[#B58E5B] font-bold block">
                    BIOGRAPHY & PHILOSOPHY
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                        Founder Full Name
                      </label>
                      <input
                        type="text"
                        value={founderData.name}
                        onChange={(e) => setFounderData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#121110] border border-gray-300 dark:border-gray-700 text-[#1F1F1F] dark:text-white focus:border-[#B58E5B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                        Official Title & Role
                      </label>
                      <input
                        type="text"
                        value={founderData.title}
                        onChange={(e) => setFounderData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#121110] border border-gray-300 dark:border-gray-700 text-[#1F1F1F] dark:text-white focus:border-[#B58E5B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                        Founder Direct Email
                      </label>
                      <input
                        type="email"
                        value={founderData.email || 'workwithhomescapes@gmail.com'}
                        onChange={(e) => setFounderData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#121110] border border-gray-300 dark:border-gray-700 text-[#1F1F1F] dark:text-white focus:border-[#B58E5B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                        Founder Direct Phone
                      </label>
                      <input
                        type="text"
                        value={founderData.phone || '+91 7380334333'}
                        onChange={(e) => setFounderData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#121110] border border-gray-300 dark:border-gray-700 text-[#1F1F1F] dark:text-white focus:border-[#B58E5B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                      Design Vision / Quote
                    </label>
                    <textarea
                      rows={3}
                      value={founderData.quote}
                      onChange={(e) => setFounderData(prev => ({ ...prev, quote: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-[#121110] border border-gray-300 dark:border-gray-700 text-[#1F1F1F] dark:text-white focus:border-[#B58E5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                      Full Executive Bio
                    </label>
                    <textarea
                      rows={4}
                      value={founderData.bio}
                      onChange={(e) => setFounderData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-[#121110] border border-gray-300 dark:border-gray-700 text-[#1F1F1F] dark:text-white focus:border-[#B58E5B]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => showNotification('Founder profile changes saved!')}
                      className="px-6 py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-wider font-bold shadow flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Founder Settings</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Custom Change PIN Dialog Modal */}
        {showChangePinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#1A1918] border border-[#B58E5B]/50 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-left text-white rounded-none">
              <div className="flex items-center justify-between border-b border-[#B58E5B]/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-[#B58E5B]" />
                  <h4 className="font-serif text-xl font-normal text-white">
                    Update Owner Security PIN
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Set a new 4-digit or custom security PIN for your Owner Portal. This PIN protects your website CMS settings when hosted online.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPinInput.trim() || newPinInput.trim().length < 4) {
                    setPinNotice('PIN must be at least 4 characters long.');
                    return;
                  }
                  const ok = changeOwnerPin(newPinInput.trim());
                  if (ok) {
                    setPinNotice('');
                    setShowChangePinModal(false);
                    showNotification('Owner Security PIN updated successfully!');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B58E5B] font-semibold mb-2">
                    New Security PIN
                  </label>
                  <input
                    type="text"
                    value={newPinInput}
                    onChange={(e) => {
                      setNewPinInput(e.target.value);
                      setPinNotice('');
                    }}
                    placeholder="Enter new PIN (e.g. 5678)"
                    autoFocus
                    className="w-full px-4 py-3 bg-[#121110] border border-gray-700 focus:border-[#B58E5B] text-white text-base tracking-widest placeholder:text-gray-600 focus:outline-none"
                  />
                  {pinNotice && (
                    <p className="text-xs text-red-400 mt-2 font-medium">{pinNotice}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePinModal(false)}
                    className="px-4 py-2 border border-gray-700 text-xs uppercase tracking-wider text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#B58E5B] hover:bg-white hover:text-[#121212] text-white text-xs uppercase tracking-wider font-bold transition-all"
                  >
                    Save New PIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom In-App Delete Confirmation Modal (Iframe & Cross-Browser Safe) */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-white dark:bg-[#1A1918] border border-red-500/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-left rounded-none">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <Trash2 className="w-6 h-6 shrink-0" />
                <h4 className="font-serif text-xl font-medium text-[#1F1F1F] dark:text-white">
                  {deleteTarget.type === 'reset' ? 'Confirm Reset Defaults' : 'Confirm Content Deletion'}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                {deleteTarget.type === 'reset'
                  ? 'Are you sure you want to reset all CMS content back to studio defaults? All custom edits and added items will be permanently cleared.'
                  : `Are you sure you want to delete "${deleteTarget.name}"? It will be immediately removed from your live studio website.`}
              </p>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-medium transition-colors shadow-md"
                >
                  {deleteTarget.type === 'reset' ? 'Reset All Content' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
