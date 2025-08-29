import React from 'react';

export function CreditScoreStatsBoxes() {
  const [used, setUsed] = React.useState(0);
  const [available, setAvailable] = React.useState(0);
  const [totalCredit, setTotalCredit] = React.useState(0);
  const [totalUsedCredit, setTotalUsedCredit] = React.useState(0);
  React.useEffect(() => {
    let submissions: any[] = [];
    if (typeof window !== 'undefined') {
      submissions = JSON.parse(localStorage.getItem('creditScoreSubmissions') || '[]');
    }
    let totalUsed = 0;
    let totalAvailable = 0;
    let totalCreditSum = 0;
    let totalUsedCreditSum = 0;
    submissions.forEach((sub: any) => {
      const score = parseInt(sub.creditScore, 10);
      if (!isNaN(score)) {
        totalUsed += score;
        totalAvailable += 900 - score;
        totalCreditSum += 900;
        totalUsedCreditSum += score;
      }
    });
    setUsed(totalUsed);
    setAvailable(totalAvailable);
    setTotalCredit(totalCreditSum);
    setTotalUsedCredit(totalUsedCreditSum);
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow p-6 text-center border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800">Total Credit</h3>
        <p className="text-2xl mt-2 font-extrabold text-blue-600">{totalCredit}</p>
      </div>
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow p-6 text-center border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800">Available Credit</h3>
        <p className="text-2xl mt-2 font-extrabold text-blue-600">{available}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow p-6 text-center border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800">Total Used Credit</h3>
        <p className="text-2xl mt-2 font-extrabold text-purple-600">{totalUsedCredit}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow p-6 text-center border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800">Used Credit</h3>
        <p className="text-2xl mt-2 font-extrabold text-purple-600">{used} / {available}</p>
      </div>
    </div>
  );
}
