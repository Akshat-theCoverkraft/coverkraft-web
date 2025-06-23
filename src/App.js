import React, { useState, useEffect } from "react";
import './App.css';
// import { requestFCMPermission, setupOnMessageListener } from "./fcm"; // 💡 New clean file
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import "./App.css";
// import { requestFCMPermission, setupOnMessageListener } from "./fcm"; // 💡 New clean file
import Login from "./LoginModule/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./LoginModule/Register";
// import { registerFirebaseSW } from './fcm'; // Import your FCM functions
import { registerFirebaseSW } from "./fcm"; // Import your FCM functions
// or './fcm' depending on where you put them
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
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
import PrivacyPolicy from "./PrivacyPolicy";
import BackToTop from "./component/BackToTop";
import LegalPoliciesPage from "../src/pages/LegalPoliciesPage.jsx"; // adjust path
import ContactUs from "./pages/ContactUs.jsx";
import PolicyType from './Landing/component/PolicyType';
import PolicyDetails from './pages/PolicyDetails';
import UniversalHomeButton from "./component/UniversalHomeButton.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();
  // Removed top-level await; handled in useEffect below


  // useEffect(() => {
  //   setupOnMessageListener();
  // }, []);

  // useEffect(() => {
  //   const setupFCM = async () => {
  //     try {
  //       const registration = await registerFirebaseSW();
  //       const token = await requestFCMPermission(registration);

  //       if (!token) {
  //         console.warn("❌ No FCM token received.");
  //       }
  //       // TODO: send token to your backend if needed
  //     } catch (err) {
  //       console.error("💥 FCM Init Error:", err);
  //     }
  //   };

  //   setupFCM();
  // }, []);

  useEffect(() => {
    let logoutTimer;
    let loginTime;
    if (loginTime) {
      const resetTimer = () => {
        if (logoutTimer) clearTimeout(logoutTimer);
        const excludedPages = ["", "/login"];
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
    setLogout(true);
    setIsLoggedIn(false);
    navigate("");
  };

  const handleRefresh = () => {
    const excludedPages = ["", "/login"];
    if (!excludedPages.includes(window.location.pathname)) {
      setLogout(true);
      setIsLoggedIn(false);
      navigate("");
    }
  };

  return (
    <>
      <ToastContainer />
      <Toaster position="top-right" reverseOrder={false} />
      {/* This stuff can go wherever appropriate in layout */}
      <BackToTop />
      <UniversalHomeButton />

      <Routes>
        <Route path="" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/motor-policy" element={<MotorPolicyForm />} />
        <Route
          path="/health-policy"
          element={<HealthPolicyForm />}
        />
        <Route path="/life-policy" element={<LifePolicyForm />} />
        <Route path="/add-policy" element={<AddPolicy />} />
        <Route path="/edit-policy" element={<EditPolicy />} />
        <Route path="/profile" element={<ProfileDrawer />} />
        <Route path="/family" element={<Family />} />
        <Route path="/about" element={<About />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/feed/:type" element={<Feeds />} />
        <Route path="/feed/:type/:id" element={<BlogDetails />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path='/privacypolicy' element={<PrivacyPolicy />} />
        <Route path="/legal" element={<LegalPoliciesPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/policy-type" element={<PolicyType />} />
        <Route path="/policy-details/:id" element={<PolicyDetails />} />
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
