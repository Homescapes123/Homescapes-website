import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addConsultation } = useStudio();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Residential Interiors',
    budget: '₹10,00,000 - ₹25,00,000',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addConsultation({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'N/A',
      projectType: formData.projectType,
      estimatedBudget: formData.budget,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '10:00 AM',
      spaceType: 'Entire Residence',
      location: 'Client Inquiry',
      notes: formData.message
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectType: 'Residential Interiors',
        budget: '₹10,00,000 - ₹25,00,000',
        message: ''
      });
    }, 5000);
  };

  return (
    <section id="contact-section" className="py-24 bg-[#F8F5F2] dark:bg-[#121110] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#B58E5B] font-medium block">
            INITIATE A CONVERSATION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F1F1F] dark:text-white">
            Let's Design Your <br />
            <span className="italic font-light text-[#B58E5B]">Dream Space.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-light">
            Whether you are planning a penthouse renovation, a coastal villa build, or an executive office, our principal directors welcome your inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Details & Interactive Google Map Mock */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel p-8 border border-[#D8CBBE]/50 dark:border-gray-800 space-y-6">
              <h3 className="font-serif text-2xl font-normal text-[#1F1F1F] dark:text-white">
                Homescapes Studio
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B58E5B] shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white block">Studio Address</span>
                    <span>Indira Nagar, Sugamau, Lucknow, Uttar Pradesh 226016, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#B58E5B] shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white block">Direct Telephone</span>
                    <span>+91 738033433</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B58E5B] shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white block">Inquiry Email</span>
                    <span>workwithhomescapes@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B58E5B] shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white block">Business Hours</span>
                    <span>Monday – Saturday: 9:00 AM – 9:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Inquiry */}
              <div className="pt-4 border-t border-[#D8CBBE]/40 dark:border-gray-800">
                <a
                  href="https://wa.me/91738033433?text=Hello%20Homescapes%20Studio,%20I%20would%20like%20to%20inquire%20about%20an%20interior%20or%20architectural%20project%20in%20Lucknow%20or%20Pan-India."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] text-white text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>CONNECT ON WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Google Map Embedded Frame */}
            <div className="glass-card border border-[#D8CBBE]/40 dark:border-gray-800 overflow-hidden h-64 relative">
              <iframe
                title="Homescapes Studio Location - Indira Nagar, Sugamau, Lucknow"
                src="https://maps.google.com/maps?q=Indira%20Nagar%2C%20Sugamau%2C%20Lucknow%2C%20Uttar%20Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.6) opacity(0.85)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Modern Contact Form */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-12 border border-[#B58E5B]/40 relative">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-[#B58E5B] text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-normal text-[#1F1F1F] dark:text-white">
                  Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-light max-w-md mx-auto">
                  Thank you, {formData.name}. Our principal design director will review your project parameters and contact you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#1F1F1F] dark:text-white mb-1">
                    Direct Project Consultation
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    Complete the details below to receive a personalized proposal framework.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-2">
                      Telephone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 738033433"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.in"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-2">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                    >
                      <option value="Residential Interiors">Residential Interiors</option>
                      <option value="Commercial Interiors">Commercial Interiors</option>
                      <option value="Modular Kitchens">Modular Kitchens</option>
                      <option value="Penthouse Renovation">Penthouse Renovation</option>
                      <option value="Turnkey Architectural Project">Turnkey Architectural Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-2">
                    Estimated Investment Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  >
                    <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 – ₹5,00,000</option>
                    <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 – ₹10,00,000</option>
                    <option value="₹10,00,000 - ₹25,00,000">₹10,00,000 – ₹25,00,000</option>
                    <option value="₹25,00,000+">₹25,00,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#B58E5B] font-medium mb-2">
                    Project Message / Property Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your property location, square footage, aesthetic goals, or desired timeline..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 text-xs bg-white dark:bg-gray-900 border border-[#D8CBBE] dark:border-gray-700 focus:outline-none focus:border-[#B58E5B] text-[#1F1F1F] dark:text-white"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full py-4 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#1F1F1F] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Consultation Request</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
