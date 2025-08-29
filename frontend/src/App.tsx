// Export backend base URL for use in other files
export { BACKEND_BASE_URL } from './backend';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import CreditScoreChecker from './pages/CreditScoreChecker';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Footer from './components/Footer';
import WhatsAppPopup from './components/WhatsAppPopup';
import { AuthProvider } from './contexts/AuthContext';
import AdminPanel from './pages/AdminPanel';
import back from './vite-env';

function App() {
  return (
    
    <AuthProvider>
      
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-white">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/credit-score-checker" element={<CreditScoreChecker />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                    
                  </Routes>
                </main>
                <Footer />
                <WhatsAppPopup />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;