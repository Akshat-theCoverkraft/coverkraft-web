// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyDsRJ8VAapehDLayHpN5Ho1fbjXZNvIr78",
  authDomain: "coverkraft-uat-5a09e.firebaseapp.com",
  projectId: "coverkraft-uat-5a09e",
  storageBucket: "coverkraft-uat-5a09e.firebasestorage.app",
  messagingSenderId: "1012907500859",
  appId: "1:1012907500859:web:4245b7fd7728e3f4a8031e",
  measurementId: "G-MLF92G82S6"
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
