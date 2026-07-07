import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { GLOBAL_CSS, T } from "./tokens";

// ── Pages ────────────────────────────────────────────────────────────────────
import HomePage       from "./pages/HomePage";
import NewClaimWizard from "./pages/Newclaimwizard";
import TrackClaimPage from "./pages/Trackclaimpage";
import AdvisoryPage   from "./pages/Advisorypage";
import DocumentsPage  from "./pages/Documentspage";
import TravelClaimPage from "./pages/TravelClaimPage";

// ── Shared UI ────────────────────────────────────────────────────────────────
import Toast from "./Toast";
import Navbar from "../../component/Navbar";

export default function CoverKraft() {
  const location = useLocation();
  const locationState = location.state || {};
  const [page,  setPage]  = useState(locationState.page || "home");
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });
  
  const loggedIn = useMemo(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  }, []);

  function navigate(id) {
    setPage(id);
    window.scrollTo(0, 0);
  }

  function showToast(msg, type = "") {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }

  return (
    <>
           <Navbar />
    <div style={{ background: T.bg, color: T.text, lineHeight: 1.6, minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Navigation Logic */}
      {page === "home"        && <HomePage       navigate={navigate} loggedIn={loggedIn} />}
      {page === "new-claim"   && <NewClaimWizard navigate={navigate} showToast={showToast} />}
      {page === "track-claim" && <TrackClaimPage navigate={navigate} />}
      {page === "advisory"    && <AdvisoryPage   navigate={navigate} />}
      {page === "documents"   && <DocumentsPage  navigate={navigate} />}
      {page === "travel-claim" && <TravelClaimPage navigate={navigate} locationState={locationState} />}
      
      {/* Fallback for Login Page */}
      {page === "login" && (
        <div style={{ padding: 100, textAlign: "center" }}>
          <div style={{ background: T.bgCard, padding: 40, borderRadius: 16, border: `1px solid ${T.border}`, display: "inline-block" }}>
            <h2 style={{ marginBottom: 12 }}>Login Required</h2>
            <p style={{ color: T.muted, marginBottom: 24 }}>Please sign in to intimate a claim.</p>
            <button 
              onClick={() => window.location.assign("/login")}
              style={{ background: T.accent, border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
            >
              Go to Login Page
            </button>
            <div style={{ marginTop: 16 }}>
               <button onClick={() => navigate("home")} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", textDecoration: "underline" }}>
                 Back to Home
               </button>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} />
    </div>
    </>

  );
}
