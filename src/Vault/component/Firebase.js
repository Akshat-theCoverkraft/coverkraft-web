// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyAuqyGKHe7E367WydQQGF98oGcAMr2v4Nw",
  authDomain: "coverkraft-uat-7480d.firebaseapp.com",
  projectId: "coverkraft-uat-7480d",
  storageBucket: "coverkraft-uat-7480d.firebasestorage.app",
  messagingSenderId: "907496635934",
  appId: "1:907496635934:web:5c3c1a1bb6a99f7ad5f80f",
  measurementId: "G-V19J2LMBD9"
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
