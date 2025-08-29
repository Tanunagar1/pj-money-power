import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQSection: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Can I get a loan with a low credit score?',
      answer: 'Yes, we offer loans for individuals with lower credit scores. Our team evaluates multiple factors including income, employment history, and collateral to determine eligibility. We work with various lenders to find the best solution for your situation.'
    },
    {
      question: 'How fast can I get ₹50,000?',
      answer: 'For personal loans up to ₹50,000, approval can be completed within 24-48 hours if all documents are submitted correctly. Disbursal typically happens within 48 hours of approval, subject to bank processing times.'
    },
    {
      question: 'Can I consolidate my existing loans?',
      answer: 'Yes, we offer loan consolidation services that can help you combine multiple debts into a single loan with potentially better terms and lower interest rates. This can simplify your repayment process and potentially save money.'
    },
    {
      question: 'Is it available for MSMEs and self-employed individuals?',
      answer: 'Absolutely! We specialize in providing loans to MSMEs and self-employed individuals. We understand the unique financial needs of business owners and offer tailored solutions with flexible documentation requirements.'
    },
    {
      question: 'What documents do I need to apply?',
      answer: 'Basic documents include identity proof (Aadhaar, PAN), address proof, income proof (salary slips for salaried, ITR for self-employed), and bank statements. Additional documents may be required based on the loan type and amount.'
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'No, we maintain complete transparency in our pricing. All charges including processing fees, prepayment penalties (if any), and other costs are clearly mentioned upfront. You will receive a detailed breakdown of all charges before loan approval.'
    },
    {
      question: 'What is the maximum loan amount I can get?',
      answer: 'Loan amounts vary based on your income, credit score, and loan type. Personal loans can go up to ₹25 lakhs, home loans up to ₹5 crores, and business loans are evaluated case-by-case. Use our eligibility calculator for a personalized estimate.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our loan services
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-blue-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Still have questions? Our team is here to help!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;