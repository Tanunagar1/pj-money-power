import React from 'react';

export function RefillCreditBox() {
  // Placeholder for refill logic
  const handleRefill = () => {
    alert('Refill request submitted! (Implement backend logic)');
  };
  return (
    <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow p-6 text-center border border-green-200 mb-6">
      <h3 className="text-lg font-semibold text-green-800 mb-2">Refill Your Credit</h3>
      <p className="mb-4 text-green-700">Need more credit? Click below to request a refill.</p>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition"
        onClick={handleRefill}
      >
        Request Credit Refill
      </button>
    </div>
  );
}
