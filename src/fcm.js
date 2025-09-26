// fcm.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import toast from "react-hot-toast";

// 🔑 Your Firebase Config
const firebaseConfig = {
  //Dev Environment
   apiKey: "AIzaSyBfct4vLSD8_FsPqblZlvK4HtUZIp0Ix1I",
  authDomain: "coverkraft-dev-8e115.firebaseapp.com",
  projectId: "coverkraft-dev-8e115",
  storageBucket: "coverkraft-dev-8e115.firebasestorage.app",
  messagingSenderId: "716611850735",
  appId: "1:716611850735:web:74e6b57410be2e0ce3261a",
  measurementId: "G-5WETG0HT4H"
};

// const VAPID_KEY =
//   "BN14UPx0ybch34v5sPNPOxAD4qOgS4etqCcG8oqOJgz_mRyAPelycwkdMU4wfKch1u9GJuah7kpuOtzczwINoNg";

const VAPID_KEY =
  "BKfebvRd1AMh4nyrd7i0TqJ6esGKvh9zQkgvZt6_ChhMf619F40uy48a2R9AOCOH16Wt6mIE10y6fvKJmWEm7HA";
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

/**
 * Register service worker for FCM
 */
export const registerFirebaseSW = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" }
    );
    // console.log("Service Worker registered:", registration);
    return registration;
  } catch (err) {
    console.error("Service Worker registration failed:", err);
    throw err;
  }
};

/**
 * Request Notification Permission & Get FCM Token
 */
export const requestFCMPermission = async (registration) => {
  try {
    const permission = await Notification.requestPermission();
    console.debug("Notification permission:", permission);

    if (permission !== "granted") {
      console.warn("Permission denied by user.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // console.log("📲 FCM Token received:", token);
    } else {
      console.warn("FCM Token is null");
    }

    return token;
  } catch (error) {
    console.error("FCM setup failed:", error);
    return null;
  }
};

  const handleRedirect = () => {
    navigate("/notification");
  };

export const setupOnMessageListener = () => {
  onMessage(messaging, (payload) => {
    // console.log("[Foreground Message]", payload);

    // ✅ Only show toast if notification payload exists
    if (payload?.notification) {
      const { title, body } = payload.notification;

      toast.custom((t) => (
        <div
        onClick={() => (window.location.href = "/notification")}
          className={`position-fixed top-0 cursor-pointer end-0 m-4 z-50 ${
            t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
          } transition-all duration-500 ease-out`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            background: "linear-gradient(145deg, #3E3E3E, #3E3E3E)",
            borderRight: "3px solid #8BC642",
            borderBottom: "3px solid #8BC642",
            boxShadow:
              "0 8px 32px rgba(0, 212, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4)",
            color: "#ffffff",
            borderRadius: "16px",
            minWidth: "420px",
            maxWidth: "500px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top gradient line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, transparent, #8BC642, transparent)",
              opacity: 0.7,
            }}
          />

          {/* Header */}
          <div
            style={{
              borderBottom: "1.5px solid rgba(0, 212, 255, 0.25)",
              paddingBottom: "1rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong
              style={{
                fontSize: "1.45rem",
                color: "#ffffff",
                fontWeight: "700",
              }}
            >
              {title}
            </strong>
            <small
              style={{
                color: "#8BC642",
                fontSize: "0.95rem",
                fontWeight: "600",
                opacity: 0.85,
              }}
            >
              just now
            </small>
          </div>

          {/* Body */}
          <div
            style={{
              fontSize: "1.18rem",
              lineHeight: "1.7",
              color: "#e5e5e5",
              fontWeight: "400",
            }}
          >
            {body}
          </div>

          {/* Bottom gradient line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #8BC642, rgba(0, 212, 255, 0.3))",
              borderRadius: "0 0 16px 16px",
            }}
          />
        </div>
      ));
    }
  });
};
