import React from 'react';
import HeroSection from '../components/HeroSection';
import WeServeSection from '../components/WeServeSection';
import LoanServicesSection from '../components/LoanServicesSection';
import SmartToolsSection from '../components/SmartToolsSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import LoanProcessSection from '../components/LoanProcessSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <WeServeSection />
      <LoanServicesSection />
      <SmartToolsSection />
      <WhyChooseUsSection />
      <LoanProcessSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
};

export default Home;