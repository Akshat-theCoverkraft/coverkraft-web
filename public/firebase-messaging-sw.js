// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyDnwNulEZC1FCtxckUiQ_x637oD74Bp2QI",
  authDomain: "coverkraft-dev-2082b.firebaseapp.com",
  projectId: "coverkraft-dev-2082b",
  storageBucket: "coverkraft-dev-2082b.firebasestorage.app",
  messagingSenderId: "946812362760",
  appId: "1:946812362760:web:853df53b3de23be699f1bd",
  measurementId: "G-K71X2MTYQ5"
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
