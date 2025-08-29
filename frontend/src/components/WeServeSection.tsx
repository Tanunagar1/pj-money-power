import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const WeServeSection: React.FC = () => {
  const cities = [
    'Chennai', 'Tirupur', 'Erode', 'Salem', 'Namakkal', 
    'Karur', 'Nilgiris', 'Madurai', 'Coimbatore', 'Trichy', 'Hosur'
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
            Cities We Serve
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Providing quick and reliable loan services across Tamil Nadu's major cities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities.map((city, index) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center mb-4">
                <MapPin size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {city}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeServeSection;