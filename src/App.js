import React, { useState, useEffect } from "react";
import './App.css';
import { requestFCMPermission, setupOnMessageListener } from "./fcm"; // 💡 New clean file
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Login from "./LoginModule/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./LoginModule/Register";
import { registerFirebaseSW } from './fcm'; // Import your FCM functions
// or './fcm' depending on where you put them
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import Landing from "./Landing/Landing";
import Vault from "./Vault/Vault";
import AddPolicy from "./Vault/component/AddPolicy";
import EditPolicy from "./Vault/component/EditPolicy";
import ProfileDrawer from "./component/profile";
import MotorPolicyForm from "./Vault/policyForms/MotorPolicyForm";
import HealthPolicyForm from "./Vault/policyForms/HealthPolicyForm";
import LifePolicyForm from "./Vault/policyForms/LifePolicyForm";
import Family from "./profile/Family";
import About from "./About/About";
import NotificationPage from "./Notification/Notification";
import BlogDetails from "./Landing/component/blogs/BlogDetails";
import Feeds from "./Landing/component/blogs/Feeds";
import PrivacyPolicy from "./PrivacyPolicy"
import BackToTop from "./component/BackToTop";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logout, setLogout] = useState(false)
  const navigate = useNavigate()
  // Removed top-level await; handled in useEffect below

useEffect(() => {
  setupOnMessageListener();
}, []);

  useEffect(() => {
    const setupFCM = async () => {
      try {
        const registration = await registerFirebaseSW();
        const token = await requestFCMPermission(registration);

        if (!token) {
          console.warn("❌ No FCM token received.");
        }
        // TODO: send token to your backend if needed
      } catch (err) {
        console.error("💥 FCM Init Error:", err);
      }
    };

    setupFCM();
  }, []);

  useEffect(() => {
    let logoutTimer;
    let loginTime;
    if (loginTime) {
      const resetTimer = () => {
        if (logoutTimer) clearTimeout(logoutTimer);
        const excludedPages = ['/coverkraft', '/coverkraft/login'];
        if (!excludedPages.includes(window.location.pathname)) {
          logoutTimer = setTimeout(() => {
            handleLogout();
          }, 30 * 60 * 1000);
        }
      };
    } else {
      handleRefresh();
    }
  }, []);

  const handleLogout = () => {
    setLogout(true)
    setIsLoggedIn(false)
    navigate("/coverkraft")
  }

  const handleRefresh = () => {
    const excludedPages = ['/coverkraft', '/coverkraft/login'];
    if (!excludedPages.includes(window.location.pathname)) {
      setLogout(true)
      setIsLoggedIn(false)
      navigate("/coverkraft")
    }
  }

  return (
    <>
      <ToastContainer />
      <Toaster position="top-right" reverseOrder={false} />
      {/* This stuff can go wherever appropriate in layout */}
      <BackToTop />

      <Routes>
        <Route path='/coverkraft' element={<Landing />} />
        <Route path='/coverkraft/register' element={<Register />} />
        <Route path='/coverkraft/login' element={<Login />} />
        <Route path='/coverkraft/vault' element={<Vault />} />
        <Route path="/coverkraft/motor-policy" element={<MotorPolicyForm />} />
        <Route path="/coverkraft/health-policy" element={<HealthPolicyForm />} />
        <Route path="/coverkraft/life-policy" element={<LifePolicyForm />} />
        <Route path='/coverkraft/add-policy' element={<AddPolicy />} />
        <Route path='/coverkraft/edit-policy' element={<EditPolicy />} />
        <Route path='/coverkraft/profile' element={<ProfileDrawer />} />
        <Route path='/coverkraft/family' element={<Family />} />
        <Route path="/coverkraft/about" element={<About />} />
        <Route path="/coverkraft/notification" element={<NotificationPage />} />
        <Route path="/coverkraft/feed/:type" element={<Feeds />} />
        <Route path="/coverkraft/feed/:type/:id" element={<BlogDetails />} />
        <Route path='/coverkraft/privacypolicy' element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
}

export default App;
