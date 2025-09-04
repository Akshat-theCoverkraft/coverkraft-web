// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAwBkvlUE6tIVEsNjFvMTqHfmDaGMdYtcg",
  authDomain: "coverkraft-f0697.firebaseapp.com",
  projectId: "coverkraft-f0697",
  storageBucket: "coverkraft-f0697.firebasestorage.app",
  messagingSenderId: "1001414765690",
  appId: "1:1001414765690:web:10f29e630f6532a7b91fc3",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  // console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "Background Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/logo192.png", 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
