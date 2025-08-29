import React, { useState, useEffect } from 'react';

const CreditScoreChecker: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');

  // Step 1: initiate session
  const handleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setReport(null);
    setRedirectUrl('');
    setTransactionId('');

    try {
      const res = await fetch(`https://app.pjmoneypower.com/api/sdk-session/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          mobile_number: mobileNumber,
          pan_number: panNumber || undefined,
        }),
      });
      const data = await res.json();
      const cToken = data.c_token ?? null;
      if (res.status === 201 && data.redirect_url) {
        
        setRedirectUrl(data.redirect_url);
        window.location.href = data.redirect_url;
       // setRedirectUrl(data.redirect_url);
        //setTransactionId(data.transaction_id || '');
        
        if (cToken) {
       localStorage.setItem('deepvue_c_token', cToken);
     }
        setMessage('Session initiated successfully!');
      } else {
        setError(data.message || 'Failed to initiate session.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: download report
  const handleDownloadReport = async () => {
    if (!transactionId) return;
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const url = `https://sdk.deepvue.ai/v1/credit-report/equifax?session_id=${transactionId}&signature=YOUR_SIGNATURE&redirect_uri=https://www.google.com/&mobile_number=${mobileNumber}&full_name=${fullName}`;

      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch report');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Try to get filename from headers
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'credit_report.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setMessage('Report downloaded successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to download report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 40%, #81d4fa 80%, #fffde4 100%)`,
        position: 'relative',
        padding: 0,
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-80px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, #00bcd4 60%, transparent 100%)',
          borderRadius: '50%',
          zIndex: 0,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-220px',
          right: '-100px',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, #388e3c 60%, transparent 100%)',
          borderRadius: '50%',
          zIndex: 0,
          opacity: 0.2,
        }}
      />

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-10 relative z-10 mb-0">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-green-700 tracking-tight">
          Credit Score Checker
        </h2>

        <form onSubmit={handleSession} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-2 border-green-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Mobile Number</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="border-2 border-green-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              maxLength={10}
              placeholder="Enter your mobile number"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">PAN Number (optional)</label>
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className="border-2 border-green-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              maxLength={10}
              placeholder="ABCDE1234F"
            />
          </div>

          {message && <div className="text-green-600 text-sm text-center font-medium">{message}</div>}
          {error && <div className="text-red-600 text-sm text-center font-medium">{error}</div>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-green-700 transition duration-150 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Initiate Session'}
          </button>
        </form>

        {redirectUrl && (
          <div className="mt-8 text-center">
            <div className="text-green-700 font-semibold mb-2">Session created! Redirect user to:</div>
            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline break-all text-lg"
            >
              {redirectUrl}
            </a>

            <div className="mt-4">
              <button
                onClick={handleDownloadReport}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-150 disabled:opacity-60"
                disabled={loading || !transactionId}
              >
                {loading ? 'Downloading...' : 'Download Credit Report'}
              </button>
            </div>
          </div>
        )}

        {report && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4 text-green-700">Credit Report</h3>
            <pre className="bg-gray-100 p-6 rounded-lg text-xs overflow-x-auto border border-green-200">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditScoreChecker;
