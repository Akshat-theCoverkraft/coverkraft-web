// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwBkvlUE6tIVEsNjFvMTqHfmDaGMdYtcg",
  authDomain: "coverkraft-f0697.firebaseapp.com",
  projectId: "coverkraft-f0697",
  storageBucket: "coverkraft-f0697.firebasestorage.app",
  messagingSenderId: "1001414765690",
  appId: "1:1001414765690:web:10f29e630f6532a7b91fc3",
  measurementId: "G-BG4LD6N6MY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/gmail.readonly"); // for Gmail access
provider.addScope("email"); // ✅ add this to access user's email
provider.setCustomParameters({
  prompt: "select_account", // ✅ forces account selection each time
});

export { auth, provider };
