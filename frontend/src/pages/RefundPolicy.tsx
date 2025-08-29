import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Policy</h2>
              <p className="text-gray-600 mb-4">
                At PJ Money Power, we strive to provide transparent and fair services. This refund policy outlines the circumstances under which refunds may be provided for our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Fees</h2>
              <p className="text-gray-600 mb-4">
                Our service fees are charged for the following:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Loan application processing</li>
                <li>Documentation and verification services</li>
                <li>Credit assessment and evaluation</li>
                <li>Administrative and operational costs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Eligibility</h2>
              <p className="text-gray-600 mb-4">
                Refunds may be considered in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Service not delivered due to our technical failure</li>
                <li>Duplicate payment made by error</li>
                <li>Unauthorized transaction on your account</li>
                <li>Cancellation within 24 hours of service initiation (subject to conditions)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Non-Refundable Services</h2>
              <p className="text-gray-600 mb-4">
                The following services are generally non-refundable:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Processing fees once the application has been submitted to lenders</li>
                <li>Documentation charges for completed verification</li>
                <li>Credit report fees</li>
                <li>Services completed as per agreed terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Loan Rejection</h2>
              <p className="text-gray-600 mb-4">
                If your loan application is rejected by the lender:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Processing fees are generally non-refundable as services were provided</li>
                <li>Partial refunds may be considered if rejection occurs before document verification</li>
                <li>Each case will be reviewed individually based on the stage of processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Refund Process</h2>
              <p className="text-gray-600 mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 text-gray-600 mb-4">
                <li>Contact our customer service team within 7 days of the transaction</li>
                <li>Provide your transaction details and reason for refund request</li>
                <li>Our team will review your request within 5-7 business days</li>
                <li>If approved, refunds will be processed to the original payment method</li>
                <li>Processing time may vary depending on your bank or payment provider</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Refund Timeline</h2>
              <p className="text-gray-600 mb-4">
                Approved refunds will be processed as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Credit/Debit Cards: 5-7 business days</li>
                <li>Net Banking: 3-5 business days</li>
                <li>Digital Wallets: 1-3 business days</li>
                <li>UPI: 1-2 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Partial Refunds</h2>
              <p className="text-gray-600 mb-4">
                In some cases, partial refunds may be provided:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>When services are partially completed</li>
                <li>Based on the stage of application processing</li>
                <li>After deducting administrative costs</li>
                <li>As determined by our review team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Dispute Resolution</h2>
              <p className="text-gray-600 mb-4">
                If you disagree with our refund decision:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>You can escalate the matter to our senior management</li>
                <li>Provide additional documentation supporting your claim</li>
                <li>We will conduct a thorough review of your case</li>
                <li>Final decisions will be communicated within 10 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For refund requests or questions about this policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> refunds@pjmoneypower.com<br />
                  <strong>Phone:</strong> +91 9876543210<br />
                  <strong>Address:</strong> 123 Business Street, Tirupur, Tamil Nadu 641604<br />
                  <strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Policy Updates</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to update this refund policy at any time. Changes will be effective immediately upon posting on our website. Please review this policy periodically for updates.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;