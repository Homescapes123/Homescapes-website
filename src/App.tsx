import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { FeaturedProjects } from './components/FeaturedProjects';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { WhyChooseUs } from './components/WhyChooseUs';
import { DesignProcess } from './components/DesignProcess';
import { ReviewsSection } from './components/ReviewsSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BackToTop } from './components/BackToTop';
import { IntroLoader } from './components/IntroLoader';
import { LegalModals } from './components/LegalModals';
import { LeadRecoveryNotice } from './components/LeadRecoveryNotice';

const MainContent: React.FC = () => {
  const { currentView } = useStudio();

  return (
    <main className="min-h-screen">
      {/* The home page is a short overview; each menu page holds the full detail for its topic. */}
      {currentView === 'home' && (
        <>
          <Hero />
          <AboutSection compact />
          <ServicesSection compact />
          <FeaturedProjects />
          <ReviewsSection />
          <ContactSection />
        </>
      )}

      {currentView === 'about' && (
        <div className="pt-16">
          <AboutSection />
          <WhyChooseUs />
          <ReviewsSection />
          <ContactSection />
        </div>
      )}

      {currentView === 'portfolio' && (
        <div className="pt-16">
          <FeaturedProjects />
          <BeforeAfterSlider />
          <ContactSection />
        </div>
      )}

      {currentView === 'services' && (
        <div className="pt-16">
          <ServicesSection />
          <DesignProcess />
          <FAQSection />
          <ContactSection />
        </div>
      )}

      {currentView === 'contact' && (
        <div className="pt-16">
          <ContactSection />
          <FAQSection />
        </div>
      )}

      {(currentView === 'privacy' || currentView === 'terms') && (
        <LegalModals />
      )}
    </main>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <div className="relative min-h-screen font-sans selection:bg-[#B58E5B] selection:text-white">
        <IntroLoader />
        <Header />
        <MainContent />
        <Footer />

        {/* Overlays and Modals */}
        <ProjectDetailModal />
        <FloatingWhatsApp />
        <BackToTop />
        <LeadRecoveryNotice />
      </div>
    </StudioProvider>
  );
}
