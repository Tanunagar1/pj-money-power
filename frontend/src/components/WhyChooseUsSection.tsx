import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, FileText, Handshake, HeadphonesIcon } from 'lucide-react';

const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: CheckCircle,
      title: '₹500+ Cr Disbursed',
      description: 'Proven track record of successful loan disbursements across Tamil Nadu'
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Thousands of satisfied customers in 10+ cities across Tamil Nadu'
    },
    {
      icon: FileText,
      title: 'Transparent Process',
      description: 'Low-paperwork process with complete transparency and no hidden charges'
    },
    {
      icon: Handshake,
      title: 'Multi-Bank Tie-ups',
      description: 'Strong partnerships with leading banks for best loan rates and terms'
    },
    {
      icon: HeadphonesIcon,
      title: 'End-to-End Support',
      description: 'Complete assistance and guidance throughout your loan journey'
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
            Why Choose PJ Money Power?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing the best financial services with complete transparency and customer satisfaction
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <feature.icon size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-blue-50 rounded-lg p-8"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Our Success Numbers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">₹500+</div>
                <div className="text-sm text-gray-600">Crore Disbursed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm text-gray-600">Cities Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">48hrs</div>
                <div className="text-sm text-gray-600">Quick Approval</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;