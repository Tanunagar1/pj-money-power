import React, { useState } from 'react';
import logo from '../../public/LOGO.png';
import { useAuth } from '../contexts/AuthContext';
import { BACKEND_BASE_URL } from '../backend';

// Hide scrollbar utility for Chrome, Safari, Opera, Firefox, Edge
const hideScrollbarStyle = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
if (typeof document !== 'undefined' && !document.getElementById('hide-scrollbar-style')) {
  const style = document.createElement('style');
  style.id = 'hide-scrollbar-style';
  style.innerHTML = hideScrollbarStyle;
  document.head.appendChild(style);
}

interface LoanApplicationModalProps {
  show: boolean;
  onClose: () => void;
}

const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({ show, onClose }) => {
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Replace with your actual login logic
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [form, setForm] = useState({
    email: '',
    loanType: '',
    aadhar: null as File | null,
    pan: null as File | null,
    photo: null as File | null,
    loanAmount: '',
    bankPassbook: null as File | null,
    location: ''
  });

  // Loan type and amount ranges
  const loanTypeOptions = [
    { label: 'Unsecured Business', value: 'Unsecured Business', min: 500000, max: 50000000, display: '5 lakhs to 5 crore' },
    { label: 'Housing', value: 'Housing', min: 1000000, max: 100000000, display: '10 lakhs to 10 crore' },
    { label: 'Mortgage', value: 'Mortgage', min: 1000000, max: 1000000000, display: '10 lakhs to 100 crore' },
    { label: 'Personal', value: 'Personal', min: 100000, max: 5000000, display: '1 lakh to 50 lakh' },
    { label: 'Others', value: 'Others', min: 100000, max: 100000000, display: '1 lakh to 10 crore' },
  ];

  const getSelectedLoanType = () => loanTypeOptions.find(opt => opt.value === form.loanType) || loanTypeOptions[0];
  const selectedLoanType = getSelectedLoanType();
  const [notification, setNotification] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & HTMLSelectElement;
    if (files && files.length > 0) {
      setForm({ ...form, [name]: files[0] });
    } else {
      // If changing loanType, reset loanAmount to min of new type
      if (name === 'loanType') {
        const newType = loanTypeOptions.find(opt => opt.value === value);
        setForm({ ...form, loanType: value, loanAmount: newType ? newType.min.toString() : '' });
      } else if (name === 'loanAmount') {
        // Clamp value to allowed range
        let num = parseInt(value, 10) || selectedLoanType.min;
        if (num < selectedLoanType.min) num = selectedLoanType.min;
        if (num > selectedLoanType.max) num = selectedLoanType.max;
        setForm({ ...form, [name]: num.toString() });
      } else {
        setForm({ ...form, [name]: value });
      }
    }
  };

  const handleLocationFetch = () => {
    setLocationLoading(true);
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            let area = '';
            let city = '';
            let district = '';
            let state = '';
            let country = '';
            if (data.address) {
              area = data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || data.address.hamlet || '';
              city = data.address.city || data.address.town || data.address.village || '';
              district = data.address.county || data.address.state_district || '';
              state = data.address.state || '';
              country = data.address.country || '';
            }
            const locationString = [area, city, district, state, country].filter(Boolean).join(', ');
            setForm((prev) => ({ ...prev, location: locationString || `${latitude}, ${longitude}` }));
          } catch {
            setForm((prev) => ({ ...prev, location: `${latitude}, ${longitude}` }));
            setLocationError('Could not fetch area/city name.');
          }
          setLocationLoading(false);
        },
        () => {
          setLocationError('Unable to fetch location. Please allow location access.');
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare form data for backend with correct field mapping
    const formData = new FormData();
    const fieldMap: Record<string, string> = {
      aadhar: 'aadhaar_photo',
      pan: 'pan_photo',
      bankPassbook: 'bank_passbook_photo',
      photo: 'profile_photo',
      loanAmount: 'loan_amount',
      loanType: 'loan_type',
    };
    // Add username and mobile from context
    formData.append('l_name', user?.name || '');
    formData.append('phone_number', user?.mobile || '');
    Object.entries(form).forEach(([key, value]) => {
      const backendKey = fieldMap[key] || key;
      if (key === 'loanAmount') {
        // Ensure loanAmount is a valid decimal string
        const decimalValue = Number(value);
        formData.append(backendKey, decimalValue ? decimalValue.toFixed(2) : '0.00');
      } else if (value instanceof File) {
        formData.append(backendKey, value);
      } else {
        formData.append(backendKey, value as string);
      }
    });
    // If you have user context, add mobile from user context here
  fetch(`https://app.pjmoneypower.com/api/loan-apply/`, {
      method: 'POST',
      body: formData,
      // credentials: 'include', // Uncomment if using session authentication
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit application');
        return res.json();
      })
      .then(() => {
        setNotification('Your request is sent, our team will reach you soon.');
        setForm({ email: '', loanType: '', aadhar: null, pan: null, photo: null, loanAmount: '', bankPassbook: null, location: '' });
        setTimeout(() => {
          onClose();
          setNotification('');
        }, 2500);
      })
      .catch(() => {
        setNotification('Failed to submit application. Please try again.');
      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-row p-0 relative overflow-hidden"
        style={{ minWidth: 900 }}
      >
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold transition z-10" onClick={onClose}>&times;</button>
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center w-full h-full py-8">
            <h2 className="text-2xl font-bold mb-2 text-blue-700">Login Required</h2>
            <p className="mb-6 text-gray-600">Please login to apply for a loan.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition" onClick={handleLogin}>Go to Login</button>
          </div>
        ) : (
          <form
            className="flex flex-row w-full h-full"
            onSubmit={handleSubmit}
            style={{ minHeight: 0 }}
          >
            {/* Left: Title and Info */}
            <div className="bg-gradient-to-b from-blue-100 via-white to-blue-50 rounded-l-2xl px-8 py-10 flex flex-col items-center justify-center border-r w-1/3 min-w-[320px]">
              <img src={logo} alt="Logo" className="w-24 h-24 object-contain mb-4 drop-shadow-lg" />
              <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">Loan Application</h2>
              <p className="text-gray-500 text-base text-center">
                Welcome,<br/>
                <span className="font-extrabold text-blue-700 text-2xl block mt-2 mb-2 tracking-wide">{user?.name || ''}</span>
                Fill the details to apply for a loan.<br/>All fields are required.
              </p>
              {form.photo && form.photo instanceof File && (
                <div className="mt-8 flex flex-col items-center">
                  <span className="text-gray-700 text-sm mb-2">Photo Preview</span>
                  <img src={URL.createObjectURL(form.photo)} alt="Preview" className="w-28 h-28 object-cover rounded shadow border" />
                </div>
              )}
            </div>
            {/* Right: Form Fields */}
            <div className="flex-1 overflow-y-auto px-10 py-10 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Type of Loan</label>
                  <select name="loanType" value={form.loanType} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Loan Type</option>
                    {loanTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {form.loanType && (
                    <div className="text-xs text-blue-700 mt-1">Allowed: {selectedLoanType.display}</div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Aadhaar Card (Upload)</label>
                  <input type="file" name="aadhar" accept="image/*,.pdf" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
                  <input type="file" name="photo" accept="image/*" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">PAN Card (Upload)</label>
                  <input type="file" name="pan" accept="image/*,.pdf" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Bank Passbook (Upload)</label>
                  <input type="file" name="bankPassbook" accept="image/*,.pdf" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2 items-center justify-center">
                  <label className="block text-sm font-medium text-gray-700 text-center">Loan Amount</label>
                  <div className="flex items-center gap-4 w-full max-w-md justify-center">
                    <input
                      type="range"
                      name="loanAmount"
                      min={selectedLoanType.min}
                      max={selectedLoanType.max}
                      step={selectedLoanType.min < 1000000 ? 10000 : 100000}
                      value={form.loanAmount || selectedLoanType.min}
                      onChange={handleChange}
                      required
                      className="w-full accent-blue-600"
                    />
                    <input
                      type="number"
                      name="loanAmount"
                      min={selectedLoanType.min}
                      max={selectedLoanType.max}
                      step={selectedLoanType.min < 1000000 ? 10000 : 100000}
                      value={form.loanAmount || selectedLoanType.min}
                      onChange={handleChange}
                      required
                      className="w-36 px-2 py-1 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-semibold"
                    />
                    <span className="font-semibold text-blue-700 min-w-[120px]">₹ {Number(form.loanAmount || selectedLoanType.min).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Range: ₹ {selectedLoanType.min.toLocaleString()} - ₹ {selectedLoanType.max.toLocaleString()}</div>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Current Location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Current Location (auto or manual)"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly={locationLoading}
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      onClick={handleLocationFetch}
                      disabled={locationLoading}
                    >
                      {locationLoading ? 'Locating...' : 'Pick Location'}
                    </button>
                  </div>
                  {locationError && <div className="text-red-600 text-sm mt-1">{locationError}</div>}
                </div>
              </div>
              <div className="pt-8">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Submit Application</button>
                {notification && <div className="mt-6 text-green-600 text-center font-semibold text-lg animate-pulse">{notification}</div>}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationModal;


