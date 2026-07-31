import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Search, X, FolderKanban, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';

export const SearchOverlay: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    projects,
    blogPosts,
    faqs,
    setSelectedProject,
    setSelectedArticle
  } = useStudio();

  if (!isSearchOpen) return null;

  const filteredProjects = projects.filter(
    p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = blogPosts.filter(
    a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter(
    f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl p-6 animate-fadeIn">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        
        {/* Search Bar Header */}
        <div className="flex items-center justify-between border-b border-[#B58E5B]/50 pb-4">
          <div className="flex items-center gap-3 w-full">
            <Search className="w-6 h-6 text-[#B58E5B]" />
            <input
              type="text"
              autoFocus
              placeholder="Search penthouse projects, stone guides, services, FAQs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xl sm:text-2xl font-serif text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <button
            id="search-overlay-close-btn"
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[75vh] overflow-y-auto space-y-8 pr-2">
          
          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B58E5B] font-semibold flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                Matching Projects ({filteredProjects.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedProject(proj);
                    }}
                    className="p-4 glass-card border border-white/10 hover:border-[#B58E5B] cursor-pointer flex items-center gap-4 group"
                  >
                    <img src={proj.heroImage} alt={proj.name} className="w-16 h-12 object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h5 className="font-serif text-base text-white group-hover:text-[#B58E5B] transition-colors">{proj.name}</h5>
                      <span className="text-xs text-gray-400">{proj.location} • {proj.style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles Results */}
          {filteredArticles.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B58E5B] font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Journal Essays ({filteredArticles.length})
              </span>
              <div className="space-y-2">
                {filteredArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedArticle(art);
                    }}
                    className="p-4 glass-card border border-white/10 hover:border-[#B58E5B] cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <h5 className="font-serif text-base text-white group-hover:text-[#B58E5B]">{art.title}</h5>
                      <span className="text-xs text-gray-400">{art.category} • {art.readTime}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B58E5B] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Results */}
          {filteredFaqs.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B58E5B] font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Matching FAQs ({filteredFaqs.length})
              </span>
              <div className="space-y-2">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="p-4 glass-card border border-white/10 space-y-1">
                    <h5 className="font-serif text-base text-white">{faq.question}</h5>
                    <p className="text-xs text-gray-300 font-light">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && filteredProjects.length === 0 && filteredArticles.length === 0 && filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-light">
              No matching archive records found for "{searchQuery}".
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
