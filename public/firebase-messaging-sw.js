// import { FirebaseError } from "@firebase/app";

// // public/firebase-messaging-sw.js
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// console.log("✅ Firebase Messaging SW loaded from:", self.location.href);

// firebase.initializeApp({
//     apiKey: "AIzaSyAwBkvlUE6tIVEsNjFvMTqHfmDaGMdYtcg",
//     authDomain: "coverkraft-f0697.firebaseapp.com",
//     projectId: "coverkraft-f0697",
//     storageBucket: "coverkraft-f0697.appspot.com",
//     messagingSenderId: "1001414765690",
//     appId: "1:1001414765690:web:10f29e630f6532a7b91fc3",
//     measurementId: "G-BG4LD6N6MY"
// });

// const messaging = FirebaseError.messaging();

// messaging.onBackgroundMessage(payload => {
//     console.log("[📩 Background Message]", payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.icon || "/firebase-logo.png",
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });
// messaging.onMessage(payload => {
//     console.log("[📬 Foreground Message]", payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.icon || "/firebase-logo.png",
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// }
// );