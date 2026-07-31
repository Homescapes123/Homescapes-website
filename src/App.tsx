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
import { TestimonialsSection } from './components/TestimonialsSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { StatisticsSection } from './components/StatisticsSection';
import { FAQSection } from './components/FAQSection';
import { BlogSection } from './components/BlogSection';
import { BlogArticleModal } from './components/BlogArticleModal';
import { InstagramFeed } from './components/InstagramFeed';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { CMSManagerModal } from './components/CMSManagerModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { SearchOverlay } from './components/SearchOverlay';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BackToTop } from './components/BackToTop';
import { IntroLoader } from './components/IntroLoader';
import { LegalModals } from './components/LegalModals';

const MainContent: React.FC = () => {
  const { currentView } = useStudio();

  return (
    <main className="min-h-screen">
      {currentView === 'home' && (
        <>
          <Hero />
          <AboutSection />
          <ServicesSection />
          <FeaturedProjects />
          <WhyChooseUs />
          <DesignProcess />
          <TestimonialsSection />
          <BeforeAfterSlider />
          <StatisticsSection />
          <FAQSection />
          <BlogSection />
          <InstagramFeed />
          <ContactSection />
        </>
      )}

      {currentView === 'about' && (
        <div className="pt-16">
          <AboutSection />
          <WhyChooseUs />
          <DesignProcess />
          <StatisticsSection />
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

      {currentView === 'blog' && (
        <div className="pt-16">
          <BlogSection />
          <InstagramFeed />
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
        <OwnerAuthModal />
        <BookingModal />
        <ProjectDetailModal />
        <BlogArticleModal />
        <CMSManagerModal />
        <SearchOverlay />
        <FloatingWhatsApp />
        <BackToTop />
      </div>
    </StudioProvider>
  );
}
