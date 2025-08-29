// Credit Score Gauge Component
const CreditScoreGauge: React.FC<{ score?: string | null }> = ({ score }) => {
  const minScore = 300;
  const maxScore = 900;
  const value = score ? Math.max(minScore, Math.min(maxScore, parseInt(score))) : minScore;
  const percent = ((value - minScore) / (maxScore - minScore)) * 100;
  const angle = percent * 1.8; // 180deg max
  // Color logic
  let color = '#ef4444'; // red
  if (value >= 750) color = '#22c55e'; // green
  else if (value >= 600) color = '#facc15'; // yellow

  return (
    <div style={{ width: 220, margin: '0 auto' }}>
      <svg viewBox="0 0 220 120" width="220" height="120">
        {/* Background arc */}
        <path d="M20,110 A90,90 0 0,1 200,110" fill="none" stroke="#e5e7eb" strokeWidth="16" />
        {/* Foreground arc */}
        <path
          d="M20,110 A90,90 0 0,1 200,110"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * percent) / 100}
          style={{ transition: 'stroke-dashoffset 1s' }}
        />
        {/* Score text */}
        <text x="110" y="80" textAnchor="middle" fontSize="32" fontWeight="bold" fill={color}>{score ?? 'N/A'}</text>
        <text x="110" y="105" textAnchor="middle" fontSize="16" fill="#374151">Credit Score</text>
      </svg>
    </div>
  );
};
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, CreditCard } from 'lucide-react';

// Stepper component
type StepperProps = {
  userMobile: string;
};

const Stepper: React.FC<StepperProps> = ({ userMobile }) => {
  const [status, setStatus] = React.useState<'none' | 'submitted' | 'approved' | 'called'>('none');
  const [loading, setLoading] = React.useState(true);
  const [loanType, setLoanType] = React.useState<string>('');

  React.useEffect(() => {
    if (!userMobile) return;

    fetch(`https://www.pjmoneypower.com/api/loan-apply/?mobile=${encodeURIComponent(userMobile)}`)
      .then(res => res.json())
      .then(data => {
        const requests = Array.isArray(data) ? data : (data.data || []);
        const userReq = [...requests].reverse().find((r: any) => r.mobile === userMobile);
        if (!userReq) {
          setStatus('none');
          setLoading(false);
          return;
        }
        setLoanType(userReq.loan_type || '');
        if (!userReq.status || userReq.status === 'submitted') {
          setStatus('submitted');
          setLoading(false);
          return;
        }

        fetch(`https://www.pjmoneypower.com/api/loan-apply/${userReq.id}/`)
          .then(res2 => res2.json())
          .then(detail => {
            setLoanType(detail.loan_type || '');
            if (detail.status === 'called') setStatus('called');
            else if (detail.status === 'approved') setStatus('approved');
            else setStatus('submitted');
            setLoading(false);
          })
          .catch(() => {
            setStatus('none');
            setLoading(false);
          });
      })
      .catch(() => {
        setStatus('none');
        setLoading(false);
      });
  }, [userMobile]);

  const steps = [
    { label: 'Loan Submitted', key: 'submitted' },
    { label: 'Loan Approved', key: 'approved' },
    { label: 'Admin Called', key: 'called' },
  ];

  const getStepClass = (stepKey: string) => {
    const order: Record<string, number> = { submitted: 0, approved: 1, called: 2 };
    const current = order[status];
    const stepIdx = order[stepKey];
    if (stepIdx < current) return 'bg-green-500 text-white';
    if (stepIdx === current && status !== 'none') return 'bg-blue-600 text-white';
    return 'bg-gray-200 text-gray-500';
  };

  if (loading) return <p className="text-gray-600">Loading application status...</p>;
  if (status === 'none') return <p className="text-gray-600">No active applications</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={step.key}>
            <div className={`flex flex-col items-center`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${getStepClass(step.key)}`}>
                {idx + 1}
              </div>
              <span className="text-xs text-center w-20">{step.label}</span>
            </div>
            {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-1 ${getStepClass(steps[idx + 1].key)}`}></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center mt-2">
        {status === 'submitted' && <span className="text-blue-700 font-semibold">Your Loan Form is submitted successfully.</span>}
        {status === 'approved' && <span className="text-green-700 font-semibold">Your loan for <b>{loanType}</b> is Approved! Wait for the call.</span>}
        {status === 'called' && <span className="text-green-700 font-semibold">Admin has called you. Process complete.</span>}
      </div>
    </div>
  );
};

// Main Profile component
const Profile: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

    const navigate = (window as any).navigate || null;
    // If using react-router-dom v6, use: import { useNavigate } from 'react-router-dom'; const navigate = useNavigate();
  const [creditScore, setCreditScore] = React.useState<string | null>(null);
  const [loadingScore, setLoadingScore] = React.useState(true);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [walletError, setWalletError] = React.useState<string | null>(null);

    // Download credit score as text file
    const handleDownloadCreditScore = () => {
      if (!creditScore) return;
      const blob = new Blob([
        `Credit Score: ${creditScore}\nUser: ${user?.name}\nMobile: ${user?.mobile}`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'credit_score.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

  // Get transaction_id from URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txId = params.get('transaction_id');
    if (txId) {
      console.log('Transaction ID:', txId);
      setTransactionId(txId);
    }
  }, [location.search]);

  // Fetch DeepVue Credit Report
  React.useEffect(() => {
  if (!transactionId) return;

  const cToken = localStorage.getItem('deepvue_c_token');
  if (!cToken) {
    console.warn('No DeepVue c_token found in localStorage');
    setWalletError('Missing authentication token');
    setLoadingScore(false);
    return;
  }

  const apiUrl = `https://production.deepvue.tech/v2/financial-services/credit-bureau/credit-report/sdk/report?transaction_id=${transactionId}`;
  const headers = {
    'Authorization': `Bearer ${cToken}`,
    'x-api-key': 'dc05a0787a244d6486dde44aafc906de',
    'Content-Type': 'application/json',
  };

  fetch(apiUrl, { method: 'GET', headers })
    .then(res => res.json())
    .then(data => {
      console.log('DeepVue Credit Report JSON:', data); // <-- console log
      
  const score = data.data?.credit_score ?? data.creditScore ?? data?.credit?.score ?? null;
  if (score !== null) setCreditScore(score.toString());
      setLoadingScore(false);
    })
    .catch(err => {
      console.error('Error fetching credit report from DeepVue:', err);
      setWalletError('Failed to fetch credit report');
      setLoadingScore(false);
    });
}, [transactionId]);


  // Fallback: Local API credit score
  React.useEffect(() => {
    if (!user?.mobile) return;
    fetch(`https://app.pjmoneypower.com/api/credit/list/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const entry = Array.isArray(data) ? data.find((item: any) => item.mobile_number === user.mobile) : null;
        if (!creditScore && entry?.credit_score) setCreditScore(entry.credit_score.toString());
        setLoadingScore(false);
      })
      .catch(() => setLoadingScore(false));
  }, [user?.mobile]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              <p className="text-gray-600">ID: {user.name}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <User size={20} className="text-blue-600" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone size={20} className="text-blue-600" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <p className="text-gray-900">+91 {user.mobile}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <CreditCard size={20} className="text-blue-600" />
                <div style={{ width: '100%' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Score</label>
                  {loadingScore ? (
                    <p className="text-gray-900">Loading...</p>
                  ) : walletError ? (
                    <p className="text-red-600">{walletError}</p>
                  ) : (
                    <span className="text-lg font-bold text-blue-900">{creditScore ?? 'Not available'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper */}
            {user.mobile && <div className="mt-10"><Stepper userMobile={user.mobile} /></div>}
           
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
            <div className="rounded-xl shadow-lg p-6 bg-gradient-to-r from-blue-100 via-blue-50 to-white border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <CreditCard size={24} className="text-blue-600" /> Quick Actions
              </h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="mb-2 font-semibold text-blue-800">Your Latest Credit Score</div>
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <CreditScoreGauge score={creditScore} />
                    </div>
                    <span className="text-lg font-bold text-blue-900">
                      {creditScore ? `Score: ${creditScore}` : 'No score available'}
                    </span>
                      {creditScore && (
                        <button
                          className="mt-2 px-4 py-1 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                          onClick={handleDownloadCreditScore}
                        >
                          Download Credit Score
                        </button>
                      )}
                  </div>
                </div>
                
                {/* Navigation for credit score checker */}
                <button
                  className="mt-2 px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition-colors"
                  onClick={() => {
                    if (typeof navigate === 'function') {
                      navigate('/credit-score-checker');
                    } else {
                      window.location.href = '/credit-score-checker';
                    }
                  }}
                >
                  Go to Credit Score Checker
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
