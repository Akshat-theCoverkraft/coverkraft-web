import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
    apiKey: "AIzaSyCx901Va2ohHAC71K_SbNqrKxQ3TCpKCDc",
    authDomain: "coverkraft-f26e1.firebaseapp.com",
    projectId: "coverkraft-f26e1",
    storageBucket: "coverkraft-f26e1.appspot.com",
    messagingSenderId: "317342762",
    appId: "1:317342762:web:eccecf45cf81536e67ef53",
    measurementId: "G-V2WBZB474V"
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
      const token = await getToken(messaging, { vapidKey: 'BDrN5XQ29CF4CxOtr5YVlQ333d2wwR_Wc3JZCMo1kILS9r4_Nw5qaETy8nD78ikHsIIrtVHi9KPLJCsNjm-uekM' });
      console.log('kys h token',token)
      return token;
    } else {
      throw new Error('Notification permission not granted');
    }
  } catch (err) {
    console.error('Error', err);
  }
};

