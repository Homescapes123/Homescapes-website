import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  Star,
  Quote,
  MessageSquarePlus,
  CheckCircle2,
  ThumbsUp,
  X,
  User,
  Sparkles,
  MapPin,
  Briefcase
} from 'lucide-react';
import { submitEnquiry } from '../lib/enquiry';
import { HoneypotField } from './HoneypotField';
import { EnquiryErrorNotice } from './EnquiryErrorNotice';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useStudio();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [helpfulCounts, setHelpfulCounts] = useState<{ [id: string]: number }>({});
  const [likedReviews, setLikedReviews] = useState<{ [id: string]: boolean }>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form state for customer review submission
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [contact, setContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const closeForm = () => {
    setIsFormOpen(false);
    setError('');
  };

  // Reviews are emailed to the studio for approval; nothing is published from the browser.
  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!name.trim() || !review.trim() || isSending) return;

    setIsSending(true);
    setError('');
    try {
      await submitEnquiry('review', { name, location, projectTitle, clientRole, rating, review, contact }, form);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return;
    } finally {
      setIsSending(false);
    }

    // Reset form
    setName('');
    setLocation('');
    setProjectTitle('');
    setClientRole('');
    setContact('');
    setRating(5);
    setReview('');
    setIsFormOpen(false);

    // Show toast
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleHelpfulClick = (id: string) => {
    if (likedReviews[id]) return;
    setHelpfulCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setLikedReviews(prev => ({ ...prev, [id]: true }));
  };

  // Compute average rating
  const totalReviews = testimonials.length;
  const averageRating = totalReviews > 0
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const filteredTestimonials = testimonials.filter(t => {
    if (filterRating === 'all') return true;
    return t.rating === filterRating;
  });

  return (
    <section id="testimonials-section" className="py-24 bg-[#FAF8F5] dark:bg-[#181716] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Alert */}
        {showSuccessToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#121212] dark:bg-white text-white dark:text-[#121212] px-6 py-4 shadow-2xl border border-[#9E723B] flex items-center gap-3 animate-slideUp">
            <CheckCircle2 className="w-5 h-5 text-[#9E723B] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest font-bold">Review Submitted</p>
              <p className="text-xs text-gray-300 dark:text-gray-700">Thank you! Your review has been sent to the studio and will appear here once approved.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs tracking-[0.3em] uppercase text-[#9E723B] font-bold block">
            CLIENT REVIEWS & FEEDBACK
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#121212] dark:text-white">
            Real Customer <br />
            <span className="italic font-light text-[#9E723B]">Feedback & Experiences.</span>
          </h2>
          <p className="text-[#332F2B] dark:text-gray-300 text-sm sm:text-base font-normal max-w-2xl mx-auto">
            We take pride in delivering exceptional design & architectural solutions across India. Browse authentic client feedback or share your own project experience directly with us.
          </p>
        </div>

        {/* Review Summary & Action Header Bar */}
        <div className="bg-white dark:bg-[#201F1D] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          {/* Average Rating Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <span className="font-serif text-4xl sm:text-5xl font-semibold text-[#121212] dark:text-white">
                {averageRating}
              </span>
              <span className="text-xs text-gray-400 block uppercase tracking-wider mt-1">out of 5.0</span>
            </div>

            <div className="h-12 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-[#9E723B] text-[#9E723B]" />
                ))}
              </div>
              <p className="text-xs font-semibold text-[#121212] dark:text-gray-200">
                {totalReviews} {totalReviews === 1 ? 'Customer Review' : 'Customer Reviews'}
              </p>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">100% Direct & Verified Submissions</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Rating Filter buttons if reviews exist */}
            {totalReviews > 0 && (
              <div className="flex items-center gap-1 bg-[#FAF6F0] dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 text-xs">
                <button
                  onClick={() => setFilterRating('all')}
                  className={`px-3 py-1.5 uppercase font-semibold transition-colors ${
                    filterRating === 'all'
                      ? 'bg-[#9E723B] text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#9E723B]'
                  }`}
                >
                  All ({totalReviews})
                </button>
                <button
                  onClick={() => setFilterRating(5)}
                  className={`px-3 py-1.5 uppercase font-semibold transition-colors ${
                    filterRating === 5
                      ? 'bg-[#9E723B] text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#9E723B]'
                  }`}
                >
                  5★ ({testimonials.filter(t => t.rating === 5).length})
                </button>
              </div>
            )}

            <button
              id="write-review-btn"
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3.5 bg-[#9E723B] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#121212] transition-all flex items-center gap-2 shadow-md shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit Your Review</span>
            </button>
          </div>
        </div>

        {/* Customer Reviews List */}
        {filteredTestimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#201F1D] p-8 border border-gray-200 dark:border-gray-800 flex flex-col justify-between relative group hover:border-[#9E723B] transition-all shadow-sm hover:shadow-md"
              >
                {/* Top Bar with Rating & Verified Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#9E723B] text-[#9E723B]" />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#9E723B] font-bold bg-[#FAF6F0] dark:bg-gray-800 px-2 py-0.5 border border-[#9E723B]/30">
                      <CheckCircle2 className="w-3 h-3 text-[#9E723B]" /> Verified Client
                    </span>
                  </div>

                  {/* Review Body */}
                  <blockquote className="text-sm text-[#2D2A26] dark:text-gray-200 font-normal leading-relaxed mb-6 italic">
                    "{item.review}"
                  </blockquote>
                </div>

                {/* Footer / Client Info */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#9E723B]/10 border border-[#9E723B]/30 flex items-center justify-center text-[#9E723B] font-bold text-sm shrink-0 uppercase">
                        {item.clientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-[#121212] dark:text-white leading-tight">
                          {item.clientName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#9E723B]" />
                          {item.location}
                        </p>
                        {item.projectTitle && (
                          <p className="text-[10px] uppercase tracking-wider text-[#9E723B] font-semibold mt-1">
                            Project: {item.projectTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Helpful Like Counter */}
                    <button
                      onClick={() => handleHelpfulClick(item.id)}
                      className={`flex items-center gap-1 text-[11px] font-medium transition-colors px-2 py-1 rounded border ${
                        likedReviews[item.id]
                          ? 'border-[#9E723B] text-[#9E723B] bg-[#FAF6F0] dark:bg-gray-800'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-[#9E723B]'
                      }`}
                      title="Mark review as helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{helpfulCounts[item.id] || 0}</span>
                    </button>
                  </div>
                  <div className="mt-3 text-[10px] text-gray-400 text-right">
                    Posted {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when no reviews match or no reviews submitted yet */
          <div className="bg-white dark:bg-[#201F1D] border border-gray-200 dark:border-gray-800 p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-[#FAF6F0] dark:bg-gray-800 border border-[#9E723B]/40 rounded-full flex items-center justify-center mx-auto text-[#9E723B]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#121212] dark:text-white font-medium">
                Be the First to Review Us!
              </h3>
              <p className="text-xs sm:text-sm text-[#2D2A26] dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                Have you worked with Homescapes Studio on an architectural or interior design project in India? We would love to hear your honest feedback.
              </p>
            </div>
            <button
              id="empty-state-review-btn"
              onClick={() => setIsFormOpen(true)}
              className="px-8 py-4 bg-[#9E723B] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#121212] transition-all shadow-md inline-flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit Direct Review</span>
            </button>
          </div>
        )}

        {/* Customer Review Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#1C1B19] max-w-xl w-full p-6 sm:p-8 border border-[#9E723B] relative shadow-2xl max-h-[90vh] overflow-y-auto">
              
              {/* Close button */}
              <button
                id="close-review-form-btn"
                onClick={closeForm}
                className="absolute top-5 right-5 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="p-3 bg-[#FAF6F0] dark:bg-gray-800 border border-[#9E723B] text-[#9E723B]">
                  <MessageSquarePlus className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#9E723B] font-bold block">CLIENT FEEDBACK</span>
                  <h3 className="font-serif text-2xl text-[#121212] dark:text-white font-medium">
                    Share Your Review
                  </h3>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                <HoneypotField />

                {/* Rating Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200 mb-2">
                    Overall Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'fill-[#9E723B] text-[#9E723B]'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#9E723B] font-bold uppercase tracking-wider ml-2">
                      {rating === 5 && '5 - Excellent'}
                      {rating === 4 && '4 - Very Good'}
                      {rating === 3 && '3 - Good'}
                      {rating === 2 && '2 - Fair'}
                      {rating === 1 && '1 - Needs Improvement'}
                    </span>
                  </div>
                </div>

                {/* Full Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#9E723B] text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200 mb-1.5">
                      City / Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indira Nagar, Sugamau, Lucknow"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#9E723B] text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Title & Client Profession */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200 mb-1.5">
                      Project / Scope Name
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. 3BHK Villa Interior Design"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#9E723B] text-[#121212] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200 mb-1.5">
                      Your Role / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Homeowner / Entrepreneur"
                      value={clientRole}
                      onChange={(e) => setClientRole(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#9E723B] text-[#121212] dark:text-white"
                    />
                  </div>
                </div>

                {/* Review / Detailed Feedback */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200 mb-1.5">
                    Your Review & Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your experience working with Homescapes Studio, design quality, timelines, or execution..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full p-4 text-xs bg-[#FAF8F5] dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#9E723B] text-[#121212] dark:text-white leading-relaxed"
                  />
                </div>

                {/* Private contact so the studio can confirm the reviewer is a client */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#121212] dark:text-gray-200 mb-1.5">
                    Email or Phone (private)
                  </label>
                  <input
                    type="text"
                    placeholder="Only used to confirm you're a client. Never published."
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#9E723B] text-[#121212] dark:text-white"
                  />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reviews are checked by the studio before they appear on the website.
                </p>

                {error && <EnquiryErrorNotice message={error} />}

                {/* Submit button */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-5 py-3 text-xs uppercase tracking-widest font-semibold text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-review-form-btn"
                    type="submit"
                    disabled={isSending}
                    className="px-8 py-3.5 bg-[#9E723B] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#121212] transition-colors shadow-md disabled:opacity-60 disabled:cursor-wait"
                  >
                    {isSending ? 'Sending…' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
