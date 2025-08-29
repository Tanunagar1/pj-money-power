// Unsplash or static images for blog selection
const splashImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
// ...existing code...
];
// tyEntry interface for loan eligibility submissions
interface EligibilityEntry {
  name: string;
  income: string;
  expenses: string;
  workType: string;
  eligible: 'Eligible' | 'Not Eligible';
}

import { BACKEND_BASE_URL } from '../backend';
import { CreditScoreStatsBoxes } from '../components/CreditScoreStatsBoxes';
import { RefillCreditBox } from '../components/RefillCreditBox';
import { CreditScoreSubmissionsTable } from '../components/CreditScoreSubmissionsTable';
// url 
const image_URL = 'https://app.pjmoneypower.com/';
// LoansPendingTable component
const LoansPendingTable: React.FC = () => {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [error, setError] = useState<string>('');
  const [rawResponse, setRawResponse] = useState<unknown>(null);
  const [docModal, setDocModal] = useState<{ url: string; type: string } | null>(null);
  useEffect(() => {
  fetch(`https://app.pjmoneypower.com/api/loan-apply/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async res => {
        const data = await res.json();
        setRawResponse(data);
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data && Array.isArray(data.data)) {
          setRequests(data.data);
        } else {
          setError('Response is not an array.');
          setRequests([]);
        }
      })
      .catch(err => {
        setError('Fetch error: ' + err);
        setRequests([]);
      });
  }, []);
  const pending = requests.filter(req => !req.status || req.status.toLowerCase() === 'pending');
  if (error) return <div className="text-red-600 font-bold">Error: {error}<br/>Raw response: <pre>{JSON.stringify(rawResponse, null, 2)}</pre></div>;
  if (!pending.length) return <div>No pending loan requests.</div>;
  return (
    <div className="overflow-x-auto w-full bg-white rounded-2xl shadow-lg p-4 border border-yellow-100">
      <table className="min-w-[1150px] w-full border text-sm md:text-base rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Name</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Mobile</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Type of Loan</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Email</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Aadhaar</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">PAN</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Photo</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Bank Passbook</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Loan Amount</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Location</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((req: LoanRequest, idx: number) => (
            <tr key={idx} className="even:bg-blue-50 hover:bg-blue-100 transition-colors">
              <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.l_name}>{req.l_name}</td>
                <td className="p-3 border whitespace-nowrap max-w-[140px] truncate" title={req.user?.phone_number}>{req.user?.phone_number || '-'}</td>
              <td className="p-3 border whitespace-nowrap max-w-[140px] truncate" title={req.loan_type || '-'}>{req.loan_type || '-'}</td>
              <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.email || '-'}>{req.email || '-'}</td>
              <td className="p-3 border whitespace-nowrap max-w-[160px] truncate" title={req.aadhaar_photo}>
                {req.aadhaar_photo ? (
                  <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.aadhaar_photo || '', type: 'Aadhaar' })}>View Document</button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.pan_photo}>
                {req.pan_photo ? (
                  <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.pan_photo || '', type: 'PAN' })}>View Document</button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-3 border whitespace-nowrap max-w-[100px] truncate text-center">
                {req.profile_photo ? (
                  <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.profile_photo || '', type: 'Photo' })}>View Document</button>
                ) : (
                  <span className="text-gray-400">No Photo</span>
                )}
              </td>
              <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.bank_passbook_photo}>
                {req.bank_passbook_photo ? (
                  <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.bank_passbook_photo || '', type: 'Bank Passbook' })}>View Document</button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.loan_amount}>{req.loan_amount || '-'}</td>
              <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.location}>{req.location || '-'}</td>
              <td className="p-3 border whitespace-nowrap text-yellow-600 font-bold">Pending</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Document Modal */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold" onClick={() => setDocModal(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{docModal.type} Document</h2>
            <img src={image_URL + docModal.url} alt={docModal.type + ' Document'} className="max-w-full max-h-[60vh] mx-auto mb-4 border rounded" />
          </div>
        </div>
      )}
    </div>
  );
};



const navItems = [
  'Dashboard',
  'Users',
  'Loans Provided',
  'Loans Pending',
  'Credit Score Checker',
  'Loan Eligibility',
  'Loan Requests',
  'Support',
  'Blog',
];



import React, { useState, useEffect } from 'react';
// DashboardStats component to fetch and show user and loan stats from backend
const DashboardStats: React.FC = () => {
  // Dashboard stats: total users, loans provided, loans pending
  const [stats, setStats] = useState({
    totalUsers: 0,
    loansProvided: 0,
    loansPending: 0,
  });
  // ...existing code...
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    // Fetch total users from /api/all_counts/, loansProvided and loansPending from /api/loan-apply/
    Promise.all([
  fetch(`https://app.pjmoneypower.com/api/all_counts/`).then(res => res.json()),
  fetch(`https://app.pjmoneypower.com/api/loan-apply/`).then(res => res.json())
    ])
      .then(([countsData, loansData]) => {
        let loansProvided = 0;
        let loansPending = 0;
        let loansArr: LoanRequest[] = [];
        if (Array.isArray(loansData)) {
          loansArr = loansData;
        } else if (loansData && Array.isArray(loansData.data)) {
          loansArr = loansData.data;
        }
        loansProvided = loansArr.filter(l => l.status === 'approved').length;
        loansPending = loansArr.filter(l => !l.status || l.status.toLowerCase() === 'pending').length;
        // Use total_users if available and > 0, else use login_users.length
        let totalUsers = 0;
        if (typeof countsData.total_users === 'number' && countsData.total_users > 0) {
          totalUsers = countsData.total_users;
        } else if (Array.isArray(countsData.login_users)) {
          totalUsers = countsData.login_users.length;
      
        }
        setStats(prev => ({
          ...prev,
          totalUsers,
          loansProvided,
          loansPending,
        }));
        // ...existing code...
        setLoading(false);
      })
      .catch(err => {
        setError('Fetch error: ' + err);
        setLoading(false);
      });
  }, []);
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow p-8 text-center border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800">Total Users</h2>
          <p className="text-3xl mt-4 font-extrabold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow p-8 text-center border border-green-200">
          <h2 className="text-xl font-semibold text-green-800">Loans provided</h2>
          <p className="text-3xl mt-4 font-extrabold text-green-600">{stats.loansProvided}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl shadow p-8 text-center border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800">Loans Pending</h2>
          <p className="text-3xl mt-4 font-extrabold text-yellow-600">{stats.loansPending}</p>
        </div>
         
      </div>
      {/* ...existing code... */}
    </>
  );
};
import { useNavigate } from 'react-router-dom';

// User type for all user data in admin panel

// UsersTable component to show name and mobile from localStorage, with improved filter UI and highlight

const UsersTable: React.FC = () => {
  // Fetch login users and total user count from /api/all_counts/
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  useEffect(() => {
  fetch(`https://app.pjmoneypower.com/api/all_counts/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.login_users)) {
          setUsers(data.login_users);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Fetch error: ' + err);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Error: {error}</h2>
    </div>
  );
  // Filter users by name or mobile
  const filteredUsers = users.filter(u => {
    const name = (u.name || u.full_name || u.username || '').toLowerCase();
    const mobile = (u.mobile || u.phone_number || u.mobileNumber || u.phone || '').toLowerCase();
    return name.includes(filter.toLowerCase()) || mobile.includes(filter.toLowerCase());
  });
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Login Users</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          className="border border-blue-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Filter by name or mobile..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full border rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Name</th>
              <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td className="p-3 border text-center" colSpan={2}>No login users found.</td></tr>
            ) : (
              filteredUsers.map((u, idx) => {
                const name = u.name || u.full_name || u.username || '-';
                const mobile = u.mobile || u.phone_number || u.mobileNumber || u.phone || '-';
                return (
                  <tr key={idx} className="even:bg-blue-50 hover:bg-blue-100 transition-colors">
                    <td className="p-3 border whitespace-nowrap max-w-[180px] truncate text-center" title={name}>{name}</td>
                    <td className="p-3 border whitespace-nowrap max-w-[140px] truncate text-center" title={mobile}>{mobile}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Loan Reguest
interface LoanRequest {
id: number;
name?: string;
  email?: string;
  mobile?: string;
  loan_type?: string;
  aadhaar_photo?: string;
  pan_photo?: string;
  profile_photo?: string;
  bank_passbook_photo?: string;
  loan_amount?: string;
  location: string;
  status?: string;
}


// LoansProvidedTable component with refresh capability
import { forwardRef, useImperativeHandle } from 'react';
const LoansProvidedTable = forwardRef((_, ref) => {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [filter, setFilter] = useState('');
  const [docModal, setDocModal] = useState<{ url: string; type: string } | null>(null);
  const fetchApproved = () => {
    fetch(`https://app.pjmoneypower.com/api/loan-apply/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        let arr: LoanRequest[] = [];
        if (Array.isArray(data)) {
          arr = data;
        } else if (data && Array.isArray(data.data)) {
          arr = data.data;
        }
        // Filter approved and sort: no email first, then with email
        const approved = arr.filter((req: LoanRequest) => req.status === 'approved');
        approved.sort((a, b) => {
          if (!!a.email === !!b.email) return 0;
          return a.email ? 1 : -1;
        });
        setRequests(approved);
      })
      .catch(() => setRequests([]));
  };
  useImperativeHandle(ref, () => ({ refresh: fetchApproved }));
  useEffect(() => { fetchApproved(); }, []);
  if (!requests.length) return <div className="text-gray-500 text-lg p-8 text-center">No loans provided.</div>;
  // Filter requests by name, mobile, or location
  const filteredRequests = requests.filter(req => {
    const name = (req.l_name || req.name || '').toLowerCase();
    const mobile = (req.user?.phone_number || req.mobile || '').toLowerCase();
    const location = (req.location || '').toLowerCase();
    return (
      name.includes(filter.toLowerCase()) ||
      mobile.includes(filter.toLowerCase()) ||
      location.includes(filter.toLowerCase())
    );
  });
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Loans Approved</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          className="border border-green-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Filter by name, mobile, or location..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-green-50">
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Name</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Mobile</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Aadhaar</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">PAN</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Photo</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Bank Passbook</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Loan Amount</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Location</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Send</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Status</th>
              <th className="p-3 border font-semibold text-green-900 whitespace-nowrap">Print</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req, idx) => {
              const handlePrint = () => {
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                if (!printWindow) return;
                // Use full image_URL for all document links
                const aadhaarUrl = req.aadhaar_photo ? (image_URL + req.aadhaar_photo) : '';
                const panUrl = req.pan_photo ? (image_URL + req.pan_photo) : '';
                const photoUrl = req.profile_photo ? (image_URL + req.profile_photo) : '';
                const bankUrl = req.bank_passbook_photo ? (image_URL + req.bank_passbook_photo) : '';
                printWindow.document.write(`
                  <html><head><title>Loan Details</title>
                  <style>
                    body { font-family: Arial, sans-serif; padding: 24px; }
                    h2 { color: #15803d; }
                    table { border-collapse: collapse; width: 100%; margin-top: 16px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background: #bbf7d0; }
                  </style>
                  </head><body>
                  <h2>Loan Provided Details</h2>
                  <table>
                    <tr><th>Name</th><td>${req.l_name || '-'}</td></tr>
                    <tr><th>Mobile</th><td>${req.user?.phone_number || '-'}</td></tr>
                    <tr><th>Aadhaar</th><td>${aadhaarUrl ? `<a href='${aadhaarUrl}' target='_blank'>View Document</a>` : '-'}</td></tr>
                    <tr><th>PAN</th><td>${panUrl ? `<a href='${panUrl}' target='_blank'>View Document</a>` : '-'}</td></tr>
                    <tr><th>Photo</th><td>${photoUrl ? `<a href='${photoUrl}' target='_blank'>View Document</a>` : '-'}</td></tr>
                    <tr><th>Bank Passbook</th><td>${bankUrl ? `<a href='${bankUrl}' target='_blank'>View Document</a>` : '-'}</td></tr>
                    <tr><th>Loan Amount</th><td>${req.loan_amount || '-'}</td></tr>
                    <tr><th>Location</th><td>${req.location || '-'}</td></tr>
                    <tr><th>Status</th><td>Approved</td></tr>
                  </table>
                  </body></html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
              };
              return (
                <tr key={idx} className="even:bg-green-50 hover:bg-green-100 transition-colors">
                  <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.l_name}>{req.l_name}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[140px] truncate" title={req.user?.phone_number}>{req.user?.phone_number || '-'}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[160px] truncate" title={req.aadhaar_photo}
                  >{req.aadhaar_photo ? (
                    <button className="text-green-600 hover:underline" onClick={() => setDocModal({ url: req.aadhaar_photo || '', type: 'Aadhaar' })}>View Document</button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.pan_photo}
                  >{req.pan_photo ? (
                    <button className="text-green-600 hover:underline" onClick={() => setDocModal({ url: req.pan_photo || '', type: 'PAN' })}>View Document</button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[100px] truncate text-center">
                    {req.profile_photo ? (
                      <button className="text-green-600 hover:underline" onClick={() => setDocModal({ url: req.profile_photo || '', type: 'Photo' })}>View Document</button>
                    ) : (
                      <span className="text-gray-400">No Photo</span>
                    )}
                  </td>
                  <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.bank_passbook_photo}>
                    {req.bank_passbook_photo ? (
                      <button className="text-green-600 hover:underline" onClick={() => setDocModal({ url: req.bank_passbook_photo || '', type: 'Bank Passbook' })}>View Document</button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.loan_amount}>{req.loan_amount || '-'}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.location}>{req.location || '-'}</td>
                  <td className="p-3 border text-green-600 font-bold">
                    {req.email ? (
                      <a
                        href={`mailto:${req.email}?subject=Loan%20Approval%20from%20PJ%20Money%20Power&body=Dear%20User,%0A%0AThis%20is%20to%20inform%20you%20regarding%20your%20loan%20application.%0A%0ARegards,%0Ainfo@pjmoneypower.com`}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold shadow transition duration-150"
                        title="Send email from info@pjmoneypower.com"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0l-4-4m4 4l-4 4" /></svg>
                        Send Email
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 border text-green-600 font-bold">Approved</td>
                  <td className="p-3 border text-center">
                    <button onClick={handlePrint} className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold shadow transition duration-150" title="Print Details">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18H4a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v9a2 2 0 01-2 2h-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 14h12v7H6z" /></svg>
                      Print
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Document Modal */}
        {docModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold" onClick={() => setDocModal(null)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">{docModal.type} Document</h2>
              <img src={image_URL + docModal.url} alt={docModal.type + ' Document'} className="max-w-full max-h-[60vh] mx-auto mb-4 border rounded" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});



// SupportTable component to show contact messages
interface ContactMessage {
  full_name: string;
  email: string;
  phone_number: string;
  message: string;
  created_at?: string;
}

const SupportTable: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  useEffect(() => {
  fetch(`https://app.pjmoneypower.com/api/support-messages/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          setMessages(result.data);
        } else {
          setMessages([]);
        }
      })
      .catch(() => setMessages([]));
  }, []);
  if (!messages.length) return <div>No support messages found.</div>;
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Full Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Phone Number</th>
          <th className="p-2 border">Message</th>
          <th className="p-2 border">Submitted At</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((msg, idx) => (
          <tr key={idx}>
            <td className="p-2 border">{msg.full_name}</td>
            <td className="p-2 border">{msg.email || '-'}</td>
            <td className="p-2 border">{msg.phone_number || '-'}</td>
            <td className="p-2 border">{msg.message || '-'}</td>
            <td className="p-2 border">{msg.created_at ? new Date(msg.created_at).toLocaleString() : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


const AdminPanel: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState(navItems[0]);
  const navigate = useNavigate();

  // Ref for LoansProvidedTable
  const loansProvidedRef = React.useRef<{refresh: () => void}>(null);
  // Callback to refresh Loans Provided after approval
  const handleLoanStatusChange = () => {
    if (loansProvidedRef.current) {
      loansProvidedRef.current.refresh();
    }
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col py-8 px-4 fixed top-0 left-0 h-full z-20 shadow-xl border-r border-blue-200">
        <div className="mb-12">
          <div className="flex items-center mb-10">
            <div className="w-16 h-16 flex items-center justify-center bg-white bg-opacity-80 rounded-full shadow-lg mr-3 border-2 border-blue-200">
              <img src="/LOGO.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-2xl font-extrabold tracking-wide">Admin Panel</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <div
                key={item}
                className={`px-5 py-3 rounded-lg cursor-pointer font-semibold flex items-center gap-2 transition-all duration-200 ${selectedSection === item ? 'bg-white text-blue-800 shadow font-bold border-l-4 border-blue-500' : 'hover:bg-blue-700 hover:text-white'}`}
                onClick={() => setSelectedSection(item)}
              >
                <span className="text-lg">{item}</span>
              </div>
            ))}
            <button
              className="w-full mt-10 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold shadow transition-all duration-200"
              onClick={() => navigate('/')}
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 ml-64 overflow-y-auto max-h-screen">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-10 tracking-tight drop-shadow">Admin Dashboard</h1>
        <div className="space-y-8">
          {selectedSection === 'Support' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Support Messages</h2>
              <SupportTable />
            </div>
          )}
          {selectedSection === 'Dashboard' && (
            <DashboardStats />
          )}
          {selectedSection === 'Users' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
              <UsersTable />
            </div>
          )}
          {selectedSection === 'Loans Provided' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
              <LoansProvidedTable ref={loansProvidedRef} />
            </div>
          )}
          {selectedSection === 'Loans Pending' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-100">
              <h2 className="text-2xl font-bold mb-4 text-yellow-700">Loans Pending</h2>
              <LoansPendingTable />
            </div>
          )}
            {selectedSection === 'Credit Score Checker' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Credit Score Checker</h2>
                <RefillCreditBox />
                <CreditScoreStatsBoxes />
                <CreditScoreSubmissionsTable />
              </div>
            )}
          {selectedSection === 'Loan Eligibility' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
              <LoanEligibilityTable />
            </div>
          )}
          {selectedSection === 'Loan Requests' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Loan Requests</h2>
              <div className="overflow-x-auto w-full">
                <LoanRequestsTable onStatusChange={handleLoanStatusChange} />
              </div>
            </div>
          )}
          {selectedSection === 'Blog' && <BlogAdminPanel />}
        </div>
      </main>
    </div>
  );
};





const LoanRequestsTable: React.FC<{onStatusChange?: () => void}> = ({onStatusChange}) => {
  const [docModal, setDocModal] = useState<{ url: string; type: string } | null>(null);
  // Always use loginUser.name and loginUser.mobile for Name and Mobile columns
  const [loginUser, setLoginUser] = useState<{ name: string; mobile: string }>({ name: '', mobile: '' });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setLoginUser({
          name: userObj.name || '',
          mobile: userObj.mobile || ''
        });
      }
    }
  }, []);

  const getDisplayName = () => {
    return loginUser && loginUser.name && loginUser.name.trim() ? loginUser.name : '-';
  };
  const getDisplayMobile = () => {
    return loginUser && loginUser.mobile && loginUser.mobile.trim() ? loginUser.mobile : '-';
  };

  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [actionLoading, setActionLoading] = useState<{[id:number]: boolean}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
  fetch(`https://app.pjmoneypower.com/api/loan-apply/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data && Array.isArray(data.data)) {
          setRequests(data.data);
        } else {
          setRequests([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setRequests([]);
        setLoading(false);
      });
  };

  const updateStatus = (id: number, status: string) => {
    setActionLoading(prev => ({...prev, [id]: true}));
  fetch(`https://app.pjmoneypower.com/api/loan-apply/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
      .then(async res => {
        try {
          await res.json();
        } catch {
          // ignore
        }
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        setActionLoading(prev => ({...prev, [id]: false}));
        if (onStatusChange) onStatusChange();
      })
      .catch(() => {
        setActionLoading(prev => ({...prev, [id]: false}));
      });
  };

  if (loading) return <div>Loading...</div>;
  if (!requests.length) return <div>No loan requests found.</div>;

  return (
    <div>
      <table className="min-w-[1150px] w-full border text-sm md:text-base">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Name </th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Mobile </th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Type of Loan</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Email</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Aadhaar</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">PAN</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Photo</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Bank Passbook</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Loan Amount</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Location</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Status</th>
            <th className="p-3 border font-semibold text-blue-900 whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests
            .filter((req: LoanRequest) => req.status !== 'approved')
            .map((req: LoanRequest, idx: number) => {
              const isActionDisabled = req.status === 'approved' || req.status === 'rejected' || actionLoading[req.id];
              return (
                <tr key={req.id || idx} className="even:bg-blue-50 hover:bg-blue-100 transition-colors">
                  <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.l_name}>{req.l_name}</td>
                <td className="p-3 border whitespace-nowrap max-w-[140px] truncate" title={req.user?.phone_number}>{req.user?.phone_number || '-'}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[140px] truncate" title={req.loan_type || '-'}>{req.loan_type || '-'}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.email || '-'}>{req.email || '-'}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[160px] truncate" title={req.aadhaar_photo}>
                    {req.aadhaar_photo ? (
                      <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.aadhaar_photo || '', type: 'Aadhaar' })}>View Document</button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.pan_photo}>
                    {req.pan_photo ? (
                      <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.pan_photo || '', type: 'PAN' })}>View Document</button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 border whitespace-nowrap max-w-[100px] truncate text-center">
                    {req.profile_photo ? (
                      <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.profile_photo || '', type: 'Photo' })}>View Document</button>
                    ) : (
                      <span className="text-gray-400">No Photo</span>
                    )}
                  </td>
                  <td className="p-3 border whitespace-nowrap max-w-[180px] truncate" title={req.bank_passbook_photo}>
                    {req.bank_passbook_photo ? (
                      <button className="text-blue-600 hover:underline" onClick={() => setDocModal({ url: req.bank_passbook_photo || '', type: 'Bank Passbook' })}>View Document</button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  {/* Document Modal */}
                
                  {docModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold" onClick={() => setDocModal(null)}>&times;</button>
                        <h2 className="text-xl font-bold mb-4">{docModal.type} Document</h2>
                        <img src={image_URL + docModal.url} alt={docModal.type + ' Document'} className="max-w-full max-h-[60vh] mx-auto mb-4 border rounded" />
                      </div>
                    </div>
                  )}
                  <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.loan_amount}>{req.loan_amount || '-'}</td>
                  <td className="p-3 border whitespace-nowrap max-w-[120px] truncate" title={req.location}>{req.location || '-'}</td>
                  <td className={"p-3 border whitespace-nowrap font-bold " + (req.status === 'approved' ? 'text-green-600' : req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600')}>{req.status || 'Pending'}</td>
                  <td className="p-3 border whitespace-nowrap">
                    <button className="px-3 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600" onClick={() => updateStatus(req.id, 'approved')} disabled={isActionDisabled}>Approve</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => updateStatus(req.id, 'rejected')} disabled={isActionDisabled}>Reject</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

// CreditScoreSubmissionsTable component
interface CreditScoreSubmission {
  fullName: string;
  mobileNumber: string;
  panNumber: string;
  
  creditScore: string;
}


// LoanEligibilityTable component
const LoanEligibilityTable: React.FC = () => {
  const [eligibilityData, setEligibilityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');


  useEffect(() => {
  fetch(`https://app.pjmoneypower.com/api/loan-eligibility/`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, },
      credentials: 'include',
    })
      .then(async res => {
        let result;
        try {
          result = await res.json();
          console.log(result)
        } catch (e) {
          setEligibilityData([]);
          setError('Failed to parse backend response.');
          setLoading(false);
          return;
        }
        if (result.success && Array.isArray(result.data)) {
          setEligibilityData(result.data);
        } else {
          setEligibilityData([]);
          setError('No eligibility submissions found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setEligibilityData([]);
        setError('Failed to fetch eligibility data.');
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 font-bold">Error: {error}</div>;
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Loan Eligibility Details</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Mobile Number</th>
            <th className="p-2 border">Monthly Income </th>
            <th className="p-2 border">Monthly Expenses </th>
            <th className="p-2 border">Work Type</th>
            <th className="p-2 border">Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {eligibilityData.length === 0 ? (
            <tr><td className="p-2 border text-center" colSpan={6}>No eligibility submissions found.</td></tr>
          ) : (
            eligibilityData.map((entry: any, idx: number) => (
              <tr key={idx}>
                <td className="p-2 border">{entry.full_name || entry.name || '-'}</td>
                <td className="p-2 border">{entry.user?.phone_number || '-'}</td>
                <td className="p-2 border">{entry.monthly_income}</td>
                <td className="p-2 border">{entry.monthly_expense}</td>
                <td className="p-2 border">{entry.work_type}</td>
                <td className={"p-2 border font-bold " + (entry.eligibility_status === 'Eligible' ? 'text-green-600' : 'text-red-600')}>{entry.eligibility_status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
  {/* Debug field removed as requested */}
    </div>
  );
};

// BlogAdminPanel and helpers
// Add this above your AdminPanel component in AdminPanel.tsx

const BlogAdminPanel: React.FC = () => {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [form, setForm] = React.useState<Partial<BlogPost>>({});
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [uploadError, setUploadError] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  // Fetch blogs from backend
  React.useEffect(() => {
    setLoading(true);
    fetch(`https://app.pjmoneypower.com/api/blogs/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        else if (data && Array.isArray(data.data)) setPosts(data.data);
        else setPosts([]);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (img: string) => {
    setSelectedImage(img);
    setForm({ ...form, image: img });
    setUploadError('');
  };

  // Handle file upload and convert to data URL (for preview only)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
        setForm({ ...form, image: reader.result });
        setUploadError('');
      }
    };
    reader.onerror = () => setUploadError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!form.title || !form.summary || !form.author || !selectedImage) {
      setErrorMsg('All fields and an image are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://app.pjmoneypower.com/api/blogs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authentication headers if needed
        },
        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          author: form.author,
          image: selectedImage, // Unsplash URL or base64 string
          date: new Date().toISOString().split('T')[0],
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        setSuccessMsg('Blog post created!');
        // Refetch posts
        fetch(`https://app.pjmoneypower.com/api/blogs/`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setPosts(data);
            else if (data && Array.isArray(data.data)) setPosts(data.data);
          });
        setForm({});
        setSelectedImage('');
      } else {
        setErrorMsg(data.message || 'Failed to create blog post.');
      }
    } catch (err) {
      setErrorMsg('Failed to create blog post.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-200">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Blog Management</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title <span className="text-red-500">*</span></label>
          <input name="title" value={form.title || ''} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Summary <span className="text-red-500">*</span></label>
          <textarea name="summary" value={form.summary || ''} onChange={handleChange} required className="border rounded px-3 py-2 w-full" rows={3} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Author <span className="text-red-500">*</span></label>
          <input name="author" value={form.author || ''} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Select Image <span className="text-red-500">*</span></label>
          <div className="flex gap-3 overflow-x-auto pb-2 mb-2">
            {splashImages.map((img, idx) => (
              <img
                key={img}
                src={img + '?w=200&h=120&fit=crop'}
                alt={`Unsplash ${idx}`}
                className={`w-32 h-20 object-cover rounded border-4 cursor-pointer ${selectedImage === img ? 'border-purple-500' : 'border-transparent'}`}
                onClick={() => handleImageSelect(img)}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="block" />
            {uploadError && <span className="text-red-500 text-sm">{uploadError}</span>}
          </div>
          {selectedImage && (
            <div className="mt-3">
              <span className="block text-xs text-gray-500 mb-1">Selected Image Preview:</span>
              <img src={selectedImage} alt="Selected" className="w-40 h-24 object-cover rounded border" />
            </div>
          )}
        </div>
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700" disabled={loading}>
          {loading ? "Posting..." : "Add Blog Post"}
        </button>
        {successMsg && <div className="text-green-600 font-semibold mt-2">{successMsg}</div>}
        {errorMsg && <div className="text-red-600 font-semibold mt-2">{errorMsg}</div>}
      </form>
      <h3 className="text-xl font-semibold mb-4">All Blog Posts</h3>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-gray-500">No blog posts yet.</div>
        ) : (
          posts.map((post, idx) => (
            <div key={idx} className="border rounded-lg p-4 flex gap-4 items-center bg-purple-50">
              <img src={post.image} alt="Blog" className="w-28 h-20 object-cover rounded" />
              <div>
                <div className="font-bold text-lg">{post.title}</div>
                <div className="text-gray-700 mb-1">{post.summary}</div>
                <div className="text-sm text-gray-500">By {post.author} | {post.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
