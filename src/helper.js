import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
  apiKey: "AIzaSyDZ0QvjCUx3oDtL6prUC1u4xwxyAjNqe0s",
  authDomain: "festivaloutfitter-54b95.firebaseapp.com",
  projectId: "festivaloutfitter-54b95",
  storageBucket: "festivaloutfitter-54b95.appspot.com",
  messagingSenderId: "172595882590",
  appId: "1:172595882590:web:0a5d53fcb47228d67f22cf",
  measurementId: "G-CCNXGC4XH2"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
try {
     
      console.log('Firebase Messaging initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Messaging:', error);
    }
    
    // // Register the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful:', registration);
        }).catch((err) => {
          console.error('ServiceWorker registration failed:', err);
        });
    } else {
      console.error('ServiceWorker is not supported in this browser');
    }
    
export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log(permission,'permission')
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: 'BDSFbAvMLzZyc9IER72FPPzb8tFT2946Hi9Ywb0ovj7O0A_mY87WskI0gnMgCRkXPONr0IMHtxhrq0khIcr6Ogk' });
      console.log('kys h token',token)
      return token;
    } else {
      throw new Error('Notification permission not granted');
    }
  } catch (err) {
    console.error('Error', err);
  }
};

