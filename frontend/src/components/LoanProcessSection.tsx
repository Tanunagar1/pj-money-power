import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calculator, Upload, CheckCircle } from 'lucide-react';

const LoanProcessSection: React.FC = () => {
  const steps = [
    {
      id: 1,
      icon: BarChart3,
      title: 'Check Your Credit Score',
      description: 'Get your free credit score and understand your loan eligibility instantly',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      icon: Calculator,
      title: 'Calculate Your Eligibility',
      description: 'Use our smart calculator to determine your loan amount and EMI options',
      color: 'bg-green-500'
    },
    {
      id: 3,
      icon: Upload,
      title: 'Upload Documents',
      description: 'Submit required documents online and get instant verification',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      icon: CheckCircle,
      title: 'Get Disbursal',
      description: 'Receive loan approval and disbursal within 48 hours',
      color: 'bg-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple 3-Step Loan Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your loan approved and disbursed in just 3 easy steps
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200 z-0"></div>
            <div className="absolute top-16 left-0 h-1 bg-blue-500 z-10 w-full"></div>

            <div className="grid grid-cols-4 gap-8 relative z-20">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <step.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied customers who have chosen PJ Money Power for their financial needs
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Start Your Application
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default LoanProcessSection;
