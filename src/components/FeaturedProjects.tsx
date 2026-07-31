import React from 'react';
import { useStudio } from '../context/StudioContext';
import { PortfolioCategory, Project } from '../types';
import { Eye, MapPin, Maximize2, Sparkles, Plus, FolderPlus } from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const {
    projects,
    selectedCategory,
    setSelectedCategory,
    setSelectedProject,
    setCurrentView,
    openOwnerPortal
  } = useStudio();

  const categories: PortfolioCategory[] = [
    'All',
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

  const filteredProjects = projects.filter(project => {
    if (selectedCategory === 'All') return true;
    return project.category.includes(selectedCategory);
  });

  return (
    <section id="featured-projects-section" className="py-24 bg-[#E2D9CD] dark:bg-[#121110] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-bold block">
              SELECTED PORTFOLIO ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#121212] dark:text-white">
              Featured Luxury <br />
              <span className="italic font-light text-[#B58E5B]">Interior Projects.</span>
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="max-w-md text-xs sm:text-sm text-gray-800 dark:text-gray-300 font-normal leading-relaxed">
              Explore our curated catalog of bespoke penthouses, coastal estates, and corporate spaces designed across India and internationally.
            </p>

            {/* Direct Owner Action Button */}
            <button
              id="owner-add-project-btn"
              onClick={openOwnerPortal}
              className="shrink-0 px-4 py-3 bg-[#B58E5B] hover:bg-[#121212] text-white text-xs uppercase tracking-wider font-bold shadow-md flex items-center gap-2 transition-all border border-[#B58E5B]"
              title="Studio Owner Portal: PIN Protected Add Project"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Owner: + Add Project & Photos</span>
            </button>
          </div>
        </div>

        {/* Portfolio Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-[#B58E5B]/40 dark:border-gray-800">
          {categories.map(cat => (
            <button
              key={cat}
              id={`portfolio-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap rounded-none font-bold border ${
                selectedCategory === cat
                  ? 'bg-[#B58E5B] text-white border-[#B58E5B] shadow-md'
                  : 'bg-[#DAD1C4] dark:bg-gray-800 text-[#121212] dark:text-gray-300 border-[#B58E5B]/30 hover:border-[#B58E5B] hover:text-[#B58E5B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: Project, idx: number) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => setSelectedProject(project)}
              className={`group cursor-pointer relative overflow-hidden bg-[#E8DFC8] dark:bg-[#1A1918] border border-[#B58E5B]/40 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[16/10] bg-gray-100 dark:bg-gray-900">
                <img
                  src={project.heroImage}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-[#B58E5B] text-white text-[10px] uppercase tracking-widest">
                      {project.style}
                    </span>
                    <button
                      id={`project-expand-btn-${project.id}`}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-colors"
                      title="View Full Case Study"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E6C894]">
                      <Eye className="w-3.5 h-3.5" />
                      View Full Case Study
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-300 font-light">
                      <span>{project.location}</span>
                      <span>•</span>
                      <span>{project.area}</span>
                      {project.budget && (
                        <>
                          <span>•</span>
                          <span className="text-[#E6C894] font-medium">{project.budget}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Visible Card Details */}
              <div className="p-6 flex items-center justify-between border-t border-[#D8CBBE]/30 dark:border-gray-800">
                <div>
                  <h4 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white group-hover:text-[#B58E5B] transition-colors">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B58E5B]" />
                    <span>{project.location}</span>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <span>{project.area}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium block">
                    {project.category[0]}
                  </span>
                  <span className="text-xs text-gray-400 font-light">{project.completionYear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <button
            id="view-all-portfolio-btn"
            onClick={() => {
              setSelectedCategory('All');
              setCurrentView('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 border border-[#1F1F1F] dark:border-white text-[#1F1F1F] dark:text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#1F1F1F] hover:text-white dark:hover:bg-[#B58E5B] dark:hover:border-[#B58E5B] transition-all duration-300 inline-flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-[#B58E5B]" />
            <span>Explore Complete Portfolio Catalog ({projects.length})</span>
          </button>
        </div>

      </div>
    </section>
  );
};
