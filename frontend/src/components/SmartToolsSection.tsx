import React, { useState } from 'react';
import { BACKEND_BASE_URL } from '../backend';
import LoanEligibilityCalculator from './LoanEligibilityCalculator';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Calculator, X } from 'lucide-react';

const SmartToolsSection: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const navigate = useNavigate();

  const tools = [
    {
      id: 'credit-score',
      icon: BarChart3,
      title: 'Credit Score Checker',
      description: 'Check your credit score instantly and get personalized recommendations',
    
    },
    {
      id: 'eligibility',
      icon: Calculator,
      title: 'Loan Eligibility Calculator',
      description: 'Calculate how much loan you can get based on your income and profile',
    
    },
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
            Smart Financial Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use our intelligent tools to make informed financial decisions
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer mx-auto"
            >
              <div className="text-center">
                <tool.icon size={32} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {tool.description}
                </p>
                {tool.id === 'credit-score' ? (
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setActiveModal(null);
                      navigate('/credit-score-checker');
                    }}
                  >
                    Try Now
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setActiveModal(tool.id);
                    }}
                  >
                    Try Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
  {activeModal === 'credit-score' && <CreditScoreModal />}
  {activeModal === 'eligibility' && <LoanEligibilityCalculator onClose={() => setActiveModal(null)} />}
    </section>
  );
};

export default SmartToolsSection;