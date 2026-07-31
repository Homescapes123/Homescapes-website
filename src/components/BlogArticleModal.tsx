import React from 'react';
import { useStudio } from '../context/StudioContext';
import { X, ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';

export const BlogArticleModal: React.FC = () => {
  const { selectedArticle, setSelectedArticle, setIsBookingOpen } = useStudio();

  if (!selectedArticle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="bg-[#F8F5F2] dark:bg-[#141312] w-full max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-y-auto border border-[#B58E5B]/40 shadow-2xl relative text-[#1F1F1F] dark:text-gray-100">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#F8F5F2]/90 dark:bg-[#141312]/90 backdrop-blur-md px-6 py-4 border-b border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between">
          <button
            id="article-back-btn"
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-[#B58E5B]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </button>

          <button
            id="article-close-btn"
            onClick={() => setSelectedArticle(null)}
            className="p-2 text-gray-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Article Container */}
        <div className="p-6 sm:p-12 space-y-8">
          
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-[#B58E5B] text-white text-[10px] uppercase tracking-widest">
              {selectedArticle.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F1F1F] dark:text-white leading-tight">
              {selectedArticle.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-light pt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#B58E5B]" />
                {selectedArticle.publishedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#B58E5B]" />
                {selectedArticle.readTime}
              </span>
            </div>
          </div>

          {/* Hero Cover Image */}
          <div className="aspect-[16/9] overflow-hidden border border-[#D8CBBE]/40 dark:border-gray-800 shadow-xl">
            <img
              src={selectedArticle.coverImage}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Author Block */}
          <div className="flex items-center justify-between p-6 glass-card border border-[#D8CBBE]/40 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <img
                src={selectedArticle.author.avatar}
                alt={selectedArticle.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#B58E5B]"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-serif text-base font-medium text-[#1F1F1F] dark:text-white">
                  Written by {selectedArticle.author.name}
                </h4>
                <p className="text-xs text-[#B58E5B] uppercase tracking-wider font-light">
                  {selectedArticle.author.role}
                </p>
              </div>
            </div>

            <button
              id="article-share-btn"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: selectedArticle.title, url: window.location.href });
                } else {
                  alert('Article link copied to clipboard!');
                }
              }}
              className="p-2 border border-[#D8CBBE] dark:border-gray-700 hover:border-[#B58E5B] text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-[#B58E5B]" />
              <span className="hidden sm:inline">Share Essay</span>
            </button>
          </div>

          {/* Article Body Content */}
          <div className="prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base text-gray-700 dark:text-gray-300 font-light leading-relaxed whitespace-pre-line">
            {selectedArticle.content}
          </div>

          {/* Bottom Footer CTA */}
          <div className="pt-8 border-t border-[#D8CBBE]/50 dark:border-gray-800 text-center space-y-4">
            <h4 className="font-serif text-2xl text-[#1F1F1F] dark:text-white">
              Ready to Bring These Design Principles to Your Project?
            </h4>
            <button
              id="article-bottom-consult-btn"
              onClick={() => {
                setSelectedArticle(null);
                setIsBookingOpen(true);
              }}
              className="px-8 py-3.5 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1F1F1F] transition-colors"
            >
              Schedule Private Consultation
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
