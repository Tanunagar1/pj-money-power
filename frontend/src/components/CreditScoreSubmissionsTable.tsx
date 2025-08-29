
import React, { useEffect, useState } from 'react';

interface CreditScoreSubmission {
  fullName: string;
  mobileNumber: string;
  panNumber: string;
  creditScore: string;
}

export function CreditScoreSubmissionsTable() {
  const [submissions, setSubmissions] = useState<CreditScoreSubmission[]>([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetch('https://app.pjmoneypower.com/api/credit-report/')
      .then(res => res.json())
      .then(data => {
        // Assume data.data is an array of credit reports
        const reports = Array.isArray(data.data) ? data.data : [];
        const mapped = reports.map((item: any) => ({
          fullName: item.full_name || '',
          mobileNumber: item.mobile_number || '',
          panNumber: item.pan || '',
          creditScore: item.credit_score ? item.credit_score.toString() : '',
        }));
        setSubmissions(mapped);
      })
      .catch(() => setSubmissions([]));
  }, []);

  const filtered = submissions.filter(sub => {
    const name = (sub.fullName || '').toLowerCase();
    const mobile = (sub.mobileNumber || '').toLowerCase();
    const pan = (sub.panNumber || '').toLowerCase();
    const score = (sub.creditScore || '').toLowerCase();
    const f = filter.toLowerCase();
    return (
      name.includes(f) ||
      mobile.includes(f) ||
      pan.includes(f) ||
      score.includes(f)
    );
  });

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 mt-6">
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          className="border border-blue-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Filter by name, mobile, PAN, email, or score..."
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Full Name</th>
              <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Mobile Number</th>
              <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">PAN Number</th>
              {/* Removed Email column as API does not provide it */}
              <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Credit Score</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={5} className="p-3 border text-center">No credit score submissions found.</td></tr>
            ) : (
              paged.map((sub, idx) => (
                <tr key={idx} className="even:bg-blue-50 hover:bg-blue-100 transition-colors">
                  <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={sub.fullName}>{sub.fullName}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[140px] truncate" title={sub.mobileNumber}>{sub.mobileNumber}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={sub.panNumber}>{sub.panNumber}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={sub.email}>{sub.email}</td>
                  <td
                    className={`p-3 border whitespace-nowrap max-w-[80px] truncate text-center font-bold ${parseInt(sub.creditScore, 10) > 750 ? 'text-green-600' : 'text-red-600'}`}
                    title={sub.creditScore}
                  >
                    {sub.creditScore}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-blue-200 text-blue-800 font-bold disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="font-semibold">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-blue-200 text-blue-800 font-bold disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
