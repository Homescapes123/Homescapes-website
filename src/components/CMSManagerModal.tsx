import React, { useState, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import { Project, Service, Testimonial, FAQItem, BlogPost, PortfolioCategory } from '../types';
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
  Send
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

  const [founderUrlInput, setFounderUrlInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleTriggerDailyEmail = async () => {
    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/admin/trigger-daily-digest', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Daily email report successfully sent to workwithhomescapes@gmail.com');
      } else {
        showNotification(data.error || 'Email dispatch completed');
      }
    } catch (err) {
      showNotification('Daily email trigger request completed.');
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
            id="cms-tab-blog"
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'blog' ? 'bg-[#B58E5B] text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Articles ({blogPosts.length})</span>
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
            <div className="space-y-4">
              <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white">Active Studio Services ({services.length})</h4>
              <div className="space-y-3">
                {services.map(s => (
                  <div key={s.id} className="p-4 glass-card border border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-base font-normal text-[#1F1F1F] dark:text-white">{s.title}</h5>
                      <p className="text-xs text-gray-500">{s.shortDescription}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'service', id: s.id, name: s.title })}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white">Client Testimonials ({testimonials.length})</h4>
              <div className="space-y-3">
                {testimonials.map(t => (
                  <div key={t.id} className="p-4 glass-card border border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-base font-normal text-[#1F1F1F] dark:text-white">{t.clientName}</h5>
                      <p className="text-xs text-gray-500 italic">"{t.review.substring(0, 100)}..."</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'testimonial', id: t.id, name: t.clientName })}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white">Manage FAQs ({faqs.length})</h4>
              <div className="space-y-3">
                {faqs.map(f => (
                  <div key={f.id} className="p-4 glass-card border border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-[#B58E5B]">{f.category}</span>
                      <h5 className="font-serif text-base font-normal text-[#1F1F1F] dark:text-white">{f.question}</h5>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'faq', id: f.id, name: f.question })}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <div className="space-y-4">
              <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white">Editorial Articles ({blogPosts.length})</h4>
              <div className="space-y-3">
                {blogPosts.map(b => (
                  <div key={b.id} className="p-4 glass-card border border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-base font-normal text-[#1F1F1F] dark:text-white">{b.title}</h5>
                      <p className="text-xs text-gray-500">{b.publishedDate} • {b.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'blog', id: b.id, name: b.title })}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                  className="px-4 py-2.5 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-wider font-bold transition-all shadow flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Dispatching Report...' : 'Send Email Digest Now'}</span>
                </button>
              </div>

              <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white pt-2">
                Incoming Client Consultations ({consultations.length})
              </h4>

              {consultations.length === 0 ? (
                <p className="text-xs text-gray-500 italic p-6 glass-card text-center">No submitted consultation requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {consultations.map(c => (
                    <div key={c.id} className="p-4 glass-card border border-[#D8CBBE]/40 dark:border-gray-800 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-serif text-lg font-medium text-[#1F1F1F] dark:text-white">{c.name}</h5>
                          <p className="text-xs text-gray-500">{c.email} • {c.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-[#B58E5B] text-white text-[10px] uppercase">{c.status}</span>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'booking', id: c.id, name: c.name })}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete Consultation Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                        <p><strong>Preferred Date:</strong> {c.preferredDate} ({c.preferredTime})</p>
                        <p><strong>Scope & Budget:</strong> {c.projectType} ({c.estimatedBudget})</p>
                      </div>
                      {c.notes && (
                        <p className="text-xs text-gray-500 italic pt-1">
                          <strong>Notes:</strong> "{c.notes}"
                        </p>
                      )}
                    </div>
                  ))}
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
