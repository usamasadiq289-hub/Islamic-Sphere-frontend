import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import EmotionBase from "./pages/EmotionBase"; // Import EmotionBase component
import { AuthProvider } from './context/AuthContext';
import Groups from "./pages/Groups"; // Add this import
import GroupDetails from "./pages/GroupDetails"; // Add this import
import Profile from "./pages/Profile"; // Add this import
import QnA from "./pages/QnA"; // Add this import
import Events from "./pages/Events"; // Add this import
import LearningPath from "./pages/LearningPath"; // Add this import
import AdminEvents from "./pages/AdminEvents";
import Prayer from './pages/Prayer'; // Add this import
import Zakat from './pages/Zakat'; // Add this import
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import FAQ from "./pages/FAQ";
import LearnMore from "./pages/LearnMore";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import About from "./pages/About";
import Chatbot from "./pages/Chatbot";
import ResendCode from "./pages/ResendCode";
import { Toaster } from 'sonner';
import SendCode from "./pages/SendCode";
import HajjUmrah from './pages/Hajj&Umrah';
import QuranicStudies from './pages/QuranicStudies';
import IslamicCharacter from './pages/IslamicCharacter';
import QuranReader from './pages/QuranReader';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/login" element={<Login />} /> {/* Login page */}
          <Route path="/signup" element={<Signup />} /> {/* Signup page */}
          <Route path="/aura-scanner" element={<EmotionBase />} />{" "}
          <Route path="/groups" element={<Groups />} /> {/* Add this route */}
          <Route path="/groups/:groupId" element={<GroupDetails />} /> {/* Add this route */}
          <Route path="/profile" element={<Profile />} /> {/* Add this route */}
          <Route path="/qna" element={<QnA />} /> {/* Add this route */}
          <Route path="/events" element={<Events />} /> {/* Add this route */}
          <Route path="/learning-path" element={<LearningPath />} /> {/* Add this route */}
          <Route path="/admin-events" element={<AdminEvents />} /> {/* Add this route */}
          <Route path="/learn/prayer" element={<Prayer />} /> {/* Add this route */}
          <Route path="/learn/zakat" element={<Zakat />} /> {/* Add this route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/faq" element={<FAQ />} /> {/* Add this route */}
          <Route path="/learn-more" element={<LearnMore />} /> {/* Add this route */}
          <Route path="/terms-of-service" element={<TermsOfService />} /> {/* Add this route */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* Add this route */}
          <Route path="/contact" element={<Contact />} /> {/* Add this route */}
          <Route path="/support" element={<Support />} /> {/* Add this route */}
          <Route path="/about" element={<About />} /> {/* Add this route */}
          <Route path="/chat" element={<Chatbot />} /> {/* Add this route */}
          <Route path="/resend-code" element={<ResendCode />} />
          <Route path="/send-code" element={<SendCode />} />
          <Route path="/learn/hajj" element={<HajjUmrah />} />
          <Route path="/learn/hajj/:topic" element={<HajjUmrah />} />
            <Route path="/learn/quran" element={<QuranicStudies />} />
            <Route path="/learn/quran/:topic" element={<QuranicStudies />} />
            <Route path="/learn/character" element={<IslamicCharacter />} />
            <Route path="/learn/character/:topic" element={<IslamicCharacter />} />
            <Route path="/learn/quran-reader" element={<QuranReader />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </AuthProvider>
  );
};

export default App;
