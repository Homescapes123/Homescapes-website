import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, Send, Sparkles } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { isBookingOpen, setIsBookingOpen, addConsultation } = useStudio();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Interiors',
    spaceType: 'Penthouse / Villa',
    estimatedBudget: '₹10,00,000 - ₹25,00,000',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTime: '10:00 AM IST',
    location: 'Indira Nagar, Sugamau, Lucknow / Pan-India',
    notes: ''
  });

  if (!isBookingOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addConsultation(formData);
    setStep(2);
  };

  const handleClose = () => {
    setIsBookingOpen(false);
    setStep(1);
  };

  const availableTimeSlots = [
    '10:00 AM IST',
    '11:30 AM IST',
    '02:30 PM IST',
    '04:00 PM IST',
    '05:30 PM IST'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#F8F5F2] dark:bg-[#141312] w-full max-w-2xl border border-[#B58E5B]/40 shadow-2xl relative text-[#1F1F1F] dark:text-gray-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-[#F8F5F2]/90 dark:bg-[#141312]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#B58E5B] text-[#B58E5B] flex items-center justify-center font-serif text-sm">
              H
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B58E5B] block">Private Appointment</span>
              <h3 className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white">
                Book Studio Consultation
              </h3>
            </div>
          </div>

          <button
            id="booking-close-btn"
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {step === 2 ? (
            <div className="text-center py-10 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-[#B58E5B] text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-serif text-3xl font-normal text-[#1F1F1F] dark:text-white">
                  Consultation Confirmed
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-light max-w-md mx-auto">
                  Thank you, {formData.name}. Your private appointment with our Principal Design Director has been requested for <strong className="text-[#B58E5B]">{formData.preferredDate}</strong> at <strong className="text-[#B58E5B]">{formData.preferredTime}</strong>.
                </p>
              </div>

              <div className="glass-card p-6 text-left space-y-2 text-xs text-gray-600 dark:text-gray-300 border border-[#D8CBBE]/40 dark:border-gray-800">
                <p><strong>Project Type:</strong> {formData.projectType}</p>
                <p><strong>Estimated Budget:</strong> {formData.estimatedBudget}</p>
                <p><strong>Email Calendar Invite:</strong> Sent to {formData.email}</p>
              </div>

              <button
                id="booking-done-btn"
                onClick={handleClose}
                className="px-8 py-3.5 bg-[#B58E5B] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#1F1F1F] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.in"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 7380334333"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5">
                    Project Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indira Nagar, Sugamau, Lucknow"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  />
                </div>
              </div>

              {/* Date & Time Slot Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#D8CBBE]/30 dark:border-gray-800">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Preferred Consultation Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Select Time Slot *
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  >
                    {availableTimeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5">
                    Project Scope Category
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  >
                    <option value="Residential Interiors">Residential Interiors</option>
                    <option value="Commercial HQ & Office">Commercial HQ & Office</option>
                    <option value="Modular Kitchen Design">Modular Kitchen Design</option>
                    <option value="Living & Penthouse Suite">Living & Penthouse Suite</option>
                    <option value="Full Renovation & Architectural">Full Renovation & Architectural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5">
                    Target Investment Range
                  </label>
                  <select
                    value={formData.estimatedBudget}
                    onChange={e => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  >
                    <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 – ₹5,00,000</option>
                    <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 – ₹10,00,000</option>
                    <option value="₹10,00,000 - ₹25,00,000">₹10,00,000 – ₹25,00,000</option>
                    <option value="₹25,00,000+">₹25,00,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-1.5">
                  Design Preferences / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Share any special design requirements, architectural style inspirations, or property notes..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-light flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#B58E5B]" />
                  Zero commitment initial consultation
                </span>
                <button
                  id="booking-submit-btn"
                  type="submit"
                  className="px-8 py-3.5 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1F1F1F] transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
