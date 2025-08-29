import React, { useState, useRef } from 'react';
import { BACKEND_BASE_URL } from '../backend';
// import { saveUserToLocalStorage } from '../utils/saveUserToLocalStorage';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [step, setStep] = useState<'input' | 'otp' | 'name'>('input');
  const [input, setInput] = useState(''); // mobile only
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');


  // Send OTP using /register/ endpoint
  const sendOtp = async (mobile: string, name: string) => {
  const response = await fetch(`https://app.pjmoneypower.com/api/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: mobile, name }),
    });
    if (!response.ok) throw new Error('Failed to send OTP');
    // Optionally handle response data
  };

  // Verify OTP using /verify/ endpoint
  const verifyOtp = async (mobile: string, otp: string, name: string) => {
  const response = await fetch(`https://app.pjmoneypower.com/api/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: mobile, otp, name }),
    });
    if (!response.ok) {
      let msg = 'Invalid OTP or input';
      try {
        const data = await response.json();
        if (data && data.error) msg = data.error;
        else if (data && data.message) msg = data.message;
      } catch {}
      throw new Error(msg);
    }
    // Optionally handle response data
    const data = await response.json();
    console.log(data)
    localStorage.setItem('access_token', data.access_token);
    
    // Save access token in localStorage
    if (data?.access_token) {
      localStorage.setItem('access_token', data.access_token);
      console.log(localStorage.setItem('access_token', data.access_token))
    } else {
      throw new Error('No access token received from server');
    }
  };
  const navigate = useNavigate();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { setUser } = useAuth();

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter your mobile number.');
      return;
    }
    // Admin login: if mobile number is 9944264799, show password prompt
    if (trimmed === '9944264799') {
      const password = prompt('Enter admin password:');
      if (password === 'admin@123') {
        navigate('/admin');
        return;
      } else {
        setError('Incorrect admin password!');
        return;
      }
    }
    // Validate mobile only
    const isMobile = /^([6-9]\d{9})$/.test(trimmed); // Indian mobile numbers start with 6-9
    if (!isMobile) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
  const response = await fetch(`https://app.pjmoneypower.com/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: trimmed, name: name.trim() }),
      });
      const data = await response.json();
      if (data.already_registered && data.loan_data) {
        // If name does not match, show error
        if (data.loan_data.l_name && data.loan_data.l_name !== name.trim()) {
          setError(`You are already registered as ${data.loan_data.l_name}. Please use the same name.`);
          return;
        }
      }
      setStep('otp');
    } catch {
      setError('Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleOtpChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
    if (!value && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await verifyOtp(input, otpValue, name.trim()); // send name as well
  setUser({ name: name.trim(), mobile: input });
  localStorage.setItem('authUser', JSON.stringify({ name: name.trim(), mobile: input }));
      navigate('/'); // Directly log in after OTP verification
    } catch (err: any) {
      setError(err.message || 'Invalid OTP or input.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
  setUser({ name: trimmedName, mobile: input });
  localStorage.setItem('authUser', JSON.stringify({ name: trimmedName, mobile: input }));
  navigate('/');
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      await sendOtp(input, name.trim());
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
      <div className="max-w-md w-full relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl inline-block mb-4">
              PJ Money Power
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {step === 'input' && (
            <form onSubmit={handleInputSubmit} className="space-y-6">
              <div>
                <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="input"
                  name="input"
                  value={input}
                  onChange={e => setInput(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your 10-digit mobile number"
                  maxLength={10}
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  maxLength={40}
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </motion.button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Enter OTP sent to <span className="font-semibold">{input}</span>
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => (otpRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-2xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-blue-600 hover:underline disabled:opacity-50 text-sm font-semibold"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </motion.button>
            </form>
          )}

          {step === 'name' && (
            <div className="text-center text-gray-500 text-sm">Name entry step removed after OTP verification.</div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;