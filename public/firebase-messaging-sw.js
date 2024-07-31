// // // Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');// Initialize the Firebase app in the service worker by passing the generated config

// const firebaseConfig = {
//     apiKey: "AIzaSyCFOJZ_GBfxfY5K5PMEdiZPe6voJdvpJyM",
//     authDomain: "coverkraft-f0697.firebaseapp.com",
//     projectId: "coverkraft-f0697",
//     storageBucket: "coverkraft-f0697.appspot.com",
//     messagingSenderId: "1001414765690",
//     appId: "1:1001414765690:web:b68c7fc607ca5f02b91fc3",
//     measurementId: "G-98E61H4W23"
//   };
  
// firebase.initializeApp(firebaseConfig);// Retrieve firebase messaging
// const messaging = firebase.messaging();

//  messaging.onBackgroundMessage(function (payload) {
//     console.log('Received background message ', payload);// Customize notification here

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = { body: payload.notification.body, };
//     self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });


// self.addEventListener('push', function(event) {
//     console.log('Push event received:', event);

//     let notificationTitle = 'Push Notification';
//     let notificationOptions = {
//         body: 'No payload',
//         icon: '/firebase-logo.png' // You can change the icon path as needed
//     };

//     if (event.data) {
//         const data = event.data.json();
//         console.log('Parsed data:', data);
        
//         // Access the title and body from the notification part of the payload
//         if (data.notification) {
//             notificationTitle = data.notification.title || notificationTitle;
//             notificationOptions.body = data.notification.body || notificationOptions.body;
//         }
//     }

//     event.waitUntil(
//         self.registration.showNotification(notificationTitle, notificationOptions)
//     );
// });
