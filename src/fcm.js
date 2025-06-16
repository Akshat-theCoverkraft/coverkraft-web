// // fcm.js
// import { getToken, onMessage } from "firebase/messaging";
// import { messaging } from "./firebase";
// import toast from "react-hot-toast";

// const VAPID_KEY = "BGD0xwuVak23b9S3sHSiAcnBgigLdGaQrZIP4_lXZqvERB-uUiZ1wFMt2yyM89V3PY8Zv0l2Ua0i_airnlX8suo";

// export const registerFirebaseSW = async () => {
//     try {
//         const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
//         console.log("✅ Service Worker registered", registration);
//         return registration;
//     } catch (err) {
//         console.error("❌ Service Worker registration failed", err);
//         throw err;
//     }
// };

// export const requestFCMPermission = async (registration) => {
//     try {
//         const permission = await Notification.requestPermission();
//         console.debug("🛂 Notification permission:", permission);

//         if (permission !== "granted") {
//             console.warn("🚫 Permission denied by user.");
//             return null;
//         }

//         const token = await getToken(messaging, {
//             vapidKey: VAPID_KEY,
//             serviceWorkerRegistration: registration,
//         });

//         if (token) {
//             console.log("📲 FCM Token received:", token);
//         } else {
//             console.warn("⚠️ FCM Token is null");
//         }

//         return token;
//     } catch (error) {
//         console.error("❌ FCM setup failed:", error);
//         return null;
//     }
// };

// export const setupOnMessageListener = () => {
//     onMessage(messaging, (payload) => {
//         console.log("[📬 Foreground Message]", payload);
//         const { title, body } = payload.notification;
//         toast.custom((t) => (
//             <div
//                 className={`position-fixed top-0 end-0 m-4 z-50 ${t.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'} transition-all duration-500 ease-out`}
//                 role="alert"
//                 aria-live="assertive"
//                 aria-atomic="true"
//                 style={{
//                     background: 'linear-gradient(145deg, #3E3E3E, #3E3E3E)',
//                     borderRight: '3px solid #8BC642',
//                     borderBottom: '3px solid #8BC642',
//                     borderTop: 'none',
//                     borderLeft: 'none',
//                     boxShadow: '0 8px 32px rgba(0, 212, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4)',
//                     color: '#ffffff',
//                     borderRadius: '16px',
//                     minWidth: '420px',
//                     maxWidth: '500px',
//                     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//                     padding: '1.5rem',
//                     overflow: 'hidden',
//                     backdropFilter: 'blur(20px)',
//                     position: 'relative'
//                 }}
//             >
//                { /* Subtle gradient overlay */}
//                                 <div style={{
//                                     position: 'absolute',
//                                     top: 0,
//                                     left: 0,
//                                     right: 0,
//                                     height: '2px', // Increased from 1px to 2px
//                                     background: 'linear-gradient(90deg, transparent, #8BC642, transparent)',
//                                     opacity: 0.7 // Slightly more visible
//                                 }} />

//                                 <div style={{
//                                     borderBottom: '1.5px solid rgba(0, 212, 255, 0.25)', // Thicker border
//                                     paddingBottom: '1rem', // Increased padding
//                                     marginBottom: '1rem', // Increased margin
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     alignItems: 'center'
//                                 }}>
//                                     <strong style={{
//                                         fontSize: '1.45rem', // Increased font size
//                                         color: '#ffffff',
//                                         fontWeight: '700', // Slightly bolder
//                                         letterSpacing: '-0.02em'
//                                     }}>
//                                         {title}
//                                     </strong>
//                                     <small style={{
//                                         color: '#8BC642',
//                                         fontSize: '0.95rem', // Increased font size
//                                         fontWeight: '600',
//                                         opacity: 0.85
//                                     }}>
//                                         just now
//                                     </small>
//                                 </div>

//                                 <div style={{
//                                     fontSize: '1.18rem', // Increased font size
//                                     lineHeight: '1.7', // Slightly more line height
//                                     color: '#e5e5e5',
//                                     fontWeight: '400'
//                                 }}>
//                                     {body}
//                                 </div>

//                                 {/* Bottom accent line */}
//                 <div style={{
//                     position: 'absolute',
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     height: '2px',
//                     background: 'linear-gradient(90deg, transparent, #8BC642, rgba(0, 212, 255, 0.3))',
//                     borderRadius: '0 0 16px 16px'
//                 }} />
//             </div>
//         ));
//     });
// };


