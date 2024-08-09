
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCx901Va2ohHAC71K_SbNqrKxQ3TCpKCDc",
    authDomain: "coverkraft-f26e1.firebaseapp.com",
    projectId: "coverkraft-f26e1",
    storageBucket: "coverkraft-f26e1.appspot.com",
    messagingSenderId: "317342762",
    appId: "1:317342762:web:eccecf45cf81536e67ef53",
    measurementId: "G-V2WBZB474V"
  };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
   
    self.registration.showNotification(notificationTitle, notificationOptions);
});
