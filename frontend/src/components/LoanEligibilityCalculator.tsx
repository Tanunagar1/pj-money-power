import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Make sure you have this context

interface LoanEligibilityCalculatorProps {
  onClose: () => void;
}

const LoanEligibilityCalculator: React.FC<LoanEligibilityCalculatorProps> = ({ onClose }) => {
  const { user } = useAuth(); // Logged-in user from context

  const [eligibilityForm, setEligibilityForm] = useState({
    name: '',
    income: '',
    expenses: '',
    workType: '',
    eligible: '' as '' | 'Eligible' | 'Not Eligible',
  });

  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  // Fill the name field with logged-in user's full name
  useEffect(() => {
    if (user && user.name) {
      setEligibilityForm((prev) => ({ ...prev, name: user.name }));
    } else {
      // fallback: check localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setEligibilityForm((prev) => ({ ...prev, name: userObj.name || '' }));
      }
    }
  }, [user]);

  const handleEligibilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEligibilityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEligibilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://app.pjmoneypower.com/api/loan-eligibility/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: eligibilityForm.name,
          monthly_income: Number(eligibilityForm.income),
          monthly_expense: Number(eligibilityForm.expenses),
          work_type: eligibilityForm.workType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setEligibilityResult(data.error || 'Error');
        return;
      }

      setEligibilityForm((prev) => ({ ...prev, eligible: data.data?.eligibility_status }));
      setEligibilityResult(data.data?.eligibility_status);

      // Save submissions in localStorage
      const prevSubmissions = JSON.parse(localStorage.getItem('loanEligibilitySubmissions') || '[]');
      localStorage.setItem(
        'loanEligibilitySubmissions',
        JSON.stringify([
          ...prevSubmissions,
          {
            name: eligibilityForm.name,
            income: eligibilityForm.income,
            expenses: eligibilityForm.expenses,
            workType: eligibilityForm.workType,
            eligible: data.data?.eligibility_status,
          },
        ])
      );
    } catch (error) {
      setEligibilityResult('Error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Loan Eligibility_Calculator</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleEligibilitySubmit}>
          <input
            type="text"
            name="name"
            value={eligibilityForm.name}
            readOnly
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
            required
          />
          <input
            type="number"
            name="income"
            value={eligibilityForm.income}
            onChange={handleEligibilityChange}
            placeholder="Monthly Income (₹)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1"
          />
          <input
            type="number"
            name="expenses"
            value={eligibilityForm.expenses}
            onChange={handleEligibilityChange}
            placeholder="Monthly Expenses (₹)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1"
          />
          <select
            name="workType"
            value={eligibilityForm.workType}
            onChange={handleEligibilityChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Work Type</option>
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Business Owner">Business Owner</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Calculate Eligibility
          </button>
        </form>
        {eligibilityResult && (
          <div
            className={`mt-4 text-center font-bold ${
              eligibilityResult === 'Eligible' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {eligibilityResult === 'Eligible'
              ? 'Congratulations! You are eligible for a loan.'
              : 'Sorry, you are not eligible for a loan.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanEligibilityCalculator;
