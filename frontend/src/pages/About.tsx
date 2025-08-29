import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About PJ Money Power
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your trusted financial partner with over ₹500 crore disbursed across Tamil Nadu
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <Target size={48} className="text-blue-600 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide accessible, transparent, and efficient financial solutions to individuals and businesses across Tamil Nadu, empowering them to achieve their dreams and grow their ventures with confidence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <Award size={48} className="text-blue-600 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and preferred financial services provider in Tamil Nadu, known for our customer-centric approach, innovative solutions, and commitment to financial inclusion.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-6">
                Founded with a vision to bridge the gap between traditional banking and modern financial needs, PJ Money Power started as a small financial consultancy in Tirupur. Over the years, we have grown to become one of the most trusted loan providers across Tamil Nadu.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our journey began with a simple belief: everyone deserves access to fair and transparent financial services. Today, with over ₹500 crore disbursed and thousands of satisfied customers, we continue to uphold this belief while expanding our reach across 10+ cities in Tamil Nadu.
              </p>
              <p className="text-lg text-gray-600">
                We specialize in providing quick, hassle-free loans for homes, businesses, personal needs, and more. Our strong partnerships with leading banks and financial institutions ensure that our customers get the best rates and terms available in the market.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Achievements
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, number: '₹500+', label: 'Crore Disbursed' },
              { icon: Users, number: '5000+', label: 'Happy Customers' },
              { icon: Target, number: '10+', label: 'Cities Served' },
              { icon: Award, number: '48hrs', label: 'Quick Approval' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white p-6 rounded-lg shadow-lg"
              >
                <stat.icon size={48} className="text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose PJ Money Power?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Transparent Process',
                description: 'No hidden charges or complicated procedures. We believe in complete transparency in all our dealings.'
              },
              {
                title: 'Quick Approval',
                description: 'Get your loan approved within 48 hours with our streamlined process and efficient team.'
              },
              {
                title: 'Competitive Rates',
                description: 'We offer some of the best interest rates in the market through our strong banking partnerships.'
              },
              {
                title: 'Expert Guidance',
                description: 'Our experienced team provides personalized advice to help you choose the right loan product.'
              },
              {
                title: 'Local Presence',
                description: 'With offices across Tamil Nadu, we understand local needs and provide personalized service.'
              },
              {
                title: 'End-to-End Support',
                description: 'From application to disbursal, we provide complete support throughout your loan journey.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;