  // firebase.js
  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyDsRJ8VAapehDLayHpN5Ho1fbjXZNvIr78",
  authDomain: "coverkraft-uat-5a09e.firebaseapp.com",
  projectId: "coverkraft-uat-5a09e",
  storageBucket: "coverkraft-uat-5a09e.firebasestorage.app",
  messagingSenderId: "1012907500859",
  appId: "1:1012907500859:web:4245b7fd7728e3f4a8031e",
  measurementId: "G-MLF92G82S6"
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
