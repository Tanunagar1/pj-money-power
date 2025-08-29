import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building, User, Building2 } from 'lucide-react';

const LoanServicesSection: React.FC = () => {
  const services = [
    {
      icon: Home,
      title: 'Home Loans',
      description: 'Affordable housing with low interest rates and flexible repayment options',
      
    },
    {
      icon: Building,
      title: 'Business Loans',
      description: 'Collateral-free business growth funding for entrepreneurs and MSMEs',
      
    },
    {
      icon: User,
      title: 'Personal Loans',
      description: 'Education, travel, wedding & more - quick personal financing solutions',
      
    },
    {
      icon: Building2,
      title: 'Mortgage Loans',
      description: 'High-value loans against existing property with competitive rates',
      
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Loan Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive financial solutions tailored to meet your specific needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="text-center mb-6">
                <service.icon size={32} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
              </div>
              {/* Button removed, now read-only */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoanServicesSection;