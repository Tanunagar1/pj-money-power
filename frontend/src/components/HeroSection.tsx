import React, { useState } from 'react';
import LoanApplicationModal from './LoanApplicationModal';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black/40">
        <div 
          className="w-full h-full bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            {/* Company Logo */}
            <div className="mb-8">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-2xl inline-block">
                PJ Money Power
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Quick Loans Made Easy
              <span className="text-blue-400 block">
                Serving Tamil Nadu's Fastest Growing Cities
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              With ₹500+ Crore disbursed, we're your trusted financial partner across Tamil Nadu.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/credit-score-checker');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <CheckCircle size={20} />
                <span>Check Credit Score</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center space-x-2"
                onClick={() => {
                  if (isAuthenticated) {
                    setShowModal(true);
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <TrendingUp size={20} />
                <span>Apply for a Loan</span>
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>₹500+ Crore Disbursed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>10+ Cities Served</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Thousands of Happy Customers</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl font-bold mb-2">₹500+</div>
              <div className="text-sm">Crore Disbursed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl font-bold mb-2">10+</div>
              <div className="text-sm">Cities Served</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm">Customer Support</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl font-bold mb-2">48hrs</div>
              <div className="text-sm">Quick Approval</div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Loan Application Modal */}
      <LoanApplicationModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default HeroSection;