import React from 'react';
import { useStudio } from '../context/StudioContext';
import { BlogPost } from '../types';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { blogPosts, setSelectedArticle } = useStudio();

  return (
    <section id="blog-section" className="py-24 bg-[#F8F5F2] dark:bg-[#121110] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-medium block">
              HOMESCAPES JOURNAL & EDITORIAL
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F1F1F] dark:text-white">
              Insights & Architectural <br />
              <span className="italic font-light text-[#B58E5B]">Design Essays.</span>
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            Explorations into tactile luxury, rare marble slab selection, acoustic wall integration, and contemporary European living trends.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post: BlogPost) => (
            <article
              key={post.id}
              id={`blog-card-${post.id}`}
              onClick={() => setSelectedArticle(post)}
              className="glass-card group cursor-pointer border border-[#D8CBBE]/40 dark:border-gray-800 hover:border-[#B58E5B] transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden img-zoom-container bg-gray-100 dark:bg-gray-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-black/80 text-white text-[10px] uppercase tracking-widest px-3 py-1">
                    {post.category}
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-light">
                    <span>{post.publishedDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B58E5B]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1F1F1F] dark:text-white group-hover:text-[#B58E5B] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#D8CBBE]/20 dark:border-gray-800 mt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#B58E5B]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="block text-xs font-medium text-[#1F1F1F] dark:text-gray-200">{post.author.name}</span>
                    <span className="block text-[9px] text-gray-400 uppercase tracking-wider">{post.author.role}</span>
                  </div>
                </div>

                <span className="text-xs text-[#B58E5B] font-medium uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <BookOpen className="w-3.5 h-3.5" />
                  Read
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
