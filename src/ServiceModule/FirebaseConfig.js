//FirebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFOJZ_GBfxfY5K5PMEdiZPe6voJdvpJyM",
  authDomain: "coverkraft-f0697.firebaseapp.com",
  projectId: "coverkraft-f0697",
  storageBucket: "coverkraft-f0697.appspot.com",
  messagingSenderId: "1001414765690",
  appId: "1:1001414765690:web:b68c7fc607ca5f02b91fc3",
  measurementId: "G-98E61H4W23"
};
 
// Initialize Firebase
// export default firebaseConfig;
// const appFire = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
// const messaging = getMessaging(appFire);

// let messaging;

// try {
//   messaging = getMessaging(appFire);
//   console.log('Firebase Messaging initialized successfully');
// } catch (error) {
//   console.error('Error initializing Firebase Messaging:', error);
// }

// // Register the service worker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/firebase-messaging-sw.js')
//     .then((registration) => {
//       console.log('ServiceWorker registration successful:', registration);
//     }).catch((err) => {
//       console.error('ServiceWorker registration failed:', err);
//     });
// } else {
//   console.error('ServiceWorker is not supported in this browser');
// }










// navigator.serviceWorker.getRegistrations().then((registrations) => {
//   if (registrations.length) {
//      [this.registration] = registrations;
//      return;
//   }
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//        this.registration = registration;
//     });
//   });


// export { appFire, messaging, getToken };
export {  getToken };