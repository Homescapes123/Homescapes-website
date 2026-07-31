import React from 'react';
import { INITIAL_INSTAGRAM_POSTS } from '../data/initialData';
import { Heart, MessageCircle, Instagram, ExternalLink } from 'lucide-react';

export const InstagramFeed: React.FC = () => {
  return (
    <section id="instagram-feed-section" className="py-20 bg-[#EFECE6] dark:bg-[#181716] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B58E5B] font-semibold flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              FOLLOW @HOMESCAPES.STUDIO
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1F1F1F] dark:text-white">
              Behind The Atelier Doors.
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1F1F1F] dark:text-gray-200 hover:text-[#B58E5B] font-medium"
          >
            <span>Follow Us On Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B58E5B]" />
          </a>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INITIAL_INSTAGRAM_POSTS.map(post => (
            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden bg-black border border-[#D8CBBE]/40 dark:border-gray-800"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Hover Dark Overlay with Likes & Comments */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-center gap-6 my-auto">
                  <div className="flex items-center gap-1.5 font-medium text-xs">
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-xs">
                    <MessageCircle className="w-4 h-4 fill-white text-white" />
                    <span>{post.comments}</span>
                  </div>
                </div>

                <p className="text-[11px] font-light text-gray-200 line-clamp-2 italic">
                  "{post.caption}"
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
