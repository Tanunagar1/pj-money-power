import React from 'react';
import { motion } from 'framer-motion';

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: December 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose max-w-none"
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using PJ Money Power's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services</h2>
              <p className="text-gray-600 mb-4">
                PJ Money Power provides loan facilitation services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Home loans</li>
                <li>Personal loans</li>
                <li>Business loans</li>
                <li>Mortgage loans</li>
                <li>Credit score checking</li>
                <li>Loan eligibility assessment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility</h2>
              <p className="text-gray-600 mb-4">
                To use our services, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Be at least 18 years of age</li>
                <li>Be a resident of India</li>
                <li>Provide accurate and complete information</li>
                <li>Have the legal capacity to enter into agreements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Application Process</h2>
              <p className="text-gray-600 mb-4">
                When you apply for a loan through our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>You authorize us to verify your information</li>
                <li>You consent to credit checks and bureau inquiries</li>
                <li>You agree to provide all required documentation</li>
                <li>You understand that loan approval is subject to lender criteria</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Fees and Charges</h2>
              <p className="text-gray-600 mb-4">
                Our service fees are clearly disclosed before you proceed with any application. These may include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Processing fees</li>
                <li>Documentation charges</li>
                <li>Administrative costs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-600 mb-4">
                We are committed to protecting your personal information. Please refer to our Privacy Policy for details on how we collect, use, and protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                PJ Money Power acts as a facilitator between borrowers and lenders. We do not guarantee loan approval or specific terms. All loan decisions are made by the respective lenders based on their criteria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Our liability is limited to the extent permitted by law. We are not responsible for any indirect, incidental, or consequential damages arising from the use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For any questions regarding these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@pjmoneypower.com<br />
                  <strong>Phone:</strong> +91 9876543210<br />
                  <strong>Address:</strong> 123 Business Street, Tirupur, Tamil Nadu 641604
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;