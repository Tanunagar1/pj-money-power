import React, { useEffect } from 'react';
import ContactSection from '../components/ContactSection';


const Contact: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <ContactSection />
    </div>
  );
};

export default Contact;