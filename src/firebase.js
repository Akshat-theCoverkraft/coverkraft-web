import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"; // ✅ REQUIRED

const firebaseConfig = {
  apiKey: "AIzaSyAwBkvlUE6tIVEsNjFvMTqHfmDaGMdYtcg",
  authDomain: "coverkraft-f0697.firebaseapp.com",
  projectId: "coverkraft-f0697",
  storageBucket: "coverkraft-f0697.appspot.com",
  messagingSenderId: "1001414765690",
  appId: "1:1001414765690:web:10f29e630f6532a7b91fc3",
  measurementId: "G-BG4LD6N6MY",
};

const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);
export { app };
