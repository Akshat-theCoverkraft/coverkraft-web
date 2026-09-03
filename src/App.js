//
import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { setupOnMessageListener } from "./fcm";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";

import Login from "./LoginModule/Login";
import Register from "./LoginModule/Register";
import Landing from "./Landing/Landing";
import Vault from "./Vault/Vault";
import AddPolicy from "./Vault/component/AddPolicy";
import ProfileDrawer from "./component/profile";
import MotorPolicyForm from "./Vault/policyForms/MotorPolicyForm";
import HealthPolicyForm from "./Vault/policyForms/HealthPolicyForm";
import LifePolicyForm from "./Vault/policyForms/LifePolicyForm";
import TravelPolicyForm from "./Vault/policyForms/TravelPolicyForm";
import RuralPolicyForm from "./Vault/policyForms/RuralPolicyForm";
import TravelSOSDetails from "./Vault/component/TravelSOSDetails";
import Family from "./profile/Family";
import About from "./About/About";
import NotificationPage from "./Notification/Notification";
import BlogDetails from "./Landing/component/blogs/BlogDetails";
import Feeds from "./Landing/component/blogs/Feeds";
import PrivacyPolicy from "./PrivacyPolicy";
import LegalPoliciesPage from "../src/pages/LegalPoliciesPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import PolicyType from "./Landing/component/PolicyType";
import PolicyDetails from "./pages/Policies/PolicyDetails.jsx";
import UniversalHomeButton from "./component/UniversalHomeButton.jsx";
import GmailSyncPage from "./Vault/component/GmailSyncPage.jsx";
import BackToTop from "./component/BackToTop.js";
import { PolicyProvider } from "./store/policyContext.js";
import LeaderShip from "./About/LeaderShip.js";
import JoinUs from "./pages/JoinUs.jsx";
import PlayStoreTesting from "./pages/PlayStoreTesting.jsx";
import PospLogin from "./pages/PospLogin.jsx";
import ProductsRouter from "./component/ProductsRouter.jsx";
import InsurancePage from "./component/InsurancePage.jsx";
import CarThirdParty from "./component/CarThirdParty.jsx";
import ProductDetail from "./component/ProductDetail.jsx";
import InsuranceCategoryPage from "./component/InsuranceCategoryPage.jsx";
import Claim from "./pages/Claim/Claim.jsx";
import NotFound from "./component/NotFound";


function App() {
  useEffect(() => {
    console.log("window.location.hostname ", window.location.hostname )
  if (window.location.hostname === "thecoverkraft.com") {
    window.location.href =
      "https://www.thecoverkraft.com" +
      window.location.pathname +
      window.location.search;
  }
}, []);



  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setupOnMessageListener();
  }, []);

  useEffect(() => {
    const SESSION_DURATION = 48 * 60 * 60 * 1000; // 48 hours
    const excludedPages = ["", "/login", "/register"];

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const loginTime = sessionStorage.getItem("loginTime");

    const handleLogout = () => {
      sessionStorage.clear();
      setLogout(true);
      setIsLoggedIn(false);
      navigate("/");
    };

    const now = Date.now();

    if (!excludedPages.includes(window.location.pathname)) {
      if (loginTime) {
        const loginTimestamp = parseInt(loginTime, 10);
        const timeElapsed = now - loginTimestamp;

        if (timeElapsed > SESSION_DURATION) {
          console.warn("⏰ Session expired.");
          handleLogout();
        } else {
          setIsLoggedIn(true);
          const remainingTime = SESSION_DURATION - timeElapsed;

          const logoutTimer = setTimeout(() => {
            console.warn("⏰ Auto-logout due to session expiry.");
            handleLogout();
          }, remainingTime);

          return () => clearTimeout(logoutTimer);
        }
      } else {
        console.warn("🚫 loginTime not found. Assuming not logged in.");
      }
    }
  }, []);

  const handleRefresh = () => {
    const excludedPages = ["", "/login"];
    if (!excludedPages.includes(window.location.pathname)) {
      setLogout(true);
      setIsLoggedIn(false);
    }
  };

  const ScrollToTop = () => {
    const { pathname } = window.location;

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <HelmetProvider>
      <ToastContainer position="top-center" />
      <Toaster position="top-right" reverseOrder={false} />
      <UniversalHomeButton />
      <ScrollToTop />
      <BackToTop />

      <PolicyProvider>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/joinUs" element={<JoinUs />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/motor-policy" element={<MotorPolicyForm />} />
          <Route path="/health-policy" element={<HealthPolicyForm />} />
          <Route path="/life-policy" element={<LifePolicyForm />} />
          <Route path="/travel-policy" element={<TravelPolicyForm />} />
          <Route path="/accident-policy" element={<RuralPolicyForm type="accident" />} />
          <Route path="/crop-policy" element={<RuralPolicyForm type="crop" />} />
          <Route path="/cattle-policy" element={<RuralPolicyForm type="cattle" />} />
          <Route path="/travel-sos/:id" element={<TravelSOSDetails />} />
          <Route path="/add-policy" element={<AddPolicy />} />
          <Route path="/profile" element={<ProfileDrawer />} />
          <Route path="/family" element={<Family />} />
          <Route path="/about" element={<About />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/feed/:type" element={<Feeds />} />
          <Route path="/feed/:type/:id" element={<BlogDetails />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal" element={<LegalPoliciesPage />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/policy-type" element={<PolicyType />} />
          <Route path="/policy-details/:id" element={<PolicyDetails />} />
          <Route path="/gmail-sync" element={<GmailSyncPage />} />
          <Route path="/posp-login" element={<PospLogin />} />
          <Route path="/Our-LeaderShip" element={<LeaderShip />} />
          <Route path="/user-deletion" element={<PlayStoreTesting />} />
          <Route path="/products" element={<ProductsRouter />} />
          <Route path="/products/:slug" element={<ProductsRouter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PolicyProvider>
    </HelmetProvider>
  );
}

export default App;
